import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  MapPin,
  Store,
  ChevronRight,
  AlertCircle,
  Play,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Order, OrderStatus } from '../types';

interface OrderTrackingProps {
  onNavigateToBfs: () => void;
  onNavigateToRider: () => void;
}

const ORDER_STAGES: Array<{ key: OrderStatus; label: string; desc: string }> = [
  { key: 'ORDER_PLACED', label: 'Order Placed', desc: 'Order transmitted to restaurant' },
  { key: 'RESTAURANT_ACCEPTED', label: 'Restaurant Accepted', desc: 'Kitchen acknowledged order' },
  { key: 'PREPARING_FOOD', label: 'Preparing Food', desc: 'Chefs are cooking the meal' },
  { key: 'RIDER_ASSIGNED', label: 'Rider Assigned', desc: 'BFS found nearest available rider' },
  { key: 'RIDER_PICKED_UP', label: 'Rider Picked Up', desc: 'Food collected from restaurant' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider heading to destination' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your hot meal!' }
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  onNavigateToBfs,
  onNavigateToRider
}) => {
  const {
    orders,
    activeOrder,
    setActiveOrder,
    restaurants,
    riders,
    customers,
    updateOrderStatus,
    assignRiderViaBFS,
    statusHistory
  } = useDatabase();

  const [isAssigning, setIsAssigning] = useState(false);

  // If no active order, pick the most recent one
  const currentOrder = activeOrder || orders[0];

  if (!currentOrder) {
    return (
      <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-700 p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Orders Yet</h2>
        <p className="text-sm text-slate-400">Place an order from the Customer Home to track delivery status.</p>
      </div>
    );
  }

  const restaurant = restaurants.find(r => r.restaurantId === currentOrder.restaurantId);
  const rider = currentOrder.assignedRiderId
    ? riders.find(r => r.riderId === currentOrder.assignedRiderId)
    : null;
  const customer = customers.find(c => c.customerId === currentOrder.customerId);

  const currentStageIndex = ORDER_STAGES.findIndex(s => s.key === currentOrder.orderStatus);

  // Filter history for this order
  const orderLogs = statusHistory.filter(h => h.orderId === currentOrder.orderId);

  // Simulation step advancing
  const handleAdvanceNextStage = () => {
    if (currentStageIndex < ORDER_STAGES.length - 1) {
      const nextStage = ORDER_STAGES[currentStageIndex + 1].key;
      updateOrderStatus(currentOrder.orderId, nextStage, `Progressed to ${nextStage}`);
    }
  };

  const handleRunManualBFS = async () => {
    setIsAssigning(true);
    try {
      await assignRiderViaBFS(currentOrder.orderId);
    } catch (err: any) {
      alert(`BFS Assignment: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30">
              LIVE TRACKING CONSOLE
            </span>
            <span className="text-xs text-slate-400">• Updated Real-time</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Order #{currentOrder.orderId}
          </h1>
          <p className="text-xs text-slate-400">
            Placed at {currentOrder.orderTime} • {customer?.name} ({customer?.zoneId})
          </p>
        </div>

        {/* Order Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Active Order:</span>
          <select
            value={currentOrder.orderId}
            onChange={e => {
              const selected = orders.find(o => o.orderId === e.target.value);
              if (selected) setActiveOrder(selected);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            {orders.map(o => (
              <option key={o.orderId} value={o.orderId}>
                #{o.orderId} - {o.orderStatus.replace(/_/g, ' ')} (${o.totalAmount})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Timeline & Map, Right ETA and Rider Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Delivery Status Timeline & Live Route */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Progress Card */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-amber-400" />
                <span>Delivery Fulfillment Pipeline</span>
              </h2>

              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                currentOrder.orderStatus === 'DELIVERED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
              }`}>
                {currentOrder.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
              {ORDER_STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="relative flex items-start space-x-4">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 ring-offset-2 ring-offset-slate-900 shadow-lg'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-amber-400'
                              : isPassed
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Simulation Controls */}
            <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                <span>Academic Simulator Controls:</span>
              </div>

              <div className="flex items-center space-x-2">
                {!currentOrder.assignedRiderId && (
                  <button
                    onClick={handleRunManualBFS}
                    disabled={isAssigning}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Run BFS Rider Assignment</span>
                  </button>
                )}

                {currentOrder.orderStatus !== 'DELIVERED' && (
                  <button
                    onClick={handleAdvanceNextStage}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Simulate Next Stage</span>
                  </button>
                )}

                {currentOrder.orderStatus === 'DELIVERED' && (
                  <button
                    onClick={() => updateOrderStatus(currentOrder.orderId, 'ORDER_PLACED', 'Order simulation reset')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-test Workflow</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Audit Trail & Status History */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-700/80 pb-3">
              <span>Database Audit Trail (`order_status_history`)</span>
              <span className="text-xs text-slate-400 font-mono">{orderLogs.length} events logged</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {orderLogs.map(log => (
                <div
                  key={log.statusId}
                  className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-start justify-between text-xs space-x-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-amber-400 font-semibold">{log.status}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{log.description}</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                    COMMITTED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live ETA Card, Assigned Rider, Order Summary */}
        <div className="space-y-6">
          {/* Estimated Delivery Time Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-900 rounded-2xl p-6 border border-amber-500/40 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Estimated Delivery Time</span>
              </span>
              <span className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                ML PREDICTED
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-white font-mono tracking-tight">
                {currentOrder.etaMinutes}
              </span>
              <span className="text-xl font-bold text-amber-400">mins</span>
            </div>

            <p className="text-xs text-slate-300">
              Calculated using Multivariate Linear Regression based on {currentOrder.distanceKm} km zone distance and current traffic.
            </p>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Transit Distance:</span>
              <span className="font-bold text-white font-mono">{currentOrder.distanceKm} km</span>
            </div>
          </div>

          {/* Assigned Rider Profile Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Bike className="w-4 h-4 text-amber-400" />
                <span>Assigned Delivery Rider</span>
              </h3>
              {rider && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  STATUS: {rider.status}
                </span>
              )}
            </div>

            {rider ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                    {rider.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">{rider.name}</h4>
                    <p className="text-xs text-amber-400 font-mono">
                      {rider.vehicleType.replace(/_/g, ' ')} • Zone {rider.currentZoneId}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">★ {rider.rating}</span>
                      <span>•</span>
                      <span>{rider.totalDeliveries} successful trips</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <a
                    href={`tel:${rider.phone}`}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Rider</span>
                  </a>
                  <button
                    onClick={onNavigateToBfs}
                    className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-amber-500/40 transition"
                  >
                    <span>View BFS Path</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                  <Bike className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-300 font-medium">Searching for nearest available rider...</p>
                <button
                  onClick={handleRunManualBFS}
                  disabled={isAssigning}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  {isAssigning ? 'Scanning Zones with BFS...' : 'Assign Rider via BFS'}
                </button>
              </div>
            )}
          </div>

          {/* Restaurant & Order Items Summary */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-700/80 pb-3">
              <Store className="w-4 h-4 text-orange-400" />
              <span>Restaurant Details</span>
            </h3>

            {restaurant && (
              <div className="text-xs space-y-1 text-slate-300">
                <div className="font-bold text-white text-sm">{restaurant.name}</div>
                <div className="text-slate-400">{restaurant.address}</div>
                <div className="text-amber-400 font-mono text-[11px] pt-1">
                  Origin Node: {restaurant.zoneId}
                </div>
              </div>
            )}

            <div className="border-t border-slate-700/80 pt-3 space-y-2">
              <div className="text-xs font-semibold text-white">Items in Order:</div>
              <div className="space-y-1 text-xs">
                {currentOrder.items.map(item => (
                  <div key={item.orderItemId} className="flex justify-between text-slate-300">
                    <span>
                      {item.itemName} <span className="text-slate-500">x{item.quantity}</span>
                    </span>
                    <span className="font-mono text-amber-400">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700/80 pt-2 flex justify-between text-xs font-bold text-white">
                <span>Total Paid</span>
                <span className="font-mono text-amber-400">${currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
