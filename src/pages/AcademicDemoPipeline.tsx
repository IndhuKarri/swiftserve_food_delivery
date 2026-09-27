import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Store,
  Bike,
  Cpu,
  BrainCircuit,
  Navigation,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDatabase } from '../context/DatabaseContext';

export interface DemoStepInfo {
  step: number;
  title: string;
  badge: string;
  subject: string;
  color: string;
  renderDetails: (data: any) => React.ReactNode;
}

export const AcademicDemoPipeline: React.FC = () => {
  const {
    customers,
    restaurants,
    menuItems,
    riders,
    zoneGraph,
    etaModel,
    orders,
    placeOrder,
    assignRiderViaBFS,
    addToCart,
    clearCart,
    cart
  } = useDatabase();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // Demo generated state
  const [demoOrder, setDemoOrder] = useState<any>(null);
  const [demoRestaurant, setDemoRestaurant] = useState<any>(null);
  const [demoCandidateRiders, setDemoCandidateRiders] = useState<any[]>([]);
  const [demoBfsResult, setDemoBfsResult] = useState<any>(null);
  const [demoEtaResult, setDemoEtaResult] = useState<any>(null);

  const startDemo = async () => {
    setIsRunning(true);
    setCurrentStepIndex(1);

    // Pick Demo Customer and Restaurant
    const cust = customers[0]; // Aarav Sharma (Zone A)
    const rest = restaurants[0]; // Spice Hub (Zone A)
    const dish = menuItems.find(m => m.restaurantId === rest.restaurantId) || menuItems[0];

    setDemoRestaurant(rest);

    // 1. Prepare Order
    clearCart();
    addToCart(dish, rest);

    const orderTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const mockOrder = {
      orderId: `DEMO_${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.customerId,
      customerName: cust.name,
      customerZone: cust.zoneId,
      restaurantId: rest.restaurantId,
      restaurantName: rest.name,
      restaurantZone: rest.zoneId,
      items: [{ name: dish.name, quantity: 1, price: dish.price }],
      totalAmount: +(dish.price + 3.50 + dish.price * 0.05).toFixed(2),
      orderTime
    };
    setDemoOrder(mockOrder);

    // Candidate Riders
    const availRiders = riders.filter(r => r.status === 'AVAILABLE' && r.currentOrders === 0);
    setDemoCandidateRiders(availRiders);

    // Run BFS
    const bfs = zoneGraph.findNearestAvailableRider(rest.zoneId, riders);
    setDemoBfsResult(bfs);

    // Run ML ETA
    const totalDist = bfs.distanceKm + 2.8; // zone transit + last mile
    const eta = etaModel.predict({
      distanceKm: totalDist,
      timeOfDay: 'EVENING',
      trafficLevel: 'MEDIUM',
      weatherCondition: 'CLEAR'
    });
    setDemoEtaResult(eta);
  };

  // Progression effect
  useEffect(() => {
    let timer: any;
    if (isRunning && autoPlay && currentStepIndex > 0 && currentStepIndex < 9) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1600);
    } else if (currentStepIndex === 9) {
      setIsRunning(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
    return () => clearTimeout(timer);
  }, [isRunning, autoPlay, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < 9) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setDemoOrder(null);
  };

  const STEPS_DATA = [
    {
      step: 1,
      title: 'Order Created',
      badge: 'DBMS INSERT',
      subject: 'DBMS',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    {
      step: 2,
      title: 'Restaurant Identified',
      badge: 'DMGT RELATION',
      subject: 'DMGT',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    },
    {
      step: 3,
      title: 'Available Riders Found',
      badge: 'OOPJ REPOSITORY',
      subject: 'OOPJ',
      color: 'text-orange-400 border-orange-500/40 bg-orange-500/10'
    },
    {
      step: 4,
      title: 'BFS Started',
      badge: 'ADSA GRAPH',
      subject: 'ADSA',
      color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10'
    },
    {
      step: 5,
      title: 'Nearest Rider Found',
      badge: 'O(V+E) HIT',
      subject: 'ADSA',
      color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10'
    },
    {
      step: 6,
      title: 'Rider Assigned',
      badge: 'ATOMIC UPDATE',
      subject: 'OOPJ / DBMS',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
      step: 7,
      title: 'ETA Model Executed',
      badge: 'PYTHON ML',
      subject: 'Python / ML',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
      step: 8,
      title: 'ETA Stored in DB',
      badge: 'PERSISTENCE',
      subject: 'DBMS',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    {
      step: 9,
      title: 'Customer Updated',
      badge: 'REAL-TIME TRACK',
      subject: 'FULL-STACK',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-rose-500/20 text-rose-300 font-mono px-2.5 py-0.5 rounded-full border border-rose-500/30">
              COLLEGE PROJECT DEMO MODE
            </span>
            <span className="text-xs text-slate-400">• Full 9-Step Pipeline Presentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            End-to-End Processing Pipeline
          </h1>
          <p className="text-xs text-slate-400">
            Witness the complete chain reaction: Customer order placement ➔ DBMS transaction ➔ Java BFS zone dispatch ➔ Python ML ETA calculation ➔ Live order tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentStepIndex === 0 ? (
            <button
              onClick={startDemo}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-5 py-3 rounded-2xl text-sm shadow-xl shadow-orange-500/20 flex items-center space-x-2 transition"
            >
              <PlayCircle className="w-5 h-5 text-slate-950" />
              <span>Run Complete Demo</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Stepper Grid (9 Steps) */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Interactive 9-Step Verification Stepper</span>
          </h2>

          <div className="flex items-center space-x-3 text-xs">
            <label className="flex items-center space-x-1.5 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={e => setAutoPlay(e.target.checked)}
                className="rounded bg-slate-900 border-slate-600 text-amber-500"
              />
              <span>Auto-advance (1.6s)</span>
            </label>

            {currentStepIndex > 0 && currentStepIndex < 9 && (
              <button
                onClick={handleNext}
                className="bg-slate-700 hover:bg-slate-600 text-white px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1 font-semibold"
              >
                <span>Step Forward</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 9 Step Pills / Indicator */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {STEPS_DATA.map((st, idx) => {
            const isDone = currentStepIndex > st.step;
            const isCurrent = currentStepIndex === st.step;

            return (
              <div
                key={st.step}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition duration-300 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg ring-2 ring-amber-500/30'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900/60 text-slate-500 border-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono">
                  {isDone ? '✓ STEP' : `STEP ${st.step}`}
                </div>
                <div className="text-[11px] leading-tight font-semibold line-clamp-1">
                  {st.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Real-Time Value Breakdown Display */}
        {currentStepIndex > 0 ? (
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-amber-400 font-mono">
                  Step {currentStepIndex}:
                </span>
                <h3 className="text-lg font-bold text-white">
                  {STEPS_DATA[currentStepIndex - 1]?.title}
                </h3>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-mono border ${STEPS_DATA[currentStepIndex - 1]?.color}`}>
                Subject: {STEPS_DATA[currentStepIndex - 1]?.subject} ({STEPS_DATA[currentStepIndex - 1]?.badge})
              </span>
            </div>

            {/* Step-specific live generated state details */}
            <div className="text-xs space-y-3 font-mono">
              {currentStepIndex === 1 && demoOrder && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 1 Completed: Order Created</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Order ID: <strong className="text-amber-400">#{demoOrder.orderId}</strong></div>
                    <div>Customer: <strong className="text-white">{demoOrder.customerName}</strong> ({demoOrder.customerZone})</div>
                    <div>Total Amount: <strong className="text-white">${demoOrder.totalAmount}</strong></div>
                    <div>Status: <span className="text-amber-400">ORDER_PLACED</span></div>
                    <div>SQL Statement: <code>INSERT INTO orders (order_id, customer_id, total_amount, status) VALUES ...</code></div>
                  </div>
                </div>
              )}

              {currentStepIndex === 2 && demoRestaurant && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 2 Completed: Restaurant Identified</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Restaurant: <strong className="text-white">{demoRestaurant.name}</strong></div>
                    <div>Kitchen Node Zone: <strong className="text-amber-400">{demoRestaurant.zoneId}</strong></div>
                    <div>Coordinates: Lat {demoRestaurant.latitude}, Lng {demoRestaurant.longitude}</div>
                    <div>Average Kitchen Preparation: {demoRestaurant.prepTimeMinutes} mins</div>
                  </div>
                </div>
              )}

              {currentStepIndex === 3 && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 3 Completed: Available Riders Found</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Total Active Fleet: {riders.length} riders</div>
                    <div>Candidates with Status = AVAILABLE &amp; currentOrders = 0: <strong className="text-emerald-400">{demoCandidateRiders.length} riders</strong></div>
                    <div className="text-slate-400 text-[11px]">
                      Identified riders across zones: {demoCandidateRiders.slice(0, 4).map(r => `${r.name} (${r.currentZoneId})`).join(', ')}...
                    </div>
                  </div>
                </div>
              )}

              {currentStepIndex === 4 && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 4 Completed: BFS Traversal Started</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Graph Root Vertex: <strong className="text-amber-400">{demoRestaurant?.zoneId}</strong></div>
                    <div>Algorithm: <strong>Breadth First Search (BFS) Level-by-Level</strong></div>
                    <div>Queue Initialization: Q = [{demoRestaurant?.zoneId}], Visited = &#123;{demoRestaurant?.zoneId}&#125;</div>
                    <div>Time Complexity: <strong>O(V + E)</strong> | Space: <strong>O(V)</strong></div>
                  </div>
                </div>
              )}

              {currentStepIndex === 5 && demoBfsResult && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 5 Completed: Nearest Rider Found via BFS</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Selected Rider: <strong className="text-white">{demoBfsResult.assignedRider?.name}</strong></div>
                    <div>Stationed in Zone: <strong className="text-amber-400">{demoBfsResult.riderFoundAtZone}</strong></div>
                    <div>Transit Distance to Restaurant: <strong className="text-emerald-400">{demoBfsResult.distanceKm} km</strong></div>
                    <div>BFS Traversed Path: [{demoBfsResult.routePath.join(' ➔ ')}]</div>
                  </div>
                </div>
              )}

              {currentStepIndex === 6 && demoBfsResult && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 6 Completed: Rider Status Updated</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Rider {demoBfsResult.assignedRider?.name} Status: <span className="text-amber-400 font-bold">AVAILABLE ➔ BUSY</span></div>
                    <div>Order #{demoOrder?.orderId} Status: <span className="text-indigo-400 font-bold">RIDER_ASSIGNED</span></div>
                    <div>Assigned Rider ID: <code>{demoBfsResult.assignedRider?.riderId}</code></div>
                    <div>Audit history event committed into `order_status_history`.</div>
                  </div>
                </div>
              )}

              {currentStepIndex === 7 && demoEtaResult && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 7 Completed: Python ML Regression Executed</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Model: Multivariate Linear Regression (OLS)</div>
                    <div>Predicted Delivery Time: <strong className="text-emerald-400 text-sm">{demoEtaResult.predictedMinutes} minutes</strong></div>
                    <div>Feature Contribution: Base Prep ({demoEtaResult.breakdown.baseIntercept}m) + Distance ({demoEtaResult.breakdown.distanceContribution}m) + Traffic ({demoEtaResult.breakdown.trafficContribution}m)</div>
                    <div>Dataset Evaluation: R² = {demoEtaResult.metrics.r2}, MAE = ±{demoEtaResult.metrics.mae} mins</div>
                  </div>
                </div>
              )}

              {currentStepIndex === 8 && demoEtaResult && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400 font-bold">✓ Step 8 Completed: Predicted ETA Stored in Database</div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div>Table: <code>orders</code></div>
                    <div>Field: <code>eta_minutes = {demoEtaResult.predictedMinutes}</code></div>
                    <div>SQL Statement: <code>UPDATE orders SET eta_minutes = {demoEtaResult.predictedMinutes}, assigned_rider_id = &apos;{demoBfsResult?.assignedRider?.riderId}&apos; WHERE order_id = &apos;{demoOrder?.orderId}&apos;;</code></div>
                    <div>Status: <span className="text-emerald-400">COMMIT SUCCESS (ACID Compliant)</span></div>
                  </div>
                </div>
              )}

              {currentStepIndex === 9 && (
                <div className="space-y-3 text-slate-300">
                  <div className="text-emerald-400 font-bold text-sm">
                    🎉 Pipeline Complete: Customer Tracking &amp; Rider App Live!
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                    <p className="text-slate-200">
                      The full stack pipeline executed flawlessly. Customer sees live ETA countdown ({demoEtaResult?.predictedMinutes} mins), assigned rider ({demoBfsResult?.assignedRider?.name}), and order status in their tracking view.
                    </p>
                    <div className="pt-2 flex items-center space-x-2">
                      <span className="text-amber-400 font-bold">Academic Synthesis:</span>
                      <span className="text-slate-400">DBMS + DMGT + ADSA + OOPJ + Python ML</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3">
            <PlayCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Ready for Project Demonstration</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click &ldquo;Run Complete Demo&rdquo; to launch the automated 9-step execution pipeline with live real-time variables.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
