import os
import pandas as pd
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load CSV dataset
DATA_FILE = "groundWater_2023_2_0.csv"
try:
    df = pd.read_csv(DATA_FILE)
    print("✅ Dataset loaded successfully.")
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    df = pd.DataFrame()

# Configure Gemini API (v1)
genai.configure(api_key="API_KEY")

# -------- Helper Functions -------- #

def find_districts_in_query(query):
    return [district for district in df["Name of District"].dropna().unique() if district.lower() in query.lower()]

def find_states_in_query(query):
    return [state for state in df["Name of State"].dropna().unique() if state.lower() in query.lower()]

def get_district_data(districts):
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
        model = genai.GenerativeModel("models/gemini-2.0-flash")  # Important: full model path
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"❌ Error contactcd ing Gemini API: {e}"

# -------- API Endpoints -------- #

@app.route('/api/states', methods=['GET'])
def get_states():
    if df.empty:
        return jsonify([]), 500
    return jsonify(sorted(df["Name of State"].dropna().unique().tolist()))

@app.route('/api/districts', methods=['GET'])
def get_districts():
    if df.empty:
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
    if df.empty:
        return jsonify({"error": "Dataset not loaded"}), 500

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

    prompt = (
        f"User Query: {user_query}\n"
        f"Dataset Info:\n{dataset_info}\n"
        "Based on the above, provide a clear and detailed answer with as many relevant numerical insights as possible."
    )

    response = get_gemini_response(prompt)
    return jsonify({"answer": response})

# -------- Run Flask Server -------- #
if __name__ == '__main__':
    app.run(debug=True)
