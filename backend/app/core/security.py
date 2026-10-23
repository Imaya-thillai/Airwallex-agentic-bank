import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """Get current authenticated user. Returns demo user if no token or in DEMO_MODE."""
    from ..models.user import User

    if not token:
        if settings.DEMO_MODE:
            user = db.query(User).filter(User.email == "admin@stackai.demo").first()
            if user:
                return user
            return _demo_user()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    if not payload:
        if settings.DEMO_MODE:
            user = db.query(User).filter(User.email == "admin@stackai.demo").first()
            return user or _demo_user()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id_raw = payload.get("sub")
    if not user_id_raw:
        if settings.DEMO_MODE:
            user = db.query(User).filter(User.email == "admin@stackai.demo").first()
            return user or _demo_user()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    # Safely convert to UUID object to satisfy SQLAlchemy's Uuid type processor
    user = None
    try:
        user_uuid = uuid.UUID(str(user_id_raw))
        user = db.query(User).filter(User.id == user_uuid).first()
    except Exception:
        # If user_id_raw is not a valid UUID (e.g. demo string or email)
        user = db.query(User).filter(User.email == str(user_id_raw)).first()

    if not user:
        if settings.DEMO_MODE:
            user = db.query(User).filter(User.email == "admin@stackai.demo").first()
            return user or _demo_user()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def _demo_user():
    class _User:
        id = uuid.UUID("00000000-0000-0000-0000-000000000010")
        email = "admin@stackai.demo"
        full_name = "Alex Admin"
        role = "admin"
        tenant_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
        is_active = True
    return _User()


def require_roles(*roles: str):
    async def _check(current_user=Depends(get_current_user)):
        user_role = getattr(current_user, "role", "admin")
        if user_role not in roles and user_role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return _check
