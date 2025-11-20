"""Healthcheck endpoints."""
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from config.settings import get_settings


router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("/ping", summary="Health probe")
async def ping() -> JSONResponse:
    """Return service status details."""

    settings = get_settings()
    return JSONResponse(
        {
            "status": "ok",
            "service": "backend",
            "environment": settings.environment,
        }
    )
