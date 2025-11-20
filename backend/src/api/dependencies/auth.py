"""API key dependency."""
from fastapi import HTTPException, Request, status

from config.settings import get_settings


async def enforce_api_key(request: Request) -> str:
    """Validate the incoming API key header against configuration."""

    settings = get_settings()
    header_name = settings.api_key_header
    provided_key = request.headers.get(header_name)

    if provided_key != settings.api_key_value:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key.",
            headers={"WWW-Authenticate": "API-Key"},
        )

    return header_name
