import React, { useState } from 'react';
import {
  Cpu,
  Bike,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MapPin,
  Clock,
  Navigation,
  Network,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { BFSResult } from '../types';

export const SmartRiderAssignment: React.FC = () => {
  const {
    orders,
    restaurants,
    riders,
    zones,
    assignRiderViaBFS,
    lastBfsResult
  } = useDatabase();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find(o => !o.assignedRiderId)?.orderId || orders[0]?.orderId || ''
  );
  const [isRunning, setIsRunning] = useState(false);
  const [localBfsResult, setLocalBfsResult] = useState<BFSResult | null>(lastBfsResult);

  const selectedOrder = orders.find(o => o.orderId === selectedOrderId) || orders[0];
  const restaurant = selectedOrder
    ? restaurants.find(r => r.restaurantId === selectedOrder.restaurantId)
    : null;
  const startZone = restaurant ? restaurant.zoneId : 'ZONE_A';

  // Available riders list
  const availableRiders = riders.filter(r => r.status === 'AVAILABLE' && r.currentOrders === 0);

  const handleRunDispatch = async () => {
    if (!selectedOrder) return;
    setIsRunning(true);
    try {
      const { bfsResult } = await assignRiderViaBFS(selectedOrder.orderId);
      setLocalBfsResult(bfsResult);
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resultToDisplay = localBfsResult || lastBfsResult;

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Overview */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30">
              ADSA BFS DISPATCH ENGINE
            </span>
            <span className="text-xs text-slate-400">• Level-by-Level Graph Search</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Smart Rider Assignment</h1>
          <p className="text-xs text-slate-400">
            Automated dispatch resolving nearest available rider via Breadth-First Search on interconnected city zones.
          </p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Target Order:</span>
          <select
            value={selectedOrderId}
            onChange={e => {
              setSelectedOrderId(e.target.value);
              setLocalBfsResult(null);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
          >
            {orders.map(o => (
              <option key={o.orderId} value={o.orderId}>
                #{o.orderId} ({o.orderStatus}) - {o.assignedRiderId ? 'Assigned' : 'UNASSIGNED'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Context & Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order context & candidate riders */}
        <div className="space-y-6">
          {/* Target Order Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-700/80 pb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Order Context for Assignment</span>
            </h3>

            {selectedOrder && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-amber-400">#{selectedOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Restaurant:</span>
                  <span className="font-semibold text-white">{restaurant?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Restaurant Zone (BFS Root):</span>
                  <span className="bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                    {startZone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Drop Zone:</span>
                  <span className="font-mono text-slate-200">{selectedOrder.zoneId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Amount:</span>
                  <span className="font-mono text-white font-bold">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-mono text-amber-400 font-semibold">{selectedOrder.orderStatus}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleRunDispatch}
              disabled={isRunning}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Cpu className="w-4 h-4 text-slate-950" />
              <span>{isRunning ? 'Traversing Graph Nodes...' : 'Execute BFS Nearest Search'}</span>
            </button>
          </div>

          {/* Candidate Available Riders */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Bike className="w-4 h-4 text-emerald-400" />
                <span>Available Fleet Candidates</span>
              </h3>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full font-bold">
                {availableRiders.length} Free
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {availableRiders.map(r => (
                <div
                  key={r.riderId}
                  className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{r.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Zone: <strong className="text-amber-400 font-mono">{r.currentZoneId}</strong> • ★ {r.rating}
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                    READY
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns (2 cols): BFS Step Traversal, Selected Rider Card, Complexity Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Result Card */}
          {resultToDisplay?.assignedRider ? (
            <div className="bg-gradient-to-br from-emerald-500/20 via-slate-800 to-slate-900 rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Rider Assigned Successfully</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Execution Latency: {resultToDisplay.executionTimeMs} ms
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-xl flex items-center justify-center">
                    {resultToDisplay.assignedRider.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {resultToDisplay.assignedRider.name}
                    </h4>
                    <p className="text-xs text-amber-400 font-mono">
                      Located in Zone {resultToDisplay.assignedRider.currentZoneId} • {resultToDisplay.assignedRider.vehicleType}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="text-xs text-slate-400">Transit Distance to Restaurant:</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {resultToDisplay.distanceKm} km
                  </div>
                </div>
              </div>

              {/* Path Traversed */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-semibold">BFS Traversal Route Path:</span>
                <div className="flex items-center space-x-2 font-mono text-amber-300 font-bold overflow-x-auto py-1">
                  {resultToDisplay.routePath.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                        {node}
                      </span>
                      {i < resultToDisplay.routePath.length - 1 && <span>➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
                <span>Method: <strong>BFS Level-by-Level Shortest Reachable Search</strong></span>
                <span className="text-emerald-400 font-mono font-semibold">Rider status updated to BUSY</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Network className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">Ready to Execute BFS Assignment</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click &ldquo;Execute BFS Nearest Search&rdquo; above to run the Breadth-First Search algorithm on the zone adjacency graph.
              </p>
            </div>
          )}

          {/* BFS Step Execution Logs */}
          {resultToDisplay?.steps && (
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Network className="w-4 h-4 text-indigo-400" />
                  <span>BFS Traversal Trace &amp; Queue Log</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {resultToDisplay.steps.length} traversal steps
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {resultToDisplay.steps.map(step => (
                  <div
                    key={step.stepIndex}
                    className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-amber-400 font-bold">Step #{step.stepIndex}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Current Node: <strong className="text-white">{step.currentNode}</strong>
                      </span>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed font-mono">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                      <span>Queue: [{step.queue.join(', ')}]</span>
                      <span>•</span>
                      <span>Visited: {`{${step.visited.join(', ')}}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theoretical Complexity Panel */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-700/80 pb-3">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Algorithm Complexity &amp; Academic Explanation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Time Complexity:</span>
                <div className="text-lg font-black text-amber-400 font-mono">O(V + E)</div>
                <p className="text-[11px] text-slate-400">
                  Where V is the number of city zones (10 vertices) and E is the number of road connections (18 edges). Each vertex and edge is evaluated at most once.
                </p>
              </div>

              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-slate-400">Space Complexity:</span>
                <div className="text-lg font-black text-cyan-400 font-mono">O(V)</div>
                <p className="text-[11px] text-slate-400">
                  Maintains a FIFO queue, a Visited Set, and distance mappings bounded linearly by the total number of zones V.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
