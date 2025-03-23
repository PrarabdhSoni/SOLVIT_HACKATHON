from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ----------------- MongoDB Connection -----------------
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/?retryWrites=true&w=majority&appName=Prarabdh"
client = MongoClient(MONGO_URI)
db = client["UrbanEye"]
collection = db["CivicIssue"]

# ----------------- Fetch Data from MongoDB -----------------
def load_data():
    data = list(collection.find({}, {"_id": 0}))  # Fetch all documents, excluding MongoDB ObjectId
    return pd.DataFrame(data) if data else pd.DataFrame()

df = load_data()

if df.empty:
    print("Warning: No data found in MongoDB collection.")

# ----------------- Define Column Transformer for Severity Score Prediction -----------------
severity_transformer = ColumnTransformer([
    ("ohe", OneHotEncoder(handle_unknown='ignore'), ["Complaint_Category"]),
    ("scaler", StandardScaler(), ["Public_Sentiment_Score"])
])

# ----------------- Train Severity Score Model -----------------
if not df.empty:
    X_severity = df[["Complaint_Category", "Public_Sentiment_Score"]]
    Y_severity = df["Severity_Score"]

    X_severity_transformed = severity_transformer.fit_transform(X_severity)

    X_train, X_test, Y_train, Y_test = train_test_split(X_severity_transformed, Y_severity, test_size=0.2, random_state=42)

    severity_model = RandomForestRegressor(n_estimators=300, random_state=42)
    severity_model.fit(X_train, Y_train)

# ----------------- Train Complaint Classification Model -----------------
label_encoder_path = "label_encoder.pkl"

if os.path.exists(label_encoder_path):
    le = joblib.load(label_encoder_path)
else:
    le = LabelEncoder()
    df["Complaint_Category"] = le.fit_transform(df["Complaint_Category"])
    joblib.dump(le, label_encoder_path)

tfidf = TfidfVectorizer(max_features=500)

if not df.empty:
    X_text = tfidf.fit_transform(df["Complaint_Text"]).toarray()
    y = df["Complaint_Category"]

    X_train_text, X_test_text, y_train_text, y_test_text = train_test_split(X_text, y, test_size=0.2, random_state=42)

    classification_model = RandomForestClassifier(n_estimators=200, random_state=42)
    classification_model.fit(X_train_text, y_train_text)

# ----------------- Store Complaints for Email -----------------
complaint_list = []

@app.route("/submit-complaint", methods=["POST"])
def submit_complaint():
    data = request.json

    complaint_category = data.get("Complaint_Category")
    public_sentiment_score = data.get("Public_Sentiment_Score")
    complaint_text = data.get("Complaint_Text")
    historical_frequency = data.get("Historical_Frequency")
    region = data.get("Region")
    user_email = data.get("User_Email")  # Capture user's email
    timestamp = data.get("Timestamp", pd.Timestamp.now().isoformat())

    if not complaint_category or not public_sentiment_score or not complaint_text:
        return jsonify({"error": "Missing required fields"}), 400

    # Predict Severity Score
    severity_input = pd.DataFrame([[complaint_category, public_sentiment_score]], 
                                  columns=["Complaint_Category", "Public_Sentiment_Score"])
    severity_transformed = severity_transformer.transform(severity_input)
    predicted_severity = severity_model.predict(severity_transformed)[0]

    # Predict Complaint Category
    text_vectorized = tfidf.transform([complaint_text]).toarray()
    predicted_category_encoded = classification_model.predict(text_vectorized)
    predicted_category = le.inverse_transform(predicted_category_encoded)[0]

    # Store Complaint for Email
    complaint_list.append({
        "User_Email": user_email,
        "Category": predicted_category,
        "Complaint": complaint_text,
        "Severity": predicted_severity,
        "Location": region,
        "Timestamp": timestamp
    })

    return jsonify({
        "Predicted Severity Score": predicted_severity,
        "Predicted Complaint Category": predicted_category
    })

@app.route("/get-complaints", methods=["GET"])
def get_complaints():
    return json.dumps(complaint_list), 200

@app.route("/clear-complaints", methods=["GET"])
def clear_complaints():
    complaint_list.clear()
    return "Complaints list cleared!", 200

if __name__ == "__main__":
    app.run(debug=True)
