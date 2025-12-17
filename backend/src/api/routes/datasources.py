from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from ...database.session import get_db
from ...models.data_source import Connection, UploadedFile

router = APIRouter(prefix="/datasources", tags=["datasources"])

class ConnectionCreate(BaseModel):
    name: str
    source_type: str
    user_id: str

class ConnectionResponse(BaseModel):
    id: str
    name: str
    source_type: str
    status: str
    last_synced_at: datetime
    created_at: datetime
    added_by: str  # We might need to fetch user name, but for now using ID or a placeholder

    class Config:
        from_attributes = True

class FileResponse(BaseModel):
    id: str
    filename: str
    size: int
    created_at: datetime
    connection: str # "Manual Upload" or connection name
    added_by: str

    class Config:
        from_attributes = True

# --- Connections ---

@router.get("/connections", response_model=List[ConnectionResponse])
async def get_connections(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Connection).where(Connection.user_id == user_id).order_by(Connection.created_at.desc()))
    connections = result.scalars().all()
    
    return [
        ConnectionResponse(
            id=conn.id,
            name=conn.name,
            source_type=conn.source_type,
            status=conn.status,
            last_synced_at=conn.last_synced_at,
            created_at=conn.created_at,
            added_by="You" # Placeholder, ideally fetch user
        ) for conn in connections
    ]

@router.post("/connections", response_model=ConnectionResponse)
async def create_connection(connection: ConnectionCreate, db: AsyncSession = Depends(get_db)):
    # Mock connection logic: just save to DB
    new_conn = Connection(
        name=connection.name,
        source_type=connection.source_type,
        user_id=connection.user_id,
        status="Ready", # Mock status
        last_synced_at=datetime.utcnow()
    )
    db.add(new_conn)
    await db.commit()
    await db.refresh(new_conn)

    return ConnectionResponse(
        id=new_conn.id,
        name=new_conn.name,
        source_type=new_conn.source_type,
        status=new_conn.status,
        last_synced_at=new_conn.last_synced_at,
        created_at=new_conn.created_at,
        added_by="You"
    )

@router.delete("/connections/{connection_id}", status_code=204)
async def delete_connection(connection_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Connection).where(Connection.id == connection_id))
    conn = result.scalar_one_or_none()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    await db.delete(conn)
    await db.commit()
    return Response(status_code=204)

# --- Files ---

@router.get("/files", response_model=List[FileResponse])
async def get_files(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UploadedFile).where(UploadedFile.user_id == user_id).order_by(UploadedFile.created_at.desc()))
    files = result.scalars().all()

    return [
        FileResponse(
            id=f.id,
            filename=f.filename,
            size=f.size,
            created_at=f.created_at,
            connection="Manual Upload",
            added_by="You"
        ) for f in files
    ]

@router.delete("/files/{file_id}", status_code=204)
async def delete_file(file_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UploadedFile).where(UploadedFile.id == file_id))
    file_record = result.scalar_one_or_none()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    await db.delete(file_record)
    await db.commit()
    return Response(status_code=204)
