"""SK1 — Adaptive Treasury Controller"""
from decimal import Decimal
from ..engine.safety import FinancialSafetyEngine, FinancialState
import logging

logger = logging.getLogger(__name__)


class TreasuryAgent:
    name = "SK1-TreasuryController"

    def __init__(self, safety_engine: FinancialSafetyEngine):
        self.safety = safety_engine

    def analyze(self, state: dict) -> dict:
        """
        Analyze treasury state and return prioritised recommendations.

        Expected state keys:
          total_cash, reserved_amount, pending_payments (optional),
          pending_advances (optional), obligations (list of dicts)
        """
        fs = FinancialState(
            total_cash=Decimal(str(state["total_cash"])),
            reserved_amount=Decimal(str(state.get("reserved_amount", 0))),
            pending_payments=Decimal(str(state.get("pending_payments", 0))),
            pending_advances=Decimal(str(state.get("pending_advances", 0))),
            minimum_reserve=self.safety.minimum_reserve,
        )

        obligations = state.get("obligations", [])
        # Sort by priority weight
        priority_weight = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        obligations_sorted = sorted(
            obligations, key=lambda o: priority_weight.get(o.get("priority", "low"), 3)
        )

        recommendations = []
        alerts = []
        running_balance = fs.total_cash

        for obl in obligations_sorted:
            amt = Decimal(str(obl["amount"]))
            priority = obl.get("priority", "medium")
            result = self.safety.check_payment_safety(fs, amt, priority)

            if result.is_safe:
                action = "PAY"
                explanation = (
                    f"Safe to pay. Post-payment reserve buffer: "
                    f"${Decimal(result.calculations['post_payment_buffer']):,.2f}."
                )
            else:
                action = "ESCALATE" if priority in ("critical", "high") else "DEFER"
                explanation = "; ".join(result.violations + result.warnings)

            recommendations.append({
                "obligation_id": obl.get("id"),
                "payee": obl.get("payee"),
                "amount": str(amt),
                "priority": priority,
                "due_date": obl.get("due_date"),
                "action": action,
                "explanation": explanation,
                "requires_approval": bool(result.required_approvals),
                "required_approvals": result.required_approvals,
            })

        # Aggregate alerts
        if fs.is_reserve_breached:
            alerts.append({"level": "critical", "message": "Minimum reserve is already breached before new payments."})
        if fs.available_cash < Decimal("20000"):
            alerts.append({"level": "warning", "message": f"Low available cash: ${fs.available_cash:,.2f}."})

        payable = [r for r in recommendations if r["action"] == "PAY"]
        deferred = [r for r in recommendations if r["action"] in ("DEFER", "ESCALATE")]

        return {
            "agent": self.name,
            "financial_state": {
                "total_cash": str(fs.total_cash),
                "reserved_amount": str(fs.reserved_amount),
                "pending_payments": str(fs.pending_payments),
                "available_cash": str(fs.available_cash),
                "reserve_buffer": str(fs.reserve_buffer),
                "minimum_reserve": str(self.safety.minimum_reserve),
            },
            "alerts": alerts,
            "recommendations": recommendations,
            "summary": (
                f"Analyzed {len(obligations)} obligations. "
                f"{len(payable)} safe to pay, {len(deferred)} deferred/escalated."
            ),
        }
