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
        You are expert in finding the core idea of the given context.
        Give precise answer to the question "What is the crux of the context?" based on the following rules.

        Rules:
        1. Answer should be only of 2 to 4 lines.
        2. Answer only from the knowledge of context.
        3. Do not include anything from outer knowledge or assumptions.
        4. Answer should be in single paragraph.
        5. Try to weight topics based on importance and give collective answer.
        6. If the context is having many topics, try to mention them in the same paragraph in a concise way.

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