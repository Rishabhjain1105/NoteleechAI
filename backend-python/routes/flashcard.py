from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

QDRANT_URL = "http://localhost:6333"
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class FlashcardRequest(BaseModel):
    collection_name: str
    topic: str = ""

@router.post("/generate")
def generate_flashcard(req: FlashcardRequest):
    try:
        vector_store = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            collection_name=req.collection_name,
            embedding=embedding_model,
        )

        query = req.topic if req.topic.strip() else "main topic"
        results = vector_store.similarity_search(query=query, k=5)

        if not results:
            raise HTTPException(status_code=404, detail="No content found in document.")

        context = "\n\n".join([r.page_content for r in results])

        if req.topic.strip():
            topic_instruction = f"Generate a flashcard specifically about this topic: {req.topic}"
        else:
            topic_instruction = "Pick the most important topic from the context and generate a flashcard about it."

        prompt = f"""
        You are a flashcard generator. Based on the context below, generate exactly 1 flashcard.
        {topic_instruction}

        Rules:
        1. Return ONLY a JSON object, no extra text, no markdown.
        2. Format: {{"topic": "...", "front": "question here", "back": "answer here"}}
        3. Front should be a clear question.
        4. Back should be a concise answer.

        Context:
        {context}
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        raw = response.choices[0].message.content.strip()

        # Clean markdown if model wraps in backticks
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        # Find JSON object within the response
        start = raw.find("{")
        end = raw.rfind("}") + 1
        raw = raw[start:end]

        flashcard = json.loads(raw)
        return {"flashcard": flashcard}

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid format. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))