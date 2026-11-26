"""
CropCare AI — FastAPI Backend
Main application entry point with CORS and router configuration.
"""

import os

# Fix for "free(): invalid pointer" crash in TensorFlow 2.16+
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routers import predict, chat, report
from app.database import engine, Base
from app.models import database_models

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as exc:
    print(f"WARNING: Database table setup failed: {exc.__class__.__name__}")

app = FastAPI(
    title="Potato Disease Detection API",
    description="AI-powered potato disease detection and plant health assistant",
    version="1.1.0",
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(predict.router)
app.include_router(chat.router)
app.include_router(report.router)


@app.get("/")
def read_root():
    return {
        "app": "Potato Disease Detection",
        "status": "running",
        "endpoints": {
            "predict": "POST /api/predict",
            "chat": "POST /api/chat",
            "report": "POST /api/report",
        },
    }