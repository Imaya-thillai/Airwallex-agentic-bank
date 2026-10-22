from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.loan import Loan
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Portfolio"])


@router.get("/portfolio/health")
def get_portfolio_health(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    loans = db.query(Loan).filter(Loan.tenant_id == TENANT_ID).all()
    
    active = [l for l in loans if l.status == "active"]
    defaulted = [l for l in loans if l.status == "defaulted"]
    completed = [l for l in loans if l.status == "completed"]
    
    total_outstanding = sum(float(l.outstanding_balance) for l in active)
    
    # At-risk: loans where recent repayment was missed (synthetic for demo)
    at_risk_balance = 19600.0  # TechFlow — missed Oct repayment

    return {
        "segments": [
            {"name": "Performing", "value": round(total_outstanding - at_risk_balance, 2),
             "color": "#10b981", "percentage": round((total_outstanding - at_risk_balance) / max(total_outstanding, 1) * 100, 1)},
            {"name": "At Risk", "value": at_risk_balance,
             "color": "#f59e0b", "percentage": round(at_risk_balance / max(total_outstanding, 1) * 100, 1)},
            {"name": "Defaulted", "value": sum(float(l.outstanding_balance) for l in defaulted),
             "color": "#ef4444", "percentage": 0},
            {"name": "Available Pool", "value": 35000.0, "color": "#06b6d4", "percentage": 0},
        ],
        "total_outstanding": total_outstanding,
        "at_risk_count": 1,
        "default_rate": 0.0,
        "collection_rate": round((total_outstanding - at_risk_balance) / max(total_outstanding, 1) * 100, 1),
    }
