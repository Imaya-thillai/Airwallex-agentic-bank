from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.account import Account
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Accounts"])


@router.get("/accounts")
def get_accounts(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    accounts = db.query(Account).filter(Account.tenant_id == TENANT_ID).all()
    total_balance = sum(float(a.balance) for a in accounts)
    total_reserved = sum(float(a.reserved_amount) for a in accounts)
    return {
        "accounts": [
            {
                "id": str(a.id),
                "name": a.name,
                "account_number": a.account_number,
                "currency": a.currency,
                "balance": float(a.balance),
                "reserved_amount": float(a.reserved_amount),
                "available": float(a.balance) - float(a.reserved_amount),
                "account_type": a.account_type,
            }
            for a in accounts
        ],
        "summary": {
            "total_balance": total_balance,
            "total_reserved": total_reserved,
            "total_available": total_balance - total_reserved,
        },
    }
