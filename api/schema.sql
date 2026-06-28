-- 1. THE RATES TABLE (The Source of Truth)
-- Stores the fixed tax parameters for your regional Kansas market.
CREATE TABLE central_ks_tax_rates (
    rate_id INT IDENTITY(1,1) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'Great Bend'
    state_rate DECIMAL(4,2) DEFAULT 6.50,   -- Kansas Base Tax
    county_rate DECIMAL(4,2) DEFAULT 1.00,  -- County Addition
    city_rate DECIMAL(4,2) NOT NULL,        -- Municipal Addition
    combined_total DECIMAL(4,2) NOT NULL,   -- Pre-calculated multiplier (e.g., 8.70)
    last_updated DATETIME DEFAULT GETDATE()
);

-- Seed the exact regional metrics for your operating area
INSERT INTO central_ks_tax_rates (city_name, city_rate, combined_total) VALUES
('Great Bend', 1.20, 8.70),  -- Barton Co.
('Hoisington', 0.75, 8.25),  -- Barton Co.
('Ellinwood',  0.50, 8.00),  -- Barton Co.
('Larned',     1.50, 9.00);  -- Pawnee Co. Adjusted Variable


-- 2. THE HISTORY TABLE (The Transaction Log)
-- Records every unique calculation processed by your Python/C# backend.
CREATE TABLE estimator_history_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    session_hash VARCHAR(64) NOT NULL,       -- Anonymized tracking string to group clicks
    selected_city VARCHAR(100) NOT NULL,     -- The target market selected by the client
    has_launch_plan BIT NOT NULL,            -- Status of checkbox 1 (0 = No, 1 = Yes)
    has_ownership_plan BIT NOT NULL,         -- Status of checkbox 2 (0 = No, 1 = Yes)
    has_custom_db BIT NOT NULL,              -- Status of checkbox 3 (0 = No, 1 = Yes)
    calculated_base_cost DECIMAL(10,2) NOT NULL,
    calculated_tax_cost DECIMAL(10,2) NOT NULL,
    calculated_grand_total DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    -- Establish relational integrity linking the transaction to your active rates
    CONSTRAINT FK_History_Rates FOREIGN KEY (selected_city)
        REFERENCES central_ks_tax_rates(city_name)
        ON UPDATE CASCADE
);

-- 3. PERFORMANCE INDEXING
-- Crucial for tracking user analytics efficiently as rows accumulate over time.
CREATE INDEX idx_history_city ON estimator_history_logs(selected_city);
CREATE INDEX idx_history_date ON estimator_history_logs(created_at);
