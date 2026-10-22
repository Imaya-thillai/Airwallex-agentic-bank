from fastapi import APIRouter
from ...core.database import engine

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    db_ok = True
    try:
        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
    except Exception:
        db_ok = False

    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "unavailable",
        "version": "1.0.0",
        "service": "STACK AI API",
    }
