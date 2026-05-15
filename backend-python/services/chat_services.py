from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = "http://localhost:6333"

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def answer_question(question: str, collection_name: str) -> str:
    vector_store = QdrantVectorStore.from_existing_collection(
        url=QDRANT_URL,
        collection_name=collection_name,
        embedding=embedding_model,
    )

    results = vector_store.similarity_search(query=question, k=5)

    if not results:
        return "No relevant information found in the document."

    context = "\n\n".join([
        f"Page Content: {r.page_content}\n"
        f"Page: {r.metadata.get('page_label', 'N/A')}\n"
        f"Source: {r.metadata.get('source', 'N/A')}"
        for r in results
    ])

    system_prompt = f"""
    You are an AI assistant that answers questions strictly based on the provided context.
    Rules:
    1. Answer only from the context below.
    2. Be concise and structured (use bullet points if needed).
    3. Mention page number and source when available.
    4. If not found, say: "Not found in the document."

    Context:
    {context}
    """

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ]
    )

    return response.choices[0].message.content