from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import ingest_pdf
import shutil
import os
import tempfile

router = APIRouter()

@router.post("/upload")
async def upload_pdf(PDF: UploadFile = File(...)):
    temp_path = os.path.join(tempfile.gettempdir(), PDF.filename)
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(PDF.file, buffer)

    try:
        collection_name = ingest_pdf(temp_path, PDF.filename)
        return {"message": "PDF ingested successfully", "collection": collection_name, "filename": PDF.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)