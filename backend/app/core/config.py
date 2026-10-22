from pydantic_settings import BaseSettings
from decimal import Decimal
from typing import Optional
import os


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./stackai.db")
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    AIRWALLEX_CLIENT_ID: str = ""
    AIRWALLEX_API_KEY: str = ""
    AIRWALLEX_BASE_URL: str = "https://api-demo.airwallex.com"
    USE_AIRWALLEX_SIMULATOR: bool = True
    OPENAI_API_KEY: str = ""
    LLM_PROVIDER: str = "demo"
    DEMO_MODE: bool = True
    MIN_RESERVE_AMOUNT: str = "50000.00"

    @property
    def minimum_reserve(self) -> Decimal:
        return Decimal(self.MIN_RESERVE_AMOUNT)

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
