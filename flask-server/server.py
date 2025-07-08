from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE")

if not SUPABASE_URL or not SUPABASE_API_KEY:
    raise RuntimeError(
        "Missing SUPABASE_URL or SUPABASE_API_KEY environment variable. "
        "Please check your .env file."
    )

supabase = create_client(SUPABASE_URL, SUPABASE_API_KEY)

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
    # r = requests.get(f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}", headers=SUPABASE_HEADERS)
    # return jsonify(r.json()), r.status_code
    data = supabase.table("budgets").select("*").execute()
    return jsonify(data.data)

@app.route("/budgets", methods=["POST"])
def create_budget():
    data = request.json
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
        json=data,
        headers=SUPABASE_HEADERS
    )
    return jsonify(r.json()), r.status_code

if __name__ == "__main__":
    app.run(debug=True)