
import React, { useState } from 'react';
import { useApp } from '../store';
import { Product, OrderStatus } from '../types';
import { getAIFoodRecommendation } from '../services/geminiService';

const StudentDashboard: React.FC = () => {
  const { addToCart, cart, placeOrder, orders, removeFromCart, products, vendors } = useApp();
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<{name: string, reason: string}[] | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Hostel 4, Gate');

  const handleAIAsk = async () => {
    if (!aiPrompt) return;
    setLoadingAI(true);
    const result = await getAIFoodRecommendation(aiPrompt);
    setRecommendations(result);
    setLoadingAI(false);
  };

  const filteredProducts = products.filter(p => p.isAvailable && (!selectedVendorId || p.vendorId === selectedVendorId));

  const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24">
      {/* Search & AI Section */}
      <section className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-orange-500">✨</span> Crave Assistant
        </h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="I'm feeling like something spicy and light..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <button 
            onClick={handleAIAsk}
            disabled={loadingAI}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loadingAI ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>
        {recommendations && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-800">{rec.name}</h4>
                <p className="text-sm text-orange-700">{rec.reason}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Tracking */}
      {activeOrders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Ongoing Orders</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {activeOrders.map(order => (
              <div key={order.id} className="min-w-[300px] bg-white p-5 rounded-2xl shadow-md border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.id}</span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full">{order.status}</span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-800">{order.items.length} items from {vendors.find(v => v.id === order.vendorId)?.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Delivery to: {order.deliveryAddress}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="text-xs">
                    <p className="text-slate-400">Your OTP</p>
                    <p className="text-lg font-black tracking-widest text-slate-900">{order.otp}</p>
                  </div>
                  <div className="animate-pulse flex items-center gap-2 text-xs font-semibold text-orange-600">
                    <span className="h-2 w-2 bg-orange-600 rounded-full"></span>
                    Tracking Live
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vendors List */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Campus Shops</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <button 
            onClick={() => setSelectedVendorId(null)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${!selectedVendorId ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            All Items
          </button>
          {vendors.map(v => (
            <button 
              key={v.id}
              onClick={() => setSelectedVendorId(v.id)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${selectedVendorId === v.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 opacity-80'}`}
            >
              <span>{v.name}</span>
              {!v.isOpen && <span className="bg-red-500 text-[8px] text-white px-1.5 py-0.5 rounded font-black uppercase">Closed</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => {
          const vendor = vendors.find(v => v.id === p.vendorId);
          return (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="h-48 overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-wider">
                  {p.category}
                </div>
                {!vendor?.isOpen && (
                   <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <span className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-sm">VENDOR CLOSED</span>
                   </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{p.name}</h3>
                  <span className="font-black text-slate-900">₹{p.price}</span>
                </div>
                <p className="text-xs text-slate-400 mb-1">{vendor?.name}</p>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
                <button 
                  disabled={!vendor?.isOpen}
                  onClick={() => addToCart(p)}
                  className={`w-full py-2 rounded-xl font-semibold border transition-all flex items-center justify-center gap-2 ${
                    vendor?.isOpen 
                    ? 'bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border-slate-100 hover:border-orange-100' 
                    : 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Cart Modal */}
      {cart.length > 0 && !showCart && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between z-40 animate-bounce-short">
          <div>
            <p className="font-bold">{cart.length} items in cart</p>
            <p className="text-xs text-slate-400">Total: ₹{cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</p>
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="bg-orange-500 px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20"
          >
            Checkout
          </button>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">Your Tray</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b border-slate-50 last:border-0">
                  <div>
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500">₹{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Delivery Point</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                >
                  <option>Hostel 4 Main Gate</option>
                  <option>Academic Block A Lobby</option>
                  <option>Library Entrance</option>
                  <option>Girls Hostel 1 Security</option>
                </select>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-medium">Grand Total</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">₹{cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
              </div>
              <button 
                onClick={() => {
                  placeOrder(deliveryAddress);
                  setShowCart(false);
                }}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all"
              >
                Place Order (UPI Simulation)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
