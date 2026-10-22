from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.business import Business
from ...models.loan import Loan
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Businesses"])


@router.get("/businesses")
def get_businesses(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    businesses = db.query(Business).filter(Business.tenant_id == TENANT_ID, Business.is_active == True).all()
    result = []
    for b in businesses:
        loans = db.query(Loan).filter(Loan.business_id == b.id).all()
        active_loans = [l for l in loans if l.status == "active"]
        result.append({
            "id": str(b.id),
            "name": b.name,
            "business_type": b.business_type,
            "contact_email": b.contact_email,
            "monthly_revenue": float(b.monthly_revenue),
            "credit_score": b.credit_score,
            "risk_level": b.risk_level,
            "active_loans": len(active_loans),
            "total_outstanding": sum(float(l.outstanding_balance) for l in active_loans),
        })
    return {"businesses": result, "total": len(result)}
