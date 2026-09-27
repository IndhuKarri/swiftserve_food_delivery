import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Cpu,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDatabase } from '../context/DatabaseContext';
import { Order } from '../types';

interface CheckoutProps {
  onBackToMenu: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBackToMenu, onOrderPlaced }) => {
  const { cart, currentCustomer, placeOrder, assignRiderViaBFS } = useDatabase();
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoAssignRider, setAutoAssignRider] = useState(true);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-sm text-slate-400">Add delicious items to proceed to checkout.</p>
        <button
          onClick={onBackToMenu}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const restaurant = cart[0].restaurant;
  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = 3.50;
  const taxes = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + deliveryFee + taxes).toFixed(2);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create order in DBMS
      const newOrder = await placeOrder(deliveryNotes);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 2. If auto-assign is checked, run BFS rider assignment immediately
      if (autoAssignRider) {
        try {
          const { order: assignedOrder } = await assignRiderViaBFS(newOrder.orderId);
          onOrderPlaced(assignedOrder);
          return;
        } catch (assignErr) {
          console.warn('Auto-assign warning:', assignErr);
        }
      }

      onOrderPlaced(newOrder);
    } catch (err: any) {
      alert(`Error placing order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Back */}
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3.5 py-2 rounded-xl transition border border-slate-700"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400" />
        <span>Modify Items in Menu</span>
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Review &amp; Confirm Order</h1>
          <p className="text-xs text-slate-400">
            Relational Order Transaction with ADSA Routing Pipeline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Delivery Address Card */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Delivery Destination</h3>
              </div>
              <span className="text-xs bg-slate-900 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Customer Zone: {currentCustomer.zoneId}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="text-sm font-bold text-white">{currentCustomer.name}</p>
              <p className="text-slate-400">{currentCustomer.phone} • {currentCustomer.email}</p>
              <p className="text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                {currentCustomer.address}
              </p>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave at door, call on arrival, extra spicy..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Restaurant Origin & Transit Details */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Pickup Location</h3>
              </div>
              <span className="text-xs bg-slate-900 text-orange-300 font-mono px-2.5 py-0.5 rounded-full border border-orange-500/30">
                Kitchen Zone: {restaurant.zoneId}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-bold text-white text-sm">{restaurant.name}</div>
              <div className="text-slate-400">{restaurant.address}</div>
              <div className="flex items-center space-x-2 text-[11px] text-amber-300 pt-1">
                <span>Estimated Transit Nodes: {restaurant.zoneId} ➔ {currentCustomer.zoneId}</span>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-700/80 pb-3 flex items-center justify-between">
              <span>Order Items ({cart.length})</span>
              <span className="text-xs text-slate-400 font-mono">Entity: order_items</span>
            </h3>

            <div className="divide-y divide-slate-700/60">
              {cart.map(({ item, quantity }) => (
                <div key={item.itemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-slate-400 ml-2 font-mono">x{quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">
                    ${(item.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bill Details, Payment & Submit */}
        <div className="space-y-6">
          {/* Bill Summary */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-700/80 pb-3">
              Payment Breakdown
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery Fee</span>
                <span className="font-mono">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes &amp; Restaurant Packaging</span>
                <span className="font-mono">${taxes.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="font-mono text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Debit/Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Cash on Del</span>
                </button>
              </div>
            </div>

            {/* Auto BFS Toggle */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAssignRider}
                  onChange={e => setAutoAssignRider(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-white flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-run BFS Rider Assignment</span>
                </span>
              </label>
              <p className="text-[11px] text-slate-400 pl-6">
                Automatically finds the nearest available rider across adjacent zones using Breadth-First Search upon order placement.
              </p>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? 'Processing Transaction...' : `Place Order • $${total.toFixed(2)}`}</span>
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Atomic ACID transaction committed to relational database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
