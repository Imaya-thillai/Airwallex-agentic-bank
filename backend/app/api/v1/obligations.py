from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.obligation import PaymentObligation
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Obligations"])


@router.get("/obligations")
def get_obligations(
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(PaymentObligation).filter(PaymentObligation.tenant_id == TENANT_ID)
    if status:
        q = q.filter(PaymentObligation.status == status)
    q = q.order_by(PaymentObligation.due_date)
    obligations = q.all()
    return {
        "obligations": [
            {
                "id": str(o.id),
                "payee": o.payee,
                "amount": float(o.amount),
                "currency": o.currency,
                "priority": o.priority,
                "category": o.category,
                "due_date": str(o.due_date),
                "status": o.status,
                "description": o.description,
            }
            for o in obligations
        ],
        "total": len(obligations),
        "total_pending": sum(float(o.amount) for o in obligations if o.status == "pending"),
    }
