import React from 'react';
import {
  Bike,
  Package,
  CheckCircle,
  Clock,
  Navigation,
  Phone,
  MapPin,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { RiderStatus, OrderStatus } from '../types';

export const RiderDashboard: React.FC = () => {
  const {
    riders,
    currentRider,
    setCurrentRiderById,
    orders,
    restaurants,
    customers,
    updateOrderStatus,
    setRiderStatus
  } = useDatabase();

  // Find orders assigned to this rider
  const assignedOrders = orders.filter(o => o.assignedRiderId === currentRider.riderId);
  const activeOrders = assignedOrders.filter(
    o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  );
  const completedOrders = assignedOrders.filter(o => o.orderStatus === 'DELIVERED');

  const totalDistance = assignedOrders.reduce((sum, o) => sum + o.distanceKm, 0);
  const avgEta = assignedOrders.length > 0
    ? Math.round(assignedOrders.reduce((sum, o) => sum + o.etaMinutes, 0) / assignedOrders.length)
    : 28;

  const handleStatusChange = (newStatus: RiderStatus) => {
    setRiderStatus(currentRider.riderId, newStatus);
  };

  const handleAdvanceOrderStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'DELIVERED';
    let note = '';

    if (currentStatus === 'RIDER_ASSIGNED') {
      nextStatus = 'RIDER_PICKED_UP';
      note = `Rider ${currentRider.name} arrived at restaurant and picked up package.`;
    } else if (currentStatus === 'RIDER_PICKED_UP') {
      nextStatus = 'OUT_FOR_DELIVERY';
      note = `Rider ${currentRider.name} is on transit towards customer address.`;
    } else if (currentStatus === 'OUT_FOR_DELIVERY') {
      nextStatus = 'DELIVERED';
      note = `Order safely handed over to customer.`;
    }

    updateOrderStatus(orderId, nextStatus, note);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Profile & Status Bar */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
            <Bike className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">{currentRider.name}</h1>
              <span className="text-xs bg-slate-900 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                {currentRider.vehicleType.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assigned Zone: <strong className="text-white">{currentRider.currentZoneId}</strong> • Phone: {currentRider.phone} • Rating: ★ {currentRider.rating}
            </p>
          </div>
        </div>

        {/* Switch Rider Persona & Status Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Switch rider dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Rider:</span>
            <select
              value={currentRider.riderId}
              onChange={e => setCurrentRiderById(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {riders.map(r => (
                <option key={r.riderId} value={r.riderId}>
                  {r.name} ({r.currentZoneId}) - {r.status}
                </option>
              ))}
            </select>
          </div>

          {/* Status Buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => handleStatusChange('AVAILABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentRider.status === 'AVAILABLE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AVAILABLE
            </button>
            <button
              onClick={() => handleStatusChange('BUSY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentRider.status === 'BUSY'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BUSY
            </button>
            <button
              onClick={() => handleStatusChange('OFFLINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentRider.status === 'OFFLINE'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OFFLINE
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Today's Trips</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {currentRider.totalDeliveries}
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold">Total Career Trips</p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Orders</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {activeOrders.length}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Currently in transit</p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {completedOrders.length}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Delivered today</p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Distance</span>
            <Navigation className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {totalDistance.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Zone graph transit</p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-md space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Delivery</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {avgEta} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">Within ML target</p>
        </div>
      </div>

      {/* Active Deliveries Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>Current Assigned Task Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400">
              Orders dispatched to {currentRider.name} via BFS Nearest Neighbor Algorithm
            </p>
          </div>
          <span className="text-xs bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700 font-mono">
            {activeOrders.length} Pending Actions
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">No Active Assigned Deliveries</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You are currently marked as {currentRider.status}. The automatic BFS dispatch system will route orders in your vicinity.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map(order => {
              const rest = restaurants.find(r => r.restaurantId === order.restaurantId);
              const cust = customers.find(c => c.customerId === order.customerId);

              return (
                <div
                  key={order.orderId}
                  className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4 hover:border-amber-500/40 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-extrabold text-white font-mono">
                        #{order.orderId}
                      </span>
                      <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-300">
                      <span className="font-mono text-amber-400 font-bold">${order.totalAmount.toFixed(2)}</span>
                      <span>•</span>
                      <span>ETA: <strong className="text-white font-mono">{order.etaMinutes} mins</strong></span>
                      <span>•</span>
                      <span>Distance: <strong className="text-white font-mono">{order.distanceKm} km</strong></span>
                    </div>
                  </div>

                  {/* Route Leg: Pickup & Drop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Pickup */}
                    <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>1. Pickup from Restaurant ({rest?.zoneId})</span>
                      </div>
                      <div className="font-semibold text-white text-sm">{rest?.name}</div>
                      <div className="text-slate-400">{rest?.address}</div>
                    </div>

                    {/* Drop */}
                    <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>2. Delivery Destination ({cust?.zoneId})</span>
                      </div>
                      <div className="font-semibold text-white text-sm">{cust?.name}</div>
                      <div className="text-slate-400">{order.deliveryAddress}</div>
                      <div className="text-slate-400 text-[11px]">Phone: {cust?.phone}</div>
                    </div>
                  </div>

                  {/* Actions for Rider */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400 italic">
                      Special note: {order.notes || 'None'}
                    </div>

                    <div className="flex items-center space-x-2">
                      {order.orderStatus === 'RIDER_ASSIGNED' && (
                        <button
                          onClick={() => handleAdvanceOrderStatus(order.orderId, order.orderStatus)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition"
                        >
                          <span>Confirm Pickup from Restaurant</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {order.orderStatus === 'RIDER_PICKED_UP' && (
                        <button
                          onClick={() => handleAdvanceOrderStatus(order.orderId, order.orderStatus)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Start Delivery to Customer</span>
                        </button>
                      )}

                      {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => handleAdvanceOrderStatus(order.orderId, order.orderStatus)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark Delivered (Complete Trip)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trip History for this Rider */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-700/80 pb-3">
          <span>Recent Delivery History for {currentRider.name}</span>
          <span className="text-xs text-slate-400 font-mono">DBMS Table: trip_history</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono">
              <tr>
                <th className="p-2.5">Trip ID</th>
                <th className="p-2.5">Order</th>
                <th className="p-2.5">Distance (km)</th>
                <th className="p-2.5">Delivery Time</th>
                <th className="p-2.5">Traffic</th>
                <th className="p-2.5">Weather</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {completedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    No completed trips yet in this session. Deliver an order above to populate!
                  </td>
                </tr>
              ) : (
                completedOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-slate-700/40">
                    <td className="p-2.5 font-mono text-amber-400">TRIP_{o.orderId.replace('ORD_', '')}</td>
                    <td className="p-2.5 font-mono">{o.orderId}</td>
                    <td className="p-2.5 font-mono">{o.distanceKm} km</td>
                    <td className="p-2.5 font-mono text-emerald-400">{o.etaMinutes} mins</td>
                    <td className="p-2.5 font-mono">MEDIUM</td>
                    <td className="p-2.5 font-mono">CLEAR</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
