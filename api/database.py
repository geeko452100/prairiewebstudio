import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "prairie.db")

# SQLite-compatible translation of schema.sql (schema.sql is the SQL Server reference)
_SQLITE_DDL = """
CREATE TABLE IF NOT EXISTS central_ks_tax_rates (
    rate_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name      TEXT    NOT NULL UNIQUE,
    state_rate     REAL    NOT NULL DEFAULT 6.50,
    county_rate    REAL    NOT NULL DEFAULT 1.00,
    city_rate      REAL    NOT NULL,
    combined_total REAL    NOT NULL,
    last_updated   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS estimator_history_logs (
    log_id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    session_hash           TEXT    NOT NULL,
    selected_city          TEXT    NOT NULL,
    has_launch_plan        INTEGER NOT NULL DEFAULT 0,
    has_ownership_plan     INTEGER NOT NULL DEFAULT 0,
    has_custom_db          INTEGER NOT NULL DEFAULT 0,
    calculated_base_cost   REAL    NOT NULL,
    calculated_tax_cost    REAL    NOT NULL,
    calculated_grand_total REAL    NOT NULL,
    created_at             TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (selected_city) REFERENCES central_ks_tax_rates(city_name) ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_history_city ON estimator_history_logs(selected_city);
CREATE INDEX IF NOT EXISTS idx_history_date ON estimator_history_logs(created_at);

INSERT OR IGNORE INTO central_ks_tax_rates (city_name, city_rate, combined_total) VALUES
    ('Great Bend', 1.20, 8.70),
    ('Hoisington', 0.75, 8.25),
    ('Ellinwood',  0.50, 8.00),
    ('Larned',     1.50, 9.00);
"""


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_conn()
    conn.executescript(_SQLITE_DDL)
    conn.commit()
    conn.close()
