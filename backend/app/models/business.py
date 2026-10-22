import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, Numeric, Integer, JSON, Boolean
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    business_type = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    monthly_revenue = Column(Numeric(18, 2), nullable=False, default=0)
    credit_score = Column(Integer, nullable=True)
    risk_level = Column(
        SAEnum("low", "medium", "high", name="business_risk"),
        nullable=False,
        default="medium",
    )
    is_active = Column(Boolean, default=True)
    business_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
