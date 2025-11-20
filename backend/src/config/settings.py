"""Backend service configuration."""
from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class BackendSettings(BaseSettings):
    """Settings for the FastAPI backend."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

    environment: str = Field(default="development")
    project_name: str = Field(default="chaatu-app")

    api_key_header: str = Field(default="CHAATU_API_KEY")
    api_key_value: str = Field(default="change-me")

    backend_port: int = Field(default=8000)
    ai_service_url: str = Field(default="http://ai-service:9000")

    postgres_host: str = Field(default="postgres")
    postgres_port: int = Field(default=5432)
    postgres_user: str = Field(default="chaatu")
    postgres_password: str = Field(default="supersecret")
    postgres_db: str = Field(default="chaatu_app")

    redis_host: str = Field(default="redis")
    redis_port: int = Field(default=6379)


@lru_cache
def get_settings() -> BackendSettings:
    """Return cached settings instance."""

    return BackendSettings()
