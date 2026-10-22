import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, Numeric
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    account_number = Column(String(50), nullable=True)
    currency = Column(String(3), nullable=False, default="USD")
    balance = Column(Numeric(18, 2), nullable=False, default=0)
    reserved_amount = Column(Numeric(18, 2), nullable=False, default=0)
    account_type = Column(
        SAEnum("checking", "savings", "lending_pool", name="account_type"),
        nullable=False,
        default="checking",
    )
    airwallex_account_id = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
