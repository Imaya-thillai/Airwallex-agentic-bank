from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
import random
from ...core.database import get_db
from ...core.security import get_current_user

router = APIRouter(tags=["Cashflow"])


@router.get("/cashflow")
def get_cashflow(
    period: str = Query("12m", description="Period: 3m, 6m, 12m"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Return historical + forecast cashflow data for charting."""
    months = {"3m": 3, "6m": 6, "12m": 12}.get(period, 12)

    # Synthetic historical data (clearly labelled)
    historical = []
    base = 110000.0
    random.seed(42)  # deterministic for demo
    for i in range(months, 0, -1):
        d = date.today().replace(day=1) - timedelta(days=i * 30)
        inflow = base + random.uniform(15000, 35000)
        outflow = base - random.uniform(8000, 22000)
        historical.append({
            "month": d.strftime("%b %Y"),
            "inflow": round(inflow, 2),
            "outflow": round(outflow, 2),
            "net": round(inflow - outflow, 2),
            "type": "historical",
        })

    # Forecast (next 3 months)
    forecast = []
    for i in range(1, 4):
        d = date.today().replace(day=1) + timedelta(days=i * 30)
        inflow = 140000 + i * 5000
        outflow = 120000 + i * 2000
        forecast.append({
            "month": d.strftime("%b %Y"),
            "inflow": round(inflow, 2),
            "outflow": round(outflow, 2),
            "net": round(inflow - outflow, 2),
            "type": "forecast",
        })

    return {
        "data": historical + forecast,
        "summary": {
            "avg_monthly_inflow": round(sum(h["inflow"] for h in historical) / len(historical), 2),
            "avg_monthly_outflow": round(sum(h["outflow"] for h in historical) / len(historical), 2),
            "data_source": "synthetic",
            "disclaimer": "Historical data is synthetic for demonstration. Forecast values are model projections.",
        },
    }
