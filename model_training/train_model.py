import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

print("📥 Loading dataset...")

# Load dataset
df = pd.read_csv("Crop_recommendation.csv")

X = df.drop("label", axis=1)
y = df["label"]

print("✂️ Splitting data...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("🌾 Training model...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Save model
model_path = os.path.join(os.getcwd(), "crop_model.pkl")
pickle.dump(model, open(model_path, "wb"))

print("✅ Model trained successfully")
print("📦 crop_model.pkl created at:", model_path)
