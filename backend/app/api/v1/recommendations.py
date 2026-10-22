from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.recommendation import Recommendation
from ...demo.seed import TENANT_ID

router = APIRouter(tags=["Recommendations"])


@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    recs = (
        db.query(Recommendation)
        .filter(Recommendation.tenant_id == TENANT_ID)
        .order_by(Recommendation.created_at.desc())
        .all()
    )
    return {
        "recommendations": [
            {
                "id": str(r.id),
                "agent_type": r.agent_type,
                "title": r.title,
                "summary": r.summary,
                "evidence": r.evidence,
                "calculations": r.calculations,
                "risks": r.risks,
                "recommended_action": r.recommended_action,
                "requires_approval": r.requires_approval,
                "status": r.status,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in recs
        ]
    }
