from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from groq import Groq
from fpdf import FPDF
import os
import tempfile
import re
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

QDRANT_URL = "http://localhost:6333"
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class NotesRequest(BaseModel):
    collection_name: str

def clean_text(text: str) -> str:
    # Remove all non-latin characters safely
    text = text.encode('latin-1', 'replace').decode('latin-1')
    # Remove any markdown bold/italic markers
    text = text.replace("**", "").replace("__", "").replace("*", "").replace("_", " ")
    # Replace any weird dashes or bullets with simple dash
    text = re.sub(r'[^\x00-\x7F]', '-', text)
    return text.strip()

def create_pdf(content: str, filename: str) -> str:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # Page width minus margins
    page_width = pdf.w - 40  # 20mm margin on each side

    lines = content.split("\n")

    for line in lines:
        line = line.strip()
        
        # Remove all non-ASCII characters completely
        line = ''.join(c if ord(c) < 128 else ' ' for c in line)
        line = line.strip()

        if not line:
            pdf.ln(3)
            continue

        if line.startswith("# "):
            text = line.replace("# ", "", 1).strip()
            if text:
                pdf.set_font("Helvetica", style="B", size=14)
                pdf.set_text_color(30, 100, 200)
                pdf.cell(page_width, 10, text[:80], ln=True)
                pdf.ln(1)

        elif line.startswith("## "):
            text = line.replace("## ", "", 1).strip()
            if text:
                pdf.set_font("Helvetica", style="B", size=12)
                pdf.set_text_color(60, 60, 60)
                pdf.cell(page_width, 8, text[:80], ln=True)
                pdf.ln(1)

        elif line.startswith("### "):
            text = line.replace("### ", "", 1).strip()
            if text:
                pdf.set_font("Helvetica", style="B", size=11)
                pdf.set_text_color(80, 80, 80)
                pdf.cell(page_width, 7, text[:80], ln=True)

        elif line.startswith("- ") or line.startswith("* "):
            text = "  - " + line[2:].strip()
            if text:
                pdf.set_font("Helvetica", size=10)
                pdf.set_text_color(0, 0, 0)
                # Split long lines into chunks of 90 characters
                chunks = [text[i:i+90] for i in range(0, len(text), 90)]
                for chunk in chunks:
                    pdf.cell(page_width, 6, chunk, ln=True)

        else:
            text = line.strip()
            if text:
                pdf.set_font("Helvetica", size=10)
                pdf.set_text_color(0, 0, 0)
                # Split long lines into chunks of 90 characters
                chunks = [text[i:i+90] for i in range(0, len(text), 90)]
                for chunk in chunks:
                    pdf.cell(page_width, 6, chunk, ln=True)

    temp_path = os.path.join(tempfile.gettempdir(), filename)
    pdf.output(temp_path)
    return temp_path

@router.post("/generate")
def generate_notes(req: NotesRequest):
    try:
        vector_store = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            collection_name=req.collection_name,
            embedding=embedding_model,
        )

        queries = [
            "introduction overview concepts",
            "main topics and definitions",
            "important points and facts",
            "processes methods and steps",
            "conclusions examples applications"
        ]

        all_docs = []
        seen = set()
        for query in queries:
            results = vector_store.similarity_search(query=query, k=3)
            for r in results:
                if r.page_content not in seen:
                    seen.add(r.page_content)
                    all_docs.append(r)

        if not all_docs:
            raise HTTPException(status_code=404, detail="No content found in document.")

        context = "\n\n".join([r.page_content for r in all_docs])

        prompt = f"""
        You are an expert note maker. Based on the context below, generate well structured study notes.

        Rules:
        1. Notes should include headings, subheadings, and explanation.
        2. For every heading and subheading, provide a brief explanation in simple language.
        3. Only include information that is present in the context. Do not add any external information.
        4. It may look like dictionary entries, but do not include bullet points.
        5. Only headings and respective paragraphs are required.
        6. Do not add conclusion.

        Context:
        {context}
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        notes_content = response.choices[0].message.content.strip()

        pdf_filename = f"notes_{req.collection_name}.pdf"
        pdf_path = create_pdf(notes_content, pdf_filename)

        return FileResponse(
            path=pdf_path,
            filename=pdf_filename,
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))