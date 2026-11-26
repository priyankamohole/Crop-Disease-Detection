"""Prediction router — POST /api/predict for potato disease detection."""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.schemas import PredictionResponse
from app.services.disease_service import predict_disease
from app.database import get_db
from app.models.database_models import Prediction

router = APIRouter(prefix="/api", tags=["Prediction"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a potato leaf image and get potato disease prediction.

    - Accepts: JPG, PNG, WEBP (max 5MB)
    - Returns: potato disease name, confidence score, description, and advice
    """
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: JPG, PNG, WEBP",
        )

    # Read and validate file size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(image_bytes)} bytes). Maximum: 5MB",
        )

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    # Get prediction
    try:
        result = predict_disease(image_bytes)

        # Saving history is optional: prediction should still work if the database
        # becomes unavailable after startup.
        try:
            db_prediction = Prediction(
                disease=result["disease"],
                display_name=result["display_name"],
                confidence=result["confidence"],
                description=result["description"],
                advice=result["advice"]
            )
            db.add(db_prediction)
            db.commit()
            db.refresh(db_prediction)
        except Exception:
            db.rollback()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    return PredictionResponse(**result)