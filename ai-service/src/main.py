"""Entry point for the AI microservice."""
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .config.settings import get_settings


settings = get_settings()
app = FastAPI(
    title="Chaatu AI Service",
    version="0.1.0",
    description="LangChain/LangGraph orchestration microservice",
)


@app.get("/health", tags=["health"])
async def health_check() -> JSONResponse:
    """Return basic service metadata for health probes."""

    return JSONResponse(
        {
            "status": "ok",
            "environment": settings.environment,
            "service": "ai-service",
        }
    )
