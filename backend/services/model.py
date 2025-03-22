import pandas as pd
import pickle
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer

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

# ------------------- Save Models using Pickle -------------------
with open("severity_model.pkl", "wb") as f:
    pickle.dump(severity_model, f)

with open("resolution_model.pkl", "wb") as f:
    pickle.dump(resolution_model, f)

with open("classification_model.pkl", "wb") as f:
    pickle.dump(classification_model, f)

with open("anomaly_model.pkl", "wb") as f:
    pickle.dump(anomaly_model, f)

with open("severity_ct.pkl", "wb") as f:
    pickle.dump(severity_ct, f)

with open("tfidf.pkl", "wb") as f:
    pickle.dump(tfidf, f)

with open("label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

with open("anomaly_preprocessor.pkl", "wb") as f:
    pickle.dump(anomaly_preprocessor, f)

print("Models trained and saved successfully!")
