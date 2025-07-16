import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Configure the API key
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def call_gemini_api_test():
    print('Dev mode: Prompt Ignored')
    
    prompt = "How much does the average house cost in the US vs NYC?"
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)

    data = {
        "prompt": prompt,
        "response": response.text
    }
    return f"Gemini API Response: {data}" 

def call_gemini_api(prompt):
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)

    return f"Gemini API received prompt: {response.text}" 