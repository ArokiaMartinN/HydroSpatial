import os
import pandas as pd
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- Load environment variables ---
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ----------------- Configuration -----------------
DATA_FILE = "groundWater_2023_2_0.csv"
RF_FILE = "district wise rainfall normal.csv"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ----------------- AI Setup -----------------
model = None
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("✅ Gemini AI Connected.")
    except Exception as e:
        print(f"⚠️ Gemini Config Error: {e}")
else:
    print("⚠️ GEMINI_API_KEY not found. AI features will be limited.")

# ----------------- Data Loading -----------------
gw_df = pd.DataFrame()
rf_df = pd.DataFrame()

def load_data():
    global gw_df, rf_df
    try:
        gw_df = pd.read_csv(DATA_FILE, encoding='ISO-8859-1')
        gw_df.columns = [c.strip() for c in gw_df.columns]
        print(f"✅ Groundwater Data Loaded: {len(gw_df)} rows")
        print(f"   Columns: {list(gw_df.columns)[:10]}...")
    except Exception as e:
        print(f"❌ Error loading {DATA_FILE}: {e}")
        gw_df = pd.DataFrame()

    try:
        rf_df = pd.read_csv(RF_FILE, encoding='ISO-8859-1')
        rf_df.columns = [c.strip() for c in rf_df.columns]
        print(f"✅ Rainfall Data Loaded: {len(rf_df)} rows")
    except Exception as e:
        print(f"⚠️ Error loading {RF_FILE}: {e}")
        rf_df = pd.DataFrame()

# load on start
load_data()

# ----------------- Helpers -----------------

def get_state_and_district_cols(df):
    state_col = next((c for c in ['Name of State', 'STATE', 'State'] if c in df.columns), None)
    dist_col = next((c for c in ['Name of District', 'DISTRICT', 'District'] if c in df.columns), None)
    return state_col, dist_col

def get_col_value(row, possible_names, default=0):
    for col in possible_names:
        if col in row:
            val = row[col]
            try:
                return float(val) if pd.notnull(val) else default
            except Exception:
                return default
    return default

def get_rainfall(district_name):
    if rf_df.empty:
        return 0
    try:
        name_clean = str(district_name).strip().lower()
        dist_col = 'DISTRICT' if 'DISTRICT' in rf_df.columns else 'District'
        if dist_col in rf_df.columns:
            match = rf_df[rf_df[dist_col].astype(str).str.strip().str.lower() == name_clean]
            if not match.empty:
                rain_col = 'ANNUAL' if 'ANNUAL' in rf_df.columns else 'Annual'
                if rain_col in rf_df.columns:
                    return float(match.iloc[0][rain_col])
    except Exception:
        pass
    return 0

def get_risk_level(stage):
    if stage > 100:
        return 'High', 'Critical'
    if stage > 90:
        return 'High', 'Critical'
    if stage > 70:
        return 'Medium', 'Semi-Critical'
    return 'Low', 'Safe'

# ----------------- API ENDPOINTS -----------------

@app.route('/api/risk-hierarchy', methods=['GET'])
def get_risk_hierarchy():
    if gw_df.empty:
        load_data()
    if gw_df.empty:
        return jsonify([]), 200

    hierarchy = []
    try:
        state_col, dist_col = get_state_and_district_cols(gw_df)
        if not state_col or not dist_col:
            print("❌ Critical: Could not find State or District columns in CSV.")
            return jsonify([]), 200

        states = sorted(gw_df[state_col].dropna().unique())

        for state in states:
            state_data = gw_df[gw_df[state_col] == state]
            districts_list = []
            total_stage = 0
            count = 0

            for _, row in state_data.iterrows():
                d_name = row[dist_col]

                stage = get_col_value(row, [
                    'Stage of Ground Water Extraction (%)',
                    'Stage of Ground Water Extraction',
                    'Stage'
                ])
                recharge = get_col_value(row, [
                    'Total Annual Ground Water Recharge',
                    'Total Annual GW Recharge',
                    'Recharge'
                ])
                irrigation = get_col_value(row, [
                    'Current Annual Ground Water Extraction For Irrigation',
                    'Extraction Irrigation'
                ])
                domestic = get_col_value(row, [
                    'Current Annual Ground Water Extraction For Domestic & Industrial Use',
                    'Extraction Domestic'
                ])

                rainfall = get_rainfall(d_name)
                risk, status = get_risk_level(stage)

                if stage > 0:
                    total_stage += stage
                    count += 1

                districts_list.append({
                    "id": f"{state}-{d_name}",
                    "name": d_name,
                    "status": status,
                    "risk": risk,
                    "metrics": {
                        "stage": stage,
                        "rainfall": rainfall,
                        "recharge": recharge,
                        "extraction_irrigation": irrigation,
                        "extraction_domestic": domestic
                    }
                })

            avg_stage = total_stage / count if count > 0 else 0
            state_risk = "High" if avg_stage > 90 else "Medium" if avg_stage > 60 else "Low"

            if districts_list:
                hierarchy.append({
                    "name": state,
                    "risk": state_risk,
                    "avg_extraction": round(avg_stage, 2),
                    "districts": districts_list
                })

        return jsonify(hierarchy)

    except Exception as e:
        print(f"🔥 Error processing hierarchy: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/states', methods=['GET'])
def get_states():
    if gw_df.empty:
        load_data()
    if gw_df.empty:
        return jsonify({"error": "Groundwater dataset not loaded"}), 500

    state_col, _ = get_state_and_district_cols(gw_df)
    if not state_col:
        return jsonify({"error": "State column not found in dataset"}), 500

    states = sorted(gw_df[state_col].dropna().unique().tolist())
    return jsonify(states), 200

@app.route('/api/districts', methods=['GET'])
def get_districts():
    if gw_df.empty:
        load_data()
    if gw_df.empty:
        return jsonify({"error": "Groundwater dataset not loaded"}), 500

    state_col, dist_col = get_state_and_district_cols(gw_df)
    if not dist_col:
        return jsonify({"error": "District column not found in dataset"}), 500

    state_param = request.args.get('state', default=None, type=str)

    filtered_df = gw_df
    if state_param and state_col:
        filtered_df = filtered_df[
            filtered_df[state_col].astype(str).str.strip().str.lower()
            == state_param.strip().lower()
        ]

    if filtered_df.empty:
        return jsonify([]), 200

    districts = sorted(filtered_df[dist_col].dropna().unique().tolist())
    return jsonify(districts), 200

# ✅ NEW: /api/data used by Dashboard.tsx
@app.route('/api/data', methods=['GET'])
def get_data():
    """
    Returns averaged numeric metrics for a given state & district.
    Used by the Dashboard to build the charts.
    """
    if gw_df.empty:
        load_data()
    if gw_df.empty:
        return jsonify({"error": "Groundwater dataset not loaded"}), 500

    state_param = request.args.get('state')
    district_param = request.args.get('district')

    state_col, dist_col = get_state_and_district_cols(gw_df)
    if not state_col or not dist_col:
        return jsonify({"error": "State/District columns not found"}), 500

    filtered_df = gw_df
    if state_param:
        filtered_df = filtered_df[
            filtered_df[state_col].astype(str).str.strip().str.lower()
            == state_param.strip().lower()
        ]
    if district_param:
        filtered_df = filtered_df[
            filtered_df[dist_col].astype(str).str.strip().str.lower()
            == district_param.strip().lower()
        ]

    if filtered_df.empty:
        return jsonify({"error": "No data found for given filters"}), 404

    # Take mean of numeric columns → Dashboard will map over these keys
    numeric_cols = filtered_df.select_dtypes(include='number').columns
    result = {k: float(f"{v:.2f}") for k, v in filtered_df[numeric_cols].mean().to_dict().items()}
    return jsonify(result), 200
@app.route('/query', methods=['POST'])
def query_ai():
    data = request.json or {}
    context = data.get('context', '')
    user_query = data.get('query', '')

    if not GEMINI_API_KEY or model is None:
        return jsonify({"answer": "⚠️ AI model not configured properly! Please check API key."})

    prompt = f"""
You are **HydroAI**, a friendly 💧 water expert chatbot that talks like a human.
Your role: Explain hydrological and groundwater concepts in a clear, engaging, and fun way!

When answering:
- Use **bold**, *italic*, emojis 😄, and small symbols (🌧️💧📊📈⚡)
- Add **headings** and **subheadings** (use HTML tags like <h3>, <b>, <br>)
- Keep a friendly, natural tone — sound like you're chatting with a friend
- Give **2–3 actionable insights** or steps
- End with a short motivational or engaging line (like “💧 Let’s keep our groundwater safe together!”)

Question:
{user_query}

Context (for accuracy):
{context}
"""

    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        print(f"❌ Error from Gemini: {e}")
        return jsonify({"answer": "😔 Oops! HydroAI couldn’t process your request. Please try again later."})
if __name__ == '__main__':
    print("🚀 Starting Flask Server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
