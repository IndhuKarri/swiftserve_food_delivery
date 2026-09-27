# SwiftServe — Smart Food Delivery & Rider Assignment System
> **"Smart Delivery. Smarter Routing."**  
> *A production-grade college final-year / capstone web platform integrating DBMS, DMGT, ADSA, OOPJ, and Python Machine Learning.*

---

## 📌 Problem Statement
A food-delivery startup manually assigned riders to incoming orders. This resulted in:
- Uneven rider workloads
- Delayed rider assignment
- Difficulty identifying the nearest available rider across municipal zones
- Unreliable delivery-time estimates
- Zero visibility into order progression
- Inefficient order lifecycle management

**SwiftServe** automates this dispatch pipeline:
$$\text{Customer} \longrightarrow \text{Order Created (DBMS)} \longrightarrow \text{Restaurant Accepted} \longrightarrow \text{ADSA BFS Zone Search} \longrightarrow \text{Rider Assigned} \longrightarrow \text{Python ML ETA Prediction} \longrightarrow \text{Real-time Tracking}$$

---

## 🎓 Academic Syllabus & Subject Mapping

### 1. DBMS (Database Management Systems)
- **Relational Model & 3NF Normalization**: 8 interconnected entities:
  - `customers` (PK: `customer_id`, FK: `zone_id`)
  - `restaurants` (PK: `restaurant_id`, FK: `zone_id`)
  - `riders` (PK: `rider_id`, FK: `current_zone_id`)
  - `orders` (PK: `order_id`, FKs: `customer_id`, `restaurant_id`, `assigned_rider_id`, `zone_id`)
  - `order_items` (PK: `order_item_id`, FK: `order_id` with `ON DELETE CASCADE`)
  - `zones` (PK: `zone_id`, code, coordinates)
  - `zone_connections` (PK: `connection_id`, FKs: `zone_a`, `zone_b`, `distance_km`)
  - `trip_history` (PK: `trip_id`, FK: `rider_id`, `order_id`)
  - `order_status_history` (Audit log with timestamps)
- **Files**: `/database/schema.sql`, `/database/sample_data.sql`
- **Features**: Interactive ER diagram, live table browser with search/filtering, and SQL console.

### 2. DMGT (Discrete Mathematics & Graph Theory)
- **Relations**: Formal Cartesian subset definitions $R \subseteq D_1 \times D_2 \times \dots \times D_n$.
- **Symmetric Graph Relation**: Urban road connections represented as a symmetric binary relation on the vertex set of zones $V$:
  $$(u, v) \in R \iff (v, u) \in R$$
  with weight metric $w: R \to \mathbb{R}^+$ representing distance in kilometers.

### 3. ADSA (Advanced Data Structures & Algorithms)
- **Breadth-First Search (BFS)** for nearest available rider dispatch:
  - Explores zone graph level-by-level starting from the restaurant vertex.
  - Maintains FIFO Queue `[Q]`, Visited Set `[V]`, Predecessor map, and Distance accumulator.
  - Halts at the first level containing available riders (`status === 'AVAILABLE'` and `currentOrders === 0`).
- **Complexity**:
  - **Time Complexity**: $\mathcal{O}(V + E)$ where $V = 10$ zones and $E = 18$ zone connections.
  - **Space Complexity**: $\mathcal{O}(V)$ for the FIFO queue and visited set.
- **Interactive Visualizer**: 2D animated node canvas showing nodes transitioning between *Unvisited*, *In Queue / Visiting*, *Visited*, and *Selected Target Rider*.

### 4. OOPJ / Java (Object-Oriented Programming with Java)
- **OOP Principles**:
  - **Encapsulation**: Private fields, accessors, synchronized assignment methods.
  - **Abstraction**: Base abstract `User` class for identity and permission inheritance.
  - **Inheritance**: `Rider` and `Customer` extend abstract `User`.
  - **Polymorphism**: Dynamic method dispatch and role interfaces.
- **Clean Enterprise Architecture**:
  - `com.swiftserve.model` (`User`, `Rider`, `Customer`, `Order`, `Zone`, `Restaurant`)
  - `com.swiftserve.algorithm` (`BFSService`, `BFSGraphSolver`)
  - `com.swiftserve.service` (`RiderAssignmentService`, `OrderService`, `ETAService`)
  - `com.swiftserve.repository` (`CustomerRepository`, `OrderRepository`, `RiderRepository`)
  - `com.swiftserve.controller` (`OrderController`, `RiderController`)
  - `com.swiftserve.config` (`DatabaseConnection` via JDBC Singleton)

### 5. Python / Machine Learning (ETA Regression)
- **Multivariate Linear Regression**:
  $$\text{ETA} = b_0 + b_1 \cdot \text{distance} + b_2 \cdot \text{time\_of\_day} + b_3 \cdot \text{traffic\_level} + b_4 \cdot \text{weather}$$
- **Training Algorithm**: Ordinary Least Squares (OLS) closed-form matrix solution $(X^T X)^{-1} X^T Y$.
- **Features**:
  - $X_1$: `distance_km` (numerical)
  - $X_2$: `time_of_day` (Ordinal Encoded: Morning=0, Afternoon=1, Evening=2, Night=3)
  - $X_3$: `traffic_level` (Low=0, Medium=1, High=2)
  - $X_4$: `weather_condition` (Clear=0, Rain=1, Storm=2)
- **True Evaluated Metrics**:
  - Calculated directly on 120+ historical trips ($R^2$, MAE, RMSE).
- **Files**: Python training scripts (`train_model.py`, `predict_eta.py`, `requirements.txt`).

---

## 🖥️ Application Pages Overview

1. **Customer Home**: Food delivery portal with search, category tabs, restaurant cards, popular dishes, location indicator, cart, and live tracking.
2. **Restaurant / Menu**: Restaurant banner, cuisine tags, menu items with veg/non-veg tags, prices, add-to-cart buttons with quantity counters.
3. **Checkout**: Order summary, address confirmation, payment method selector (UPI, Card, COD), auto-run BFS toggle, "Place Order" button.
4. **Order Tracking**: Real-time progress timeline (Order Placed ➔ Accepted ➔ Preparing ➔ Rider Assigned ➔ Picked Up ➔ Out for Delivery ➔ Delivered), live ETA countdown card, rider details, simulation advancement buttons.
5. **Rider Dashboard**: Status toggle (`AVAILABLE`, `BUSY`, `OFFLINE`), active delivery pipeline, trip progress actions, and trip history.
6. **Admin Dashboard**: Operational control tower, KPI summary cards, orders-per-hour and status distribution charts, fleet workload stats, order management table.
7. **Smart Rider Assignment**: Visual dispatch console allowing manual or automated BFS dispatch with traversed route output.
8. **ETA Machine Learning Lab**: Interactive predictor with distance slider, traffic/weather toggles, formula breakdown, evaluation metrics, and Python script viewer.
9. **ADSA BFS Visualizer**: Interactive 2D graph diagram of zones A–J, start zone selector, queue inspection, step-by-step or autoplay BFS animation, and complexity analysis.
10. **DBMS & SQL Studio**: Live 8-table browser with search, interactive ER diagram, DMGT mathematical relations, and interactive SQL console.
11. **Academic Syllabus & Viva Guide**: Comprehensive viva-voce questions and answers mapping each subject to its implementation in code.
12. **Project Demo Mode (9-Step Pipeline)**: Step-by-step automated presentation mode for project reviews and professor demonstrations.

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
