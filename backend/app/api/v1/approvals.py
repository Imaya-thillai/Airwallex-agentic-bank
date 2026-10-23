import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime, timezone, timedelta
import hashlib, json
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.approval import ApprovalRequest
from ...demo.seed import TENANT_ID, ADMIN_ID

router = APIRouter(tags=["Approvals"])


class ApprovalCreate(BaseModel):
    action_type: str
    action_payload: dict
    expires_in_minutes: int = 30


class ApprovalReview(BaseModel):
    notes: Optional[str] = None


def _canonical_hash(action_type: str, payload: dict) -> str:
    canonical = json.dumps({"action_type": action_type, "payload": payload}, sort_keys=True)
    return hashlib.sha256(canonical.encode()).hexdigest()


def _to_uuid(val: Any) -> uuid.UUID:
    if isinstance(val, uuid.UUID):
        return val
    return uuid.UUID(str(val))


def _ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


@router.get("/approvals")
def list_approvals(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    approvals = (
        db.query(ApprovalRequest)
        .filter(ApprovalRequest.tenant_id == TENANT_ID)
        .order_by(ApprovalRequest.created_at.desc())
        .limit(50)
        .all()
    )
    # Auto-expire safely handling offset-naive SQLite datetimes
    now = datetime.now(timezone.utc)
    for a in approvals:
        if a.status == "pending" and a.expires_at:
            if _ensure_utc(a.expires_at) < now:
                a.status = "expired"
    db.commit()

    return {
        "approvals": [
            {
                "id": str(a.id),
                "action_type": a.action_type,
                "action_payload": a.action_payload,
                "canonical_hash": a.canonical_hash,
                "status": a.status,
                "expires_at": a.expires_at.isoformat() if a.expires_at else None,
                "review_notes": a.review_notes,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in approvals
        ]
    }


@router.post("/approvals")
def create_approval(
    req: ApprovalCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    h = _canonical_hash(req.action_type, req.action_payload)
    existing = db.query(ApprovalRequest).filter(
        ApprovalRequest.canonical_hash == h,
        ApprovalRequest.status == "pending",
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Identical approval request already pending")

    approval = ApprovalRequest(
        tenant_id=TENANT_ID,
        requested_by=ADMIN_ID,
        action_type=req.action_type,
        action_payload=req.action_payload,
        canonical_hash=h,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=req.expires_in_minutes),
    )
    db.add(approval)
    db.commit()
    db.refresh(approval)
    return {"id": str(approval.id), "status": approval.status, "canonical_hash": h}


@router.post("/approvals/{approval_id}/approve")
def approve_request(
    approval_id: str,
    req: ApprovalReview = ApprovalReview(),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        appr_uuid = _to_uuid(approval_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid approval UUID")

    approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == appr_uuid).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    now = datetime.now(timezone.utc)
    if approval.expires_at and _ensure_utc(approval.expires_at) < now:
        approval.status = "expired"
        db.commit()
        raise HTTPException(status_code=410, detail="Approval has expired")
    if approval.status != "pending":
        raise HTTPException(status_code=409, detail=f"Approval is already {approval.status}")
    approval.status = "approved"
    approval.reviewed_at = now
    approval.reviewed_by = ADMIN_ID
    approval.review_notes = req.notes
    db.commit()
    return {"id": str(approval.id), "status": "approved"}


@router.post("/approvals/{approval_id}/reject")
def reject_request(
    approval_id: str,
    req: ApprovalReview = ApprovalReview(),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        appr_uuid = _to_uuid(approval_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid approval UUID")

    approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == appr_uuid).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval.status != "pending":
        raise HTTPException(status_code=409, detail=f"Approval is already {approval.status}")
    approval.status = "rejected"
    approval.reviewed_at = datetime.now(timezone.utc)
    approval.reviewed_by = ADMIN_ID
    approval.review_notes = req.notes
    db.commit()
    return {"id": str(approval.id), "status": "rejected"}
