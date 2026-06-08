-- ============================================================
-- Nexus EMS — PostgreSQL Schema
-- Run this ONCE to create the database and seed initial data
-- Spring Boot will auto-create tables via ddl-auto=update
-- ============================================================

-- Create database (run as superuser)
CREATE DATABASE ems_db;

-- Connect to ems_db before running the rest
\c ems_db;

-- ── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tables are auto-created by Hibernate (ddl-auto=update) ──
-- The SQL below is for reference / manual creation only

CREATE TABLE IF NOT EXISTS users (
    id           BIGSERIAL PRIMARY KEY,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role         VARCHAR(20)  NOT NULL DEFAULT 'EMPLOYEE',
    profile_image_url TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name       VARCHAR(100),
    last_name        VARCHAR(100),
    email            VARCHAR(255),
    phone_number     VARCHAR(20),
    address          TEXT,
    age              INT,
    gender           VARCHAR(10),
    date_of_birth    DATE,
    joining_date     DATE,
    education        VARCHAR(255),
    experience       INT,
    designation      VARCHAR(100),
    department       VARCHAR(100),
    salary           NUMERIC(12,2),
    profile_image_url TEXT,
    manager_id       BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    token       VARCHAR(512) NOT NULL UNIQUE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id             BIGSERIAL PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    description    TEXT,
    priority       VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    due_date       DATE,
    assigned_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    assigned_to_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
    id          BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date        DATE   NOT NULL,
    check_in    TIME,
    check_out   TIME,
    total_hours NUMERIC(4,2),
    status      VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (employee_id, date)
);

CREATE TABLE IF NOT EXISTS salaries (
    id           BIGSERIAL PRIMARY KEY,
    employee_id  BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month        INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year         INT NOT NULL,
    basic_salary NUMERIC(12,2) NOT NULL,
    bonus        NUMERIC(12,2) DEFAULT 0,
    deductions   NUMERIC(12,2) DEFAULT 0,
    present_days INT DEFAULT 26,
    absent_days  INT DEFAULT 0,
    net_salary   NUMERIC(12,2) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (employee_id, month, year)
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role          ON users(role);
CREATE INDEX IF NOT EXISTS idx_employees_email     ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_manager   ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to   ON tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by   ON tasks(assigned_by_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status        ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_salary_emp_month    ON salaries(employee_id, month, year);

-- ── Seed Data ────────────────────────────────────────────────
-- Passwords are BCrypt hashes of: admin123 | manager123 | emp123

INSERT INTO users (first_name, last_name, email, password, phone_number, role)
VALUES
  ('Super', 'Admin',   'admin@nexus.com',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpR0KEQ0/N4.oO', '9000000001', 'ADMIN'),
  ('Alex',  'Johnson', 'manager@nexus.com',  '$2a$12$2B8LFpLCNMGcvCfJqwNAFuWzPO9vGDVCOEKYmb9zH8xLJJgv7FeYe', '9000000002', 'MANAGER'),
  ('Sam',   'Wilson',  'employee@nexus.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '9000000003', 'EMPLOYEE')
ON CONFLICT (email) DO NOTHING;

-- Create employee profile records for seed users
INSERT INTO employees (user_id, first_name, last_name, email, phone_number, designation, department, joining_date, salary)
SELECT id, first_name, last_name, email, phone_number,
       CASE role WHEN 'ADMIN' THEN 'System Administrator' WHEN 'MANAGER' THEN 'Engineering Manager' ELSE 'Software Engineer' END,
       'Engineering',
       CURRENT_DATE,
       CASE role WHEN 'ADMIN' THEN 150000 WHEN 'MANAGER' THEN 120000 ELSE 80000 END
FROM users
WHERE email IN ('admin@nexus.com','manager@nexus.com','employee@nexus.com')
ON CONFLICT DO NOTHING;
