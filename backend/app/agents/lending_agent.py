"""SK7 — Portfolio Lending Agent"""
from decimal import Decimal
from ..engine.safety import FinancialSafetyEngine, FinancialState
import logging

logger = logging.getLogger(__name__)


class LendingAgent:
    name = "SK7-LendingAgent"
    PORTFOLIO_RESERVE_RATIO = Decimal("0.15")  # 15% of total portfolio must be liquid

    def __init__(self, safety_engine: FinancialSafetyEngine):
        self.safety = safety_engine

    def assess_funding_request(self, request: dict, state: dict) -> dict:
        """
        Assess a single funding/advance request.

        request: {business_id, business_name, requested_amount,
                  repayment_percentage, monthly_revenue, purpose}
        state:   {total_cash, reserved_amount, pending_payments,
                  pending_advances, outstanding_loans}
        """
        fs = FinancialState(
            total_cash=Decimal(str(state["total_cash"])),
            reserved_amount=Decimal(str(state.get("reserved_amount", 0))),
            pending_payments=Decimal(str(state.get("pending_payments", 0))),
            pending_advances=Decimal(str(state.get("pending_advances", 0))),
            minimum_reserve=self.safety.minimum_reserve,
        )

        requested = Decimal(str(request["requested_amount"]))
        monthly_revenue = Decimal(str(request.get("monthly_revenue", 0)))
        repayment_pct = Decimal(str(request.get("repayment_percentage", "0.10")))

        # Safety engine check
        result = self.safety.check_advance_safety(fs, requested)

        # Monthly repayment estimate
        monthly_repayment = Decimal("0")
        if monthly_revenue > 0:
            monthly_repayment = self.safety.calculate_revenue_repayment(
                monthly_revenue, repayment_pct
            )

        # Months to repay (based on approved amount)
        approved = result.approved_amount or Decimal("0")
        months_to_repay = (
            (approved / monthly_repayment).quantize(Decimal("0.1"))
            if monthly_repayment > 0
            else Decimal("999")
        )

        # Risk classification
        if months_to_repay > 24:
            risk = "high"
        elif months_to_repay > 12:
            risk = "medium"
        else:
            risk = "low"

        action = "APPROVE" if result.approved_amount and result.approved_amount > 0 else "REJECT"

        return {
            "agent": self.name,
            "business_id": request.get("business_id"),
            "business_name": request.get("business_name"),
            "requested_amount": str(requested),
            "approved_amount": str(approved),
            "is_approved": approved > Decimal("0"),
            "action": action,
            "risk_level": risk,
            "violations": result.violations,
            "warnings": result.warnings,
            "requires_approval": bool(result.required_approvals),
            "required_approvals": result.required_approvals,
            "calculations": {
                **result.calculations,
                "monthly_revenue": str(monthly_revenue),
                "repayment_percentage": f"{float(repayment_pct)*100:.1f}%",
                "monthly_repayment_estimate": str(monthly_repayment),
                "estimated_months_to_repay": str(months_to_repay),
            },
            "recommendation": (
                f"{'Approve' if approved > 0 else 'Reject'} advance of "
                f"${approved:,.2f} for {request.get('business_name')}. "
                f"Risk: {risk}. Est. repayment: {months_to_repay} months "
                f"at {float(repayment_pct)*100:.1f}% of monthly revenue."
            ),
        }
