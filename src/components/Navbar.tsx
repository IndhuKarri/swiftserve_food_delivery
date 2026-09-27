import React, { useState } from 'react';
import {
  ShoppingBag,
  Bike,
  LayoutDashboard,
  Cpu,
  BrainCircuit,
  Network,
  Database,
  GraduationCap,
  PlayCircle,
  Code2,
  RefreshCw,
  MapPin,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export type AppView =
  | 'customer'
  | 'menu'
  | 'checkout'
  | 'tracking'
  | 'rider'
  | 'admin'
  | 'assignment'
  | 'ml'
  | 'bfs'
  | 'dbms'
  | 'java'
  | 'subjects'
  | 'demo';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenCart }) => {
  const { cart, currentCustomer, customers, setCurrentCustomerById, resetToDefaults, orders } = useDatabase();
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(
    o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  ).length;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner with Subject Highlights */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white text-xs px-4 py-1.5 font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-black/30 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider">PROJECT ACADEMIC STACK</span>
          <span className="hidden sm:inline">DBMS (Relational SQL) • DMGT (Relations) • ADSA (Zone BFS) • OOPJ (Java Backend) • Python (ETA ML)</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <button
            onClick={() => onNavigate('demo')}
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full transition font-semibold"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Run Complete Demo</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Reset database to clean default seed state?')) {
                resetToDefaults();
              }
            }}
            title="Reset sample database"
            className="flex items-center space-x-1 hover:text-amber-200 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('customer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold text-xl">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                  SwiftServe
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                  SMART ROUTING
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">Smart Delivery. Smarter Routing.</p>
            </div>
          </div>

          {/* Quick Persona & Location Pill */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">User: <strong className="text-white">{currentCustomer.name.split(' ')[0]}</strong> ({currentCustomer.zoneId})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCustomerDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-700">
                    Switch Customer Persona (20 in DB)
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {customers.slice(0, 8).map(cust => (
                      <button
                        key={cust.customerId}
                        onClick={() => {
                          setCurrentCustomerById(cust.customerId);
                          setShowCustomerDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-700/60 flex items-center justify-between ${
                          cust.customerId === currentCustomer.customerId ? 'bg-amber-500/10 text-amber-400 font-medium' : 'text-slate-300'
                        }`}
                      >
                        <div>
                          <div>{cust.name}</div>
                          <div className="text-[10px] text-slate-400">{cust.zoneId} • {cust.phone}</div>
                        </div>
                        {cust.customerId === currentCustomer.customerId && <span className="text-amber-400 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('customer')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                currentView === 'customer' || currentView === 'menu' || currentView === 'checkout'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer App</span>
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 relative ${
                currentView === 'tracking'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Track Orders</span>
              {activeOrdersCount > 0 && (
                <span className="ml-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] px-1.5 rounded-full font-mono">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('rider')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                currentView === 'rider'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Rider Portal</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action buttons: Cart & Academic modules */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 flex items-center space-x-1.5"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Academic Deep-Dive Secondary Bar */}
        <div className="flex items-center justify-start overflow-x-auto space-x-1.5 py-2 border-t border-slate-800/80 text-xs text-slate-400 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1 mr-1">Algorithms &amp; Tech:</span>

          <button
            onClick={() => onNavigate('assignment')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
              currentView === 'assignment' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Rider Dispatch</span>
          </button>

          <button
            onClick={() => onNavigate('bfs')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
              currentView === 'bfs' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>ADSA (Zone BFS Graph)</span>
          </button>

          <button
            onClick={() => onNavigate('ml')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
              currentView === 'ml' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span>Python ML (ETA Regression)</span>
          </button>

          <button
            onClick={() => onNavigate('dbms')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
              currentView === 'dbms' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>DBMS &amp; SQL Studio</span>
          </button>

          <button
            onClick={() => onNavigate('java')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
              currentView === 'java' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-orange-400" />
            <span>OOPJ (Java Backend)</span>
          </button>

          <button
            onClick={() => onNavigate('subjects')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
              currentView === 'subjects' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>Academic Syllabus</span>
          </button>

          <button
            onClick={() => onNavigate('demo')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap flex items-center space-x-1 ml-auto ${
              currentView === 'demo' ? 'bg-rose-500 text-white font-semibold' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold">Interactive Pipeline Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
