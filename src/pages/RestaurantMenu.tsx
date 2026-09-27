import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingBag,
  Info,
  Check
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Restaurant, MenuItem } from '../types';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  onBack: () => void;
  onOpenCart: () => void;
  onProceedToCheckout: () => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  restaurant,
  onBack,
  onOpenCart,
  onProceedToCheckout
}) => {
  const { menuItems, cart, addToCart, updateCartQuantity, zones } = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const zoneInfo = zones.find(z => z.zoneId === restaurant.zoneId);

  // Filter items belonging to this restaurant
  const items = menuItems.filter(item => item.restaurantId === restaurant.restaurantId);

  // Group categories
  const categories = Array.from(new Set(items.map(i => i.category)));

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter(i => i.category === selectedCategory);

  const getItemCartQuantity = (itemId: string): number => {
    const found = cart.find(c => c.item.itemId === itemId);
    return found ? found.quantity : 0;
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3.5 py-2 rounded-xl transition border border-slate-700"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400" />
        <span>Back to All Restaurants</span>
      </button>

      {/* Restaurant Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl">
        <div className="relative h-60 sm:h-72 w-full bg-slate-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Overlay info */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  Zone Node: {restaurant.zoneId} ({zoneInfo?.zoneName})
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Kitchen Open
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {restaurant.name}
              </h1>

              <p className="text-sm text-slate-300">{restaurant.cuisine}</p>

              <div className="flex items-center space-x-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{restaurant.address}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Avg Prep: {restaurant.prepTimeMinutes} mins</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 self-start sm:self-auto">
              <div className="text-center px-3 border-r border-slate-700">
                <div className="flex items-center justify-center space-x-1 text-emerald-400 font-bold text-lg">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="text-[10px] text-slate-400">1,200+ Reviews</div>
              </div>

              <div className="text-center px-3">
                <div className="text-amber-400 font-bold text-lg font-mono">
                  {restaurant.priceRange}
                </div>
                <div className="text-[10px] text-slate-400">Price Tier</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All Items ({items.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center justify-between">
          <span>Available Delicacies</span>
          <span className="text-xs text-slate-400 font-normal">Freshly prepared to order</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const quantity = getItemCartQuantity(item.itemId);
            return (
              <div
                key={item.itemId}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/40 rounded-2xl p-4 transition flex justify-between gap-4 shadow-lg"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-xs font-mono text-slate-400">
                      {item.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.name}</h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-sm font-bold text-amber-400 font-mono">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between space-y-2 flex-shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(item, restaurant)}
                      className="w-24 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-md transition flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="w-24 flex items-center justify-between bg-slate-900 border border-amber-500/60 rounded-lg p-1 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.itemId, -1)}
                        className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-amber-400 font-mono">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.itemId, 1)}
                        className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-40 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-slate-950 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} | ${totalCartAmount.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-900 font-medium">
                From {restaurant.name} ({restaurant.zoneId})
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCart}
              className="bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition"
            >
              View Basket
            </button>
            <button
              onClick={onProceedToCheckout}
              className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition flex items-center space-x-1.5"
            >
              <span>Checkout</span>
              <Check className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
