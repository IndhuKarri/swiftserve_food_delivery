import React, { useState } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { Navbar, AppView } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { CustomerHome } from './pages/CustomerHome';
import { RestaurantMenu } from './pages/RestaurantMenu';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { RiderDashboard } from './pages/RiderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SmartRiderAssignment } from './pages/SmartRiderAssignment';
import { ETAPredictionLab } from './pages/ETAPredictionLab';
import { BFSVisualizer } from './pages/BFSVisualizer';
import { DBMSView } from './pages/DBMSView';
import { JavaCodeExplorer } from './pages/JavaCodeExplorer';
import { AcademicSubjectsView } from './pages/AcademicSubjectsView';
import { AcademicDemoPipeline } from './pages/AcademicDemoPipeline';
import { Restaurant, Order } from './types';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('customer');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('menu');
  };

  const handleOrderPlaced = (order: Order) => {
    setCurrentView('tracking');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'customer' && (
          <CustomerHome
            onSelectRestaurant={handleSelectRestaurant}
            onNavigateToTracking={() => setCurrentView('tracking')}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'menu' && selectedRestaurant && (
          <RestaurantMenu
            restaurant={selectedRestaurant}
            onBack={() => setCurrentView('customer')}
            onOpenCart={() => setIsCartOpen(true)}
            onProceedToCheckout={() => setCurrentView('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            onBackToMenu={() => {
              if (selectedRestaurant) setCurrentView('menu');
              else setCurrentView('customer');
            }}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTracking
            onNavigateToBfs={() => setCurrentView('bfs')}
            onNavigateToRider={() => setCurrentView('rider')}
          />
        )}

        {currentView === 'rider' && <RiderDashboard />}

        {currentView === 'admin' && <AdminDashboard />}

        {currentView === 'assignment' && <SmartRiderAssignment />}

        {currentView === 'ml' && <ETAPredictionLab />}

        {currentView === 'bfs' && <BFSVisualizer />}

        {currentView === 'dbms' && <DBMSView />}

        {currentView === 'java' && <JavaCodeExplorer />}

        {currentView === 'subjects' && <AcademicSubjectsView />}

        {currentView === 'demo' && <AcademicDemoPipeline />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              ⚡
            </span>
            <span className="font-bold text-white">SwiftServe</span>
            <span>— Smart Delivery. Smarter Routing.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>DBMS (3NF Normalization)</span>
            <span>•</span>
            <span>DMGT (Relations)</span>
            <span>•</span>
            <span>ADSA (O(V+E) BFS Routing)</span>
            <span>•</span>
            <span>OOPJ (Java Backend)</span>
            <span>•</span>
            <span>Python (Linear Regression)</span>
          </div>

          <div className="text-[11px] text-slate-500">
            College Final Year Project &amp; Enterprise Logistics Demonstration
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DatabaseProvider>
      <MainAppContent />
    </DatabaseProvider>
  );
}
