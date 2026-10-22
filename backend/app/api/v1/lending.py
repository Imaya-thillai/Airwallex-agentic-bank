from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from ...core.database import get_db
from ...core.security import get_current_user
from ...agents.orchestrator import AgentOrchestrator
from ...models.account import Account
from ...models.loan import Loan
from ...models.business import Business
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Lending"])


class LendingAssessRequest(BaseModel):
    business_id: Optional[str] = None
    business_name: str
    requested_amount: float
    monthly_revenue: float
    repayment_percentage: float = 0.10
    purpose: Optional[str] = None


@router.post("/lending/assess")
def assess_lending(
    req: LendingAssessRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    accounts = db.query(Account).filter(Account.tenant_id == TENANT_ID).all()
    total_cash = sum(float(a.balance) for a in accounts)
    reserved = sum(float(a.reserved_amount) for a in accounts)

    loans = db.query(Loan).filter(Loan.tenant_id == TENANT_ID, Loan.status == "active").all()
    outstanding_loans = sum(float(l.outstanding_balance) for l in loans)

    orchestrator = AgentOrchestrator(minimum_reserve=Decimal("50000.00"))
    result = orchestrator.lending.assess_funding_request(
        request={
            "business_id": req.business_id,
            "business_name": req.business_name,
            "requested_amount": req.requested_amount,
            "monthly_revenue": req.monthly_revenue,
            "repayment_percentage": req.repayment_percentage,
            "purpose": req.purpose,
        },
        state={
            "total_cash": total_cash,
            "reserved_amount": reserved,
            "pending_payments": 78900.0,  # from current obligations
            "outstanding_loans": outstanding_loans,
        }
    )
    return result
