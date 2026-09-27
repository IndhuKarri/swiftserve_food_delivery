import {
  Customer,
  Restaurant,
  MenuItem,
  Rider,
  Order,
  OrderItem,
  Zone,
  ZoneConnection,
  TripHistory,
  OrderStatusHistory
} from '../types';

export const INITIAL_ZONES: Zone[] = [
  { zoneId: 'ZONE_A', zoneName: 'Downtown Central', code: 'A', x: 260, y: 150, description: 'High density dining & commercial hub' },
  { zoneId: 'ZONE_B', zoneName: 'Midtown Avenue', code: 'B', x: 440, y: 130, description: 'Shopping district & cafes' },
  { zoneId: 'ZONE_C', zoneName: 'West End Heights', code: 'C', x: 160, y: 270, description: 'Upscale residential & food street' },
  { zoneId: 'ZONE_D', zoneName: 'Tech Park Campus', code: 'D', x: 380, y: 260, description: 'IT offices & quick eateries' },
  { zoneId: 'ZONE_E', zoneName: 'University Town', code: 'E', x: 560, y: 240, description: 'Student hostels & late night diners' },
  { zoneId: 'ZONE_F', zoneName: 'Harbor Bay', code: 'F', x: 120, y: 410, description: 'Coastal promenade & seafood' },
  { zoneId: 'ZONE_G', zoneName: 'Green Hills Suburb', code: 'G', x: 280, y: 400, description: 'Family residential neighborhoods' },
  { zoneId: 'ZONE_H', zoneName: 'East Market Square', code: 'H', x: 480, y: 390, description: 'Traditional spice & wholesale market' },
  { zoneId: 'ZONE_I', zoneName: 'North Ridge Tech', code: 'I', x: 350, y: 50, description: 'Residential towers & corporate park' },
  { zoneId: 'ZONE_J', zoneName: 'South Station Terminal', code: 'J', x: 380, y: 510, description: 'Metro terminal & transit junctions' }
];

export const INITIAL_ZONE_CONNECTIONS: ZoneConnection[] = [
  { connectionId: 'CONN_1', zoneA: 'ZONE_A', zoneB: 'ZONE_B', distanceKm: 2.1 },
  { connectionId: 'CONN_2', zoneA: 'ZONE_A', zoneB: 'ZONE_C', distanceKm: 2.8 },
  { connectionId: 'CONN_3', zoneA: 'ZONE_A', zoneB: 'ZONE_D', distanceKm: 3.4 },
  { connectionId: 'CONN_4', zoneA: 'ZONE_A', zoneB: 'ZONE_I', distanceKm: 2.5 },
  { connectionId: 'CONN_5', zoneA: 'ZONE_B', zoneB: 'ZONE_D', distanceKm: 2.2 },
  { connectionId: 'CONN_6', zoneA: 'ZONE_B', zoneB: 'ZONE_E', distanceKm: 3.1 },
  { connectionId: 'CONN_7', zoneA: 'ZONE_C', zoneB: 'ZONE_D', distanceKm: 3.0 },
  { connectionId: 'CONN_8', zoneA: 'ZONE_C', zoneB: 'ZONE_F', distanceKm: 2.6 },
  { connectionId: 'CONN_9', zoneA: 'ZONE_C', zoneB: 'ZONE_G', distanceKm: 2.9 },
  { connectionId: 'CONN_10', zoneA: 'ZONE_D', zoneB: 'ZONE_E', distanceKm: 2.7 },
  { connectionId: 'CONN_11', zoneA: 'ZONE_D', zoneB: 'ZONE_G', distanceKm: 2.4 },
  { connectionId: 'CONN_12', zoneA: 'ZONE_D', zoneB: 'ZONE_H', distanceKm: 3.2 },
  { connectionId: 'CONN_13', zoneA: 'ZONE_E', zoneB: 'ZONE_H', distanceKm: 2.8 },
  { connectionId: 'CONN_14', zoneA: 'ZONE_F', zoneB: 'ZONE_G', distanceKm: 2.5 },
  { connectionId: 'CONN_15', zoneA: 'ZONE_G', zoneB: 'ZONE_H', distanceKm: 3.5 },
  { connectionId: 'CONN_16', zoneA: 'ZONE_G', zoneB: 'ZONE_J', distanceKm: 2.3 },
  { connectionId: 'CONN_17', zoneA: 'ZONE_H', zoneB: 'ZONE_J', distanceKm: 2.9 },
  { connectionId: 'CONN_18', zoneA: 'ZONE_I', zoneB: 'ZONE_B', distanceKm: 2.7 }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    restaurantId: 'REST_001',
    name: 'Spice Hub',
    address: '42 MG Road, Downtown Central',
    zoneId: 'ZONE_A',
    latitude: 12.9716,
    longitude: 77.5946,
    rating: 4.8,
    cuisine: 'North Indian & Mughlai',
    status: 'OPEN',
    prepTimeMinutes: 20,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_002',
    name: 'Biryani House',
    address: '15 Royal Tower, Midtown Avenue',
    zoneId: 'ZONE_B',
    latitude: 12.9750,
    longitude: 77.6050,
    rating: 4.9,
    cuisine: 'Hyderabadi Biryani',
    status: 'OPEN',
    prepTimeMinutes: 18,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_003',
    name: 'Pizza Corner',
    address: '88 Crust Lane, West End Heights',
    zoneId: 'ZONE_C',
    latitude: 12.9650,
    longitude: 77.5850,
    rating: 4.6,
    cuisine: 'Woodfired Italian Pizza',
    status: 'OPEN',
    prepTimeMinutes: 22,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_004',
    name: 'South Indian Kitchen',
    address: '102 Temple Road, Tech Park Campus',
    zoneId: 'ZONE_D',
    latitude: 12.9800,
    longitude: 77.6100,
    rating: 4.7,
    cuisine: 'Authentic Dosas & Filter Coffee',
    status: 'OPEN',
    prepTimeMinutes: 12,
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_005',
    name: 'Burger Point',
    address: '27 College Blvd, University Town',
    zoneId: 'ZONE_E',
    latitude: 12.9880,
    longitude: 77.6250,
    rating: 4.5,
    cuisine: 'Gourmet Smashed Burgers',
    status: 'OPEN',
    prepTimeMinutes: 15,
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_006',
    name: 'Dragon Wok',
    address: '6 Bay Promenade, Harbor Bay',
    zoneId: 'ZONE_F',
    latitude: 12.9550,
    longitude: 77.5750,
    rating: 4.4,
    cuisine: 'Pan-Asian & Dim Sum',
    status: 'OPEN',
    prepTimeMinutes: 20,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_007',
    name: 'Taco Fiesta',
    address: '54 Meadow Grove, Green Hills Suburb',
    zoneId: 'ZONE_G',
    latitude: 12.9600,
    longitude: 77.5990,
    rating: 4.6,
    cuisine: 'Mexican & Burrito Bowls',
    status: 'OPEN',
    prepTimeMinutes: 16,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_008',
    name: 'Sweet Delights Bakery',
    address: '19 Spice Bazaar, East Market Square',
    zoneId: 'ZONE_H',
    latitude: 12.9720,
    longitude: 77.6300,
    rating: 4.9,
    cuisine: 'Pastries, Cakes & Waffles',
    status: 'OPEN',
    prepTimeMinutes: 14,
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_009',
    name: 'Green Bowl Salad Co.',
    address: '90 Silicon Way, North Ridge Tech',
    zoneId: 'ZONE_I',
    latitude: 12.9900,
    longitude: 77.5950,
    rating: 4.7,
    cuisine: 'Healthy Salads & Smoothies',
    status: 'OPEN',
    prepTimeMinutes: 12,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    restaurantId: 'REST_010',
    name: 'Royal Tandoor',
    address: '11 Metro Plaza, South Station Terminal',
    zoneId: 'ZONE_J',
    latitude: 12.9500,
    longitude: 77.6100,
    rating: 4.8,
    cuisine: 'Charcoal Kebabs & Curries',
    status: 'OPEN',
    prepTimeMinutes: 25,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Spice Hub (REST_001)
  { itemId: 'ITEM_001', restaurantId: 'REST_001', name: 'Paneer Butter Masala', description: 'Cottage cheese simmered in rich buttery tomato cashew gravy', price: 14.50, category: 'Curries', isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_002', restaurantId: 'REST_001', name: 'Butter Garlic Naan', description: 'Crispy clay-oven baked flatbread brushed with roasted garlic butter', price: 3.50, category: 'Breads', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_003', restaurantId: 'REST_001', name: 'Murgh Makhani (Butter Chicken)', description: 'Tender tandoor chicken pieces cooked in velvety makhani sauce', price: 16.99, category: 'Curries', isVeg: false, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_004', restaurantId: 'REST_001', name: 'Dal Makhani Heritage', description: 'Slow cooked black lentils with fresh cream and aromatic spices', price: 11.99, category: 'Curries', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },

  // Biryani House (REST_002)
  { itemId: 'ITEM_005', restaurantId: 'REST_002', name: 'Hyderabadi Dum Chicken Biryani', description: 'Fragrant basmati rice slow cooked with marinated spiced chicken & saffron', price: 15.99, category: 'Biryani', isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_006', restaurantId: 'REST_002', name: 'Royal Mutton Biryani', description: 'Succulent tender goat chunks infused with shahi spices and mint', price: 18.50, category: 'Biryani', isVeg: false, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_007', restaurantId: 'REST_002', name: 'Mirchi Ka Salan & Raita', description: 'Traditional roasted chili gravy accompanied with chilled spiced yogurt', price: 4.50, category: 'Sides', isVeg: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80' },

  // Pizza Corner (REST_003)
  { itemId: 'ITEM_008', restaurantId: 'REST_003', name: 'Margherita Classica', description: 'San Marzano tomatoes, fresh buffalo mozzarella, basil & extra virgin olive oil', price: 13.99, category: 'Pizza', isVeg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_009', restaurantId: 'REST_003', name: 'Double Pepperoni Rush', description: 'Crisp hand-stretched crust topped with double aged pepperoni and mozzarella', price: 17.50, category: 'Pizza', isVeg: false, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_010', restaurantId: 'REST_003', name: 'Truffle Mushroom Deluxe', description: 'Wild button mushrooms, white truffle oil, fontina cheese and rosemary', price: 18.00, category: 'Pizza', isVeg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },

  // South Indian Kitchen (REST_004)
  { itemId: 'ITEM_011', restaurantId: 'REST_004', name: 'Ghee Roast Masala Dosa', description: 'Crisp golden crepe roasted in pure desi ghee stuffed with potato masala', price: 8.50, category: 'Tiffin', isVeg: true, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_012', restaurantId: 'REST_004', name: 'Steamed Idli & Medu Vada Combo', description: 'Puffy rice cakes with crisp lentil donuts, sambar and trio of chutneys', price: 7.00, category: 'Tiffin', isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_013', restaurantId: 'REST_004', name: 'South Madras Filter Coffee', description: 'Traditional chicory brew frothed with hot creamy milk', price: 3.50, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },

  // Burger Point (REST_005)
  { itemId: 'ITEM_014', restaurantId: 'REST_005', name: 'Smash Angus Cheeseburger', description: 'Double smashed prime beef patties with cheddar, pickles & secret sauce', price: 12.99, category: 'Burgers', isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_015', restaurantId: 'REST_005', name: 'Spicy Crispy Chicken Burger', description: 'Buttermilk fried chicken breast, jalapeno slaw, and chipotle mayo', price: 11.50, category: 'Burgers', isVeg: false, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_016', restaurantId: 'REST_005', name: 'Truffle Parmesan Fries', description: 'Hand-cut russet potatoes dusted with parmesan and white truffle drizzle', price: 5.99, category: 'Sides', isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80' },

  // Dragon Wok (REST_006)
  { itemId: 'ITEM_017', restaurantId: 'REST_006', name: 'Hakka Chili Garlic Noodles', description: 'Wok tossed noodles with scallions, bell peppers and fiery chili oil', price: 10.99, category: 'Noodles', isVeg: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
  { itemId: 'ITEM_018', restaurantId: 'REST_006', name: 'Kung Pao Chicken Bowls', description: 'Crispy chicken bites tossed with peanuts, dried chilies and Szechuan glaze', price: 14.25, category: 'Mains', isVeg: false, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },

  // Taco Fiesta (REST_007)
  { itemId: 'ITEM_019', restaurantId: 'REST_007', name: 'Chipotle Chicken Burrito Bowl', description: 'Cilantro lime rice, black beans, pico de gallo, guacamole and grilled chicken', price: 13.50, category: 'Bowls', isVeg: false, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80' },

  // Sweet Delights (REST_008)
  { itemId: 'ITEM_020', restaurantId: 'REST_008', name: 'Belgian Chocolate Fudge Cake', description: 'Decadent multi-layered dark chocolate sponge with melted ganache', price: 7.50, category: 'Desserts', isVeg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80' },

  // Green Bowl Salad Co (REST_009)
  { itemId: 'ITEM_021', restaurantId: 'REST_009', name: 'Mediterranean Quinoa Crunch', description: 'Organic quinoa, cucumbers, kalamata olives, feta cheese and lemon tahini', price: 11.50, category: 'Salads', isVeg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },

  // Royal Tandoor (REST_010)
  { itemId: 'ITEM_022', restaurantId: 'REST_010', name: 'Galouti Kebab Platter', description: 'Melt-in-mouth smoked lamb patties served with ulte tawa ka paratha', price: 19.50, category: 'Kebabs', isVeg: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80' }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { customerId: 'CUST_001', name: 'Aarav Sharma', phone: '+91 98451 23401', email: 'aarav.sharma@example.com', address: 'Flat 402, Sunshine Apts, MG Road', zoneId: 'ZONE_A' },
  { customerId: 'CUST_002', name: 'Priya Iyer', phone: '+91 98451 23402', email: 'priya.iyer@example.com', address: '12 Emerald Blvd, Midtown', zoneId: 'ZONE_B' },
  { customerId: 'CUST_003', name: 'Rohan Mehta', phone: '+91 98451 23403', email: 'rohan.mehta@example.com', address: '77 Lakeview Towers, West End', zoneId: 'ZONE_C' },
  { customerId: 'CUST_004', name: 'Ananya Verma', phone: '+91 98451 23404', email: 'ananya.v@example.com', address: 'Block C, IT Residency, Tech Park', zoneId: 'ZONE_D' },
  { customerId: 'CUST_005', name: 'Kabir Das', phone: '+91 98451 23405', email: 'kabir.das@example.com', address: 'Hostel 9, University Campus', zoneId: 'ZONE_E' },
  { customerId: 'CUST_006', name: 'Sneha Nair', phone: '+91 98451 23406', email: 'sneha.n@example.com', address: '10 Ocean Drive, Harbor Bay', zoneId: 'ZONE_F' },
  { customerId: 'CUST_007', name: 'Vikram Joshi', phone: '+91 98451 23407', email: 'vikram.j@example.com', address: '45 Pine Crest, Green Hills', zoneId: 'ZONE_G' },
  { customerId: 'CUST_008', name: 'Divya Reddy', phone: '+91 98451 23408', email: 'divya.r@example.com', address: '22 Bazaar Lane, East Market', zoneId: 'ZONE_H' },
  { customerId: 'CUST_009', name: 'Arjun Kapoor', phone: '+91 98451 23409', email: 'arjun.k@example.com', address: '304 Cyber Vista, North Ridge', zoneId: 'ZONE_I' },
  { customerId: 'CUST_010', name: 'Meera Sen', phone: '+91 98451 23410', email: 'meera.sen@example.com', address: '88 Station View, South Station', zoneId: 'ZONE_J' },
  { customerId: 'CUST_011', name: 'Siddharth Rao', phone: '+91 98451 23411', email: 'sid.rao@example.com', address: '15 Commercial Street, Downtown', zoneId: 'ZONE_A' },
  { customerId: 'CUST_012', name: 'Neha Gupta', phone: '+91 98451 23412', email: 'neha.g@example.com', address: '9 Palm Meadows, Midtown', zoneId: 'ZONE_B' },
  { customerId: 'CUST_013', name: 'Karan Singhania', phone: '+91 98451 23413', email: 'karan.s@example.com', address: '50 Sunset Point, West End', zoneId: 'ZONE_C' },
  { customerId: 'CUST_014', name: 'Pooja Bhat', phone: '+91 98451 23414', email: 'pooja.bhat@example.com', address: 'Infotech Valley Phase 2', zoneId: 'ZONE_D' },
  { customerId: 'CUST_015', name: 'Aditya Kulkarni', phone: '+91 98451 23415', email: 'aditya.k@example.com', address: '3 Scholar Enclave, University Town', zoneId: 'ZONE_E' },
  { customerId: 'CUST_016', name: 'Tanvi Patel', phone: '+91 98451 23416', email: 'tanvi.p@example.com', address: '7 Lighthouse Way, Harbor Bay', zoneId: 'ZONE_F' },
  { customerId: 'CUST_017', name: 'Rishi Chopra', phone: '+91 98451 23417', email: 'rishi.c@example.com', address: '101 Orchard Garden, Green Hills', zoneId: 'ZONE_G' },
  { customerId: 'CUST_018', name: 'Gauri Menon', phone: '+91 98451 23418', email: 'gauri.m@example.com', address: '6 Silk Mill Lane, East Market', zoneId: 'ZONE_H' },
  { customerId: 'CUST_019', name: 'Sameer Sheikh', phone: '+91 98451 23419', email: 'sameer.s@example.com', address: '22 Skyline Towers, North Ridge', zoneId: 'ZONE_I' },
  { customerId: 'CUST_020', name: 'Ishita Roy', phone: '+91 98451 23420', email: 'ishita.roy@example.com', address: '4 Rail View Colony, South Station', zoneId: 'ZONE_J' }
];

export const INITIAL_RIDERS: Rider[] = [
  { riderId: 'RIDER_001', name: 'Rahul Sharma', phone: '+91 97120 54001', vehicleType: 'ELECTRIC_BIKE', currentZoneId: 'ZONE_B', status: 'AVAILABLE', totalDeliveries: 148, currentOrders: 0, rating: 4.9 },
  { riderId: 'RIDER_002', name: 'Amit Verma', phone: '+91 97120 54002', vehicleType: 'MOTORBIKE', currentZoneId: 'ZONE_D', status: 'AVAILABLE', totalDeliveries: 230, currentOrders: 0, rating: 4.8 },
  { riderId: 'RIDER_003', name: 'Deepak Patel', phone: '+91 97120 54003', vehicleType: 'SCOOTER', currentZoneId: 'ZONE_C', status: 'AVAILABLE', totalDeliveries: 94, currentOrders: 0, rating: 4.7 },
  { riderId: 'RIDER_004', name: 'Kiran Kumar', phone: '+91 97120 54004', vehicleType: 'ELECTRIC_BIKE', currentZoneId: 'ZONE_A', status: 'BUSY', totalDeliveries: 312, currentOrders: 1, rating: 4.9 },
  { riderId: 'RIDER_005', name: 'Suresh Raina', phone: '+91 97120 54005', vehicleType: 'MOTORBIKE', currentZoneId: 'ZONE_E', status: 'AVAILABLE', totalDeliveries: 180, currentOrders: 0, rating: 4.6 },
  { riderId: 'RIDER_006', name: 'Manoj Tiwari', phone: '+91 97120 54006', vehicleType: 'BICYCLE', currentZoneId: 'ZONE_F', status: 'AVAILABLE', totalDeliveries: 64, currentOrders: 0, rating: 4.5 },
  { riderId: 'RIDER_007', name: 'Ganesh Naik', phone: '+91 97120 54007', vehicleType: 'SCOOTER', currentZoneId: 'ZONE_G', status: 'AVAILABLE', totalDeliveries: 215, currentOrders: 0, rating: 4.8 },
  { riderId: 'RIDER_008', name: 'Vijay Chawla', phone: '+91 97120 54008', vehicleType: 'ELECTRIC_BIKE', currentZoneId: 'ZONE_H', status: 'AVAILABLE', totalDeliveries: 120, currentOrders: 0, rating: 4.7 },
  { riderId: 'RIDER_009', name: 'Rajesh Pandey', phone: '+91 97120 54009', vehicleType: 'MOTORBIKE', currentZoneId: 'ZONE_I', status: 'AVAILABLE', totalDeliveries: 156, currentOrders: 0, rating: 4.8 },
  { riderId: 'RIDER_010', name: 'Sunil Gavaskar', phone: '+91 97120 54010', vehicleType: 'SCOOTER', currentZoneId: 'ZONE_J', status: 'AVAILABLE', totalDeliveries: 198, currentOrders: 0, rating: 4.9 },
  { riderId: 'RIDER_011', name: 'Pradeep Yadav', phone: '+91 97120 54011', vehicleType: 'ELECTRIC_BIKE', currentZoneId: 'ZONE_A', status: 'OFFLINE', totalDeliveries: 88, currentOrders: 0, rating: 4.4 },
  { riderId: 'RIDER_012', name: 'Chetan Bhagat', phone: '+91 97120 54012', vehicleType: 'MOTORBIKE', currentZoneId: 'ZONE_B', status: 'BUSY', totalDeliveries: 275, currentOrders: 1, rating: 4.9 },
  { riderId: 'RIDER_013', name: 'Mohan Lal', phone: '+91 97120 54013', vehicleType: 'SCOOTER', currentZoneId: 'ZONE_C', status: 'AVAILABLE', totalDeliveries: 142, currentOrders: 0, rating: 4.7 },
  { riderId: 'RIDER_014', name: 'Jatin Soni', phone: '+91 97120 54014', vehicleType: 'ELECTRIC_BIKE', currentZoneId: 'ZONE_D', status: 'OFFLINE', totalDeliveries: 110, currentOrders: 0, rating: 4.5 },
  { riderId: 'RIDER_015', name: 'Vikash Mishra', phone: '+91 97120 54015', vehicleType: 'MOTORBIKE', currentZoneId: 'ZONE_E', status: 'AVAILABLE', totalDeliveries: 204, currentOrders: 0, rating: 4.8 }
];

export const INITIAL_ORDERS: Order[] = [
  {
    orderId: 'ORD_1001',
    customerId: 'CUST_001',
    restaurantId: 'REST_001',
    orderTime: '2026-09-26 12:45:00',
    orderStatus: 'OUT_FOR_DELIVERY',
    totalAmount: 38.48,
    assignedRiderId: 'RIDER_004',
    etaMinutes: 28,
    distanceKm: 3.5,
    createdAt: '2026-09-26T12:45:00Z',
    deliveryAddress: 'Flat 402, Sunshine Apts, MG Road',
    zoneId: 'ZONE_A',
    items: [
      { orderItemId: 'OITEM_001', orderId: 'ORD_1001', itemId: 'ITEM_001', itemName: 'Paneer Butter Masala', quantity: 2, price: 14.50 },
      { orderItemId: 'OITEM_002', orderId: 'ORD_1001', itemId: 'ITEM_002', itemName: 'Butter Garlic Naan', quantity: 2, price: 3.50 }
    ],
    notes: 'Please do not ring bell, baby is sleeping'
  },
  {
    orderId: 'ORD_1002',
    customerId: 'CUST_004',
    restaurantId: 'REST_002',
    orderTime: '2026-09-26 13:10:00',
    orderStatus: 'RIDER_ASSIGNED',
    totalAmount: 34.49,
    assignedRiderId: 'RIDER_012',
    etaMinutes: 32,
    distanceKm: 4.2,
    createdAt: '2026-09-26T13:10:00Z',
    deliveryAddress: 'Block C, IT Residency, Tech Park',
    zoneId: 'ZONE_D',
    items: [
      { orderItemId: 'OITEM_003', orderId: 'ORD_1002', itemId: 'ITEM_005', itemName: 'Hyderabadi Dum Chicken Biryani', quantity: 2, price: 15.99 }
    ]
  },
  {
    orderId: 'ORD_1003',
    customerId: 'CUST_003',
    restaurantId: 'REST_003',
    orderTime: '2026-09-26 13:30:00',
    orderStatus: 'PREPARING_FOOD',
    totalAmount: 31.49,
    assignedRiderId: null,
    etaMinutes: 35,
    distanceKm: 2.8,
    createdAt: '2026-09-26T13:30:00Z',
    deliveryAddress: '77 Lakeview Towers, West End',
    zoneId: 'ZONE_C',
    items: [
      { orderItemId: 'OITEM_004', orderId: 'ORD_1003', itemId: 'ITEM_008', itemName: 'Margherita Classica', quantity: 1, price: 13.99 },
      { orderItemId: 'OITEM_005', orderId: 'ORD_1003', itemId: 'ITEM_009', itemName: 'Double Pepperoni Rush', quantity: 1, price: 17.50 }
    ]
  },
  {
    orderId: 'ORD_1004',
    customerId: 'CUST_005',
    restaurantId: 'REST_005',
    orderTime: '2026-09-26 13:40:00',
    orderStatus: 'RESTAURANT_ACCEPTED',
    totalAmount: 24.49,
    assignedRiderId: null,
    etaMinutes: 26,
    distanceKm: 3.1,
    createdAt: '2026-09-26T13:40:00Z',
    deliveryAddress: 'Hostel 9, University Campus',
    zoneId: 'ZONE_E',
    items: [
      { orderItemId: 'OITEM_006', orderId: 'ORD_1004', itemId: 'ITEM_014', itemName: 'Smash Angus Cheeseburger', quantity: 1, price: 12.99 },
      { orderItemId: 'OITEM_007', orderId: 'ORD_1004', itemId: 'ITEM_015', itemName: 'Spicy Crispy Chicken Burger', quantity: 1, price: 11.50 }
    ]
  },
  {
    orderId: 'ORD_1005',
    customerId: 'CUST_002',
    restaurantId: 'REST_004',
    orderTime: '2026-09-26 13:50:00',
    orderStatus: 'ORDER_PLACED',
    totalAmount: 19.00,
    assignedRiderId: null,
    etaMinutes: 25,
    distanceKm: 2.2,
    createdAt: '2026-09-26T13:50:00Z',
    deliveryAddress: '12 Emerald Blvd, Midtown',
    zoneId: 'ZONE_B',
    items: [
      { orderItemId: 'OITEM_008', orderId: 'ORD_1005', itemId: 'ITEM_011', itemName: 'Ghee Roast Masala Dosa', quantity: 1, price: 8.50 },
      { orderItemId: 'OITEM_009', orderId: 'ORD_1005', itemId: 'ITEM_012', itemName: 'Steamed Idli & Medu Vada Combo', quantity: 1, price: 7.00 },
      { orderItemId: 'OITEM_010', orderId: 'ORD_1005', itemId: 'ITEM_013', itemName: 'South Madras Filter Coffee', quantity: 1, price: 3.50 }
    ]
  }
];

export const INITIAL_ORDER_STATUS_HISTORY: OrderStatusHistory[] = [
  { statusId: 'STAT_001', orderId: 'ORD_1001', status: 'ORDER_PLACED', timestamp: '2026-09-26 12:45:00', description: 'Order created by customer' },
  { statusId: 'STAT_002', orderId: 'ORD_1001', status: 'RESTAURANT_ACCEPTED', timestamp: '2026-09-26 12:47:15', description: 'Spice Hub accepted the order' },
  { statusId: 'STAT_003', orderId: 'ORD_1001', status: 'PREPARING_FOOD', timestamp: '2026-09-26 12:48:30', description: 'Kitchen started preparation' },
  { statusId: 'STAT_004', orderId: 'ORD_1001', status: 'RIDER_ASSIGNED', timestamp: '2026-09-26 12:51:00', description: 'Nearest available rider Kiran Kumar assigned via BFS' },
  { statusId: 'STAT_005', orderId: 'ORD_1001', status: 'RIDER_PICKED_UP', timestamp: '2026-09-26 13:05:20', description: 'Rider picked up order from Spice Hub' },
  { statusId: 'STAT_006', orderId: 'ORD_1001', status: 'OUT_FOR_DELIVERY', timestamp: '2026-09-26 13:07:00', description: 'Rider is on the way to Sunshine Apts' },

  { statusId: 'STAT_007', orderId: 'ORD_1002', status: 'ORDER_PLACED', timestamp: '2026-09-26 13:10:00', description: 'Order created by customer' },
  { statusId: 'STAT_008', orderId: 'ORD_1002', status: 'RESTAURANT_ACCEPTED', timestamp: '2026-09-26 13:12:00', description: 'Biryani House accepted order' },
  { statusId: 'STAT_009', orderId: 'ORD_1002', status: 'RIDER_ASSIGNED', timestamp: '2026-09-26 13:14:10', description: 'Rider Chetan Bhagat assigned via BFS' },

  { statusId: 'STAT_010', orderId: 'ORD_1003', status: 'ORDER_PLACED', timestamp: '2026-09-26 13:30:00', description: 'Order placed by customer' },
  { statusId: 'STAT_011', orderId: 'ORD_1003', status: 'RESTAURANT_ACCEPTED', timestamp: '2026-09-26 13:31:40', description: 'Pizza Corner accepted order' },
  { statusId: 'STAT_012', orderId: 'ORD_1003', status: 'PREPARING_FOOD', timestamp: '2026-09-26 13:32:10', description: 'Pizzas in woodfired oven' }
];

// Helper to seed 120 realistic historical trips for the ML Regression training
export function generateInitialTripHistory(): TripHistory[] {
  const trips: TripHistory[] = [];
  const times: Array<'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'> = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];
  const traffics: Array<'LOW' | 'MEDIUM' | 'HIGH'> = ['LOW', 'MEDIUM', 'HIGH'];
  const weathers: Array<'CLEAR' | 'RAIN' | 'STORM'> = ['CLEAR', 'RAIN', 'STORM'];

  // Base physics: ETA ~ 12 (prep/handshake) + 3.8 * distance + trafficPenalty + weatherPenalty + timePenalty + noise
  const seeds = [
    { dist: 1.8, time: 0, traf: 0, weat: 0 },
    { dist: 2.4, time: 1, traf: 1, weat: 0 },
    { dist: 3.1, time: 2, traf: 2, weat: 0 },
    { dist: 4.5, time: 2, traf: 2, weat: 1 },
    { dist: 5.2, time: 3, traf: 0, weat: 0 },
    { dist: 2.0, time: 0, traf: 1, weat: 1 },
    { dist: 3.8, time: 1, traf: 2, weat: 0 },
    { dist: 6.4, time: 2, traf: 2, weat: 2 },
    { dist: 1.5, time: 3, traf: 0, weat: 0 },
    { dist: 4.0, time: 1, traf: 1, weat: 0 },
  ];

  let tripCount = 0;
  for (let cycle = 0; cycle < 12; cycle++) {
    for (let i = 0; i < seeds.length; i++) {
      tripCount++;
      const s = seeds[i];
      const dist = +(s.dist + (cycle % 3) * 0.4 - ((cycle * 7) % 5) * 0.1).toFixed(1);
      const timeIdx = (s.time + cycle) % 4;
      const trafIdx = (s.traf + (cycle % 2)) % 3;
      const weatIdx = (s.weat + (cycle % 3 === 2 ? 1 : 0)) % 3;

      const timeOfDay = times[timeIdx];
      const trafficLevel = traffics[trafIdx];
      const weatherCondition = weathers[weatIdx];

      // True synthetic relationship for linear regression
      const basePrep = 12.0;
      const distComponent = dist * 3.85;
      const trafficComponent = trafIdx === 0 ? 0 : trafIdx === 1 ? 5.2 : 11.4;
      const weatherComponent = weatIdx === 0 ? 0 : weatIdx === 1 ? 6.1 : 14.8;
      const timeComponent = timeIdx === 2 ? 4.5 : timeIdx === 1 ? 2.0 : 0.5; // Evening peak
      const randomJitter = ((tripCount * 17) % 7) - 3; // reproducible deterministic noise between -3 and +3

      const actualMinutes = Math.max(12, Math.round(basePrep + distComponent + trafficComponent + weatherComponent + timeComponent + randomJitter));

      trips.push({
        tripId: `TRIP_${1000 + tripCount}`,
        riderId: `RIDER_${String(((tripCount * 3) % 15) + 1).padStart(3, '0')}`,
        orderId: `ORD_${8000 + tripCount}`,
        distanceKm: dist,
        timeOfDay,
        actualDeliveryMinutes: actualMinutes,
        trafficLevel,
        weatherCondition,
        createdAt: `2026-09-${String(Math.min(26, 10 + Math.floor(tripCount / 6))).padStart(2, '0')}T${String(10 + (timeIdx * 3)).padStart(2, '0')}:30:00Z`
      });
    }
  }

  return trips;
}

export const INITIAL_TRIP_HISTORY: TripHistory[] = generateInitialTripHistory();
