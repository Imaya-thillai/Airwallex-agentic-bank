import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Text
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    requested_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action_type = Column(String(100), nullable=False)
    action_payload = Column(JSON, nullable=False)
    canonical_hash = Column(String(64), nullable=False)  # SHA-256 of canonical action
    status = Column(
        SAEnum("pending", "approved", "rejected", "expired", name="approval_status"),
        nullable=False,
        default="pending",
    )
    expires_at = Column(DateTime(timezone=True), nullable=False)
    reviewed_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
