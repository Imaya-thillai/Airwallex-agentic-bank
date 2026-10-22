import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, Boolean, DateTime, ForeignKey, Enum as SAEnum
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200), nullable=True)
    role = Column(
        SAEnum("admin", "finance_manager", "treasury_operator", "lending_analyst", "auditor", name="user_role"),
        nullable=False,
        default="auditor",
    )
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
