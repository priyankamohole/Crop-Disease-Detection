"""Chat router — POST /api/chat for the CropCare chatbot."""

from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat_service import get_chat_response

router = APIRouter(prefix="/api", tags=["Chatbot"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the CropCare AI chatbot.

    - Accepts: JSON with 'message' field
    - Returns: AI-generated reply about crop health
    """
    reply = get_chat_response(request.message)
    return ChatResponse(reply=reply)
