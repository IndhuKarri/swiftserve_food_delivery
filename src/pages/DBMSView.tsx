import React, { useState } from 'react';
import {
  Database,
  Table,
  GitFork,
  Code2,
  Search,
  CheckCircle,
  Download,
  Terminal,
  Play,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const DBMSView: React.FC = () => {
  const {
    customers,
    restaurants,
    menuItems,
    riders,
    orders,
    zones,
    zoneConnections,
    tripHistory
  } = useDatabase();

  const [activeTab, setActiveTab] = useState<'tables' | 'er' | 'dmgt' | 'sql'>('tables');
  const [selectedTable, setSelectedTable] = useState<string>('customers');
  const [tableSearch, setTableSearch] = useState<string>('');

  // SQL console state
  const [sqlQuery, setSqlQuery] = useState<string>(
    `SELECT o.order_id, c.name AS customer, r.name AS restaurant, rd.name AS rider, o.total_amount, o.eta_minutes
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN riders rd ON o.assigned_rider_id = rd.rider_id
ORDER BY o.order_time DESC;`
  );
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  // Execute demo SQL queries
  const handleRunQuery = () => {
    // Execute matching relational join in JS memory to mirror relational DBMS
    const joined = orders.map(o => {
      const c = customers.find(cust => cust.customerId === o.customerId);
      const r = restaurants.find(rest => rest.restaurantId === o.restaurantId);
      const rd = riders.find(rid => rid.riderId === o.assignedRiderId);
      return {
        order_id: o.orderId,
        customer: c?.name || o.customerId,
        restaurant: r?.name || o.restaurantId,
        rider: rd?.name || 'UNASSIGNED',
        total_amount: `$${o.totalAmount.toFixed(2)}`,
        eta_minutes: `${o.etaMinutes} mins`,
        order_status: o.orderStatus
      };
    });
    setQueryResult(joined);
  };

  // Helper to render table contents
  const renderTableData = () => {
    switch (selectedTable) {
      case 'customers':
        return {
          columns: ['customer_id (PK)', 'name', 'phone', 'email', 'zone_id (FK)', 'address'],
          rows: customers.map(c => [c.customerId, c.name, c.phone, c.email, c.zoneId, c.address])
        };
      case 'restaurants':
        return {
          columns: ['restaurant_id (PK)', 'name', 'cuisine', 'zone_id (FK)', 'rating', 'prep_mins', 'status'],
          rows: restaurants.map(r => [r.restaurantId, r.name, r.cuisine, r.zoneId, `★ ${r.rating}`, `${r.prepTimeMinutes}m`, r.status])
        };
      case 'riders':
        return {
          columns: ['rider_id (PK)', 'name', 'vehicle_type', 'current_zone_id (FK)', 'status', 'deliveries', 'orders'],
          rows: riders.map(r => [r.riderId, r.name, r.vehicleType, r.currentZoneId, r.status, r.totalDeliveries, r.currentOrders])
        };
      case 'orders':
        return {
          columns: ['order_id (PK)', 'customer_id (FK)', 'restaurant_id (FK)', 'assigned_rider_id (FK)', 'order_status', 'eta_mins', 'total'],
          rows: orders.map(o => [o.orderId, o.customerId, o.restaurantId, o.assignedRiderId || 'NULL', o.orderStatus, `${o.etaMinutes}m`, `$${o.totalAmount}`])
        };
      case 'zones':
        return {
          columns: ['zone_id (PK)', 'zone_name', 'code', 'pos_x', 'pos_y', 'description'],
          rows: zones.map(z => [z.zoneId, z.zoneName, z.code, z.x, z.y, z.description || ''])
        };
      case 'zone_connections':
        return {
          columns: ['connection_id (PK)', 'zone_a (FK)', 'zone_b (FK)', 'distance_km'],
          rows: zoneConnections.map(zc => [zc.connectionId, zc.zoneA, zc.zoneB, `${zc.distanceKm} km`])
        };
      case 'trip_history':
        return {
          columns: ['trip_id (PK)', 'rider_id (FK)', 'order_id (FK)', 'distance_km', 'time_of_day', 'traffic', 'weather', 'actual_minutes'],
          rows: tripHistory.slice(0, 15).map(t => [t.tripId, t.riderId, t.orderId, `${t.distanceKm}km`, t.timeOfDay, t.trafficLevel, t.weatherCondition, `${t.actualDeliveryMinutes}m`])
        };
      default:
        return { columns: [], rows: [] };
    }
  };

  const currentTableData = renderTableData();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-cyan-500/20 text-cyan-300 font-mono px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              RELATIONAL DBMS &amp; DMGT STUDIO
            </span>
            <span className="text-xs text-slate-400">• 3NF Schema &amp; Relations</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Database &amp; Mathematical Relations</h1>
          <p className="text-xs text-slate-400">
            Relational entities, foreign key constraints, ER diagram relationships, and SQL queries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'tables' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table Browser</span>
          </button>
          <button
            onClick={() => setActiveTab('er')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'er' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>ER Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('dmgt')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'dmgt' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DMGT Relations</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'sql' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SQL Console</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TABLE BROWSER */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table Selector (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-xs text-slate-400 font-semibold px-2 uppercase tracking-wider">
              Relational Tables (8)
            </span>
            <div className="bg-slate-800/80 rounded-2xl p-2 border border-slate-700 space-y-1">
              {[
                { id: 'customers', label: 'customers', count: customers.length },
                { id: 'restaurants', label: 'restaurants', count: restaurants.length },
                { id: 'riders', label: 'riders', count: riders.length },
                { id: 'orders', label: 'orders', count: orders.length },
                { id: 'zones', label: 'zones', count: zones.length },
                { id: 'zone_connections', label: 'zone_connections', count: zoneConnections.length },
                { id: 'trip_history', label: 'trip_history (ML)', count: tripHistory.length }
              ].map(tbl => (
                <button
                  key={tbl.id}
                  onClick={() => setSelectedTable(tbl.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                    selectedTable === tbl.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <span>{tbl.label}</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-slate-400">
                    {tbl.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Data Grid (9 cols) */}
          <div className="lg:col-span-9 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  <span>TABLE: {selectedTable}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Showing records matching third normal form (3NF) relational design
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-cyan-400">
                  <tr>
                    {currentTableData.columns.map((col, idx) => (
                      <th key={idx} className="p-3 border-b border-slate-700 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {currentTableData.rows
                    .filter(row =>
                      row.some(val =>
                        String(val).toLowerCase().includes(tableSearch.toLowerCase())
                      )
                    )
                    .map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-700/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL ER DIAGRAM */}
      {activeTab === 'er' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
          <div className="border-b border-slate-700/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <GitFork className="w-5 h-5 text-cyan-400" />
              <span>Entity Relationship (ER) Model &amp; Cardinality</span>
            </h3>
            <p className="text-xs text-slate-400">
              Formal relationship cardinalities between tables with primary and foreign key mapping.
            </p>
          </div>

          {/* Visual ER Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Box 1: Customers */}
            <div className="bg-slate-900 rounded-xl p-4 border border-cyan-500/50 space-y-2 shadow-lg">
              <div className="font-bold text-cyan-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>CUSTOMERS</span>
                <span className="text-[10px] text-slate-500">1</span>
              </div>
              <div className="text-amber-300 font-semibold">• customer_id (PK)</div>
              <div className="text-slate-300">• name</div>
              <div className="text-slate-300">• phone</div>
              <div className="text-slate-300">• email</div>
              <div className="text-cyan-300 font-semibold">• zone_id (FK ➔ ZONES)</div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                Relationship: 1 Customer ➔ Many Orders (1:N)
              </div>
            </div>

            {/* Box 2: Restaurants */}
            <div className="bg-slate-900 rounded-xl p-4 border border-orange-500/50 space-y-2 shadow-lg">
              <div className="font-bold text-orange-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>RESTAURANTS</span>
                <span className="text-[10px] text-slate-500">1</span>
              </div>
              <div className="text-amber-300 font-semibold">• restaurant_id (PK)</div>
              <div className="text-slate-300">• name</div>
              <div className="text-cyan-300 font-semibold">• zone_id (FK ➔ ZONES)</div>
              <div className="text-slate-300">• latitude, longitude</div>
              <div className="text-slate-300">• rating, cuisine</div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                Relationship: 1 Restaurant ➔ Many Orders (1:N)
              </div>
            </div>

            {/* Box 3: Orders (Central Fact Entity) */}
            <div className="bg-slate-900 rounded-xl p-4 border-2 border-amber-500 space-y-2 shadow-xl">
              <div className="font-bold text-amber-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>ORDERS (Fact Table)</span>
                <span className="text-[10px] text-amber-300">CENTRAL</span>
              </div>
              <div className="text-amber-300 font-semibold">• order_id (PK)</div>
              <div className="text-cyan-300 font-semibold">• customer_id (FK)</div>
              <div className="text-orange-300 font-semibold">• restaurant_id (FK)</div>
              <div className="text-emerald-300 font-semibold">• assigned_rider_id (FK)</div>
              <div className="text-slate-300">• order_status, total_amount</div>
              <div className="text-slate-300">• eta_minutes, distance_km</div>
              <div className="pt-2 text-[10px] text-amber-300 border-t border-slate-800">
                Foreign Keys: customer_id, restaurant_id, rider_id
              </div>
            </div>

            {/* Box 4: Riders */}
            <div className="bg-slate-900 rounded-xl p-4 border border-emerald-500/50 space-y-2 shadow-lg">
              <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>RIDERS</span>
                <span className="text-[10px] text-slate-500">1</span>
              </div>
              <div className="text-amber-300 font-semibold">• rider_id (PK)</div>
              <div className="text-slate-300">• name, phone</div>
              <div className="text-slate-300">• vehicle_type</div>
              <div className="text-cyan-300 font-semibold">• current_zone_id (FK)</div>
              <div className="text-slate-300">• status, total_deliveries</div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                Relationship: 1 Rider ➔ Many Orders (1:N)
              </div>
            </div>

            {/* Box 5: Zones (Graph Vertices) */}
            <div className="bg-slate-900 rounded-xl p-4 border border-indigo-500/50 space-y-2 shadow-lg">
              <div className="font-bold text-indigo-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>ZONES (Nodes)</span>
                <span className="text-[10px] text-slate-500">GRAPH</span>
              </div>
              <div className="text-amber-300 font-semibold">• zone_id (PK)</div>
              <div className="text-slate-300">• zone_name, code</div>
              <div className="text-slate-300">• pos_x, pos_y</div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                Parent of Customers, Riders &amp; Restaurants
              </div>
            </div>

            {/* Box 6: Zone Connections (Graph Edges) */}
            <div className="bg-slate-900 rounded-xl p-4 border border-indigo-500/50 space-y-2 shadow-lg">
              <div className="font-bold text-indigo-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>ZONE_CONNECTIONS</span>
                <span className="text-[10px] text-slate-500">EDGES</span>
              </div>
              <div className="text-amber-300 font-semibold">• connection_id (PK)</div>
              <div className="text-indigo-300 font-semibold">• zone_a (FK ➔ ZONES)</div>
              <div className="text-indigo-300 font-semibold">• zone_b (FK ➔ ZONES)</div>
              <div className="text-slate-300">• distance_km (Weight)</div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                Undirected Graph Adjacency representation
              </div>
            </div>

            {/* Box 7: Order Items */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-2 shadow-lg">
              <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 flex justify-between">
                <span>ORDER_ITEMS</span>
                <span className="text-[10px] text-slate-500">N</span>
              </div>
              <div className="text-amber-300 font-semibold">• order_item_id (PK)</div>
              <div className="text-amber-300 font-semibold">• order_id (FK ➔ ORDERS)</div>
              <div className="text-slate-300">• item_name, quantity, price</div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                Weak entity dependent on Order (CASCADE delete)
              </div>
            </div>

            {/* Box 8: Trip History */}
            <div className="bg-slate-900 rounded-xl p-4 border border-rose-500/50 space-y-2 shadow-lg">
              <div className="font-bold text-rose-400 border-b border-slate-700 pb-1 flex justify-between">
                <span>TRIP_HISTORY</span>
                <span className="text-[10px] text-slate-500">ML LOG</span>
              </div>
              <div className="text-amber-300 font-semibold">• trip_id (PK)</div>
              <div className="text-emerald-300 font-semibold">• rider_id (FK)</div>
              <div className="text-slate-300">• distance_km, time_of_day</div>
              <div className="text-slate-300">• actual_delivery_minutes</div>
              <div className="text-slate-300">• traffic_level, weather</div>
              <div className="pt-2 text-[10px] text-rose-300 border-t border-slate-800">
                Training data for Machine Learning Regression
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DMGT MATHEMATICAL RELATIONS */}
      {activeTab === 'dmgt' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
          <div className="border-b border-slate-700/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>DMGT: Discrete Mathematics &amp; Relational Representation</span>
            </h3>
            <p className="text-xs text-slate-400">
              Formal definition of Relations as Cartesian subsets: R ⊆ D1 × D2 × ... × Dn
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="text-amber-400 font-bold text-sm">1. Mathematical Schema Definition</h4>
              <p className="text-slate-300 leading-relaxed">
                In relational calculus and discrete mathematics, a relation schema is denoted as:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg text-emerald-400 border border-slate-800">
                Customer(Customer_ID, Name, Phone, Zone_ID)<br />
                Restaurant(Restaurant_ID, Name, Zone_ID)<br />
                Rider(Rider_ID, Name, Zone_ID, Status)<br />
                Order(Order_ID, Customer_ID, Restaurant_ID, Rider_ID, Status, ETA)<br />
                Zone(Zone_ID, Zone_Name)<br />
                ZoneConnection(Zone_A, Zone_B, Distance_Km)
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="text-cyan-400 font-bold text-sm">2. Binary Relation &amp; Graph Equivalence</h4>
              <p className="text-slate-300 leading-relaxed">
                Let V = &#123; Zone_A, Zone_B, ..., Zone_J &#125; be the set of zones. The adjacency connection between zones is a symmetric binary relation R on V:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg text-cyan-300 border border-slate-800">
                R = &#123; (u, v) ∈ V × V | there exists a direct road connection between zone u and zone v &#125;<br />
                Symmetry: (u, v) ∈ R ⇔ (v, u) ∈ R<br />
                Weight Function: w: R ➔ ℝ+ where w(u, v) = distance_km
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="text-indigo-400 font-bold text-sm">3. Functional Dependencies &amp; 3NF</h4>
              <p className="text-slate-300 leading-relaxed">
                The database satisfies the Third Normal Form (3NF) because:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Every non-prime attribute is non-transitively dependent on the primary key.</li>
                <li>Customer_ID ➔ Name, Phone, Email, Zone_ID (1NF, 2NF, 3NF hold).</li>
                <li>Zone_ID ➔ Zone_Name, Code is decoupled into a dedicated Zone entity to prevent update anomalies.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SQL CONSOLE */}
      {activeTab === 'sql' && (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>Interactive SQL Query Console</span>
              </h3>
              <p className="text-xs text-slate-400">
                Execute relational queries across Orders, Customers, Restaurants, and Riders.
              </p>
            </div>

            <button
              onClick={handleRunQuery}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute SQL Query</span>
            </button>
          </div>

          {/* SQL Editor */}
          <div className="relative">
            <textarea
              rows={5}
              value={sqlQuery}
              onChange={e => setSqlQuery(e.target.value)}
              className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Query Results */}
          {queryResult && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Query Output Result:</span>
                <span className="font-mono text-slate-400">{queryResult.length} rows returned in 2.1 ms</span>
              </div>

              <div className="overflow-x-auto max-h-60 overflow-y-auto bg-slate-950 rounded-xl border border-slate-700">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      {Object.keys(queryResult[0] || {}).map(col => (
                        <th key={col} className="p-2.5 border-b border-slate-800">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        {Object.values(row).map((val: any, vIdx) => (
                          <td key={vIdx} className="p-2.5 whitespace-nowrap">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
