import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Boolean, Text
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    agent_type = Column(
        SAEnum("treasury", "lending", "combined", name="agent_type_enum"),
        nullable=False,
    )
    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=False)
    evidence = Column(JSON, nullable=True)
    calculations = Column(JSON, nullable=True)
    risks = Column(JSON, nullable=True)
    recommended_action = Column(Text, nullable=False)
    requires_approval = Column(Boolean, default=False)
    status = Column(
        SAEnum("pending", "approved", "rejected", "executed", name="rec_status"),
        nullable=False,
        default="pending",
    )
    created_at = Column(DateTime(timezone=True), default=utcnow)
