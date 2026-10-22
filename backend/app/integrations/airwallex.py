import httpx
from decimal import Decimal
from typing import Dict, Any, List
from .base import BankingAdapterBase
from ..core.config import settings


class AirwallexAdapter(BankingAdapterBase):
    """
    Live Airwallex Sandbox integration adapter.
    Interacts with official Airwallex endpoints using bearer API token auth.
    """

    def __init__(self):
        self.base_url = settings.AIRWALLEX_BASE_URL.rstrip('/')
        self.client_id = settings.AIRWALLEX_CLIENT_ID
        self.api_key = settings.AIRWALLEX_API_KEY
        self._token = None

    async def _get_auth_token(self) -> str:
        if self._token:
            return self._token
        if not self.client_id or not self.api_key:
            raise ValueError("Airwallex API credentials not configured in environment (AIRWALLEX_CLIENT_ID / AIRWALLEX_API_KEY)")
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{self.base_url}/api/v1/authentication/login",
                headers={"x-client-id": self.client_id, "x-api-key": self.api_key},
                timeout=10.0,
            )
            res.raise_for_status()
            self._token = res.json().get("token")
            return self._token

    async def get_account_balance(self, account_id: str) -> Dict[str, Any]:
        token = await self._get_auth_token()
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{self.base_url}/api/v1/balances/current",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0,
            )
            res.raise_for_status()
            return res.json()

    async def get_transactions(self, account_id: str, from_date: str, to_date: str) -> List[Dict[str, Any]]:
        token = await self._get_auth_token()
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{self.base_url}/api/v1/financial_transactions",
                params={"from_created_at": from_date, "to_created_at": to_date},
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0,
            )
            res.raise_for_status()
            return res.json().get("items", [])

    async def initiate_transfer(
        self,
        from_account: str,
        to_account: str,
        amount: Decimal,
        currency: str,
        idempotency_key: str,
        description: str,
    ) -> Dict[str, Any]:
        token = await self._get_auth_token()
        payload = {
            "request_id": idempotency_key,
            "source_account_id": from_account,
            "beneficiary_id": to_account,
            "amount": float(amount),
            "currency": currency,
            "reference": description,
        }
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{self.base_url}/api/v1/transfers/create",
                json=payload,
                headers={"Authorization": f"Bearer {token}", "x-request-id": idempotency_key},
                timeout=15.0,
            )
            res.raise_for_status()
            return res.json()

    async def get_transfer_status(self, transfer_id: str) -> Dict[str, Any]:
        token = await self._get_auth_token()
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{self.base_url}/api/v1/transfers/{transfer_id}",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10.0,
            )
            res.raise_for_status()
            return res.json()
