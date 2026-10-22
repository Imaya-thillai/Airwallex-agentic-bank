import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, JSON
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    agent_type = Column(String(50), nullable=False)
    input_state = Column(JSON, nullable=True)
    output_state = Column(JSON, nullable=True)
    actions_taken = Column(JSON, nullable=True)
    status = Column(
        SAEnum("running", "completed", "failed", name="agent_run_status"),
        nullable=False,
        default="running",
    )
    started_at = Column(DateTime(timezone=True), default=utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
