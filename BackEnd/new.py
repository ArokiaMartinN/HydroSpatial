import os
import pandas as pd
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from dotenv import load_dotenv

# --- Load environment variables from .env ---
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ----------------- Load CSV dataset -----------------
DATA_FILE = "groundWater_2023_2_0.csv"
try:
    df = pd.read_csv(DATA_FILE)
    print("✅ Dataset loaded successfully.")
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    df = pd.DataFrame()

# Helper to check if dataset is usable
REQUIRED_COLUMNS = {"Name of State", "Name of District"}

def dataset_ready():
    return (not df.empty) and REQUIRED_COLUMNS.issubset(set(df.columns))

if not dataset_ready():
    print("⚠️ WARNING: Dataset is empty or missing required columns "
          "('Name of State', 'Name of District'). Dataset-based answers may be limited.")

# ----------------- Configure Gemini AI -----------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY not found. Set it in .env or environment.")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use the same model that works in 1.py
    model = genai.GenerativeModel('gemini-pro-latest')
    print("✅ Gemini AI configured successfully.")
except Exception as e:
    raise RuntimeError(f"🔴 Error configuring Gemini AI: {e}")

# -------- Helper Functions -------- #

def find_districts_in_query(query):
    if not dataset_ready():
        return []
    return [
        district
        for district in df["Name of District"].dropna().unique()
        if district.lower() in query.lower()
    ]

def find_states_in_query(query):
    if not dataset_ready():
        return []
    return [
        state
        for state in df["Name of State"].dropna().unique()
        if state.lower() in query.lower()
    ]

def get_district_data(districts):
    if not dataset_ready():
        return "Dataset is not ready. Using general groundwater guidance only."

    output = f"📍 Data for districts: {', '.join(districts)}\n"
    df_filtered = df[df["Name of District"].isin(districts)]

    for _, row in df_filtered.iterrows():
        parts = []
        for col in df.columns:
            if isinstance(row[col], (int, float)):
                parts.append(f"{col}: {row[col]}")
        output += f"\n🔸 District '{row['Name of District']}':\n" + "\n".join(parts)

    if len(df_filtered) > 1:
        numeric_cols = df_filtered.select_dtypes(include='number').columns
        average = df_filtered[numeric_cols].mean().to_dict()
        output += "\n\n📊 Aggregated Averages:\n"
        output += "\n".join([f"{k}: {v:.2f}" for k, v in average.items()])

    return output

def get_state_data(states):
    if not dataset_ready():
        return "Dataset is not ready. Using general groundwater guidance only."

    output = ""
    for state in states:
        df_state = df[df["Name of State"].str.lower() == state.lower()]
        if df_state.empty:
            output += f"\n❌ No data for state '{state}'."
        else:
            output += f"\n📍 Data for state '{state}':\n"
            for _, row in df_state.iterrows():
                parts = []
                for col in df.columns:
                    if isinstance(row[col], (int, float)):
                        parts.append(f"{col}: {row[col]}")
                output += f"\n🔸 District '{row['Name of District']}':\n" + "\n".join(parts)

            numeric_cols = df_state.select_dtypes(include='number').columns
            avg = df_state[numeric_cols].mean().to_dict()
            output += "\n\n📊 State Averages:\n"
            output += "\n".join([f"{k}: {v:.2f}" for k, v in avg.items()])
    return output

def search_dataset(query):
    if not dataset_ready():
        # This line will be visible to the model in the prompt
        return "Dataset not loaded or missing required columns. Use only general groundwater knowledge."

    districts = find_districts_in_query(query)
    states = find_states_in_query(query)

    results = []
    if districts:
        results.append(get_district_data(districts))
    if states:
        results.append(get_state_data(states))

    return "\n".join(results) if results else "No relevant districts or states found in query."

def get_gemini_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"❌ Error contacting Gemini API: {e}")
        return f"❌ Error contacting Gemini API: {e}"

# -------- API Endpoints -------- #

@app.route('/api/states', methods=['GET'])
def get_states():
    if not dataset_ready():
        return jsonify([]), 500
    return jsonify(sorted(df["Name of State"].dropna().unique().tolist()))

@app.route('/api/districts', methods=['GET'])
def get_districts():
    if not dataset_ready():
        return jsonify([]), 500
    state = request.args.get('state')
    if state:
        filtered = df[df["Name of State"].str.lower() == state.lower()]
        districts = sorted(filtered["Name of District"].dropna().unique().tolist())
    else:
        districts = sorted(df["Name of District"].dropna().unique().tolist())
    return jsonify(districts)

@app.route('/api/data', methods=['GET'])
def get_data():
    if not dataset_ready():
        return jsonify({"error": "Dataset not loaded or missing required columns"}), 500

    state = request.args.get('state')
    district = request.args.get('district')
    field = request.args.get('field')

    filtered_df = df.copy()
    if state:
        filtered_df = filtered_df[filtered_df["Name of State"].str.lower() == state.lower()]
    if district:
        filtered_df = filtered_df[filtered_df["Name of District"].str.lower() == district.lower()]

    if filtered_df.empty:
        return jsonify({"error": "No data found for given filters"}), 404

    if field and field.lower() == "rainfall":
        col = "Mean Rainfall" if "Mean Rainfall" in filtered_df.columns else "Rainfall"
        if col not in filtered_df.columns:
            return jsonify({"error": "Rainfall data not available"}), 400
        return jsonify({"average_rainfall": round(filtered_df[col].mean(), 2)})

    numeric_cols = filtered_df.select_dtypes(include='number').columns
    return jsonify({k: round(v, 2) for k, v in filtered_df[numeric_cols].mean().to_dict().items()})

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    user_query = data.get("query", "")
    if not user_query:
        return jsonify({"error": "No query provided."}), 400

    dataset_info = search_dataset(user_query)

    prompt = f"""
You are HydroSpatial AI, a helpful and friendly assistant for groundwater and water resources.
Your tone is professional, simple, and very clear. Your goal is to provide highly structured, step-by-step answers in HTML.

--- DATASET CONTEXT ---
{dataset_info}
--- END DATASET CONTEXT ---

--- USER QUERY ---
{user_query}
--- END USER QUERY ---

--- HOW TO USE DATASET ---
- First, try to use the dataset context to answer the question.
- If the dataset context says something like "Dataset not loaded or missing required columns" or
  "No relevant districts or states found in query.", then:
  - Do NOT give fake location-specific numbers.
  - Mention clearly that you are giving general guidance.
- You may also use your general knowledge about groundwater, rainfall, water stress, desalination, etc.

--- FORMATTING RULES (CRITICAL) ---
- Output only HTML tags, no Markdown, no backticks.
- Do NOT include <!DOCTYPE html>, <html>, or <body> tags.
- The response must be a clean HTML fragment that can go inside a <div>.
- Use:
  - <h2> for the main title (with an emoji).
  - <h3> for subheadings (sections).
  - <p> for short paragraphs.
  - <b> for bold key terms.
  - <i> for small emphasis if needed.
  - <ul> + <li> for bullet lists.
  - <ol> + <li> for step-by-step lists.
  - Emojis to make it friendly (e.g., 💧, 🌍, 📊, ✅, ⚠️, 💡).

--- REQUIRED STRUCTURE (VERY IMPORTANT) ---
1. Start with a clear main heading:
   <h2>💧 Main Topic Title</h2>

2. Then a 2–3 sentence summary:
   <p>Short and simple summary of what this is about.</p>

3. Then a step-by-step section:
   <h3>🧭 Step-by-Step Approach</h3>
   <ol>
     <li><b>Step 1 – ...:</b> 2–4 sentences of detailed, practical explanation.</li>
     <li><b>Step 2 – ...:</b> 2–4 sentences of detailed, practical explanation.</li>
     <li><b>Step 3 – ...:</b> 2–4 sentences of detailed, practical explanation.</li>
     <li><b>Step 4 – ...:</b> 2–4 sentences of detailed, practical explanation.</li>
   </ol>

4. Then a key points / checklist section:
   <h3>📌 Key Technical Points</h3>
   <ul>
     <li><b>Point 1:</b> Clear explanation.</li>
     <li><b>Point 2:</b> Clear explanation.</li>
     <li><b>Point 3:</b> Clear explanation.</li>
   </ul>

5. Then how to apply this in practice:
   <h3>🔧 How to Apply This in the Field</h3>
   <ol>
     <li>Concrete action 1 the user can do.</li>
     <li>Concrete action 2 the user can do.</li>
     <li>Concrete action 3 the user can do.</li>
   </ol>

6. Optional extra insights:
   <h3>🔍 Extra Insights</h3>
   <p>Any extra tips, caveats, or common mistakes.</p>

--- STYLE ---
- Be very step-by-step.
- Every step and bullet must be clear, concrete, and practical.
- Use simple language and explain any technical term in plain words.
"""

    response = get_gemini_response(prompt)
    return jsonify({"answer": response})

# -------- Run Flask Server -------- #
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
