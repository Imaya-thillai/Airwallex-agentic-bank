"""
Demo seed data — STACK AI
Inserts a reproducible demo scenario into the database.
All values are synthetic / demonstration fixtures.
"""
import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from sqlalchemy.orm import Session
from ..core.database import SessionLocal, engine
from ..models import Base, Tenant, User, Account, Business, Loan, Repayment, PaymentObligation, Recommendation
from ..core.security import get_password_hash

TENANT_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")
ADMIN_ID = uuid.UUID("00000000-0000-0000-0000-000000000010")

TODAY = date.today()


def create_tables():
    Base.metadata.create_all(bind=engine)


def seed(db: Session):
    # Skip if already seeded
    if db.query(Tenant).filter(Tenant.id == TENANT_ID).first():
        print("Demo data already seeded — skipping.")
        return

    print("Seeding demo data…")

    # ── Tenant ──────────────────────────────────────────────────────────────
    tenant = Tenant(id=TENANT_ID, name="STACK AI Demo", slug="stackai-demo")
    db.add(tenant)

    # ── Users ────────────────────────────────────────────────────────────────
    users = [
        User(id=ADMIN_ID, tenant_id=TENANT_ID, email="admin@stackai.demo",
             hashed_password=get_password_hash("admin123"), full_name="Alex Admin", role="admin"),
        User(id=uuid.uuid4(), tenant_id=TENANT_ID, email="finance@stackai.demo",
             hashed_password=get_password_hash("finance123"), full_name="Fiona Finance", role="finance_manager"),
        User(id=uuid.uuid4(), tenant_id=TENANT_ID, email="treasury@stackai.demo",
             hashed_password=get_password_hash("treasury123"), full_name="Trevor Treasury", role="treasury_operator"),
        User(id=uuid.uuid4(), tenant_id=TENANT_ID, email="lending@stackai.demo",
             hashed_password=get_password_hash("lending123"), full_name="Layla Lending", role="lending_analyst"),
        User(id=uuid.uuid4(), tenant_id=TENANT_ID, email="auditor@stackai.demo",
             hashed_password=get_password_hash("auditor123"), full_name="Andy Auditor", role="auditor"),
    ]
    for u in users:
        db.add(u)

    # ── Accounts ─────────────────────────────────────────────────────────────
    main_account_id = uuid.uuid4()
    lending_pool_id = uuid.uuid4()
    reserve_account_id = uuid.uuid4()

    accounts = [
        Account(id=main_account_id, tenant_id=TENANT_ID, name="Main Operating Account",
                account_number="ACC-001", currency="USD", balance=Decimal("92380.00"),
                reserved_amount=Decimal("15000.00"), account_type="checking"),
        Account(id=lending_pool_id, tenant_id=TENANT_ID, name="Lending Pool",
                account_number="ACC-002", currency="USD", balance=Decimal("35000.00"),
                reserved_amount=Decimal("5000.00"), account_type="lending_pool"),
        Account(id=reserve_account_id, tenant_id=TENANT_ID, name="Reserve Account",
                account_number="ACC-003", currency="USD", balance=Decimal("15000.00"),
                reserved_amount=Decimal("15000.00"), account_type="savings"),
    ]
    # Total cash across accounts = 92380 + 35000 + 15000 = 142380
    for a in accounts:
        db.add(a)

    # ── Businesses ───────────────────────────────────────────────────────────
    greenleaf_id = uuid.uuid4()
    techflow_id = uuid.uuid4()
    metro_id = uuid.uuid4()
    sunrise_id = uuid.uuid4()
    coastal_id = uuid.uuid4()
    pioneer_id = uuid.uuid4()

    businesses = [
        Business(id=greenleaf_id, tenant_id=TENANT_ID, name="GreenLeaf Organics",
                 business_type="Retail", monthly_revenue=Decimal("48000.00"), credit_score=720,
                 risk_level="low", contact_email="finance@greenleaf.demo"),
        Business(id=techflow_id, tenant_id=TENANT_ID, name="TechFlow Solutions",
                 business_type="Technology", monthly_revenue=Decimal("62000.00"), credit_score=680,
                 risk_level="medium", contact_email="billing@techflow.demo"),
        Business(id=metro_id, tenant_id=TENANT_ID, name="Metro Retail Group",
                 business_type="Retail", monthly_revenue=Decimal("35000.00"), credit_score=640,
                 risk_level="medium", contact_email="accounts@metro.demo"),
        Business(id=sunrise_id, tenant_id=TENANT_ID, name="Sunrise Logistics",
                 business_type="Logistics", monthly_revenue=Decimal("28000.00"), credit_score=590,
                 risk_level="high", contact_email="ops@sunrise.demo"),
        Business(id=coastal_id, tenant_id=TENANT_ID, name="Coastal Hospitality",
                 business_type="Hospitality", monthly_revenue=Decimal("55000.00"), credit_score=700,
                 risk_level="low", contact_email="finance@coastal.demo"),
        Business(id=pioneer_id, tenant_id=TENANT_ID, name="Pioneer Manufacturing",
                 business_type="Manufacturing", monthly_revenue=Decimal("41000.00"), credit_score=660,
                 risk_level="medium", contact_email="ar@pioneer.demo"),
    ]
    for b in businesses:
        db.add(b)

    # ── Loans ────────────────────────────────────────────────────────────────
    loan1_id = uuid.uuid4()
    loan2_id = uuid.uuid4()
    loan3_id = uuid.uuid4()

    loans = [
        Loan(id=loan1_id, tenant_id=TENANT_ID, business_id=greenleaf_id,
             account_id=lending_pool_id, principal=Decimal("35000.00"),
             outstanding_balance=Decimal("22400.00"), repayment_percentage=Decimal("0.10"),
             status="active", loan_type="revenue_based",
             disbursed_at=datetime.now(timezone.utc) - timedelta(days=120)),
        Loan(id=loan2_id, tenant_id=TENANT_ID, business_id=techflow_id,
             account_id=lending_pool_id, principal=Decimal("28000.00"),
             outstanding_balance=Decimal("19600.00"), repayment_percentage=Decimal("0.12"),
             status="active", loan_type="revenue_based",
             disbursed_at=datetime.now(timezone.utc) - timedelta(days=90)),
        Loan(id=loan3_id, tenant_id=TENANT_ID, business_id=metro_id,
             account_id=lending_pool_id, principal=Decimal("22000.00"),
             outstanding_balance=Decimal("18200.00"), repayment_percentage=Decimal("0.08"),
             status="active", loan_type="revenue_based",
             disbursed_at=datetime.now(timezone.utc) - timedelta(days=60)),
    ]
    for l in loans:
        db.add(l)

    # ── Repayments ───────────────────────────────────────────────────────────
    repayments = [
        Repayment(loan_id=loan1_id, amount_due=Decimal("4800.00"), amount_paid=Decimal("4800.00"),
                  period_start=TODAY - timedelta(days=60), period_end=TODAY - timedelta(days=30),
                  status="complete", revenue_received=Decimal("48000.00")),
        Repayment(loan_id=loan1_id, amount_due=Decimal("4800.00"), amount_paid=Decimal("3200.00"),
                  period_start=TODAY - timedelta(days=30), period_end=TODAY,
                  status="partial", revenue_received=Decimal("32000.00")),  # delayed revenue
        Repayment(loan_id=loan2_id, amount_due=Decimal("7440.00"), amount_paid=Decimal("7440.00"),
                  period_start=TODAY - timedelta(days=60), period_end=TODAY - timedelta(days=30),
                  status="complete", revenue_received=Decimal("62000.00")),
        Repayment(loan_id=loan2_id, amount_due=Decimal("7440.00"), amount_paid=Decimal("0.00"),
                  period_start=TODAY - timedelta(days=30), period_end=TODAY,
                  status="missed", revenue_received=Decimal("0.00")),  # failed
        Repayment(loan_id=loan3_id, amount_due=Decimal("2800.00"), amount_paid=Decimal("2800.00"),
                  period_start=TODAY - timedelta(days=30), period_end=TODAY,
                  status="complete", revenue_received=Decimal("35000.00")),
    ]
    for r in repayments:
        db.add(r)

    # ── Payment Obligations ──────────────────────────────────────────────────
    obligations = [
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="Staff Payroll — October", amount=Decimal("45000.00"),
                          currency="USD", priority="critical", category="payroll",
                          due_date=TODAY + timedelta(days=3), status="pending",
                          description="Monthly payroll for 45 staff members"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="CloudOps Infrastructure Ltd", amount=Decimal("8200.00"),
                          currency="USD", priority="high", category="supplier",
                          due_date=TODAY + timedelta(days=5), status="pending",
                          description="Monthly cloud infrastructure invoice"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="ATO Quarterly Tax", amount=Decimal("12400.00"),
                          currency="USD", priority="high", category="tax",
                          due_date=TODAY + timedelta(days=14), status="pending",
                          description="Q3 quarterly tax installment"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="Office Lease — November", amount=Decimal("6500.00"),
                          currency="USD", priority="medium", category="operational",
                          due_date=TODAY + timedelta(days=10), status="pending",
                          description="Monthly office space lease"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="Marketing Agency — Campaign", amount=Decimal("3800.00"),
                          currency="USD", priority="low", category="operational",
                          due_date=TODAY + timedelta(days=21), status="pending",
                          description="Q4 digital marketing campaign"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="Equipment Maintenance", amount=Decimal("2100.00"),
                          currency="USD", priority="medium", category="operational",
                          due_date=TODAY + timedelta(days=8), status="pending",
                          description="Annual equipment service contract"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="Insurance Premium — Q4", amount=Decimal("4750.00"),
                          currency="USD", priority="medium", category="operational",
                          due_date=TODAY + timedelta(days=7), status="paid",
                          description="Quarterly business insurance premium"),
        PaymentObligation(tenant_id=TENANT_ID, account_id=main_account_id,
                          payee="Legal Retainer", amount=Decimal("2500.00"),
                          currency="USD", priority="low", category="operational",
                          due_date=TODAY - timedelta(days=2), status="overdue",
                          description="Monthly legal retainer fee"),
    ]
    for o in obligations:
        db.add(o)

    # ── Recommendations ──────────────────────────────────────────────────────
    recommendations = [
        Recommendation(
            tenant_id=TENANT_ID,
            agent_type="lending",
            title="GreenLeaf Organics — Advance Request Assessment",
            summary=(
                "GreenLeaf Organics has requested a $15,000 advance. "
                "After accounting for payroll ($45,000), cloud infrastructure ($8,200), "
                "and minimum reserve ($50,000), the maximum permissible advance is $7,480. "
                "STACK AI recommends approving a revised advance of $7,480."
            ),
            evidence={"business": "GreenLeaf Organics", "requested": "15000", "monthly_revenue": "48000"},
            calculations={
                "total_cash": "142380.00",
                "minimum_reserve": "50000.00",
                "pending_payments": "78900.00",
                "reserved_amount": "35000.00",
                "max_permissible_advance": "7480.00",
                "proposed_advance": "15000.00",
                "approved_amount": "7480.00",
            },
            risks=["Revenue delay risk", "Combined commitment near reserve limit"],
            recommended_action="Approve revised advance of $7,480 to GreenLeaf Organics",
            requires_approval=True,
            status="pending",
        ),
        Recommendation(
            tenant_id=TENANT_ID,
            agent_type="treasury",
            title="Payroll Payment — Immediate Action Required",
            summary="Critical payroll obligation of $45,000 due in 3 days. Available cash supports this payment.",
            evidence={"payee": "Staff Payroll", "amount": "45000", "due_days": "3"},
            calculations={"total_cash": "142380.00", "post_payment_buffer": "47380.00"},
            risks=["Borderline reserve margin after payment"],
            recommended_action="Execute payroll payment immediately",
            requires_approval=True,
            status="pending",
        ),
    ]
    for r in recommendations:
        db.add(r)

    db.commit()
    print("[OK] Demo data seeded successfully.")


def main():
    create_tables()
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
