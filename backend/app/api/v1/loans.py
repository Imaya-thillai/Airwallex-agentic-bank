from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.loan import Loan
from ...models.business import Business
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Loans"])


@router.get("/loans")
def get_loans(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    loans = db.query(Loan).filter(Loan.tenant_id == TENANT_ID).all()
    result = []
    for l in loans:
        biz = db.query(Business).filter(Business.id == l.business_id).first()
        result.append({
            "id": str(l.id),
            "business_id": str(l.business_id),
            "business_name": biz.name if biz else "Unknown",
            "business_type": biz.business_type if biz else None,
            "risk_level": biz.risk_level if biz else "medium",
            "principal": float(l.principal),
            "outstanding_balance": float(l.outstanding_balance),
            "repayment_percentage": float(l.repayment_percentage),
            "repayment_pct_display": f"{float(l.repayment_percentage)*100:.0f}%",
            "interest_rate": float(l.interest_rate),
            "status": l.status,
            "loan_type": l.loan_type,
            "disbursed_at": l.disbursed_at.isoformat() if l.disbursed_at else None,
            "monthly_revenue": float(biz.monthly_revenue) if biz else 0,
            "monthly_repayment_estimate": float(biz.monthly_revenue * l.repayment_percentage) if biz else 0,
        })
    total_outstanding = sum(float(l.outstanding_balance) for l in loans)
    total_principal = sum(float(l.principal) for l in loans)
    return {
        "loans": result,
        "summary": {
            "total_principal": total_principal,
            "total_outstanding": total_outstanding,
            "active_count": sum(1 for l in loans if l.status == "active"),
        },
    }


@router.get("/repayments")
def get_repayments(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from ...models.repayment import Repayment
    reps = db.query(Repayment).all()
    return {
        "repayments": [
            {
                "id": str(r.id),
                "loan_id": str(r.loan_id),
                "amount_due": float(r.amount_due),
                "amount_paid": float(r.amount_paid),
                "period_start": str(r.period_start),
                "period_end": str(r.period_end),
                "status": r.status,
                "revenue_received": float(r.revenue_received),
            }
            for r in reps
        ]
    }
