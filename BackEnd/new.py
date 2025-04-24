import os  
from flask import Flask, request, jsonify
import pandas as pd
import difflib
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load the dataset from a CSV file.
DATA_FILE = "groundWater_2023_2_0.csv"
try:
    df = pd.read_csv(DATA_FILE)
    print("Dataset loaded successfully.")
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame()  # fallback to an empty DataFrame if loading fails

#genai.configure(api_key="YOUR_API-KEY")

def find_districts_in_query(query):
    """
    Returns a list of district names that are found in the query by scanning the dataset.
    """
    matched_districts = []
    for district in df["Name of District"].dropna().unique():
        if district.lower() in query.lower():
            matched_districts.append(district)
    print(f"[DEBUG] Matched Districts: {matched_districts}")
    return matched_districts

def find_states_in_query(query):
    """
    Returns a list of state names that are found in the query by scanning the dataset.
    """
    matched_states = []
    for state in df["Name of State"].dropna().unique():
        if state.lower() in query.lower():
            matched_states.append(state)
    print(f"[DEBUG] Matched States: {matched_states}")
    return matched_states

def get_district_data(districts):
    """
    Returns detailed data for the given districts, including an aggregate if multiple are found.
    """
    district_info = f"Data for districts {', '.join(districts)}:\n"
    df_filtered = df[df["Name of District"].isin(districts)]
    for _, row in df_filtered.iterrows():
        parts = []
        for col in [
            "Recharge from rainfall During Monsoon Season",
            "Recharge from other sources During Monsoon Season",
            "Recharge from rainfall During Non Monsoon Season",
            "Recharge from other sources During Non Monsoon Season",
            "Total Annual Ground Water Recharge",
            "Total Natural Discharges",
            "Annual Extractable Ground Water Resource",
            "Current Annual Ground Water Extraction For Irrigation",
            "Current Annual Ground Water Extraction For Domestic & Industrial Use",
            "Total Current Annual Ground Water Extraction",
            "Annual GW Allocation for Domestic Use as on 2025",
            "Net Ground Water Availability for future use",
            "Stage of Ground Water Extraction (%)"
        ]:
            if col in row:
                parts.append(f"{col}: {row[col]}")
        district_info += f"\nDistrict '{row['Name of District']}': " + "; ".join(parts)
    
    if len(df_filtered) > 1:
        numeric_cols = df_filtered.select_dtypes(include='number').columns
        aggregate = df_filtered[numeric_cols].mean().to_dict()
        agg_info = "\n\nAggregated Averages for the selected districts:\n" + \
                   "\n".join([f"{k}: {v:.2f}" for k, v in aggregate.items()])
        district_info += agg_info
    
    return district_info

def get_state_data(states):
    """
    Returns detailed data for the given states by aggregating data over all districts
    and providing per-district details.
    """
    state_info = ""
    for state in states:
        df_state = df[df["Name of State"].str.lower() == state.lower()]
        if df_state.empty:
            state_info += f"\nNo data found for state '{state}'."
        else:
            state_info += f"\nData for state '{state}' (aggregated over all its districts):\n"
            for _, row in df_state.iterrows():
                parts = []
                for col in [
                    "Recharge from rainfall During Monsoon Season",
                    "Recharge from other sources During Monsoon Season",
                    "Recharge from rainfall During Non Monsoon Season",
                    "Recharge from other sources During Non Monsoon Season",
                    "Total Annual Ground Water Recharge",
                    "Total Natural Discharges",
                    "Annual Extractable Ground Water Resource",
                    "Current Annual Ground Water Extraction For Irrigation",
                    "Current Annual Ground Water Extraction For Domestic & Industrial Use",
                    "Total Current Annual Ground Water Extraction",
                    "Annual GW Allocation for Domestic Use as on 2025",
                    "Net Ground Water Availability for future use",
                    "Stage of Ground Water Extraction (%)"
                ]:
                    if col in row:
                        parts.append(f"{col}: {row[col]}")
                state_info += f"\nDistrict '{row['Name of District']}': " + "; ".join(parts)
            
            numeric_cols = df_state.select_dtypes(include='number').columns
            aggregate = df_state[numeric_cols].mean().to_dict()
            agg_info = "\n\nAggregated Averages for state data:\n" + \
                       "\n".join([f"{k}: {v:.2f}" for k, v in aggregate.items()])
            state_info += agg_info + "\n"
    
    return state_info

def search_dataset(query):
    """
    Extracts relevant groundwater data for both districts and states detected in the query.
    Combines all retrieved data into one string.
    """
    district_matches = find_districts_in_query(query)
    state_matches = find_states_in_query(query)
    
    dataset_info_parts = []
    
    if district_matches:
        district_info = get_district_data(district_matches)
        dataset_info_parts.append(district_info)
    
    if state_matches:
        state_info = get_state_data(state_matches)
        dataset_info_parts.append(state_info)
    
    if not dataset_info_parts:
        dataset_info = "No specific district or state was identified in the query."
    else:
        dataset_info = "\n".join(dataset_info_parts)
    
    print(f"[DEBUG] Combined dataset info:\n{dataset_info}")
    return dataset_info

def get_gemini_response(prompt):
    """
    Calls the Gemini API to generate a response based on the prompt.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error contacting Gemini API: {e}"
@app.route('/api/states', methods=['GET'])
def get_states():
    if df.empty:
        return jsonify([]), 500
    # Extract unique states from the dataset
    states = sorted(df["Name of State"].dropna().unique().tolist())
    return jsonify(states)

@app.route('/api/districts', methods=['GET'])
def get_districts():
    if df.empty:
        return jsonify([]), 500
    state = request.args.get('state')
    if state:
        districts = sorted(
            df[df["Name of State"].str.lower() == state.lower()]["Name of District"]
            .dropna()
            .unique()
            .tolist()
        )
    else:
        districts = sorted(df["Name of District"].dropna().unique().tolist())
    return jsonify(districts)

@app.route('/api/data', methods=['GET'])
def get_data():
    if df.empty:
        return jsonify({"error": "Dataset not loaded"}), 500

    state = request.args.get('state')
    district = request.args.get('district')
    field = request.args.get('field')  # e.g. "rainfall"

    filtered_df = df.copy()
    if state:
        filtered_df = filtered_df[filtered_df["Name of State"].str.lower() == state.lower()]
    if district:
        filtered_df = filtered_df[filtered_df["Name of District"].str.lower() == district.lower()]

    if filtered_df.empty:
        return jsonify({"error": "No data found for given filters"}), 404

    # If a specific field is requested (e.g., "rainfall"), compute its average.
    # (This example assumes the CSV contains either a "Mean Rainfall" column or a "Rainfall" column.)
    if field and field.lower() == "rainfall":
        if "Mean Rainfall" in filtered_df.columns:
            avg_value = filtered_df["Mean Rainfall"].mean()
        elif "Rainfall" in filtered_df.columns:
            avg_value = filtered_df["Rainfall"].mean()
        else:
            return jsonify({"error": "Rainfall data not available"}), 400
        data = {"average_rainfall": round(avg_value, 2)}
    else:
        # Otherwise, return aggregated values for all numeric columns.
        numeric_cols = filtered_df.select_dtypes(include='number').columns
        aggregates = filtered_df[numeric_cols].mean().to_dict()
        # Round off the values for cleaner output.
        data = {k: round(v, 2) for k, v in aggregates.items()}

    return jsonify(data)
@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    user_query = data.get("query", "")
    if not user_query:
        return jsonify({"error": "No query provided."}), 400

    # Retrieve dataset information for all keywords (districts and states) in the query.
    dataset_info = search_dataset(user_query)
    
    # Build prompt that includes both the dataset details and the original query.
    prompt = (
        f"User Query: {user_query}\n"
        f"Dataset Information: {dataset_info}\n"
        "Based on the above, provide a clear, detailed, and natural answer related to groundwater data.***give many numerical values from the dataset ***"
    )
    
    gemini_response = get_gemini_response(prompt)
    return jsonify({"answer": gemini_response})

if __name__ == '__main__':
    app.run(debug=True)
