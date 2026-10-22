import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, Date, ForeignKey, Enum as SAEnum, Numeric
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Repayment(Base):
    __tablename__ = "repayments"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    loan_id = Column(Uuid(as_uuid=True), ForeignKey("loans.id"), nullable=False, index=True)
    amount_due = Column(Numeric(18, 2), nullable=False)
    amount_paid = Column(Numeric(18, 2), nullable=False, default=0)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    status = Column(
        SAEnum("pending", "partial", "complete", "missed", name="repayment_status"),
        nullable=False,
        default="pending",
    )
    revenue_received = Column(Numeric(18, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)
