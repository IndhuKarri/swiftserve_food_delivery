import React, { useState, useEffect } from 'react';
import {
  Network,
  Play,
  RotateCcw,
  StepForward,
  CheckCircle,
  Bike,
  Store,
  Info,
  Clock,
  Navigation
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Zone, ZoneConnection, Rider } from '../types';

export const BFSVisualizer: React.FC = () => {
  const { zones, zoneConnections, riders } = useDatabase();

  const [startZoneId, setStartZoneId] = useState<string>('ZONE_A');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1000);

  // Filter available riders only
  const availableRiders = riders.filter(r => r.status === 'AVAILABLE' && r.currentOrders === 0);

  // Compute step-by-step BFS traversal
  const bfsSteps = React.useMemo(() => {
    const queue: string[] = [];
    const visited = new Set<string>();
    const distanceMap: Record<string, number> = {};
    const predecessorMap: Record<string, string | null> = {};
    const steps: Array<{
      stepNumber: number;
      currentNode: string;
      queue: string[];
      visited: string[];
      targetRider: Rider | null;
      foundZone: string | null;
      description: string;
    }> = [];

    // Adjacency map
    const adj = new Map<string, Array<{ target: string; dist: number }>>();
    zones.forEach(z => adj.set(z.zoneId, []));
    zoneConnections.forEach(c => {
      adj.get(c.zoneA)?.push({ target: c.zoneB, dist: c.distanceKm });
      adj.get(c.zoneB)?.push({ target: c.zoneA, dist: c.distanceKm });
    });

    queue.push(startZoneId);
    visited.add(startZoneId);
    distanceMap[startZoneId] = 0;
    predecessorMap[startZoneId] = null;

    // Check start zone
    const ridersAtStart = availableRiders.filter(r => r.currentZoneId === startZoneId);
    steps.push({
      stepNumber: 1,
      currentNode: startZoneId,
      queue: [...queue],
      visited: Array.from(visited),
      targetRider: null,
      foundZone: null,
      description: `Step 1: Enqueue start restaurant zone [${startZoneId}]. Checking for riders...`
    });

    if (ridersAtStart.length > 0) {
      const topRider = ridersAtStart[0];
      steps.push({
        stepNumber: 2,
        currentNode: startZoneId,
        queue: [],
        visited: Array.from(visited),
        targetRider: topRider,
        foundZone: startZoneId,
        description: `IMMEDIATE MATCH: Available rider ${topRider.name} is stationed at origin ${startZoneId} (0 km)!`
      });
      return steps;
    }

    let foundTarget: Rider | null = null;
    let foundZone: string | null = null;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const ridersHere = availableRiders.filter(r => r.currentZoneId === current);

      if (current !== startZoneId && ridersHere.length > 0) {
        foundTarget = ridersHere[0];
        foundZone = current;
        steps.push({
          stepNumber: steps.length + 1,
          currentNode: current,
          queue: [...queue],
          visited: Array.from(visited),
          targetRider: foundTarget,
          foundZone: foundZone,
          description: `TARGET FOUND: Located available rider ${foundTarget.name} at zone [${current}]! BFS halts.`
        });
        break;
      }

      const neighbors = adj.get(current) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          predecessorMap[edge.target] = current;
          distanceMap[edge.target] = (distanceMap[current] || 0) + edge.dist;
          queue.push(edge.target);

          steps.push({
            stepNumber: steps.length + 1,
            currentNode: edge.target,
            queue: [...queue],
            visited: Array.from(visited),
            targetRider: null,
            foundZone: null,
            description: `BFS Discovery: Exploring edge (${current} ➔ ${edge.target}, +${edge.dist}km). Added [${edge.target}] to FIFO queue.`
          });
        }
      }
    }

    return steps;
  }, [zones, zoneConnections, availableRiders, startZoneId]);

  // Autoplay
  useEffect(() => {
    let timer: any;
    if (isPlaying && activeStepIndex < bfsSteps.length - 1) {
      timer = setTimeout(() => {
        setActiveStepIndex(prev => prev + 1);
      }, speedMs);
    } else if (activeStepIndex >= bfsSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeStepIndex, bfsSteps.length, speedMs]);

  const currentStep = bfsSteps[activeStepIndex] || bfsSteps[0];

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStepIndex(0);
  };

  const handleNextStep = () => {
    if (activeStepIndex < bfsSteps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  // Helper to determine zone node status for visualization
  const getNodeState = (zoneId: string) => {
    if (currentStep.foundZone === zoneId) return 'TARGET';
    if (currentStep.currentNode === zoneId) return 'CURRENT';
    if (currentStep.queue.includes(zoneId)) return 'IN_QUEUE';
    if (currentStep.visited.includes(zoneId)) return 'VISITED';
    return 'UNVISITED';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              ADSA GRAPH VISUALIZATION LAB
            </span>
            <span className="text-xs text-slate-400">• Breadth-First Search (BFS)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Zone Graph &amp; BFS Traversal Visualizer</h1>
          <p className="text-xs text-slate-400">
            Interactive demonstration of graph nodes (zones), edges (distance weights), and level-by-level queue expansion.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400">Start (Restaurant):</span>
            <select
              value={startZoneId}
              onChange={e => {
                setStartZoneId(e.target.value);
                handleReset();
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
            >
              {zones.map(z => (
                <option key={z.zoneId} value={z.zoneId}>
                  {z.zoneId} ({z.zoneName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
              title={isPlaying ? 'Pause' : 'Play BFS'}
            >
              <Play className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextStep}
              disabled={activeStepIndex >= bfsSteps.length - 1}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
              title="Next Step"
            >
              <StepForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Canvas & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 2D Graph Visualizer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] pb-4 border-b border-slate-800/80">
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600 inline-block" />
              <span>Unvisited</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-300">
              <span className="w-3 h-3 rounded-full bg-amber-500/30 border-2 border-amber-400 inline-block animate-pulse" />
              <span>In Queue / Visiting</span>
            </span>
            <span className="flex items-center space-x-1 text-indigo-300">
              <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400 inline-block" />
              <span>Visited</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-300 font-bold">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white inline-block" />
              <span>Target Rider Found</span>
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative flex-1 w-full h-[400px]">
            <svg className="w-full h-full" viewBox="50 20 580 520">
              {/* Edges */}
              {zoneConnections.map(conn => {
                const zA = zones.find(z => z.zoneId === conn.zoneA);
                const zB = zones.find(z => z.zoneId === conn.zoneB);
                if (!zA || !zB) return null;

                const isTraversed =
                  currentStep.visited.includes(conn.zoneA) &&
                  currentStep.visited.includes(conn.zoneB);

                const midX = (zA.x + zB.x) / 2;
                const midY = (zA.y + zB.y) / 2;

                return (
                  <g key={conn.connectionId}>
                    <line
                      x1={zA.x}
                      y1={zA.y}
                      x2={zB.x}
                      y2={zB.y}
                      stroke={isTraversed ? '#6366f1' : '#334155'}
                      strokeWidth={isTraversed ? '2.5' : '1.5'}
                      strokeDasharray={isTraversed ? 'none' : '4'}
                    />
                    <text
                      x={midX}
                      y={midY - 4}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {conn.distanceKm}km
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {zones.map(zone => {
                const state = getNodeState(zone.zoneId);
                const ridersHere = availableRiders.filter(r => r.currentZoneId === zone.zoneId);
                const isStart = zone.zoneId === startZoneId;

                let fill = '#1e293b';
                let stroke = '#475569';
                let strokeWidth = '2';

                if (state === 'TARGET') {
                  fill = '#10b981';
                  stroke = '#ffffff';
                  strokeWidth = '3';
                } else if (state === 'CURRENT') {
                  fill = '#f59e0b';
                  stroke = '#fbbf24';
                  strokeWidth = '3';
                } else if (state === 'IN_QUEUE') {
                  fill = '#4338ca';
                  stroke = '#818cf8';
                  strokeWidth = '2';
                } else if (state === 'VISITED') {
                  fill = '#312e81';
                  stroke = '#6366f1';
                  strokeWidth = '2';
                }

                return (
                  <g
                    key={zone.zoneId}
                    className="cursor-pointer transition duration-300"
                    onClick={() => {
                      setStartZoneId(zone.zoneId);
                      handleReset();
                    }}
                  >
                    {/* Outer glowing halo if active */}
                    {(state === 'CURRENT' || state === 'TARGET') && (
                      <circle
                        cx={zone.x}
                        cy={zone.y}
                        r="28"
                        fill={state === 'TARGET' ? '#10b981' : '#f59e0b'}
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r="20"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />

                    {/* Zone Code */}
                    <text
                      x={zone.x}
                      y={zone.y + 4}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {zone.code}
                    </text>

                    {/* Zone Name Label */}
                    <text
                      x={zone.x}
                      y={zone.y + 32}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {zone.zoneName.split(' ')[0]}
                    </text>

                    {/* Restaurant icon badge */}
                    {isStart && (
                      <g transform={`translate(${zone.x + 10}, ${zone.y - 20})`}>
                        <rect width="18" height="18" rx="4" fill="#f59e0b" />
                        <text x="9" y="13" fill="#020617" fontSize="10" fontWeight="bold" textAnchor="middle">
                          🍴
                        </text>
                      </g>
                    )}

                    {/* Rider Presence Badge */}
                    {ridersHere.length > 0 && (
                      <g transform={`translate(${zone.x - 28}, ${zone.y - 20})`}>
                        <rect width="20" height="16" rx="4" fill="#059669" />
                        <text x="10" y="12" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                          🚴{ridersHere.length}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Traversal Step Progress Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Step {activeStepIndex + 1} of {bfsSteps.length}
            </span>
            <div className="w-48 bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((activeStepIndex + 1) / bfsSteps.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-white">
              {Math.round(((activeStepIndex + 1) / bfsSteps.length) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Right Column: Queue State, Current Node, Complexity Explanation (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Current Step Description Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>BFS Queue State</span>
              </h3>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded">
                Step #{currentStep.stepNumber}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400">Current Node Popped:</div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between font-mono">
                <span className="text-amber-400 font-bold">{currentStep.currentNode}</span>
                <span className="text-[11px] text-slate-400">
                  {zones.find(z => z.zoneId === currentStep.currentNode)?.zoneName}
                </span>
              </div>
            </div>

            {/* FIFO Queue View */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>FIFO Queue `[Q]`:</span>
                <span className="font-mono text-slate-300">{currentStep.queue.length} elements</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 min-h-[42px] flex items-center space-x-1.5 overflow-x-auto font-mono text-[11px]">
                {currentStep.queue.length === 0 ? (
                  <span className="text-slate-600 italic">Queue Empty</span>
                ) : (
                  currentStep.queue.map((qNode, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/60"
                    >
                      {qNode}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Visited Set */}
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-400">Visited Set `{'{V}'}`:</div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-700 font-mono text-[11px] text-slate-300 max-h-20 overflow-y-auto">
                {`{ ${currentStep.visited.join(', ')} }`}
              </div>
            </div>

            {/* Step Explanation */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-slate-200 leading-relaxed font-mono">
              {currentStep.description}
            </div>

            {/* Target Found Card */}
            {currentStep.targetRider && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Optimal Rider Assigned!</span>
                </div>
                <div className="text-white font-semibold">
                  {currentStep.targetRider.name} ({currentStep.targetRider.vehicleType})
                </div>
                <div className="text-slate-300 text-[11px]">
                  Stationed in Zone {currentStep.foundZone}
                </div>
              </div>
            )}
          </div>

          {/* Complexity Box */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-700/80 pb-3">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>ADSA Complexity Analysis</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400">Algorithm:</span>
                <span className="font-mono font-bold text-white">Breadth First Search (BFS)</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="font-mono font-bold text-amber-400">O(V + E)</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                <span className="text-slate-400">Space Complexity:</span>
                <span className="font-mono font-bold text-cyan-400">O(V)</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                BFS guarantees finding the nearest available rider with minimum zone hops because all zones at distance <em>k</em> are examined before zones at distance <em>k+1</em>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
