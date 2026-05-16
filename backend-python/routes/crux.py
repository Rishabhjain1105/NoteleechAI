from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

QDRANT_URL = "http://localhost:6333"
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class CruxRequest(BaseModel):
    collection_name: str

@router.post("/generate")
def generate_crux(req: CruxRequest):
    try:
        vector_store = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            collection_name=req.collection_name,
            embedding=embedding_model,
        )

        results = vector_store.similarity_search(query="core idea main point essence conclusion", k=10)

        if not results:
            raise HTTPException(status_code=404, detail="No content found in document.")

        context = "\n\n".join([r.page_content for r in results])

        prompt = f"""
        You are an expert at finding the core essence of any document.
        Based on the context below, extract the crux — the single most important idea or conclusion of this document.

        Rules:
        1. Answer in 2 to 4 lines maximum.
        2. Be direct and precise.
        3. No bullet points, just plain flowing sentences.
        4. Capture the deepest insight or conclusion, not just a surface summary.
        5. Only use information from the context.

        Context:
        {context}
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        crux = response.choices[0].message.content.strip()
        return {"crux": crux}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))