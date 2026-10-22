import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, Numeric, JSON
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class FinancialEvent(Base):
    __tablename__ = "financial_events"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    account_id = Column(Uuid(as_uuid=True), ForeignKey("accounts.id"), nullable=True)
    event_type = Column(String(100), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    description = Column(String(500), nullable=True)
    source = Column(
        SAEnum("synthetic", "historical", "sandbox", "forecast", name="event_source"),
        nullable=False,
        default="synthetic",
    )
    event_metadata = Column(JSON, nullable=True)
    occurred_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    created_at = Column(DateTime(timezone=True), default=utcnow)
