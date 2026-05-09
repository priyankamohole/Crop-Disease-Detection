from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    disease = Column(String)
    display_name = Column(String)
    confidence = Column(Float)
    description = Column(String)
    advice = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
