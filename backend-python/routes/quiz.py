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

class QuizRequest(BaseModel):
    collection_name: str

@router.post("/generate")
def generate_quiz(req: QuizRequest):
    try:
        vector_store = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            collection_name=req.collection_name,
            embedding=embedding_model,
        )

        # Fetch from different parts of the document for topic versatility
        queries = [
            "introduction concepts definitions",
            "important facts and figures",
            "conclusions and results",
            "processes and methods",
            "examples and applications"
        ]

        all_docs = []
        for query in queries:
            results = vector_store.similarity_search(query=query, k=2)
            all_docs.extend(results)

        if not all_docs:
            raise HTTPException(status_code=404, detail="No content found in document.")

        context = "\n\n".join([r.page_content for r in all_docs])

        prompt = f"""
        You are a quiz generator. Based on the context below generate exactly 5 MCQ questions covering different topics from the document.

        Rules:
        1. Return ONLY a valid JSON array, no extra text, no markdown, no code blocks.
        2. Each question must have: question, options (array of 4), correct_answer (must match one option exactly)
        3. Cover different topics across all 5 questions, do not repeat the same concept.
        4. Make options realistic and not obviously wrong.
        5. Format:
        [
            {{
                "question": "...",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "A"
            }}
        ]

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

        # Find JSON array within the response
        start = raw.find("[")
        end = raw.rfind("]") + 1
        raw = raw[start:end]

        quiz = json.loads(raw)
        return {"quiz": quiz}

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid format. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))