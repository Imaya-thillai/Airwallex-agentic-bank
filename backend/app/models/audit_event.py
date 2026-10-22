import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, JSON
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    user_id = Column(Uuid(as_uuid=True), nullable=True)
    event_type = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=True)
    resource_id = Column(String(200), nullable=True)
    description = Column(String(500), nullable=False)
    event_metadata = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)
