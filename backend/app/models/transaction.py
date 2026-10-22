import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, Numeric, JSON
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    account_id = Column(Uuid(as_uuid=True), ForeignKey("accounts.id"), nullable=True)
    transaction_type = Column(
        SAEnum("credit", "debit", "transfer", "advance", "repayment", name="tx_type"),
        nullable=False,
    )
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    status = Column(
        SAEnum("pending", "completed", "failed", "uncertain", "cancelled", name="tx_status"),
        nullable=False,
        default="pending",
    )
    idempotency_key = Column(String(200), unique=True, nullable=False, index=True)
    airwallex_tx_id = Column(String(200), nullable=True)
    payee_name = Column(String(200), nullable=True)
    payee_account = Column(String(100), nullable=True)
    description = Column(String(500), nullable=True)
    tx_metadata = Column(JSON, nullable=True)
    executed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
