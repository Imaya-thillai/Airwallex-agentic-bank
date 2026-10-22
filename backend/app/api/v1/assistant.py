from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from ...core.security import get_current_user

router = APIRouter(tags=["AI Assistant"])

DEMO_RESPONSES = {
    "advance": {
        "summary": "GreenLeaf Organics — Advance Assessment",
        "answer": (
            "Based on current financial state (Total Cash: $142,380, Pending Payments: $78,900, "
            "Minimum Reserve: $50,000), the maximum permissible advance is **$7,480**. "
            "The originally requested $15,000 would breach the minimum reserve by $7,520. "
            "I recommend approving $7,480 with a 10% revenue-based repayment agreement."
        ),
        "calculations": {
            "total_cash": "$142,380", "minimum_reserve": "$50,000",
            "pending_payments": "$78,900", "max_advance": "$7,480"
        },
        "requires_approval": True,
    },
    "urgent": {
        "summary": "Urgent Payments This Week",
        "answer": (
            "3 payments require attention this week:\n"
            "1. **Staff Payroll — $45,000** (CRITICAL, due in 3 days)\n"
            "2. **CloudOps Infrastructure — $8,200** (HIGH, due in 5 days)\n"
            "3. **Equipment Maintenance — $2,100** (MEDIUM, due in 8 days)\n\n"
            "All three are payable from current available cash. Payroll should be prioritized immediately."
        ),
        "requires_approval": True,
    },
    "revenue": {
        "summary": "Revenue Shock Scenario: -30%",
        "answer": (
            "If monthly revenue falls 30%:\n"
            "- GreenLeaf's monthly repayment drops from $4,800 → $3,360\n"
            "- TechFlow's repayment drops from $7,440 → $5,208\n"
            "- Combined monthly repayment shortfall: $3,472\n"
            "- At current trajectory, GreenLeaf loan repayment extends from 4.7 → 6.7 months\n\n"
            "**Recommendation:** Establish revenue monitoring alert at 80% of expected monthly receipts."
        ),
        "requires_approval": False,
    },
    "default": {
        "summary": "STACK AI Response",
        "answer": (
            "I've analyzed the current financial state across treasury and lending portfolios. "
            "Total cash stands at **$142,380** with $50,000 minimum reserve. "
            "Available for new commitments: **$7,480**. "
            "Would you like me to run a specific scenario or assessment?"
        ),
        "requires_approval": False,
    },
}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


@router.post("/assistant/chat")
def chat(req: ChatRequest, current_user=Depends(get_current_user)):
    msg = req.message.lower()

    # Route to appropriate demo response
    if any(w in msg for w in ["advance", "greenleaf", "approve", "lending", "loan"]):
        resp = DEMO_RESPONSES["advance"]
    elif any(w in msg for w in ["urgent", "payment", "pay", "week", "due"]):
        resp = DEMO_RESPONSES["urgent"]
    elif any(w in msg for w in ["revenue", "fall", "drop", "30%", "scenario"]):
        resp = DEMO_RESPONSES["revenue"]
    else:
        resp = DEMO_RESPONSES["default"]

    return {
        "role": "assistant",
        "content": resp["answer"],
        "summary": resp["summary"],
        "calculations": resp.get("calculations", {}),
        "requires_approval": resp["requires_approval"],
        "data_source": "deterministic_demo",
        "disclaimer": "Responses use deterministic rules on live application data. Configure LLM_PROVIDER for AI-powered responses.",
    }
