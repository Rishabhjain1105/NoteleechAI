from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import ingest_pdf
import shutil
import os

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        collection_name = ingest_pdf(temp_path, file.filename)
        return {"message": "PDF ingested successfully", "collection": collection_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.remove(temp_path)