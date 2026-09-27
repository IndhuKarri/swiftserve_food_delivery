import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  OrderStatusHistory,
  OrderStatus,
  RiderStatus,
  BFSResult,
  MLModelMetrics,
  CartItem
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_RIDERS,
  INITIAL_ORDERS,
  INITIAL_ZONES,
  INITIAL_ZONE_CONNECTIONS,
  INITIAL_TRIP_HISTORY,
  INITIAL_ORDER_STATUS_HISTORY
} from '../data/mockDatabase';
import { ZoneGraph } from '../algorithms/bfsRiderAssignment';
import { ETARegressionModel, ETAPredictionResult } from '../ml/etaRegressionModel';

interface DatabaseContextType {
  customers: Customer[];
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  riders: Rider[];
  orders: Order[];
  zones: Zone[];
  zoneConnections: ZoneConnection[];
  tripHistory: TripHistory[];
  statusHistory: OrderStatusHistory[];
  cart: CartItem[];
  currentCustomer: Customer;
  currentRider: Rider;
  zoneGraph: ZoneGraph;
  etaModel: ETARegressionModel;
  modelMetrics: MLModelMetrics | null;
  lastBfsResult: BFSResult | null;
  activeOrder: Order | null;

  // Actions
  addToCart: (item: MenuItem, restaurant: Restaurant) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  setCurrentCustomerById: (customerId: string) => void;
  setCurrentRiderById: (riderId: string) => void;
  placeOrder: (notes?: string) => Promise<Order>;
  assignRiderViaBFS: (orderId: string) => Promise<{ order: Order; bfsResult: BFSResult }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  setRiderStatus: (riderId: string, status: RiderStatus) => void;
  predictOrderETA: (distanceKm: number, timeOfDay: any, trafficLevel: any, weatherCondition: any) => ETAPredictionResult;
  retrainModel: () => MLModelMetrics;
  resetToDefaults: () => void;
  setActiveOrder: (order: Order | null) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const STORAGE_KEY = 'swiftserve_db_state_v1';

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use defaults
  const [customers] = useState<Customer[]>(() => {
    return INITIAL_CUSTOMERS;
  });

  const [restaurants] = useState<Restaurant[]>(() => {
    return INITIAL_RESTAURANTS;
  });

  const [menuItems] = useState<MenuItem[]>(() => {
    return INITIAL_MENU_ITEMS;
  });

  const [zones] = useState<Zone[]>(() => {
    return INITIAL_ZONES;
  });

  const [zoneConnections] = useState<ZoneConnection[]>(() => {
    return INITIAL_ZONE_CONNECTIONS;
  });

  const [riders, setRiders] = useState<Rider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_riders');
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [tripHistory, setTripHistory] = useState<TripHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIP_HISTORY;
  });

  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_history');
    return saved ? JSON.parse(saved) : INITIAL_ORDER_STATUS_HISTORY;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentCustomerId, setCurrentCustomerId] = useState<string>('CUST_001');
  const [currentRiderId, setCurrentRiderId] = useState<string>('RIDER_001');
  const [lastBfsResult, setLastBfsResult] = useState<BFSResult | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>('ORD_1001');

  // Instantiate ZoneGraph
  const zoneGraph = useMemo(() => {
    return new ZoneGraph(zones, zoneConnections);
  }, [zones, zoneConnections]);

  // Instantiate & Train Machine Learning Model
  const { etaModel, initialMetrics } = useMemo(() => {
    const model = new ETARegressionModel();
    const metrics = model.train(tripHistory);
    return { etaModel: model, initialMetrics: metrics };
  }, [tripHistory]);

  const [modelMetrics, setModelMetrics] = useState<MLModelMetrics | null>(initialMetrics);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_riders', JSON.stringify(riders));
  }, [riders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_trips', JSON.stringify(tripHistory));
  }, [tripHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_history', JSON.stringify(statusHistory));
  }, [statusHistory]);

  const currentCustomer = customers.find(c => c.customerId === currentCustomerId) || customers[0];
  const currentRider = riders.find(r => r.riderId === currentRiderId) || riders[0];
  const activeOrder = orders.find(o => o.orderId === activeOrderId) || orders[0] || null;

  // Cart operations
  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    setCart(prev => {
      // If adding from another restaurant, reset cart to new restaurant
      const existingRestId = prev[0]?.restaurant.restaurantId;
      if (existingRestId && existingRestId !== restaurant.restaurantId) {
        return [{ item, quantity: 1, restaurant }];
      }
      const existing = prev.find(i => i.item.itemId === item.itemId);
      if (existing) {
        return prev.map(i =>
          i.item.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1, restaurant }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.itemId !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.item.itemId === itemId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const setCurrentCustomerById = (id: string) => {
    setCurrentCustomerId(id);
  };

  const setCurrentRiderById = (id: string) => {
    setCurrentRiderId(id);
  };

  const setActiveOrder = (order: Order | null) => {
    setActiveOrderId(order ? order.orderId : null);
  };

  // Place order
  const placeOrder = async (notes?: string): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const restaurant = cart[0].restaurant;
    const orderId = `ORD_${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);

    const orderItems: OrderItem[] = cart.map((c, idx) => ({
      orderItemId: `OITEM_${orderId}_${idx + 1}`,
      orderId,
      itemId: c.item.itemId,
      itemName: c.item.name,
      quantity: c.quantity,
      price: c.item.price
    }));

    const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    const deliveryFee = 3.50;
    const taxes = +(subtotal * 0.05).toFixed(2);
    const totalAmount = +(subtotal + deliveryFee + taxes).toFixed(2);

    // Initial base estimate distance between zones
    const customerZone = currentCustomer.zoneId;
    const restZone = restaurant.zoneId;
    const baseDistance = customerZone === restZone ? 1.8 : 3.5;

    // Use ML to predict initial ETA
    const etaPred = etaModel.predict({
      distanceKm: baseDistance,
      timeOfDay: 'AFTERNOON',
      trafficLevel: 'MEDIUM',
      weatherCondition: 'CLEAR'
    });

    const newOrder: Order = {
      orderId,
      customerId: currentCustomer.customerId,
      restaurantId: restaurant.restaurantId,
      orderTime: formattedTime,
      orderStatus: 'ORDER_PLACED',
      totalAmount,
      assignedRiderId: null,
      etaMinutes: etaPred.predictedMinutes,
      distanceKm: baseDistance,
      createdAt: now.toISOString(),
      deliveryAddress: currentCustomer.address,
      zoneId: customerZone,
      items: orderItems,
      notes: notes || 'Standard Delivery'
    };

    const newHistory: OrderStatusHistory = {
      statusId: `STAT_${Date.now()}`,
      orderId,
      status: 'ORDER_PLACED',
      timestamp: formattedTime,
      description: `Order successfully placed by ${currentCustomer.name}. Waiting for restaurant acceptance.`
    };

    setOrders(prev => [newOrder, ...prev]);
    setStatusHistory(prev => [newHistory, ...prev]);
    setActiveOrderId(orderId);
    clearCart();

    return newOrder;
  };

  // Assign nearest available rider via Breadth-First Search (BFS)
  const assignRiderViaBFS = async (orderId: string): Promise<{ order: Order; bfsResult: BFSResult }> => {
    const targetOrder = orders.find(o => o.orderId === orderId);
    if (!targetOrder) throw new Error(`Order ${orderId} not found.`);

    const restaurant = restaurants.find(r => r.restaurantId === targetOrder.restaurantId);
    const startZone = restaurant ? restaurant.zoneId : 'ZONE_A';

    // Run BFS on zone graph
    const bfsResult = zoneGraph.findNearestAvailableRider(startZone, riders);
    setLastBfsResult(bfsResult);

    if (!bfsResult.assignedRider) {
      throw new Error(`No available riders found in any reachable zone starting from ${startZone}.`);
    }

    const assignedRider = bfsResult.assignedRider;
    const transitDist = bfsResult.distanceKm + targetOrder.distanceKm;

    // Run ML ETA Prediction
    const etaResult = etaModel.predict({
      distanceKm: +(transitDist).toFixed(1),
      timeOfDay: 'EVENING',
      trafficLevel: 'MEDIUM',
      weatherCondition: 'CLEAR'
    });

    const updatedOrder: Order = {
      ...targetOrder,
      assignedRiderId: assignedRider.riderId,
      orderStatus: 'RIDER_ASSIGNED',
      etaMinutes: etaResult.predictedMinutes
    };

    // Update Rider status to BUSY
    setRiders(prev =>
      prev.map(r =>
        r.riderId === assignedRider.riderId
          ? { ...r, status: 'BUSY', currentOrders: r.currentOrders + 1 }
          : r
      )
    );

    // Update Order list
    setOrders(prev => prev.map(o => (o.orderId === orderId ? updatedOrder : o)));

    // Append Status History
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const historyEntry: OrderStatusHistory = {
      statusId: `STAT_${Date.now()}`,
      orderId,
      status: 'RIDER_ASSIGNED',
      timestamp: nowTime,
      description: `Rider ${assignedRider.name} assigned via BFS traversal (${bfsResult.distanceKm} km transit). Predicted ETA: ${etaResult.predictedMinutes} mins.`
    };
    setStatusHistory(prev => [historyEntry, ...prev]);

    return { order: updatedOrder, bfsResult };
  };

  // Update order status workflow
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const targetOrder = orders.find(o => o.orderId === orderId);
    if (!targetOrder) return;

    const updated = { ...targetOrder, orderStatus: status };

    // If marked DELIVERED, free the rider and log a new trip record
    if (status === 'DELIVERED' && targetOrder.assignedRiderId) {
      setRiders(prev =>
        prev.map(r =>
          r.riderId === targetOrder.assignedRiderId
            ? {
                ...r,
                status: 'AVAILABLE',
                currentOrders: Math.max(0, r.currentOrders - 1),
                totalDeliveries: r.totalDeliveries + 1
              }
            : r
        )
      );

      // Create trip history entry
      const newTrip: TripHistory = {
        tripId: `TRIP_${Date.now().toString().slice(-6)}`,
        riderId: targetOrder.assignedRiderId,
        orderId: targetOrder.orderId,
        distanceKm: targetOrder.distanceKm,
        timeOfDay: 'EVENING',
        actualDeliveryMinutes: targetOrder.etaMinutes,
        trafficLevel: 'MEDIUM',
        weatherCondition: 'CLEAR',
        createdAt: new Date().toISOString()
      };
      setTripHistory(prev => [newTrip, ...prev]);
    }

    setOrders(prev => prev.map(o => (o.orderId === orderId ? updated : o)));

    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const historyEntry: OrderStatusHistory = {
      statusId: `STAT_${Date.now()}`,
      orderId,
      status,
      timestamp: nowTime,
      description: note || `Order status updated to ${status}`
    };
    setStatusHistory(prev => [historyEntry, ...prev]);
  };

  // Rider toggle status
  const setRiderStatus = (riderId: string, status: RiderStatus) => {
    setRiders(prev =>
      prev.map(r => (r.riderId === riderId ? { ...r, status } : r))
    );
  };

  // Predict ETA using ML
  const predictOrderETA = (
    distanceKm: number,
    timeOfDay: any,
    trafficLevel: any,
    weatherCondition: any
  ): ETAPredictionResult => {
    return etaModel.predict({
      distanceKm,
      timeOfDay,
      trafficLevel,
      weatherCondition
    });
  };

  const retrainModel = (): MLModelMetrics => {
    const metrics = etaModel.train(tripHistory);
    setModelMetrics(metrics);
    return metrics;
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY + '_riders');
    localStorage.removeItem(STORAGE_KEY + '_orders');
    localStorage.removeItem(STORAGE_KEY + '_trips');
    localStorage.removeItem(STORAGE_KEY + '_history');
    setRiders(INITIAL_RIDERS);
    setOrders(INITIAL_ORDERS);
    setTripHistory(INITIAL_TRIP_HISTORY);
    setStatusHistory(INITIAL_ORDER_STATUS_HISTORY);
    setCart([]);
    setLastBfsResult(null);
    setActiveOrderId('ORD_1001');
    const freshMetrics = etaModel.train(INITIAL_TRIP_HISTORY);
    setModelMetrics(freshMetrics);
  };

  return (
    <DatabaseContext.Provider
      value={{
        customers,
        restaurants,
        menuItems,
        riders,
        orders,
        zones,
        zoneConnections,
        tripHistory,
        statusHistory,
        cart,
        currentCustomer,
        currentRider,
        zoneGraph,
        etaModel,
        modelMetrics,
        lastBfsResult,
        activeOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setCurrentCustomerById,
        setCurrentRiderById,
        placeOrder,
        assignRiderViaBFS,
        updateOrderStatus,
        setRiderStatus,
        predictOrderETA,
        retrainModel,
        resetToDefaults,
        setActiveOrder
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
