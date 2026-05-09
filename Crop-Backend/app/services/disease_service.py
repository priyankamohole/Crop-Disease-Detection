"""
Potato disease prediction service using the local potatoes.h5 TF/Keras model.
Handles: Potato___Early_blight | Potato___Late_blight | Potato___healthy
"""

import os
import json
import numpy as np
from io import BytesIO
from PIL import Image

# ── Paths & Config ─────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "data", "potatoes.h5")
DISEASES_DB_PATH = os.path.join(BASE_DIR, "data", "diseases.json")

# Model expects 256x256 RGB images
IMG_SIZE = 256

# Class order must match the training data label encoding
CLASS_NAMES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
]

# ── Singletons ─────────────────────────────────────────────────────────
_model = None
_diseases_db: dict = {}


def _load_model():
    """Load the Keras model once and cache it."""
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        # Lazy import to avoid startup crash in some environments
        import tensorflow as tf
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model


def _load_diseases_db() -> dict:
    """Load the disease info JSON once and cache it."""
    global _diseases_db
    if not _diseases_db:
        if os.path.exists(DISEASES_DB_PATH):
            with open(DISEASES_DB_PATH, "r") as f:
                _diseases_db = json.load(f)
        else:
            _diseases_db = {"disease_info": {}}
    return _diseases_db


def predict_disease(image_bytes: bytes) -> dict:
    """
    Run the local potatoes.h5 model on an uploaded image.

    Returns:
        dict with keys: disease, display_name, confidence, description, advice
    """
    # 1. Pre-process image
    try:
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((IMG_SIZE, IMG_SIZE))
        img_array = np.array(img, dtype=np.float32)            # Use [0, 255] to match training
        img_array = np.expand_dims(img_array, axis=0)          # (1, 256, 256, 3)
    except Exception as e:
        raise Exception(f"Image processing failed: {str(e)}")

    # 2. Inference
    try:
        model = _load_model()
        predictions = model.predict(img_array, verbose=0)      # shape: (1, 3)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0])) * 100
    except Exception as e:
        raise Exception(f"Model inference failed: {str(e)}")

    disease_key = CLASS_NAMES[predicted_index]

    # 3. Lookup description & advice from diseases.json
    db = _load_diseases_db()
    info = db.get("disease_info", {}).get(disease_key, {})

    return {
        "disease":      disease_key,
        "display_name": info.get("display_name", disease_key.replace("___", " - ").replace("_", " ")),
        "confidence":   round(confidence, 2),
        "description":  info.get("description", "Potato leaf analysis completed by local AI model."),
        "advice":       info.get("advice", "Please consult an agricultural expert for tailored advice."),
    }