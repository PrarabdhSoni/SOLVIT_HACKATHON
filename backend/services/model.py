from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import IsolationForest

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ------------------- Load Data -------------------
df_severity = pd.read_csv("severity_score_dataset_v2.csv")
df_resolution = pd.read_csv("civic_issue_dataset.csv")
df_classification = pd.read_csv("complaint_classification_dataset.csv")

# ------------------- Train Severity Score Model -------------------
severity_ct = ColumnTransformer([
    ("ohe", OneHotEncoder(handle_unknown='ignore'), ["Complaint Category"]),
    ("scaler", StandardScaler(), ["Public Sentiment Score"])
])

X_severity = df_severity[["Complaint Category", "Public Sentiment Score"]]
Y_severity = df_severity["Severity Score"]

X_severity_transformed = severity_ct.fit_transform(X_severity)

severity_model = RandomForestRegressor(n_estimators=200, random_state=42)
severity_model.fit(X_severity_transformed, Y_severity)

# ------------------- Train Resolution Time Model -------------------
features = ["Severity_Score", "Complaint_Category", "Historical_Frequency"]
target = "Estimated_Resolution_Time_Days"

df_resolution = df_resolution.dropna(subset=features + [target])

X_resolution = df_resolution[features]
y_resolution = df_resolution[target]

categorical_features = ["Complaint_Category"]
numerical_features = ["Severity_Score", "Historical_Frequency"]

resolution_preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numerical_features),
    ("cat", OneHotEncoder(handle_unknown='ignore'), categorical_features)
])

resolution_model = Pipeline([
    ("preprocessor", resolution_preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

resolution_model.fit(X_resolution, y_resolution)

# ------------------- Train Complaint Classification Model -------------------
le = LabelEncoder()
df_classification["Complaint_Category"] = le.fit_transform(df_classification["Complaint_Category"])

tfidf = TfidfVectorizer(max_features=500)
X_text = tfidf.fit_transform(df_classification["Complaint_Text"]).toarray()
y_classification = df_classification["Complaint_Category"]

classification_model = RandomForestClassifier(n_estimators=200, random_state=42)
classification_model.fit(X_text, y_classification)

# ------------------- Train Anomaly Detection Model -------------------
features_anomaly = ["Historical_Frequency", "Severity_Score", "Region"]

df_resolution = df_resolution.dropna(subset=features_anomaly)

categorical_features_anomaly = ["Region"]
numerical_features_anomaly = ["Historical_Frequency", "Severity_Score"]

anomaly_preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numerical_features_anomaly),
    ("cat", OneHotEncoder(handle_unknown='ignore'), categorical_features_anomaly)
])

X_anomaly = anomaly_preprocessor.fit_transform(df_resolution[features_anomaly])

anomaly_model = IsolationForest(contamination=0.1, random_state=42)
anomaly_model.fit(X_anomaly)

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
