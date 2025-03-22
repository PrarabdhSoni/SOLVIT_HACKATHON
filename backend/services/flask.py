from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ------------------- Load Trained Models -------------------
try:
    with open("severity_model.pkl", "rb") as f:
        severity_model = pickle.load(f)

    with open("resolution_model.pkl", "rb") as f:
        resolution_model = pickle.load(f)

    with open("classification_model.pkl", "rb") as f:
        classification_model = pickle.load(f)

    with open("anomaly_model.pkl", "rb") as f:
        anomaly_model = pickle.load(f)

    with open("severity_ct.pkl", "rb") as f:
        severity_ct = pickle.load(f)

    with open("tfidf.pkl", "rb") as f:
        tfidf = pickle.load(f)

    with open("label_encoder.pkl", "rb") as f:
        le = pickle.load(f)

    with open("anomaly_preprocessor.pkl", "rb") as f:
        anomaly_preprocessor = pickle.load(f)

except FileNotFoundError as e:
    print("Model files missing. Train and save models first!")
    exit(1)  # Stop execution if models are not found

# ------------------- API Endpoints -------------------
@app.route("/predict_severity", methods=["POST"])
def predict_severity():
    data = request.json
    df_new = pd.DataFrame(data)
    X_new_transformed = severity_ct.transform(df_new)
    predicted_severity = severity_model.predict(X_new_transformed)
    return jsonify({"severity_scores": predicted_severity.tolist()})

@app.route("/predict_resolution_time", methods=["POST"])
def predict_resolution_time():
    data = request.json
    df_new = pd.DataFrame(data)
    predicted_time = resolution_model.predict(df_new)
    return jsonify({"resolution_time_days": predicted_time.tolist()})

@app.route("/predict_complaint_category", methods=["POST"])
def predict_complaint_category():
    data = request.json["complaints"]
    complaints_tfidf = tfidf.transform(data).toarray()
    predictions = classification_model.predict(complaints_tfidf)
    predicted_labels = le.inverse_transform(predictions)
    return jsonify({"predicted_categories": predicted_labels.tolist()})

@app.route("/detect_anomaly", methods=["POST"])
def detect_anomaly():
    data = request.json
    df_new = pd.DataFrame(data)
    X_new = anomaly_preprocessor.transform(df_new)
    anomaly_prediction = anomaly_model.predict(X_new)
    anomaly_labels = ["Anomaly" if x == -1 else "Normal" for x in anomaly_prediction]
    return jsonify({"anomaly_status": anomaly_labels})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
