--------------------------------------------------
-- 1. Common (Master) Database Schema
--------------------------------------------------
CREATE TABLE public.tenants (
    tenant_id SERIAL PRIMARY KEY,
    tenant_name VARCHAR(255) NOT NULL,
    db_name VARCHAR(255) UNIQUE NOT NULL,  -- Tenant's dedicated database name
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--------------------------------------------------
-- 2. Tenant-Specific Database Schema
--------------------------------------------------

-- A. Hierarchical Location Tables
--------------------------------------------------

-- Cemeteries: Represents the overall cemetery facility.
CREATE TABLE cemeteries (
    cemetery_id SERIAL PRIMARY KEY,
    cemetery_name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    established_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gardens: Subdivisions within a cemetery.
CREATE TABLE gardens (
    garden_id SERIAL PRIMARY KEY,
    cemetery_id INT NOT NULL,
    garden_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_garden_cemetery
      FOREIGN KEY (cemetery_id) REFERENCES cemeteries(cemetery_id)
);

-- Lots: Further subdivisions within a garden.
CREATE TABLE lots (
    lot_id SERIAL PRIMARY KEY,
    garden_id INT NOT NULL,
    lot_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',  -- e.g., available, reserved, sold
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_lot_garden
      FOREIGN KEY (garden_id) REFERENCES gardens(garden_id)
);

-- Spaces: Specific areas or units within a lot.
CREATE TABLE spaces (
    space_id SERIAL PRIMARY KEY,
    lot_id INT NOT NULL,
    space_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',  -- e.g., available, reserved, sold
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_space_lot
      FOREIGN KEY (lot_id) REFERENCES lots(lot_id)
);

-- Depth/Levels: Actual burial spaces within a space (supporting multi-depth or multi-level arrangements).
CREATE TABLE space_levels (
    level_id SERIAL PRIMARY KEY,
    space_id INT NOT NULL,
    level_number INT NOT NULL,  -- For example, 1, 2, 3, etc.
    status VARCHAR(50) DEFAULT 'vacant',  -- e.g., vacant, occupied, reserved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_level_space
      FOREIGN KEY (space_id) REFERENCES spaces(space_id)
);

--------------------------------------------------
-- B. Operational and Customer Management Tables
--------------------------------------------------

-- Customers: Stores information about individuals or families.
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations: Tracks reservations for a specific space level.
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    level_id INT NOT NULL,  -- Reserved burial space (depth/level)
    customer_id INT NOT NULL,
    reservation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',  -- e.g., pending, confirmed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_reservation_level
      FOREIGN KEY (level_id) REFERENCES space_levels(level_id),
    CONSTRAINT fk_reservation_customer
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Deceased: Records for individuals interred.
CREATE TABLE deceased (
    deceased_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    death_date DATE,
    biography TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interments: Captures burial events linking a deceased record to a space level.
CREATE TABLE interments (
    interment_id SERIAL PRIMARY KEY,
    level_id INT NOT NULL,  -- The space level where the interment occurs
    deceased_id INT NOT NULL,
    customer_id INT,  -- Optional: Customer who arranged the interment
    interment_date DATE NOT NULL,
    officiant VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_interment_level
      FOREIGN KEY (level_id) REFERENCES space_levels(level_id),
    CONSTRAINT fk_interment_deceased
      FOREIGN KEY (deceased_id) REFERENCES deceased(deceased_id),
    CONSTRAINT fk_interment_customer
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

--------------------------------------------------
-- C. Financial and Maintenance Tables
--------------------------------------------------

-- Billing Invoices: Stores invoice details for billing customers.
CREATE TABLE billing_invoices (
    invoice_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    billing_date DATE NOT NULL,
    due_date DATE,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid',  -- e.g., unpaid, paid, overdue
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_invoice_customer
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Billing Items: Provides detailed line items for each invoice.
CREATE TABLE billing_items (
    billing_item_id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL,
    item_description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_billing_item_invoice
      FOREIGN KEY (invoice_id) REFERENCES billing_invoices(invoice_id)
);

-- Payments: Records payment transactions against invoices.
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    invoice_id INT,  -- Payment may be associated with a specific invoice
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50),  -- e.g., credit card, bank transfer, cash
    status VARCHAR(50) DEFAULT 'completed',  -- e.g., completed, pending, refunded
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_payment_customer
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT fk_payment_invoice
      FOREIGN KEY (invoice_id) REFERENCES billing_invoices(invoice_id)
);

-- Maintenance Logs: Records maintenance activities at any hierarchical level.
CREATE TABLE maintenance_logs (
    maintenance_log_id SERIAL PRIMARY KEY,
    cemetery_id INT,  -- Optional: Maintenance at the cemetery level
    garden_id INT,    -- Optional: Maintenance at the garden level
    lot_id INT,       -- Optional: Maintenance at the lot level
    space_id INT,     -- Optional: Maintenance at the space level
    level_id INT,     -- Optional: Maintenance at the specific level
    maintenance_date DATE NOT NULL,
    description TEXT NOT NULL,
    performed_by VARCHAR(255),
    cost NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_maintenance_cemetery
      FOREIGN KEY (cemetery_id) REFERENCES cemeteries(cemetery_id),
    CONSTRAINT fk_maintenance_garden
      FOREIGN KEY (garden_id) REFERENCES gardens(garden_id),
    CONSTRAINT fk_maintenance_lot
      FOREIGN KEY (lot_id) REFERENCES lots(lot_id),
    CONSTRAINT fk_maintenance_space
      FOREIGN KEY (space_id) REFERENCES spaces(space_id),
    CONSTRAINT fk_maintenance_level
      FOREIGN KEY (level_id) REFERENCES space_levels(level_id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user_tenant
      FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);