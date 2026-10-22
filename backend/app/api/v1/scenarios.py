from fastapi import APIRouter, Depends
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from ...core.security import get_current_user
from ...agents.orchestrator import AgentOrchestrator

router = APIRouter(tags=["Scenarios"])


class ScenarioRequest(BaseModel):
    total_cash: float = 142380.0
    reserved_amount: float = 35000.0
    minimum_reserve: float = 50000.0
    pending_payments: float = 0.0
    proposed_advance: Optional[float] = None
    revenue_shock_pct: Optional[float] = None  # e.g. -0.30 for 30% revenue drop
    business_name: str = "GreenLeaf Organics"
    monthly_revenue: float = 48000.0
    repayment_percentage: float = 0.10


@router.post("/scenarios/simulate")
def simulate_scenario(
    req: ScenarioRequest,
    current_user=Depends(get_current_user),
):
    orchestrator = AgentOrchestrator(minimum_reserve=Decimal(str(req.minimum_reserve)))

    # Apply revenue shock
    effective_revenue = req.monthly_revenue
    if req.revenue_shock_pct:
        effective_revenue = req.monthly_revenue * (1 + req.revenue_shock_pct)

    state = {
        "total_cash": req.total_cash,
        "reserved_amount": req.reserved_amount,
        "pending_payments": req.pending_payments,
        "pending_advances": 0,
        "outstanding_loans": 60200,  # demo
    }

    results = {}

    if req.proposed_advance:
        result = orchestrator.lending.assess_funding_request(
            request={
                "business_name": req.business_name,
                "requested_amount": req.proposed_advance,
                "monthly_revenue": effective_revenue,
                "repayment_percentage": req.repayment_percentage,
            },
            state=state,
        )
        results["lending_assessment"] = result

    from ...engine.safety import FinancialSafetyEngine, FinancialState
    engine = FinancialSafetyEngine(Decimal(str(req.minimum_reserve)))
    fs = FinancialState(
        total_cash=Decimal(str(req.total_cash)),
        reserved_amount=Decimal(str(req.reserved_amount)),
        pending_payments=Decimal(str(req.pending_payments)),
        pending_advances=Decimal("0"),
        minimum_reserve=Decimal(str(req.minimum_reserve)),
    )

    return {
        "scenario": {
            "total_cash": req.total_cash,
            "reserved_amount": req.reserved_amount,
            "minimum_reserve": req.minimum_reserve,
            "pending_payments": req.pending_payments,
            "effective_monthly_revenue": round(effective_revenue, 2),
            "revenue_shock_applied": req.revenue_shock_pct,
        },
        "financial_state": {
            "available_cash": float(fs.available_cash),
            "reserve_buffer": float(fs.reserve_buffer),
            "is_reserve_breached": fs.is_reserve_breached,
        },
        "results": results,
    }
