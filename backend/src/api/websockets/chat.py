import asyncio
from typing import Any, AsyncGenerator, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...database.session import AsyncSessionLocal
from ...models.chat import Chat, Message

router = APIRouter()


async def stream_response(prompt: str) -> AsyncGenerator[str, None]:
    response = (
        "Thanks for sharing! "
        "Here's a concise summary of what you asked about, "
        "followed by suggestions pulled from the unified knowledge base."
    )
    combined = f"{response}\n\n> {prompt.strip() or 'No prompt content provided.'}"
    for token in combined.split():
        await asyncio.sleep(0.05)
        yield f"{token} "


async def ensure_chat_exists(db: AsyncSession, chat_id: str) -> Chat:
    result = await db.execute(select(Chat).where(Chat.id == chat_id))
    chat = result.scalar_one_or_none()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.websocket("/ws/chat/{conversation_id}")
async def chat_websocket(websocket: WebSocket, conversation_id: str):
    await websocket.accept()
    await websocket.send_json({"event": "connected", "conversation_id": conversation_id})
    
    async with AsyncSessionLocal() as db:
        await ensure_chat_exists(db, conversation_id)

    try:
        while True:
            payload: Dict[str, Any] = await websocket.receive_json()
            if payload.get("event") != "user_message":
                continue
            content = payload.get("content", "")
            metadata = payload.get("metadata", {}) or {}
            
            assistant_message_id = None

            async with AsyncSessionLocal() as db:
                user_message = Message(chat_id=conversation_id, role="user", content=content)
                db.add(user_message)
                
                assistant_message = Message(chat_id=conversation_id, role="assistant", content="")
                db.add(assistant_message)
                
                await db.commit()
                await db.refresh(assistant_message)
                assistant_message_id = assistant_message.id

            awaited_message_id = metadata.get("message_id") or assistant_message_id
            await websocket.send_json({
                "event": "assistant_message_started",
                "message_id": awaited_message_id,
            })

            streamed_content = ""
            async for chunk in stream_response(content):
                streamed_content += chunk
                await websocket.send_json({
                    "event": "assistant_message_chunk",
                    "message_id": awaited_message_id,
                    "delta": chunk,
                })

            async with AsyncSessionLocal() as db:
                result = await db.execute(select(Message).where(Message.id == assistant_message_id))
                msg = result.scalar_one()
                msg.content = streamed_content.strip()
                await db.commit()

            sources = [
                {
                    "id": "source-1",
                    "title": "Unified Knowledge Base",
                    "url": "https://chaatu.ai/handbook",
                    "snippet": "Synthetic reference for development builds.",
                }
            ]
            await websocket.send_json({
                "event": "assistant_message_completed",
                "message_id": awaited_message_id,
                "content": streamed_content.strip(),
                "sources": sources,
            })
    except WebSocketDisconnect:
        await websocket.close()
    except Exception as exc:
        # Check if connection is already closed before sending
        try:
            await websocket.send_json({"event": "error", "detail": str(exc)})
            await websocket.close()
        except:
            pass

