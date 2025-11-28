from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads"
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


@router.post("/upload")
async def upload_document(
    conversation_id: str = Form(...),
    file: UploadFile = File(...),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    if len(contents) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (15MB max)")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid4())
    filename = f"{file_id}_{file.filename}"
    destination = UPLOAD_DIR / filename
    destination.write_bytes(contents)

    return {
        "id": file_id,
        "filename": file.filename,
        "size": len(contents),
        "conversation_id": conversation_id,
        "mime_type": file.content_type,
        "url": f"/uploads/{filename}",
    }

