import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useDatabase();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 3.50 : 0;
  const taxes = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + deliveryFee + taxes).toFixed(2);
  const restaurant = cart[0]?.restaurant;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Your Food Basket</h2>
              <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant Context */}
          {restaurant && (
            <div className="px-6 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Ordering from: </span>
                <span className="font-semibold text-white">{restaurant.name}</span>
                <span className="text-slate-500 ml-1">({restaurant.zoneId})</span>
              </div>
              <button
                onClick={clearCart}
                className="text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                title="Clear basket"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-300">Your basket is empty</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explore delicious meals from top restaurants in your zone and add your favorites!
                </p>
              </div>
            ) : (
              cart.map(({ item, quantity }) => (
                <div
                  key={item.itemId}
                  className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center space-x-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    </div>
                    <p className="text-xs text-amber-400 font-mono mt-0.5">
                      ${(item.price * quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.itemId, -1)}
                          className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold font-mono text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.itemId, 1)}
                          className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        className="text-slate-500 hover:text-rose-400 text-xs transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-mono text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="font-mono text-slate-200">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Taxes &amp; Packing (5%)</span>
                  <span className="font-mono text-slate-200">${taxes.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
                  <span>Total Payable</span>
                  <span className="font-mono text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Smart BFS assignment will automatically link nearest rider!</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
