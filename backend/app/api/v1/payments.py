from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.transaction import Transaction
from ...demo.seed import TENANT_ID
import uuid
from datetime import datetime, timezone

router = APIRouter(tags=["Payments"])


@router.get("/payments")
def get_payments(
    page: int = Query(1, ge=1),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    PAGE_SIZE = 20
    q = db.query(Transaction).filter(Transaction.tenant_id == TENANT_ID)
    if status:
        q = q.filter(Transaction.status == status)
    total = q.count()
    transactions = q.order_by(Transaction.created_at.desc()).offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()

    # If no transactions yet (before seed), return synthetic demo list
    if not transactions:
        return _demo_payments()

    return {
        "payments": [
            {
                "id": str(t.id),
                "transaction_type": t.transaction_type,
                "amount": float(t.amount),
                "currency": t.currency,
                "status": t.status,
                "payee_name": t.payee_name,
                "description": t.description,
                "idempotency_key": t.idempotency_key,
                "executed_at": t.executed_at.isoformat() if t.executed_at else None,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in transactions
        ],
        "total": total,
        "page": page,
        "pages": max(1, -(-total // PAGE_SIZE)),
    }


def _demo_payments():
    """Synthetic demo payments for display before real transactions exist."""
    from datetime import date, timedelta
    demos = [
        {"id": str(uuid.uuid4()), "transaction_type": "debit", "amount": 45000.0, "currency": "USD",
         "status": "pending", "payee_name": "Staff Payroll", "description": "Monthly payroll",
         "idempotency_key": "PAYROLL-OCT-2024", "executed_at": None,
         "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "transaction_type": "debit", "amount": 8200.0, "currency": "USD",
         "status": "pending", "payee_name": "CloudOps Ltd", "description": "Infrastructure invoice",
         "idempotency_key": "CLOUD-OCT-2024", "executed_at": None,
         "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "transaction_type": "advance", "amount": 7480.0, "currency": "USD",
         "status": "pending", "payee_name": "GreenLeaf Organics", "description": "Revenue-based advance",
         "idempotency_key": "ADV-GREENLEAF-001", "executed_at": None,
         "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "transaction_type": "credit", "amount": 48000.0, "currency": "USD",
         "status": "completed", "payee_name": "GreenLeaf Organics Revenue", "description": "Monthly revenue receipt",
         "idempotency_key": "REV-GREENLEAF-SEP", "executed_at": datetime.now(timezone.utc).isoformat(),
         "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "transaction_type": "repayment", "amount": 4800.0, "currency": "USD",
         "status": "completed", "payee_name": "GreenLeaf Organics Repayment", "description": "Sep repayment",
         "idempotency_key": "REP-GREENLEAF-SEP", "executed_at": datetime.now(timezone.utc).isoformat(),
         "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "transaction_type": "repayment", "amount": 7440.0, "currency": "USD",
         "status": "failed", "payee_name": "TechFlow Solutions", "description": "Oct repayment — revenue delay",
         "idempotency_key": "REP-TECHFLOW-OCT", "executed_at": None,
         "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    return {"payments": demos, "total": len(demos), "page": 1, "pages": 1}
