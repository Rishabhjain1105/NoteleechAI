from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import pdf, chat

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