import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, Numeric
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    business_id = Column(Uuid(as_uuid=True), ForeignKey("businesses.id"), nullable=False)
    account_id = Column(Uuid(as_uuid=True), ForeignKey("accounts.id"), nullable=True)
    principal = Column(Numeric(18, 2), nullable=False)
    outstanding_balance = Column(Numeric(18, 2), nullable=False)
    interest_rate = Column(Numeric(5, 4), nullable=False, default=0)
    repayment_percentage = Column(Numeric(5, 4), nullable=False, default=0.1)
    status = Column(
        SAEnum("active", "completed", "defaulted", "pending", name="loan_status"),
        nullable=False,
        default="active",
    )
    loan_type = Column(
        SAEnum("revenue_based", "term", "line_of_credit", name="loan_type"),
        nullable=False,
        default="revenue_based",
    )
    disbursed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
