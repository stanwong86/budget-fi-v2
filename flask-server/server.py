from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client
from gemini_api import call_gemini_api, call_gemini_api_test  # Import the Gemini API helper

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:5173",             # dev Vite/React
        "https://budget-fi.netlify.app"      # prod frontend
    ]}},
    supports_credentials=True            # drop this line if you’re not using cookies or auth headers
)

PORT = int(os.environ.get("PORT", 5000))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE")

if not SUPABASE_URL or not SUPABASE_API_KEY:
    raise RuntimeError(
        "Missing SUPABASE_URL or SUPABASE_API_KEY environment variable. "
        "Please check your .env file."
    )

supabase = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_API_KEY)

SUPABASE_HEADERS = {
    "apikey": SUPABASE_API_KEY,
    "Authorization": f"Bearer {SUPABASE_API_KEY}",
    "Content-Type": "application/json"
}

@app.route("/")
def home():
    return {"status": "Supabase Flask API is live"}

@app.route("/budgets", methods=["GET"])
def get_budgets():
    data = supabase.table("budgets").select("*").execute()
    return jsonify(data.data)

@app.route("/budgets", methods=["POST"])
def save_budget():
    if not request.json:
        return jsonify({"error": "No JSON data provided"}), 400
    
    data = supabase.table("budgets").update(request.json).eq("id", request.json["id"]).execute()
    return jsonify(data.data[0])

@app.route("/gemini", methods=["POST"])
def gemini_route():
    if not request.json or "prompt" not in request.json:
        return jsonify({"error": "No prompt provided"}), 400
    prompt = request.json["prompt"]
    try:
        result = call_gemini_api(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/gemini", methods=["GET"])
def gemini_route_get():
    try:
        result = call_gemini_api_test()
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=PORT)