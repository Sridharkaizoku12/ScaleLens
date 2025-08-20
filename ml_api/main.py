from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model.joblib"

class PredictionResponse(BaseModel):
    profit_loss: float
    details: str

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    # Read CSV
    df = pd.read_csv(file.file)
    if not os.path.exists(MODEL_PATH):
        return {"profit_loss": 0, "details": "Model not trained yet."}
    model = joblib.load(MODEL_PATH)
    # Assume the CSV has the same columns as used in training
    prediction = model.predict(df)[0]
    return {"profit_loss": float(prediction), "details": "Prediction successful."}

@app.post("/train")
async def train(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    # Assume last column is the target (profit/loss)
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]
    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    return {"message": "Model trained successfully."}
