from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from ...core.database import get_db
from ...core.security import get_current_user
from ...models import Account, Loan, PaymentObligation, Recommendation, Repayment
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # ── KPI Data ─────────────────────────────────────────────────────────────
    accounts = db.query(Account).filter(Account.tenant_id == TENANT_ID).all()
    total_cash = sum(float(a.balance) for a in accounts)
    reserved_amount = sum(float(a.reserved_amount) for a in accounts)
    available_for_lending = max(total_cash - reserved_amount - 50000.0, 0)

    loans = db.query(Loan).filter(Loan.tenant_id == TENANT_ID, Loan.status == "active").all()
    outstanding_loans = sum(float(l.outstanding_balance) for l in loans)

    # Expected repayments next 30 days (10% avg repayment on outstanding)
    expected_repayments = sum(
        float(l.outstanding_balance) * float(l.repayment_percentage) for l in loans
    )

    # ── Obligations ──────────────────────────────────────────────────────────
    obligations = (
        db.query(PaymentObligation)
        .filter(PaymentObligation.tenant_id == TENANT_ID, PaymentObligation.status == "pending")
        .order_by(PaymentObligation.due_date)
        .limit(8)
        .all()
    )

    # ── Recommendations ───────────────────────────────────────────────────────
    recs = (
        db.query(Recommendation)
        .filter(Recommendation.tenant_id == TENANT_ID, Recommendation.status == "pending")
        .order_by(Recommendation.created_at.desc())
        .limit(3)
        .all()
    )

    # ── Portfolio health ──────────────────────────────────────────────────────
    active_count = db.query(Loan).filter(Loan.tenant_id == TENANT_ID, Loan.status == "active").count()
    defaulted_count = db.query(Loan).filter(Loan.tenant_id == TENANT_ID, Loan.status == "defaulted").count()

    # ── Alerts ────────────────────────────────────────────────────────────────
    missed_repayments = db.query(Repayment).filter(Repayment.status == "missed").count()

    alerts = []
    if missed_repayments > 0:
        alerts.append({"level": "warning", "message": f"{missed_repayments} missed repayment(s) require attention"})
    if available_for_lending < 10000:
        alerts.append({"level": "critical", "message": "Available liquidity critically low"})

    return {
        "kpis": {
            "total_cash": total_cash,
            "reserved_amount": reserved_amount,
            "available_for_lending": available_for_lending,
            "outstanding_loans": outstanding_loans,
            "expected_repayments_30d": round(expected_repayments, 2),
            "data_source": "synthetic",
        },
        "portfolio_health": {
            "active": active_count,
            "at_risk": 1,  # demo: TechFlow missed payment
            "defaulted": defaulted_count,
            "available_pool": round(available_for_lending, 2),
        },
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
        "loans": [
            {
                "id": str(l.id),
                "business_id": str(l.business_id),
                "principal": float(l.principal),
                "outstanding_balance": float(l.outstanding_balance),
                "repayment_percentage": float(l.repayment_percentage),
                "status": l.status,
                "loan_type": l.loan_type,
            }
            for l in loans
        ],
        "recommendations": [
            {
                "id": str(r.id),
                "agent_type": r.agent_type,
                "title": r.title,
                "summary": r.summary,
                "calculations": r.calculations,
                "recommended_action": r.recommended_action,
                "requires_approval": r.requires_approval,
                "status": r.status,
            }
            for r in recs
        ],
        "alerts": alerts,
    }
