
import React, { useState } from 'react';
import { useApp } from '../store';
import { OrderStatus } from '../types';
import { VENDORS } from '../constants';

const VendorDashboard: React.FC = () => {
  const { currentUser, orders, updateOrderStatus, products, addProduct, toggleProductAvailability } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: ''
  });

  const vendorId = currentUser?.vendorId || 'v1';
  const vendorInfo = VENDORS.find(v => v.id === vendorId);
  const vendorOrders = orders.filter(o => o.vendorId === vendorId);
  const vendorProducts = products.filter(p => p.vendorId === vendorId);

  const pending = vendorOrders.filter(o => o.status === OrderStatus.PENDING);
  const activeOrderList = vendorOrders.filter(o => [OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP].includes(o.status));
  const completed = vendorOrders.filter(o => o.status === OrderStatus.DELIVERED);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    addProduct({
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      description: newItem.description,
      vendorId: vendorId
    });
    
    setNewItem({ name: '', price: '', category: 'Main Course', description: '' });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24">
      <header className="mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{vendorInfo?.name}</h1>
            <p className="text-slate-500 font-medium">Managing campus storefront at {vendorInfo?.location}</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'menu' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            Menu Management
          </button>
        </div>
      </header>

      {activeTab === 'orders' ? (
        <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Incoming Orders</h2>
              <span className="bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full">{pending.length} New</span>
            </div>
            <div className="space-y-4">
              {pending.length === 0 && (
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                   <p className="text-slate-400 font-medium">Wait for customers to place orders...</p>
                </div>
              )}
              {pending.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-orange-200 transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.id}</span>
                       <p className="text-slate-500 text-xs mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-black text-slate-900 text-xl">₹{order.totalAmount}</p>
                       <p className="text-xs text-orange-600 font-bold uppercase">Pending Prep</p>
                     </div>
                  </div>
                  <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-2xl">
                     {order.items.map((item, i) => (
                       <div key={i} className="flex justify-between text-sm">
                         <span className="font-medium text-slate-700">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                         <span className="font-bold">₹{item.price * item.quantity}</span>
                       </div>
                     ))}
                  </div>
                  <button 
                    onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Accept & Start Preparing
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-800 mb-6">Prep & Dispatch</h2>
            <div className="space-y-4">
              {activeOrderList.length === 0 && (
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                   <p className="text-slate-400 font-medium">No active kitchen tasks</p>
                </div>
              )}
              {activeOrderList.map(order => (
                <div key={order.id} className={`p-6 rounded-3xl shadow-sm border transition-all ${order.status === OrderStatus.PREPARING ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-slate-800">{order.id}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${order.status === OrderStatus.PREPARING ? 'bg-orange-200 text-orange-700' : 'bg-green-200 text-green-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">Destination: <span className="font-bold text-slate-900">{order.deliveryAddress}</span></p>
                  {order.status === OrderStatus.PREPARING ? (
                     <button 
                      onClick={() => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)}
                      className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
                    >
                      Mark Ready for Pickup
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-700 font-bold justify-center py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Awaiting Delivery Partner
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800">Your Menu</h2>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Item
            </button>
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form 
                onSubmit={handleAddItem}
                className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-800">Add Item</h3>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Item Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      value={newItem.name}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Price (₹)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={newItem.price}
                        onChange={e => setNewItem({...newItem, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Category</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={newItem.category}
                        onChange={e => setNewItem({...newItem, category: e.target.value})}
                      >
                        <option>Main Course</option>
                        <option>Snacks</option>
                        <option>Beverage</option>
                        <option>Dessert</option>
                        <option>Retail</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none h-24"
                      value={newItem.description}
                      onChange={e => setNewItem({...newItem, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-8 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all"
                >
                  Create Food Item
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorProducts.map(product => (
              <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                <img src={product.image} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{product.name}</h4>
                  <p className="text-xs text-slate-400 mb-2">{product.category}</p>
                  <p className="font-black text-slate-900">₹{product.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <button 
                    onClick={() => toggleProductAvailability(product.id)}
                    className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors underline"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
            {vendorProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 font-medium">No items in your menu yet. Add your first dish!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
