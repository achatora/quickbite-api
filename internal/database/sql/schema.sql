-- Drop tables if they already exist so we can start fresh
-- We drop orders first because it depends on menu_items
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;

-- Create the menu_items table first
-- Orders depends on it so it must exist first
CREATE TABLE menu_items (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    price       NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Create the orders table
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    menu_item_id    INT REFERENCES menu_items(id),
    item_name       VARCHAR(255) NOT NULL,
    quantity        INT NOT NULL,
    notes           TEXT,
    total_price     NUMERIC(10, 2) NOT NULL,
    status          VARCHAR(50) DEFAULT 'pending',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer'
);
