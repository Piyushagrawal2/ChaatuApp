"""Settings module for AI service."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class AIServiceSettings(BaseSettings):
    """Configuration for the LangChain/LangGraph AI service."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

    environment: str = "development"
    project_name: str = "chaatu-app"

    gemini_api_key: str | None = None
    gemini_model_primary: str = "gemini-2.5-pro"
    gemini_model_fallback: str = "llama3-70b"

    tavily_api_key: str | None = None
    serpapi_api_key: str | None = None

    chromadb_host: str = "chromadb"
    chromadb_port: int = 8000
    chromadb_persist_dir: str = "/data"

    redis_host: str = "redis"
    redis_port: int = 6379


@lru_cache
def get_settings() -> AIServiceSettings:
    """Return cached settings instance."""

    return AIServiceSettings()
