"""Agent Orchestrator — coordinates SK1 + SK7 via shared safety engine."""
from decimal import Decimal
from .treasury_agent import TreasuryAgent
from .lending_agent import LendingAgent
from ..engine.safety import FinancialSafetyEngine, FinancialState
import logging

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    def __init__(self, minimum_reserve: Decimal = Decimal("50000.00")):
        self.safety = FinancialSafetyEngine(minimum_reserve=minimum_reserve)
        self.treasury = TreasuryAgent(self.safety)
        self.lending = LendingAgent(self.safety)

    def run_full_analysis(self, financial_state: dict) -> dict:
        """
        Run both agents against the same financial_state dict and
        detect cross-agent conflicts.
        """
        treasury_result = self.treasury.analyze(financial_state)
        lending_results = [
            self.lending.assess_funding_request(req, financial_state)
            for req in financial_state.get("funding_requests", [])
        ]

        # Conflict detection
        treasury_pay_total = sum(
            Decimal(r["amount"])
            for r in treasury_result["recommendations"]
            if r["action"] == "PAY"
        )
        lending_advance_total = sum(
            Decimal(r["approved_amount"])
            for r in lending_results
            if r["is_approved"]
        )

        total_cash = Decimal(str(financial_state["total_cash"]))
        reserved = Decimal(str(financial_state.get("reserved_amount", 0)))
        minimum_reserve = self.safety.minimum_reserve

        headroom = total_cash - reserved - treasury_pay_total - lending_advance_total - minimum_reserve
        conflicts = []

        if headroom < Decimal("0"):
            conflicts.append({
                "type": "COMBINED_COMMITMENT_EXCEEDS_CASH",
                "message": (
                    f"Treasury payments (${treasury_pay_total:,.2f}) + "
                    f"Lending advances (${lending_advance_total:,.2f}) + "
                    f"Reserve (${minimum_reserve:,.2f}) exceed total cash (${total_cash:,.2f})."
                ),
                "resolution": "Lending advances revised downward.",
            })
            # Reduce lending to fit
            remaining = max(total_cash - reserved - treasury_pay_total - minimum_reserve, Decimal("0"))
            for lr in lending_results:
                if lr["is_approved"]:
                    original = Decimal(lr["approved_amount"])
                    revised = min(original, remaining)
                    lr["approved_amount"] = str(revised)
                    lr["is_approved"] = revised > Decimal("0")
                    remaining = max(remaining - revised, Decimal("0"))
                    if revised < original:
                        lr["warnings"].append(
                            f"Amount revised from ${original:,.2f} to ${revised:,.2f} "
                            "due to combined commitment conflict with treasury."
                        )

        return {
            "treasury_analysis": treasury_result,
            "lending_assessments": lending_results,
            "conflicts": conflicts,
            "combined_summary": {
                "total_cash": str(total_cash),
                "minimum_reserve": str(minimum_reserve),
                "treasury_commitments": str(treasury_pay_total),
                "lending_commitments": str(lending_advance_total),
                "headroom_after_all": str(max(headroom, Decimal("0"))),
                "combined_safe": len(conflicts) == 0,
            },
        }
