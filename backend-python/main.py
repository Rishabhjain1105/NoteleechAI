from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import pdf, chat, flashcard, summary, crux, quiz, notes
from qdrant_client import QdrantClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf.router, prefix="/pdf", tags=["PDF"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(flashcard.router, prefix="/flashcard", tags=["Flashcard"])
app.include_router(summary.router, prefix="/summary", tags=["Summary"])
app.include_router(crux.router, prefix="/crux", tags=["Crux"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])


@app.get("/collections")
def get_collections():
    client = QdrantClient(url="http://localhost:6333")
    collections = [c.name for c in client.get_collections().collections]
    return {"collections": collections}