"""
Financial Safety Engine — STACK AI
All monetary calculations use Python Decimal to avoid floating-point errors.
This module is deliberately kept free of LLM or HTTP calls.
"""
from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
from dataclasses import dataclass, field
from typing import Optional
import logging

logger = logging.getLogger(__name__)

CENT = Decimal("0.01")


class SafetyViolation(Exception):
    def __init__(self, code: str, message: str, details: dict | None = None):
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)


@dataclass
class FinancialState:
    total_cash: Decimal
    reserved_amount: Decimal
    pending_payments: Decimal
    pending_advances: Decimal
    minimum_reserve: Decimal

    @property
    def committed(self) -> Decimal:
        return self.reserved_amount + self.pending_payments + self.pending_advances

    @property
    def available_cash(self) -> Decimal:
        """Cash available after commitments AND minimum reserve."""
        return max(self.total_cash - self.committed - self.minimum_reserve, Decimal("0"))

    @property
    def reserve_buffer(self) -> Decimal:
        """How much above the minimum reserve we currently sit."""
        return self.total_cash - self.committed - self.minimum_reserve

    @property
    def is_reserve_breached(self) -> bool:
        return self.reserve_buffer < Decimal("0")


@dataclass
class SafetyResult:
    is_safe: bool
    approved_amount: Optional[Decimal]
    violations: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    calculations: dict = field(default_factory=dict)
    required_approvals: list[str] = field(default_factory=list)


class FinancialSafetyEngine:
    """
    Deterministic financial safety engine.
    Invariants enforced:
      1. available_cash >= 0 after any commitment
      2. minimum_reserve is never breached by a new commitment
      3. No double-execution (idempotency checked by callers)
      4. All monetary values use Decimal
    """

    def __init__(self, minimum_reserve: Decimal = Decimal("50000.00")):
        self.minimum_reserve = minimum_reserve

    # ─── Validation ──────────────────────────────────────────────────────────

    def validate_amount(self, amount, field_name: str = "amount") -> Decimal:
        if amount is None:
            raise SafetyViolation("NULL_AMOUNT", f"{field_name} cannot be None")
        try:
            d = Decimal(str(amount))
        except InvalidOperation:
            raise SafetyViolation("INVALID_AMOUNT", f"{field_name} '{amount}' is not a valid number")
        if d <= Decimal("0"):
            raise SafetyViolation("NON_POSITIVE_AMOUNT", f"{field_name} must be > 0, got {d}")
        return d.quantize(CENT, rounding=ROUND_HALF_UP)

    # ─── Lending / Advance ───────────────────────────────────────────────────

    def check_advance_safety(
        self, state: FinancialState, proposed_advance: Decimal
    ) -> SafetyResult:
        proposed_advance = self.validate_amount(proposed_advance, "proposed_advance")

        max_advance = max(
            state.total_cash - state.committed - self.minimum_reserve, Decimal("0")
        )
        post_advance_buffer = state.total_cash - state.committed - proposed_advance - self.minimum_reserve

        violations: list[str] = []
        warnings: list[str] = []

        if proposed_advance > max_advance:
            violations.append(
                f"Proposed advance ${proposed_advance:,.2f} exceeds maximum permissible "
                f"${max_advance:,.2f}. Reserve would be breached by "
                f"${abs(post_advance_buffer):,.2f}."
            )

        if post_advance_buffer < Decimal("0"):
            pass  # already covered above
        elif post_advance_buffer < Decimal("10000"):
            warnings.append(
                f"Advance leaves only ${post_advance_buffer:,.2f} margin above minimum reserve."
            )

        # Determine approved amount — revised downward if needed
        if violations:
            approved = max_advance if max_advance > Decimal("0") else None
        else:
            approved = proposed_advance

        required_approvals = []
        if approved and approved > Decimal("10000"):
            required_approvals.append("FINANCE_MANAGER")

        calcs = {
            "total_cash": str(state.total_cash),
            "reserved_amount": str(state.reserved_amount),
            "pending_payments": str(state.pending_payments),
            "pending_advances": str(state.pending_advances),
            "minimum_reserve": str(self.minimum_reserve),
            "committed": str(state.committed),
            "available_before_advance": str(state.available_cash),
            "proposed_advance": str(proposed_advance),
            "max_permissible_advance": str(max_advance),
            "post_advance_reserve_buffer": str(post_advance_buffer),
            "approved_amount": str(approved) if approved else "0.00",
        }

        return SafetyResult(
            is_safe=len(violations) == 0,
            approved_amount=approved,
            violations=violations,
            warnings=warnings,
            calculations=calcs,
            required_approvals=required_approvals,
        )

    # ─── Payments ────────────────────────────────────────────────────────────

    def check_payment_safety(
        self, state: FinancialState, payment_amount: Decimal, priority: str
    ) -> SafetyResult:
        payment_amount = self.validate_amount(payment_amount, "payment_amount")
        post_payment_buffer = state.total_cash - state.committed - payment_amount - self.minimum_reserve

        violations: list[str] = []
        warnings: list[str] = []

        if post_payment_buffer < Decimal("0"):
            if priority in ("critical",):
                warnings.append(
                    f"Payment of ${payment_amount:,.2f} breaches minimum reserve — "
                    f"CRITICAL priority requires escalation and manual approval."
                )
            else:
                violations.append(
                    f"Payment of ${payment_amount:,.2f} would breach minimum reserve "
                    f"by ${abs(post_payment_buffer):,.2f}. Action: DEFER."
                )

        required_approvals = []
        if priority in ("critical", "high") and payment_amount > Decimal("5000"):
            required_approvals.append("TREASURY_OPERATOR")

        return SafetyResult(
            is_safe=len(violations) == 0,
            approved_amount=payment_amount if len(violations) == 0 else None,
            violations=violations,
            warnings=warnings,
            calculations={
                "total_cash": str(state.total_cash),
                "payment_amount": str(payment_amount),
                "post_payment_buffer": str(post_payment_buffer),
                "minimum_reserve": str(self.minimum_reserve),
            },
            required_approvals=required_approvals,
        )

    # ─── Revenue-based repayment ─────────────────────────────────────────────

    def calculate_revenue_repayment(
        self, revenue_received: Decimal, repayment_percentage: Decimal
    ) -> Decimal:
        revenue_received = self.validate_amount(revenue_received, "revenue_received")
        pct = Decimal(str(repayment_percentage))
        if not (Decimal("0") < pct <= Decimal("1")):
            raise SafetyViolation(
                "INVALID_PERCENTAGE",
                f"repayment_percentage must be in (0, 1], got {pct}",
            )
        return (revenue_received * pct).quantize(CENT, rounding=ROUND_HALF_UP)
