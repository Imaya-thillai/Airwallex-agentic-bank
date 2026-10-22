import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, Date, ForeignKey, Enum as SAEnum, Numeric
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class PaymentObligation(Base):
    __tablename__ = "payment_obligations"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    account_id = Column(Uuid(as_uuid=True), ForeignKey("accounts.id"), nullable=True)
    payee = Column(String(200), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    priority = Column(
        SAEnum("critical", "high", "medium", "low", name="obligation_priority"),
        nullable=False,
        default="medium",
    )
    category = Column(
        SAEnum("payroll", "supplier", "tax", "operational", "loan", name="obligation_category"),
        nullable=False,
        default="operational",
    )
    due_date = Column(Date, nullable=False)
    status = Column(
        SAEnum("pending", "paid", "deferred", "overdue", name="obligation_status"),
        nullable=False,
        default="pending",
    )
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
