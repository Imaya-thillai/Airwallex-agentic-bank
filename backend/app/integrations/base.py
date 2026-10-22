from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Optional, List, Dict, Any


class BankingAdapterBase(ABC):
    @abstractmethod
    async def get_account_balance(self, account_id: str) -> Dict[str, Any]:
        """Retrieve balance for an account."""
        pass

    @abstractmethod
    async def get_transactions(self, account_id: str, from_date: str, to_date: str) -> List[Dict[str, Any]]:
        """Retrieve historical transaction statements."""
        pass

    @abstractmethod
    async def initiate_transfer(
        self,
        from_account: str,
        to_account: str,
        amount: Decimal,
        currency: str,
        idempotency_key: str,
        description: str,
    ) -> Dict[str, Any]:
        """Execute an idempotent payment or advance transfer."""
        pass

    @abstractmethod
    async def get_transfer_status(self, transfer_id: str) -> Dict[str, Any]:
        """Poll or verify transfer status for uncertainty reconciliation."""
        pass
