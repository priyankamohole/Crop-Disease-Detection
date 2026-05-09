"""Pydantic models for API request/response schemas."""

from pydantic import BaseModel
from typing import Optional


class PredictionResponse(BaseModel):
    """Response schema for disease prediction."""
    disease: str
    display_name: str
    confidence: float
    description: str
    advice: str


class ChatRequest(BaseModel):
    """Request schema for chatbot."""
    message: str


class ChatResponse(BaseModel):
    """Response schema for chatbot."""
    reply: str


class ReportRequest(BaseModel):
    """Request schema for PDF report generation."""
    disease: str
    display_name: str
    confidence: float
    description: str
    advice: str
