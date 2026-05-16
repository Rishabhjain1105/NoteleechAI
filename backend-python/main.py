from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import pdf, chat, flashcard, summary, crux, quiz

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