from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.audit_event import AuditEvent
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Audit"])


@router.get("/audit")
def get_audit_log(
    page: int = Query(1, ge=1),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    PAGE_SIZE = 50
    q = db.query(AuditEvent).filter(AuditEvent.tenant_id == TENANT_ID)
    total = q.count()
    events = q.order_by(AuditEvent.created_at.desc()).offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
    return {
        "events": [
            {
                "id": str(e.id),
                "event_type": e.event_type,
                "resource_type": e.resource_type,
                "resource_id": e.resource_id,
                "description": e.description,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
        "total": total,
        "page": page,
    }
