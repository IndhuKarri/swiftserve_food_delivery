/**
 * OOPJ / Java Backend Architecture & Code Base for SwiftServe
 * Models the complete Java Spring Boot / JDBC enterprise backend
 */

export interface JavaSourceFile {
  packagePath: string;
  fileName: string;
  category: 'model' | 'service' | 'repository' | 'algorithm' | 'controller' | 'config';
  oopConcept: string;
  code: string;
  description: string;
}

export const JAVA_PROJECT_FILES: JavaSourceFile[] = [
  {
    packagePath: 'com.swiftserve.model',
    fileName: 'User.java',
    category: 'model',
    oopConcept: 'Inheritance & Abstraction (Base abstract class)',
    description: 'Abstract base class demonstrating inheritance for Customer and Rider personas.',
    code: `package com.swiftserve.model;

import java.time.LocalDateTime;

/**
 * Demonstrates Abstraction & Encapsulation.
 * Base entity for all platform actors.
 */
public abstract class User {
    protected String id;
    protected String name;
    protected String phone;
    protected String currentZoneId;
    protected LocalDateTime registeredAt;

    public User(String id, String name, String phone, String currentZoneId) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.currentZoneId = currentZoneId;
        this.registeredAt = LocalDateTime.now();
    }

    // Abstract method enforcing polymorphism
    public abstract String getRoleDescription();

    // Getters and Setters demonstrating encapsulation
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCurrentZoneId() { return currentZoneId; }
    public void setCurrentZoneId(String currentZoneId) { this.currentZoneId = currentZoneId; }
}
`
  },
  {
    packagePath: 'com.swiftserve.model',
    fileName: 'Rider.java',
    category: 'model',
    oopConcept: 'Inheritance & Polymorphism',
    description: 'Rider class extending User, encapsulating vehicle types and status transitions.',
    code: `package com.swiftserve.model;

public class Rider extends User {
    public enum Status { AVAILABLE, BUSY, OFFLINE }
    public enum VehicleType { ELECTRIC_BIKE, MOTORBIKE, SCOOTER, BICYCLE }

    private VehicleType vehicleType;
    private Status status;
    private int totalDeliveries;
    private int currentOrders;
    private double rating;

    public Rider(String id, String name, String phone, String currentZoneId, VehicleType vehicleType) {
        super(id, name, phone, currentZoneId);
        this.vehicleType = vehicleType;
        this.status = Status.AVAILABLE;
        this.totalDeliveries = 0;
        this.currentOrders = 0;
        this.rating = 5.0;
    }

    @Override
    public String getRoleDescription() {
        return "Delivery Partner - " + vehicleType + " [Status: " + status + "]";
    }

    public boolean isEligibleForAssignment() {
        return this.status == Status.AVAILABLE && this.currentOrders == 0;
    }

    public void assignOrder() {
        if (!isEligibleForAssignment()) {
            throw new IllegalStateException("Rider " + name + " is not available for assignment.");
        }
        this.status = Status.BUSY;
        this.currentOrders++;
    }

    public void completeOrder() {
        this.currentOrders = Math.max(0, this.currentOrders - 1);
        this.totalDeliveries++;
        this.status = Status.AVAILABLE;
    }

    // Getters & Setters
    public VehicleType getVehicleType() { return vehicleType; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public int getTotalDeliveries() { return totalDeliveries; }
    public int getCurrentOrders() { return currentOrders; }
    public double getRating() { return rating; }
}
`
  },
  {
    packagePath: 'com.swiftserve.algorithm',
    fileName: 'BFSService.java',
    category: 'algorithm',
    oopConcept: 'Data Structures & Algorithms in OOP (ADSA)',
    description: 'Graph-based level-by-level BFS search solver to locate the nearest available rider.',
    code: `package com.swiftserve.algorithm;

import com.swiftserve.model.Rider;
import com.swiftserve.model.Zone;
import java.util.*;

/**
 * BFS nearest rider search algorithm.
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
public class BFSService {
    private final Map<String, List<ZoneEdge>> adjacencyList = new HashMap<>();

    public static class ZoneEdge {
        public final String targetZoneId;
        public final double distanceKm;

        public ZoneEdge(String targetZoneId, double distanceKm) {
            this.targetZoneId = targetZoneId;
            this.distanceKm = distanceKm;
        }
    }

    public void addConnection(String zoneA, String zoneB, double distanceKm) {
        adjacencyList.computeIfAbsent(zoneA, k -> new ArrayList<>()).add(new ZoneEdge(zoneB, distanceKm));
        adjacencyList.computeIfAbsent(zoneB, k -> new ArrayList<>()).add(new ZoneEdge(zoneA, distanceKm));
    }

    /**
     * Executes Breadth First Search level by level
     */
    public RiderAssignmentResult findNearestAvailableRider(
            String restaurantZoneId, 
            Map<String, List<Rider>> ridersByZone) {

        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        Map<String, Double> distanceMap = new HashMap<>();

        queue.offer(restaurantZoneId);
        visited.add(restaurantZoneId);
        distanceMap.put(restaurantZoneId, 0.0);

        while (!queue.isEmpty()) {
            String currentZone = queue.poll();
            List<Rider> ridersInCurrentZone = ridersByZone.getOrDefault(currentZone, Collections.emptyList());

            // Check if available rider exists at current zone
            for (Rider rider : ridersInCurrentZone) {
                if (rider.isEligibleForAssignment()) {
                    return new RiderAssignmentResult(rider, currentZone, distanceMap.get(currentZone), true);
                }
            }

            // Explore adjacent zones in BFS queue
            for (ZoneEdge edge : adjacencyList.getOrDefault(currentZone, Collections.emptyList())) {
                if (!visited.contains(edge.targetZoneId)) {
                    visited.add(edge.targetZoneId);
                    distanceMap.put(edge.targetZoneId, distanceMap.get(currentZone) + edge.distanceKm);
                    queue.offer(edge.targetZoneId);
                }
            }
        }

        return new RiderAssignmentResult(null, null, 0.0, false);
    }

    public static class RiderAssignmentResult {
        public final Rider rider;
        public final String foundZoneId;
        public final double distanceKm;
        public final boolean success;

        public RiderAssignmentResult(Rider rider, String foundZoneId, double distanceKm, boolean success) {
            this.rider = rider;
            this.foundZoneId = foundZoneId;
            this.distanceKm = distanceKm;
            this.success = success;
        }
    }
}
`
  },
  {
    packagePath: 'com.swiftserve.service',
    fileName: 'RiderAssignmentService.java',
    category: 'service',
    oopConcept: 'Service Layer & Business Orchestration',
    description: 'Coordinates BFS routing, status updates, and database transactional updates.',
    code: `package com.swiftserve.service;

import com.swiftserve.algorithm.BFSService;
import com.swiftserve.algorithm.BFSService.RiderAssignmentResult;
import com.swiftserve.model.Order;
import com.swiftserve.model.Rider;
import com.swiftserve.repository.OrderRepository;
import com.swiftserve.repository.RiderRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RiderAssignmentService {
    private final BFSService bfsService;
    private final RiderRepository riderRepository;
    private final OrderRepository orderRepository;
    private final ETAService etaService;

    public RiderAssignmentService(
            BFSService bfsService,
            RiderRepository riderRepository,
            OrderRepository orderRepository,
            ETAService etaService) {
        this.bfsService = bfsService;
        this.riderRepository = riderRepository;
        this.orderRepository = orderRepository;
        this.etaService = etaService;
    }

    public synchronized Order assignNearestRider(String orderId) {
        Order order = orderRepository.findById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }

        // Fetch all active riders grouped by zone
        List<Rider> availableRiders = riderRepository.findAvailableRiders();
        Map<String, List<Rider>> ridersByZone = availableRiders.stream()
                .collect(Collectors.groupingBy(Rider::getCurrentZoneId));

        // Execute BFS routing
        RiderAssignmentResult result = bfsService.findNearestAvailableRider(order.getRestaurantZoneId(), ridersByZone);

        if (!result.success || result.rider == null) {
            throw new IllegalStateException("No available rider found in any reachable zone for Order " + orderId);
        }

        Rider selectedRider = result.rider;
        selectedRider.assignOrder();
        riderRepository.update(selectedRider);

        // Calculate and attach ETA
        int etaMinutes = etaService.calculateETA(result.distanceKm, order.getCreatedAt());

        order.setAssignedRiderId(selectedRider.getId());
        order.setStatus(Order.Status.RIDER_ASSIGNED);
        order.setEtaMinutes(etaMinutes);
        orderRepository.update(order);

        return order;
    }
}
`
  },
  {
    packagePath: 'com.swiftserve.repository',
    fileName: 'DatabaseConnection.java',
    category: 'config',
    oopConcept: 'Singleton Pattern & JDBC Connection Factory',
    description: 'Manages relational database connection pooling via JDBC with environmental variables.',
    code: `package com.swiftserve.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton Pattern for Database Connection Factory
 */
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private Connection connection;

    private final String url = System.getenv().getOrDefault("DB_URL", "jdbc:postgresql://localhost:5432/swiftserve");
    private final String user = System.getenv().getOrDefault("DB_USER", "postgres");
    private final String password = System.getenv().getOrDefault("DB_PASSWORD", "secure_password");

    private DatabaseConnection() {
        try {
            Class.forName("org.postgresql.Driver");
            this.connection = DriverManager.getConnection(url, user, password);
            System.out.println("[JDBC] Successfully connected to PostgreSQL Relational Database.");
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("[JDBC ERROR] Failed to connect: " + e.getMessage());
        }
    }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }
}
`
  },
  {
    packagePath: 'com.swiftserve.controller',
    fileName: 'OrderController.java',
    category: 'controller',
    oopConcept: 'REST API Controller & HTTP Endpoint Routing',
    description: 'Exposes clean REST endpoints for order creation, BFS assignment, and status updates.',
    code: `package com.swiftserve.controller;

import com.swiftserve.model.Order;
import com.swiftserve.service.RiderAssignmentService;
import com.swiftserve.service.OrderService;

/**
 * REST API Controller matching Spring Boot annotations
 */
public class OrderController {
    private final RiderAssignmentService riderAssignmentService;
    private final OrderService orderService;

    public OrderController(RiderAssignmentService riderAssignmentService, OrderService orderService) {
        this.riderAssignmentService = riderAssignmentService;
        this.orderService = orderService;
    }

    // POST /api/orders/{id}/assign-rider
    public Order assignRiderToOrder(String orderId) {
        System.out.println("[API] Received POST request to assign rider for order: " + orderId);
        return riderAssignmentService.assignNearestRider(orderId);
    }
}
`
  }
];
