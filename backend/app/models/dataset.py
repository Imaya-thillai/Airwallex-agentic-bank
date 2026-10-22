import uuid
from datetime import datetime, timezone
from sqlalchemy import Uuid, Column, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Integer, BigInteger, Text
from ..core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class DatasetRegistry(Base):
    __tablename__ = "dataset_registry"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    source = Column(String(200), nullable=True)
    license = Column(String(200), nullable=True)
    file_path = Column(String(500), nullable=True)
    schema_version = Column(String(50), nullable=True)
    row_count = Column(BigInteger, nullable=True)
    accepted_count = Column(BigInteger, nullable=True)
    rejected_count = Column(BigInteger, nullable=True)
    status = Column(
        SAEnum("pending", "ingesting", "completed", "failed", name="dataset_status"),
        nullable=False,
        default="pending",
    )
    provenance = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class IngestionJob(Base):
    __tablename__ = "ingestion_jobs"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_id = Column(Uuid(as_uuid=True), ForeignKey("dataset_registry.id"), nullable=False)
    status = Column(
        SAEnum("pending", "running", "completed", "failed", name="job_status"),
        nullable=False,
        default="pending",
    )
    rows_processed = Column(BigInteger, nullable=False, default=0)
    rows_accepted = Column(BigInteger, nullable=False, default=0)
    rows_rejected = Column(BigInteger, nullable=False, default=0)
    error_log = Column(JSON, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
