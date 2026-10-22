import uuid
from decimal import Decimal
from datetime import datetime, timezone
from typing import Dict, Any, List
from .base import BankingAdapterBase


class AirwallexSimulatorAdapter(BankingAdapterBase):
    """
    High-fidelity Airwallex Sandbox simulator for local deterministic testing.
    Maintains in-memory idempotency register and transfer state.
    """

    def __init__(self):
        self._idempotency_store: Dict[str, Dict[str, Any]] = {}
        self._transfers: Dict[str, Dict[str, Any]] = {}

    async def get_account_balance(self, account_id: str) -> Dict[str, Any]:
        return {
            "account_id": account_id,
            "currency": "USD",
            "available_amount": 142380.00,
            "pending_amount": 78900.00,
            "reserved_amount": 35000.00,
            "is_simulated": True,
            "provider": "Airwallex Simulator",
        }

    async def get_transactions(self, account_id: str, from_date: str, to_date: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": "sim_tx_001",
                "type": "PAYMENT",
                "amount": 4800.00,
                "currency": "USD",
                "status": "SETTLED",
                "counterparty": "GreenLeaf Organics",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": "sim_tx_002",
                "type": "PAYOUT",
                "amount": 8200.00,
                "currency": "USD",
                "status": "SETTLED",
                "counterparty": "CloudOps Infrastructure Ltd",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        ]

    async def initiate_transfer(
        self,
        from_account: str,
        to_account: str,
        amount: Decimal,
        currency: str,
        idempotency_key: str,
        description: str,
    ) -> Dict[str, Any]:
        # Idempotency check: duplicate keys return original execution record
        if idempotency_key in self._idempotency_store:
            existing = self._idempotency_store[idempotency_key]
            existing["is_duplicate_replay"] = True
            return existing

        transfer_id = f"sim_tf_{uuid.uuid4().hex[:12]}"
        record = {
            "transfer_id": transfer_id,
            "from_account": from_account,
            "to_account": to_account,
            "amount": float(amount),
            "currency": currency,
            "status": "SUCCESS",
            "idempotency_key": idempotency_key,
            "description": description,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_simulated": True,
            "provider": "Airwallex Sandbox Simulator",
        }
        self._idempotency_store[idempotency_key] = record
        self._transfers[transfer_id] = record
        return record

    async def get_transfer_status(self, transfer_id: str) -> Dict[str, Any]:
        if transfer_id in self._transfers:
            return self._transfers[transfer_id]
        return {
            "transfer_id": transfer_id,
            "status": "NOT_FOUND",
            "is_simulated": True,
        }
