export type VehicleType = 'ELECTRIC_BIKE' | 'MOTORBIKE' | 'SCOOTER' | 'BICYCLE';

export type RiderStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'RESTAURANT_ACCEPTED'
  | 'PREPARING_FOOD'
  | 'RIDER_ASSIGNED'
  | 'RIDER_PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
export type TrafficLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type WeatherCondition = 'CLEAR' | 'RAIN' | 'STORM';

export interface Customer {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  zoneId: string;
  avatar?: string;
}

export interface Restaurant {
  restaurantId: string;
  name: string;
  address: string;
  zoneId: string;
  latitude: number;
  longitude: number;
  rating: number;
  cuisine: string;
  status: 'OPEN' | 'CLOSED' | 'BUSY';
  prepTimeMinutes: number;
  image: string;
  priceRange: '$' | '$$' | '$$$';
}

export interface MenuItem {
  itemId: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
}

export interface Rider {
  riderId: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  currentZoneId: string;
  status: RiderStatus;
  totalDeliveries: number;
  currentOrders: number;
  rating: number;
  avatar?: string;
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  restaurantId: string;
  orderTime: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  assignedRiderId: string | null;
  etaMinutes: number;
  distanceKm: number;
  createdAt: string;
  deliveryAddress: string;
  zoneId: string; // destination zone (customer)
  items: OrderItem[];
  notes?: string;
}

export interface Zone {
  zoneId: string;
  zoneName: string;
  code: string;
  x: number; // for 2D visualization
  y: number;
  description?: string;
}

export interface ZoneConnection {
  connectionId: string;
  zoneA: string;
  zoneB: string;
  distanceKm: number;
}

export interface TripHistory {
  tripId: string;
  riderId: string;
  orderId: string;
  distanceKm: number;
  timeOfDay: TimeOfDay;
  actualDeliveryMinutes: number;
  trafficLevel: TrafficLevel;
  weatherCondition: WeatherCondition;
  createdAt: string;
}

export interface OrderStatusHistory {
  statusId: string;
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}

export interface BFSStep {
  stepIndex: number;
  currentNode: string;
  queue: string[];
  visited: string[];
  discoveredRiders: Rider[];
  distanceMap: Record<string, number>;
  predecessorMap: Record<string, string | null>;
  description: string;
}

export interface BFSResult {
  startZone: string;
  assignedRider: Rider | null;
  riderFoundAtZone: string | null;
  distanceKm: number;
  traversedZones: string[];
  routePath: string[];
  steps: BFSStep[];
  timeComplexity: string;
  spaceComplexity: string;
  executionTimeMs: number;
}

export interface MLModelMetrics {
  intercept: number;
  coefDistance: number;
  coefTimeOfDay: number;
  coefTraffic: number;
  coefWeather: number;
  mae: number;
  r2: number;
  rmse: number;
  sampleCount: number;
  formula: string;
}

export interface AcademicSubject {
  id: string;
  code: string;
  name: string;
  syllabusTopic: string;
  contribution: string;
  codeReferences: string[];
  visualHighlights: string[];
  practicalImportance: string;
}
