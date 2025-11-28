from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel
from datetime import datetime

from ...database.session import get_db
from ...models.chat import Chat, Message

router = APIRouter(prefix="/chats", tags=["chats"])

class MessageCreate(BaseModel):
    role: str
    content: str

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    title: str
    user_id: str 

class ChatResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

@router.post("/", response_model=ChatResponse)
async def create_chat(chat: ChatCreate, db: AsyncSession = Depends(get_db)):
    new_chat = Chat(title=chat.title, user_id=chat.user_id)
    db.add(new_chat)
    await db.commit()
    await db.refresh(new_chat)
    
    # Manually construct response to avoid lazy loading of messages relationship
    return ChatResponse(
        id=new_chat.id,
        title=new_chat.title,
        created_at=new_chat.created_at,
        messages=[]  # New chats have no messages
    )

@router.get("/", response_model=List[ChatResponse])
async def get_chats(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chat).where(Chat.user_id == user_id).order_by(Chat.created_at.desc()))
    chats = result.scalars().all()
    
    # Manually construct responses to avoid lazy loading
    return [
        ChatResponse(
            id=chat.id,
            title=chat.title,
            created_at=chat.created_at,
            messages=[]  # Don't load messages for chat list
        )
        for chat in chats
    ]

@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Eager load messages
    result_msgs = await db.execute(select(Message).where(Message.chat_id == chat_id).order_by(Message.created_at.asc()))
    messages = result_msgs.scalars().all()
    
    # Manually construct response
    return ChatResponse(
        id=chat.id,
        title=chat.title,
        created_at=chat.created_at,
        messages=[
            MessageResponse(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at
            )
            for msg in messages
        ]
    )

@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def add_message(chat_id: str, message: MessageCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    new_message = Message(chat_id=chat_id, role=message.role, content=message.content)
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    return new_message


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(chat_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    await db.delete(chat)
    await db.commit()
    return Response(status_code=204)
