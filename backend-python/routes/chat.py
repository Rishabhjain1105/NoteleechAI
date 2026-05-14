from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chat_service import answer_question

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    collection_name: str

@router.post("/ask")
def ask(req: ChatRequest):
    try:
        answer = answer_question(req.question, req.collection_name)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))