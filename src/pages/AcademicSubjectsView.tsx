import React from 'react';
import {
  GraduationCap,
  Database,
  Layers,
  Network,
  Code2,
  BrainCircuit,
  CheckCircle2,
  FileCode,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface AcademicSubjectDetail {
  code: string;
  name: string;
  color: string;
  icon: any;
  coreConcepts: string[];
  projectImplementation: string;
  complexityOrMetric: string;
  codeLocation: string;
  vivaQuestion: string;
  vivaAnswer: string;
}

const SUBJECTS: AcademicSubjectDetail[] = [
  {
    code: 'DBMS',
    name: 'Database Management Systems',
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    icon: Database,
    coreConcepts: [
      'Relational Data Model',
      '3NF Normalization',
      'Entity-Relationship (ER) Modeling',
      'Foreign Key Referential Integrity',
      'Indexes for Performance',
      'ACID Transaction Properties'
    ],
    projectImplementation:
      'Engineered an 8-table relational schema (customers, restaurants, riders, orders, order_items, zones, zone_connections, trip_history). Enforces ON DELETE CASCADE on weak entities and ON DELETE RESTRICT on master zones.',
    complexityOrMetric: 'B-Tree Indexing O(log N) lookup',
    codeLocation: '/database/schema.sql & /src/data/mockDatabase.ts',
    vivaQuestion: 'Why is trip_history decoupled into a separate entity?',
    vivaAnswer:
      'Decoupling trip_history ensures 3NF compliance by separating dynamic transaction delivery audits from static order definitions, preventing update anomalies and enabling large-scale ML model retraining.'
  },
  {
    code: 'DMGT',
    name: 'Discrete Mathematics & Graph Theory',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    icon: Layers,
    coreConcepts: [
      'Binary Relations as Subsets (R ⊆ A × B)',
      'Symmetric Relations for Undirected Roads',
      'Graph Vertices & Edges (G = (V, E))',
      'Adjacency Matrix & List Equivalences',
      'Path Connectivity & Reachability'
    ],
    projectImplementation:
      'Modeled city delivery zones as vertices V and bi-directional roadways as symmetric binary relations (u, v) ∈ E with positive weight functions w(e) representing distance in kilometers.',
    complexityOrMetric: '|V| = 10 Zones, |E| = 18 Connected Edges',
    codeLocation: '/src/algorithms/bfsRiderAssignment.ts',
    vivaQuestion: 'How does DMGT define the relation between Zones and Connections?',
    vivaAnswer:
      'ZoneConnection is a symmetric relation R ⊆ V × V where (u, v) ∈ R implies (v, u) ∈ R, representing two-way vehicular transit between urban delivery nodes.'
  },
  {
    code: 'ADSA',
    name: 'Advanced Data Structures & Algorithms',
    color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
    icon: Network,
    coreConcepts: [
      'Breadth-First Search (BFS)',
      'Adjacency List Graph Representation',
      'FIFO Queue (First-In, First-Out)',
      'Visited Set to Prevent Cyclic Loops',
      'Predecessor Map for Shortest Path Extraction'
    ],
    projectImplementation:
      'Dispatches orders by running level-by-level BFS from the restaurant zone. Explores neighboring zones outward until encountering the first available rider, guaranteeing minimum zone hops.',
    complexityOrMetric: 'Time: O(V + E), Space: O(V)',
    codeLocation: '/src/algorithms/bfsRiderAssignment.ts',
    vivaQuestion: 'Why use BFS instead of DFS for rider assignment?',
    vivaAnswer:
      'BFS explores nodes level by level (by edge distance), guaranteeing that the first available rider discovered is the closest in topological distance, whereas DFS may plunge deep into far distant zones.'
  },
  {
    code: 'OOPJ',
    name: 'Object-Oriented Programming with Java',
    color: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
    icon: Code2,
    coreConcepts: [
      'Encapsulation (Private fields with accessors)',
      'Abstraction (Abstract User base class)',
      'Inheritance (Rider & Customer extend User)',
      'Polymorphism (Dynamic method dispatch)',
      'Service & Repository Layer Architecture',
      'JDBC Connection Pooling (Singleton Pattern)'
    ],
    projectImplementation:
      'Structured using standard Spring Boot / Java enterprise packages (model, service, repository, algorithm, controller, config). BFSService coordinates rider matching with encapsulated state transitions.',
    complexityOrMetric: 'Clean Architecture with SOLID principles',
    codeLocation: '/src/services/javaBackendService.ts',
    vivaQuestion: 'How does your Java backend prevent race conditions during rider assignment?',
    vivaAnswer:
      'The RiderAssignmentService uses synchronized blocks and state verification (isEligibleForAssignment()) to ensure that concurrent order dispatches cannot assign the same rider twice.'
  },
  {
    code: 'Python / ML',
    name: 'Machine Learning & Predictive Modeling',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    icon: BrainCircuit,
    coreConcepts: [
      'Multivariate Linear Regression',
      'Ordinary Least Squares (OLS) Normal Equations',
      'Categorical Encoding (Ordinal / Label Encoding)',
      'Goodness of Fit (R² Score)',
      'Evaluation Metrics: MAE & RMSE'
    ],
    projectImplementation:
      'Trains on 120+ historical trips to estimate delivery times using features: distance_km, time_of_day, traffic_level, and weather_condition. Solves closed-form matrix math (XᵀX)⁻¹XᵀY.',
    complexityOrMetric: 'Formula: ETA = b0 + b1·(Dist) + b2·(Time) + b3·(Traf) + b4·(Weat)',
    codeLocation: '/src/ml/etaRegressionModel.ts & Python scripts',
    vivaQuestion: 'Why is linear regression appropriate for this delivery time prediction?',
    vivaAnswer:
      'Delivery time exhibits strong linear correlation with transit distance and traffic delays. Linear regression provides direct interpretability of feature coefficients (b1 = mins per km, b3 = traffic penalty).'
  }
];

export const AcademicSubjectsView: React.FC = () => {
  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full text-xs text-purple-300 font-medium">
          <GraduationCap className="w-4 h-4 text-purple-400" />
          <span>Curriculum &amp; Syllabus Integration</span>
        </div>

        <h1 className="text-3xl font-black text-white">
          Academic Subject Mapping &amp; Viva Examination Guide
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          SwiftServe demonstrates the synthesis of five foundational computer science disciplines working together to solve an enterprise logistics challenge. Use this reference for university project presentations, viva-voce evaluations, and technical interviews.
        </p>
      </div>

      {/* End-to-End System Flowchart */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <span>End-to-End Multi-Disciplinary Architecture Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
          <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/40 space-y-1 text-center">
            <span className="text-cyan-400 font-bold">1. DBMS Layer</span>
            <p className="text-slate-400 text-[11px]">Customer creates order; atomic record inserted into `orders` table.</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-orange-500/40 space-y-1 text-center">
            <span className="text-orange-400 font-bold">2. OOPJ Controller</span>
            <p className="text-slate-400 text-[11px]">Java OrderService intercepts request and invokes RiderAssignmentService.</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/40 space-y-1 text-center">
            <span className="text-indigo-400 font-bold">3. ADSA BFS Graph</span>
            <p className="text-slate-400 text-[11px]">BFSService traverses zone graph level by level to find nearest free rider.</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40 space-y-1 text-center">
            <span className="text-emerald-400 font-bold">4. Python ML ETA</span>
            <p className="text-slate-400 text-[11px]">Regression model predicts ETA based on distance, traffic, and weather.</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/40 space-y-1 text-center">
            <span className="text-amber-400 font-bold">5. Live Reflection</span>
            <p className="text-slate-400 text-[11px]">Rider &amp; Order status committed; customer tracking UI streams updates.</p>
          </div>
        </div>
      </div>

      {/* Subject Deep Dives */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white">
          Detailed Subject Breakdowns
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {SUBJECTS.map(subj => {
            const Icon = subj.icon;
            return (
              <div
                key={subj.code}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl border ${subj.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-white">{subj.name}</span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-xs font-mono font-bold text-amber-400 border border-slate-700">
                          {subj.code}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{subj.complexityOrMetric}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                    Source: {subj.codeLocation}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Left: Core Syllabus Concepts & Implementation */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-white text-xs mb-1.5">
                        Key Syllabus Topics Demonstrated:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {subj.coreConcepts.map((concept, i) => (
                          <span
                            key={i}
                            className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[11px]"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="font-bold text-white text-xs mb-1">Project Implementation:</h4>
                      <p className="text-slate-300 leading-relaxed">
                        {subj.projectImplementation}
                      </p>
                    </div>
                  </div>

                  {/* Right: Viva Voce Exam Q&A */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                      <HelpCircle className="w-4 h-4" />
                      <span>Likely Viva Question:</span>
                    </div>
                    <p className="text-white font-semibold text-xs italic">
                      &ldquo;{subj.vivaQuestion}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-emerald-400 font-bold text-[11px] mb-0.5">Model Answer:</div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {subj.vivaAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
