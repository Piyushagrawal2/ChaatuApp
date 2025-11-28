import asyncio
from typing import Any, AsyncGenerator, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...database.session import get_db
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
async def chat_websocket(websocket: WebSocket, conversation_id: str, db: AsyncSession = Depends(get_db)):
    await websocket.accept()
    await websocket.send_json({"event": "connected", "conversation_id": conversation_id})
    await ensure_chat_exists(db, conversation_id)
    try:
        while True:
            payload: Dict[str, Any] = await websocket.receive_json()
            if payload.get("event") != "user_message":
                continue
            content = payload.get("content", "")
            metadata = payload.get("metadata", {}) or {}
            user_message = Message(chat_id=conversation_id, role="user", content=content)
            db.add(user_message)
            await db.commit()
            await db.refresh(user_message)

            assistant_message = Message(chat_id=conversation_id, role="assistant", content="")
            db.add(assistant_message)
            await db.commit()
            await db.refresh(assistant_message)

            awaited_message_id = metadata.get("message_id") or assistant_message.id
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

            assistant_message.content = streamed_content.strip()
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
                "content": assistant_message.content,
                "sources": sources,
            })
    except WebSocketDisconnect:
        await websocket.close()
    except Exception as exc:
        await websocket.send_json({"event": "error", "detail": str(exc)})
        await websocket.close()

