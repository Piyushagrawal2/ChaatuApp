"""FastAPI application factory."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config.settings import get_settings
from .api.routes import health, chats, documents
from .api.websockets import chat as ws_chat
from .database.session import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

def create_app() -> FastAPI:
    """Create and configure FastAPI app."""

    settings = get_settings()
    app = FastAPI(title="Chaatu Backend", version="0.1.0", docs_url="/docs", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(chats.router)
    app.include_router(documents.router)
    app.include_router(ws_chat.router)

    return app


app = create_app()
