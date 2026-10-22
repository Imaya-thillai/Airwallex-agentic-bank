from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from ...core.database import get_db
from ...core.security import get_current_user
from ...agents.orchestrator import AgentOrchestrator
from ...models.account import Account
from ...models.obligation import PaymentObligation
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Treasury"])


class TreasuryAnalyzeRequest(BaseModel):
    include_obligations: bool = True
    custom_obligations: Optional[List[dict]] = None


@router.post("/treasury/analyze")
def analyze_treasury(
    req: TreasuryAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    accounts = db.query(Account).filter(Account.tenant_id == TENANT_ID).all()
    total_cash = sum(float(a.balance) for a in accounts)
    reserved = sum(float(a.reserved_amount) for a in accounts)

    obligations_data = []
    if req.include_obligations:
        obls = db.query(PaymentObligation).filter(
            PaymentObligation.tenant_id == TENANT_ID,
            PaymentObligation.status == "pending"
        ).all()
        obligations_data = [
            {"id": str(o.id), "payee": o.payee, "amount": float(o.amount),
             "priority": o.priority, "due_date": str(o.due_date)}
            for o in obls
        ]

    if req.custom_obligations:
        obligations_data = req.custom_obligations

    orchestrator = AgentOrchestrator(minimum_reserve=Decimal("50000.00"))
    result = orchestrator.treasury.analyze({
        "total_cash": total_cash,
        "reserved_amount": reserved,
        "obligations": obligations_data,
    })

    return result
