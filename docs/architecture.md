# SwiftServe — Architecture Specification

## 1. System Context & Layering
```
+-------------------------------------------------------------+
|                      CLIENT TIER (React)                    |
|  - Customer App (Ordering, Live Tracking)                   |
|  - Rider Portal (Order Pickup, Delivery Actions)            |
|  - Admin Dashboard (KPIs, Dispatch Logs)                   |
|  - Academic Labs (BFS Visualizer, ML Studio, DBMS Viewer)   |
+-------------------------------------------------------------+
                              | REST JSON API
+-------------------------------------------------------------+
|                      BACKEND SERVICES                       |
|  - Java Spring Boot / Order & Rider Assignment Service      |
|  - ADSA BFS Solver (Graph Adjacency Traversal)              |
|  - Python ML Service (OLS Multivariate Linear Regression)   |
|  - Database Connection Pool (JDBC Singleton Pattern)        |
+-------------------------------------------------------------+
                              | SQL / ACID Transactions
+-------------------------------------------------------------+
|                      RELATIONAL DBMS                        |
|  - Zones & Zone Connections (Graph Topology)                |
|  - Customers, Restaurants, Riders (Actors)                  |
|  - Orders & Order Items (Transactions)                      |
|  - Trip History & Status History (Audit & ML Training Set)  |
+-------------------------------------------------------------+
```

## 2. Data Flow Pipeline
1. Customer initiates order from restaurant zone $Z_{\text{rest}}$.
2. Order committed into DBMS with status `ORDER_PLACED`.
3. Java `RiderAssignmentService` queries for all available riders ($S_{\text{avail}}$ where status = AVAILABLE and currentOrders = 0).
4. `BFSService` executes Breadth-First Search on the Zone graph starting at $Z_{\text{rest}}$.
5. When the nearest available rider $R^*$ is located at zone $Z_{\text{rider}}$ with shortest graph distance $d$:
   - $R^*$.status updated to `BUSY`
   - Order updated to `RIDER_ASSIGNED` with `assigned_rider_id = R*.id`
6. Python ML regression model computes:
   $$\text{ETA} = b_0 + b_1 \cdot d_{\text{total}} + b_2 \cdot \text{time} + b_3 \cdot \text{traffic} + b_4 \cdot \text{weather}$$
7. ETA stored in the database; customer tracking interface streams the real-time update.
