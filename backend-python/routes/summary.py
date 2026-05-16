from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

QDRANT_URL = "http://localhost:6333"
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class SummaryRequest(BaseModel):
    collection_name: str

@router.post("/generate")
def generate_summary(req: SummaryRequest):
    try:
        vector_store = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            collection_name=req.collection_name,
            embedding=embedding_model,
        )

        results = vector_store.similarity_search(query="main topics overview summary", k=10)

        if not results:
            raise HTTPException(status_code=404, detail="No content found in document.")

        context = "\n\n".join([r.page_content for r in results])

        prompt = f"""
        You are a summarization expert. Based on the context below, generate a clean structured summary.

        Rules:
        1. Start with a one line overview of what the document is about.
        2. Then list the key points as bullet points.
        3. Keep it concise and easy to read.
        4. Do not add anything that is not in the context.

        Context:
        {context}
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        summary = response.choices[0].message.content.strip()
        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))