from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE")

if not SUPABASE_URL or not SUPABASE_API_KEY:
    raise RuntimeError(
        "Missing SUPABASE_URL or SUPABASE_API_KEY environment variable. "
        "Please check your .env file."
    )

print("SUPABASE_API_KEY: " + SUPABASE_API_KEY)
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
def create_budget():
    if not request.json:
        return jsonify({"error": "No JSON data provided"}), 400
    
    data = supabase.table("budgets").update(request.json).eq("id", request.json["id"]).execute()
    return jsonify(data.data[0])

if __name__ == "__main__":
    app.run(debug=True)