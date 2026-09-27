-- =========================================================================
-- SwiftServe — Smart Food Delivery & Rider Assignment System
-- Relational Database Schema (PostgreSQL / MySQL Compatible)
-- Concepts: Relational Model, 3NF Normalization, PK/FK Constraints, Indexes
-- =========================================================================

-- Drop tables in reverse dependency order if re-creating
DROP TABLE IF EXISTS trip_history CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS riders CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS zone_connections CASCADE;
DROP TABLE IF EXISTS zones CASCADE;

-- 1. ZONES (Graph Nodes)
CREATE TABLE zones (
    zone_id VARCHAR(32) PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL,
    description TEXT
);

-- 2. ZONE CONNECTIONS (Graph Edges for ADSA BFS Routing)
CREATE TABLE zone_connections (
    connection_id VARCHAR(32) PRIMARY KEY,
    zone_a VARCHAR(32) NOT NULL,
    zone_b VARCHAR(32) NOT NULL,
    distance_km NUMERIC(5, 2) NOT NULL CHECK (distance_km > 0),
    FOREIGN KEY (zone_a) REFERENCES zones(zone_id) ON DELETE CASCADE,
    FOREIGN KEY (zone_b) REFERENCES zones(zone_id) ON DELETE CASCADE,
    CONSTRAINT unique_zone_pair UNIQUE (zone_a, zone_b)
);

-- 3. CUSTOMERS
CREATE TABLE customers (
    customer_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    zone_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE RESTRICT
);

-- 4. RESTAURANTS
CREATE TABLE restaurants (
    restaurant_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    address TEXT NOT NULL,
    zone_id VARCHAR(32) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    cuisine VARCHAR(80) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'BUSY')),
    prep_time_minutes INT DEFAULT 20,
    price_range VARCHAR(5) DEFAULT '$$',
    image_url TEXT,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE RESTRICT
);

-- 5. RIDERS
CREATE TABLE riders (
    rider_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(30) NOT NULL CHECK (vehicle_type IN ('ELECTRIC_BIKE', 'MOTORBIKE', 'SCOOTER', 'BICYCLE')),
    current_zone_id VARCHAR(32) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BUSY', 'OFFLINE')),
    total_deliveries INT DEFAULT 0 CHECK (total_deliveries >= 0),
    current_orders INT DEFAULT 0 CHECK (current_orders >= 0),
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_zone_id) REFERENCES zones(zone_id) ON DELETE RESTRICT
);

-- 6. ORDERS
CREATE TABLE orders (
    order_id VARCHAR(32) PRIMARY KEY,
    customer_id VARCHAR(32) NOT NULL,
    restaurant_id VARCHAR(32) NOT NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(30) DEFAULT 'ORDER_PLACED' CHECK (order_status IN (
        'ORDER_PLACED', 'RESTAURANT_ACCEPTED', 'PREPARING_FOOD', 
        'RIDER_ASSIGNED', 'RIDER_PICKED_UP', 'OUT_FOR_DELIVERY', 
        'DELIVERED', 'CANCELLED'
    )),
    total_amount NUMERIC(8, 2) NOT NULL CHECK (total_amount >= 0),
    assigned_rider_id VARCHAR(32),
    eta_minutes INT NOT NULL CHECK (eta_minutes > 0),
    distance_km NUMERIC(5, 2) NOT NULL CHECK (distance_km >= 0),
    delivery_address TEXT NOT NULL,
    zone_id VARCHAR(32) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_rider_id) REFERENCES riders(rider_id) ON DELETE SET NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE RESTRICT
);

-- 7. ORDER ITEMS
CREATE TABLE order_items (
    order_item_id VARCHAR(32) PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL,
    item_id VARCHAR(32) NOT NULL,
    item_name VARCHAR(120) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(7, 2) NOT NULL CHECK (price >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 8. ORDER STATUS HISTORY (Audit Trail)
CREATE TABLE order_status_history (
    status_id VARCHAR(32) PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL,
    status VARCHAR(30) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 9. TRIP HISTORY (Used for Machine Learning ETA Regression Training)
CREATE TABLE trip_history (
    trip_id VARCHAR(32) PRIMARY KEY,
    rider_id VARCHAR(32) NOT NULL,
    order_id VARCHAR(32) NOT NULL,
    distance_km NUMERIC(5, 2) NOT NULL CHECK (distance_km > 0),
    time_of_day VARCHAR(20) NOT NULL CHECK (time_of_day IN ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT')),
    actual_delivery_minutes INT NOT NULL CHECK (actual_delivery_minutes > 0),
    traffic_level VARCHAR(20) NOT NULL CHECK (traffic_level IN ('LOW', 'MEDIUM', 'HIGH')),
    weather_condition VARCHAR(20) NOT NULL CHECK (weather_condition IN ('CLEAR', 'RAIN', 'STORM')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rider_id) REFERENCES riders(rider_id) ON DELETE CASCADE
);

-- =========================================================================
-- OPTIMIZATION INDEXES
-- =========================================================================
CREATE INDEX idx_riders_status_zone ON riders(status, current_zone_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_trip_features ON trip_history(distance_km, time_of_day, traffic_level, weather_condition);
