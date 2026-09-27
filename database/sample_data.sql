-- =========================================================================
-- SwiftServe — Sample Data (20 Customers, 10 Restaurants, 15 Riders, 10 Zones, Orders, Trips)
-- =========================================================================

-- ZONES
INSERT INTO zones (zone_id, zone_name, code, pos_x, pos_y, description) VALUES
('ZONE_A', 'Downtown Central', 'A', 260, 150, 'High density dining & commercial hub'),
('ZONE_B', 'Midtown Avenue', 'B', 440, 130, 'Shopping district & cafes'),
('ZONE_C', 'West End Heights', 'C', 160, 270, 'Upscale residential & food street'),
('ZONE_D', 'Tech Park Campus', 'D', 380, 260, 'IT offices & quick eateries'),
('ZONE_E', 'University Town', 'E', 560, 240, 'Student hostels & late night diners'),
('ZONE_F', 'Harbor Bay', 'F', 120, 410, 'Coastal promenade & seafood'),
('ZONE_G', 'Green Hills Suburb', 'G', 280, 400, 'Family residential neighborhoods'),
('ZONE_H', 'East Market Square', 'H', 480, 390, 'Traditional spice & wholesale market'),
('ZONE_I', 'North Ridge Tech', 'I', 350, 50, 'Residential towers & corporate park'),
('ZONE_J', 'South Station Terminal', 'J', 380, 510, 'Metro terminal & transit junctions');

-- ZONE CONNECTIONS
INSERT INTO zone_connections (connection_id, zone_a, zone_b, distance_km) VALUES
('CONN_1', 'ZONE_A', 'ZONE_B', 2.10),
('CONN_2', 'ZONE_A', 'ZONE_C', 2.80),
('CONN_3', 'ZONE_A', 'ZONE_D', 3.40),
('CONN_4', 'ZONE_A', 'ZONE_I', 2.50),
('CONN_5', 'ZONE_B', 'ZONE_D', 2.20),
('CONN_6', 'ZONE_B', 'ZONE_E', 3.10),
('CONN_7', 'ZONE_C', 'ZONE_D', 3.00),
('CONN_8', 'ZONE_C', 'ZONE_F', 2.60),
('CONN_9', 'ZONE_C', 'ZONE_G', 2.90),
('CONN_10', 'ZONE_D', 'ZONE_E', 2.70),
('CONN_11', 'ZONE_D', 'ZONE_G', 2.40),
('CONN_12', 'ZONE_D', 'ZONE_H', 3.20),
('CONN_13', 'ZONE_E', 'ZONE_H', 2.80),
('CONN_14', 'ZONE_F', 'ZONE_G', 2.50),
('CONN_15', 'ZONE_G', 'ZONE_H', 3.50),
('CONN_16', 'ZONE_G', 'ZONE_J', 2.30),
('CONN_17', 'ZONE_H', 'ZONE_J', 2.90),
('CONN_18', 'ZONE_I', 'ZONE_B', 2.70);

-- RESTAURANTS
INSERT INTO restaurants (restaurant_id, name, address, zone_id, latitude, longitude, rating, cuisine, status, prep_time_minutes, price_range) VALUES
('REST_001', 'Spice Hub', '42 MG Road, Downtown Central', 'ZONE_A', 12.971600, 77.594600, 4.8, 'North Indian & Mughlai', 'OPEN', 20, '$$'),
('REST_002', 'Biryani House', '15 Royal Tower, Midtown Avenue', 'ZONE_B', 12.975000, 77.605000, 4.9, 'Hyderabadi Biryani', 'OPEN', 18, '$$'),
('REST_003', 'Pizza Corner', '88 Crust Lane, West End Heights', 'ZONE_C', 12.965000, 77.585000, 4.6, 'Woodfired Italian Pizza', 'OPEN', 22, '$$'),
('REST_004', 'South Indian Kitchen', '102 Temple Road, Tech Park', 'ZONE_D', 12.980000, 77.610000, 4.7, 'Authentic Dosas & Filter Coffee', 'OPEN', 12, '$'),
('REST_005', 'Burger Point', '27 College Blvd, University Town', 'ZONE_E', 12.988000, 77.625000, 4.5, 'Gourmet Smashed Burgers', 'OPEN', 15, '$'),
('REST_006', 'Dragon Wok', '6 Bay Promenade, Harbor Bay', 'ZONE_F', 12.955000, 77.575000, 4.4, 'Pan-Asian & Dim Sum', 'OPEN', 20, '$$'),
('REST_007', 'Taco Fiesta', '54 Meadow Grove, Green Hills', 'ZONE_G', 12.960000, 77.599000, 4.6, 'Mexican & Burrito Bowls', 'OPEN', 16, '$$'),
('REST_008', 'Sweet Delights Bakery', '19 Spice Bazaar, East Market', 'ZONE_H', 12.972000, 77.630000, 4.9, 'Pastries, Cakes & Waffles', 'OPEN', 14, '$'),
('REST_009', 'Green Bowl Salad Co.', '90 Silicon Way, North Ridge Tech', 'ZONE_I', 12.990000, 77.595000, 4.7, 'Healthy Salads & Smoothies', 'OPEN', 12, '$$'),
('REST_010', 'Royal Tandoor', '11 Metro Plaza, South Station', 'ZONE_J', 12.950000, 77.610000, 4.8, 'Charcoal Kebabs & Curries', 'OPEN', 25, '$$$');

-- RIDERS
INSERT INTO riders (rider_id, name, phone, vehicle_type, current_zone_id, status, total_deliveries, current_orders, rating) VALUES
('RIDER_001', 'Rahul Sharma', '+91 97120 54001', 'ELECTRIC_BIKE', 'ZONE_B', 'AVAILABLE', 148, 0, 4.9),
('RIDER_002', 'Amit Verma', '+91 97120 54002', 'MOTORBIKE', 'ZONE_D', 'AVAILABLE', 230, 0, 4.8),
('RIDER_003', 'Deepak Patel', '+91 97120 54003', 'SCOOTER', 'ZONE_C', 'AVAILABLE', 94, 0, 4.7),
('RIDER_004', 'Kiran Kumar', '+91 97120 54004', 'ELECTRIC_BIKE', 'ZONE_A', 'BUSY', 312, 1, 4.9),
('RIDER_005', 'Suresh Raina', '+91 97120 54005', 'MOTORBIKE', 'ZONE_E', 'AVAILABLE', 180, 0, 4.6),
('RIDER_006', 'Manoj Tiwari', '+91 97120 54006', 'BICYCLE', 'ZONE_F', 'AVAILABLE', 64, 0, 4.5),
('RIDER_007', 'Ganesh Naik', '+91 97120 54007', 'SCOOTER', 'ZONE_G', 'AVAILABLE', 215, 0, 4.8),
('RIDER_008', 'Vijay Chawla', '+91 97120 54008', 'ELECTRIC_BIKE', 'ZONE_H', 'AVAILABLE', 120, 0, 4.7),
('RIDER_009', 'Rajesh Pandey', '+91 97120 54009', 'MOTORBIKE', 'ZONE_I', 'AVAILABLE', 156, 0, 4.8),
('RIDER_010', 'Sunil Gavaskar', '+91 97120 54010', 'SCOOTER', 'ZONE_J', 'AVAILABLE', 198, 0, 4.9),
('RIDER_011', 'Pradeep Yadav', '+91 97120 54011', 'ELECTRIC_BIKE', 'ZONE_A', 'OFFLINE', 88, 0, 4.4),
('RIDER_012', 'Chetan Bhagat', '+91 97120 54012', 'MOTORBIKE', 'ZONE_B', 'BUSY', 275, 1, 4.9),
('RIDER_013', 'Mohan Lal', '+91 97120 54013', 'SCOOTER', 'ZONE_C', 'AVAILABLE', 142, 0, 4.7),
('RIDER_014', 'Jatin Soni', '+91 97120 54014', 'ELECTRIC_BIKE', 'ZONE_D', 'OFFLINE', 110, 0, 4.5),
('RIDER_015', 'Vikash Mishra', '+91 97120 54015', 'MOTORBIKE', 'ZONE_E', 'AVAILABLE', 204, 0, 4.8);
