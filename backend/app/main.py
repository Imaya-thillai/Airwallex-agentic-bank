from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import (
    dashboard, accounts, cashflow, obligations, payments, loans,
    portfolio, recommendations, treasury, lending, scenarios,
    approvals, audit, businesses, auth, assistant, health
)

app = FastAPI(
    title="STACK AI API",
    description="Multi-Agent Treasury and Lending Intelligence Platform — Airwallex Hackathon",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"

app.include_router(health.router, prefix=PREFIX)
app.include_router(auth.router, prefix=PREFIX)
app.include_router(dashboard.router, prefix=PREFIX)
app.include_router(accounts.router, prefix=PREFIX)
app.include_router(cashflow.router, prefix=PREFIX)
app.include_router(obligations.router, prefix=PREFIX)
app.include_router(payments.router, prefix=PREFIX)
app.include_router(loans.router, prefix=PREFIX)
app.include_router(portfolio.router, prefix=PREFIX)
app.include_router(recommendations.router, prefix=PREFIX)
app.include_router(treasury.router, prefix=PREFIX)
app.include_router(lending.router, prefix=PREFIX)
app.include_router(scenarios.router, prefix=PREFIX)
app.include_router(approvals.router, prefix=PREFIX)
app.include_router(audit.router, prefix=PREFIX)
app.include_router(businesses.router, prefix=PREFIX)
app.include_router(assistant.router, prefix=PREFIX)


@app.get("/")
def root():
    return {
        "service": "STACK AI",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/v1/health",
    }
