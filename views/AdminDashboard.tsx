
import React, { useState } from 'react';
import { useApp } from '../store';
import { VENDORS } from '../constants';
import { OrderStatus, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { orders, products, updateOrderStatus, toggleProductAvailability } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'vendors' | 'products'>('overview');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const platformCommission = totalRevenue * 0.05; 
  const successfulOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;

  const vendorPerformance = VENDORS.map(v => ({
    name: v.name,
    sales: orders.filter(o => o.vendorId === v.id).reduce((a, b) => a + b.totalAmount, 0)
  }));

  const COLORS = ['#F97316', '#3B82F6', '#10B981', '#6366F1'];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Admin</h1>
          <p className="text-slate-500 font-medium">Platform-wide oversight and management tools.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'orders', label: 'Live Orders', icon: '📦' },
            { id: 'vendors', label: 'Vendors', icon: '🏪' },
            { id: 'products', label: 'Products', icon: '🍕' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Volume', value: `₹${totalRevenue}`, color: 'text-orange-600', icon: '💰' },
              { label: 'Total Orders', value: orders.length, color: 'text-blue-600', icon: '📦' },
              { label: 'Active Items', value: products.length, color: 'text-green-600', icon: '🍕' },
              { label: 'Net Profit', value: `₹${platformCommission.toFixed(2)}`, color: 'text-indigo-600', icon: '🏧' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-8">Revenue Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendorPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                      {vendorPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xl font-bold mb-6">Security & Logs</h3>
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">System Health</p>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium">All Nodes Operational</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Real-time Traffic</p>
                  <p className="text-2xl font-black">2.4k <span className="text-xs text-slate-400">Hits/min</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Admin Session</p>
                  <p className="text-sm text-slate-300">Last login: 2 mins ago from Admin-GLA-01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">Master Order List</h2>
            <div className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-500">
              Total {orders.length} orders tracked
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Address</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-800">{order.id}</p>
                      <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-600">
                      {VENDORS.find(v => v.id === order.vendorId)?.name}
                    </td>
                    <td className="px-8 py-4 font-black text-slate-900">₹{order.totalAmount}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{order.deliveryAddress}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Force Cancel"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">No orders found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {VENDORS.map(vendor => {
            const vendorOrders = orders.filter(o => o.vendorId === vendor.id);
            const vendorSales = vendorOrders.reduce((a, b) => a + b.totalAmount, 0);
            
            return (
              <div key={vendor.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100">
                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">{vendor.name}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{vendor.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Sales</p>
                    <p className="text-lg font-black text-slate-800">₹{vendorSales}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Orders</p>
                    <p className="text-lg font-black text-slate-800">{vendorOrders.length}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                    View Analytics
                  </button>
                  <button className="px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-2xl font-black text-slate-800">Global Product Catalog</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-4 flex items-center gap-4">
                      <img src={product.image} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-slate-800">{product.name}</span>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500">{product.category}</td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-600">
                      {VENDORS.find(v => v.id === product.vendorId)?.name}
                    </td>
                    <td className="px-8 py-4 font-black text-slate-900">₹{product.price}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isAvailable ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <button 
                        onClick={() => toggleProductAvailability(product.id)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                          product.isAvailable ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                        }`}
                      >
                        {product.isAvailable ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
