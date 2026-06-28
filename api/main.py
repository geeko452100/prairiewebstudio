import hashlib
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from database import get_conn, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prairie Web Studio Tax API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://prairiewebstudio.com",
        "http://localhost",
        "http://localhost:8080",
        "http://127.0.0.1",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/tax")
def calculate_tax(
    amount: float = Query(default=0.0, ge=0, description="Base cost before tax"),
    city_name: str = Query(default="Great Bend", description="Kansas city name for rate lookup"),
    has_launch_plan: bool = Query(default=False, description="Client selected Launch & Support plan"),
    has_ownership_plan: bool = Query(default=False, description="Client selected Own It Outright plan"),
    has_custom_db: bool = Query(default=False, description="Client needs custom database setup"),
):
    conn = get_conn()

    row = conn.execute(
        "SELECT combined_total FROM central_ks_tax_rates WHERE city_name = ?",
        (city_name,),
    ).fetchone()

    rate = row["combined_total"] if row else 8.70

    calculated_tax_cost = round(amount * (rate / 100), 2)
    calculated_grand_total = round(amount + calculated_tax_cost, 2)

    session_hash = hashlib.sha256(
        f"{city_name}:{amount}:{has_launch_plan}:{has_ownership_plan}:{has_custom_db}".encode()
    ).hexdigest()

    conn.execute(
        """
        INSERT INTO estimator_history_logs (
            session_hash, selected_city,
            has_launch_plan, has_ownership_plan, has_custom_db,
            calculated_base_cost, calculated_tax_cost, calculated_grand_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            session_hash, city_name,
            int(has_launch_plan), int(has_ownership_plan), int(has_custom_db),
            amount, calculated_tax_cost, calculated_grand_total,
        ),
    )
    conn.commit()
    conn.close()

    return {
        "city_name": city_name,
        "rate": rate,
        "calculated_base_cost": round(amount, 2),
        "calculated_tax_cost": calculated_tax_cost,
        "calculated_grand_total": calculated_grand_total,
        "has_launch_plan": has_launch_plan,
        "has_ownership_plan": has_ownership_plan,
        "has_custom_db": has_custom_db,
    }


@app.get("/api/tax/rates")
def list_rates():
    conn = get_conn()
    rows = conn.execute(
        """
        SELECT city_name, state_rate, county_rate, city_rate, combined_total, last_updated
        FROM central_ks_tax_rates
        ORDER BY city_name
        """
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
