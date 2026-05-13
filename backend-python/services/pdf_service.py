from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

QDRANT_URL = "http://localhost:6333"

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_collection_name(filename: str) -> str:
    return filename.replace(" ", "_").replace(".pdf", "").lower()

def collection_exists(client: QdrantClient, name: str) -> bool:
    existing = [c.name for c in client.get_collections().collections]
    return name in existing

def ingest_pdf(pdf_path: str, filename: str) -> str:
    collection_name = get_collection_name(filename)
    qdrant_client = QdrantClient(url=QDRANT_URL)

    if collection_exists(qdrant_client, collection_name):
        return collection_name

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = splitter.split_documents(docs)

    qdrant_client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
    )

    QdrantVectorStore.from_documents(
        documents=split_docs,
        url=QDRANT_URL,
        collection_name=collection_name,
        embedding=embedding_model,
    )

    return collection_name