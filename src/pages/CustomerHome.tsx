import React, { useState } from 'react';
import {
  Search,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  Filter
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Restaurant, MenuItem } from '../types';

interface CustomerHomeProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNavigateToTracking: () => void;
  onOpenCart: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Cuisines', icon: '🍽️' },
  { id: 'biryani', label: 'Biryani & Kebabs', icon: '🍚' },
  { id: 'pizza', label: 'Woodfired Pizza', icon: '🍕' },
  { id: 'burgers', label: 'Gourmet Burgers', icon: '🍔' },
  { id: 'indian', label: 'North Indian', icon: '🍛' },
  { id: 'south', label: 'South Indian Dosa', icon: '🥞' },
  { id: 'asian', label: 'Asian & Wok', icon: '🥢' },
  { id: 'healthy', label: 'Salads & Healthy', icon: '🥗' },
  { id: 'desserts', label: 'Desserts & Cakes', icon: '🍰' }
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectRestaurant,
  onNavigateToTracking,
  onOpenCart
}) => {
  const { restaurants, menuItems, currentCustomer, addToCart, orders } = useDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone = selectedZoneFilter === 'ALL' || r.zoneId === selectedZoneFilter;

    let matchesCategory = true;
    if (selectedCategory === 'biryani') matchesCategory = r.cuisine.toLowerCase().includes('biryani');
    else if (selectedCategory === 'pizza') matchesCategory = r.cuisine.toLowerCase().includes('pizza');
    else if (selectedCategory === 'burgers') matchesCategory = r.cuisine.toLowerCase().includes('burger');
    else if (selectedCategory === 'indian') matchesCategory = r.cuisine.toLowerCase().includes('indian') || r.cuisine.toLowerCase().includes('mughlai');
    else if (selectedCategory === 'south') matchesCategory = r.cuisine.toLowerCase().includes('south') || r.cuisine.toLowerCase().includes('dosa');
    else if (selectedCategory === 'asian') matchesCategory = r.cuisine.toLowerCase().includes('asian') || r.cuisine.toLowerCase().includes('dim sum');
    else if (selectedCategory === 'healthy') matchesCategory = r.cuisine.toLowerCase().includes('salad');
    else if (selectedCategory === 'desserts') matchesCategory = r.cuisine.toLowerCase().includes('bakery') || r.cuisine.toLowerCase().includes('pastries');

    return matchesSearch && matchesZone && matchesCategory;
  });

  const popularDishes = menuItems.slice(0, 6);
  const activeOrdersCount = orders.filter(
    o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  ).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-slate-700/60 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs text-amber-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Driven Nearest Rider Graph Dispatch • Real-Time O(V+E) BFS Routing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Delicious meals delivered in{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              record time.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            SwiftServe matches your order to the nearest available delivery rider across city zones using Breadth-First Search, calculating precise ETA via trained machine learning.
          </p>

          {/* Quick Search & Location Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Biryani, Pizza, Burger, Spice Hub, Zone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 flex items-center space-x-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500">Delivering to</div>
                  <div className="font-semibold text-white truncate max-w-[130px]">
                    {currentCustomer.name.split(' ')[0]} ({currentCustomer.zoneId})
                  </div>
                </div>
              </div>

              {activeOrdersCount > 0 && (
                <button
                  onClick={onNavigateToTracking}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-3 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                  <span>Track Live ({activeOrdersCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>ADSA BFS Zone Routing</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>Python ML ETA Prediction</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>PostgreSQL Relational DBMS</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Java OOP Architecture</span>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Explore Food Categories</span>
          </h2>
          <span className="text-xs text-slate-400">Curated menus for every mood</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Dishes Quick-Add Carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span>Trending Fast-Delivery Bites</span>
            </h2>
            <p className="text-xs text-slate-400">Order directly with 1-click addition to cart</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularDishes.map(item => {
            const rest = restaurants.find(r => r.restaurantId === item.restaurantId)!;
            return (
              <div
                key={item.itemId}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 rounded-2xl p-2.5 transition flex flex-col justify-between group shadow-md"
              >
                <div className="space-y-2">
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span
                      className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full ${
                        item.isVeg ? 'bg-emerald-400 ring-2 ring-emerald-950' : 'bg-rose-500 ring-2 ring-rose-950'
                      }`}
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-[10px] text-amber-300 font-mono px-1.5 py-0.5 rounded font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{rest?.name}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (rest) addToCart(item, rest);
                    }}
                    className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold rounded-lg text-xs transition border border-amber-500/40"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Top Restaurants in Your Delivery Network</span>
              <span className="text-xs bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-700">
                {filteredRestaurants.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Each restaurant is mapped to its zone node for BFS nearest rider optimization
            </p>
          </div>

          {/* Zone Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter Zone:</span>
            <select
              value={selectedZoneFilter}
              onChange={e => setSelectedZoneFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="ALL">All Zones (A to J)</option>
              <option value="ZONE_A">Zone A - Downtown</option>
              <option value="ZONE_B">Zone B - Midtown</option>
              <option value="ZONE_C">Zone C - West End</option>
              <option value="ZONE_D">Zone D - Tech Park</option>
              <option value="ZONE_E">Zone E - University</option>
              <option value="ZONE_F">Zone F - Harbor Bay</option>
              <option value="ZONE_G">Zone G - Green Hills</option>
              <option value="ZONE_H">Zone H - East Market</option>
              <option value="ZONE_I">Zone I - North Ridge</option>
              <option value="ZONE_J">Zone J - South Station</option>
            </select>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <div
              key={restaurant.restaurantId}
              onClick={() => onSelectRestaurant(restaurant)}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer transition duration-200 group flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="bg-slate-900/90 backdrop-blur-md text-amber-300 font-mono text-xs px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{restaurant.zoneId}</span>
                    </span>
                    <span className="bg-slate-900/90 backdrop-blur-md text-white font-mono text-xs px-2 py-1 rounded-lg border border-slate-700">
                      {restaurant.priceRange}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>{restaurant.rating}</span>
                    </span>
                    <span className="bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>~{restaurant.prepTimeMinutes} mins prep</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition truncate">
                      {restaurant.name}
                    </h3>
                  </div>

                  <p className="text-xs text-amber-400/90 font-medium">
                    {restaurant.cuisine}
                  </p>

                  <p className="text-xs text-slate-400 truncate">
                    {restaurant.address}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-4 pb-4 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Accepting Orders</span>
                </span>

                <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition flex items-center space-x-1">
                  <span>View Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
