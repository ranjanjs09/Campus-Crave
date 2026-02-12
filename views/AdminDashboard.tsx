
import React, { useState } from 'react';
import { useApp } from '../store';
import { OrderStatus, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { orders, products, vendors, updateOrderStatus, toggleProductAvailability, updateProduct, updateVendor } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'vendors' | 'products'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const platformCommission = totalRevenue * 0.05; 
  
  const vendorPerformance = vendors.map(v => ({
    name: v.name,
    sales: orders.filter(o => o.vendorId === v.id).reduce((a, b) => a + b.totalAmount, 0)
  }));

  const COLORS = ['#F97316', '#3B82F6', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

  const handleProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category
      });
      setEditingProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Admin</h1>
          <p className="text-slate-500 font-medium">Full Platform Access: Manage All Data Points.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'orders', label: 'All Orders', icon: '📦' },
            { id: 'vendors', label: 'Vendors', icon: '🏪' },
            { id: 'products', label: 'Inventory', icon: '🍕' }
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
              { label: 'Platform GMV', value: `₹${totalRevenue}`, color: 'text-orange-600', icon: '💰' },
              { label: 'Total Orders', value: orders.length, color: 'text-blue-600', icon: '📦' },
              { label: 'Vendor Count', value: vendors.length, color: 'text-green-600', icon: '🏪' },
              { label: 'Commission (5%)', value: `₹${platformCommission.toFixed(2)}`, color: 'text-indigo-600', icon: '🏧' },
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
              <h3 className="text-xl font-bold text-slate-800 mb-8">Sales by Vendor</h3>
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
              <h3 className="text-xl font-bold mb-6">Real-time Monitoring</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium">Pending Approvals</span>
                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                       {orders.filter(o => o.status === OrderStatus.PENDING).length}
                    </span>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium">In Prep</span>
                    <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                       {orders.filter(o => o.status === OrderStatus.PREPARING).length}
                    </span>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium">On the Way</span>
                    <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                       {orders.filter(o => o.status === OrderStatus.OUT_FOR_DELIVERY).length}
                    </span>
                 </div>
              </div>
              <p className="mt-8 text-xs text-slate-500 italic">GLA-CRAVE Security Node #001 Active</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">Master Order Control</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Items</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status Override</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-800">{order.id}</p>
                      <p className="text-[10px] text-slate-500">{vendors.find(v => v.id === order.vendorId)?.name}</p>
                      <p className="text-[10px] text-slate-400">@{order.deliveryAddress}</p>
                    </td>
                    <td className="px-8 py-4">
                       <p className="text-xs font-medium text-slate-600">
                          {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                       </p>
                    </td>
                    <td className="px-8 py-4 font-black text-slate-900">₹{order.totalAmount}</td>
                    <td className="px-8 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-2 py-1 outline-none"
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-4">
                      <button 
                        onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                        className="text-xs font-bold text-green-600 hover:underline"
                      >
                        Force Deliver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {vendors.map(vendor => (
            <div key={vendor.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-slate-800">{vendor.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{vendor.location}</p>
                </div>
                <div className={`h-3 w-3 rounded-full ${vendor.isOpen ? 'bg-green-500' : 'bg-red-500'} shadow-sm shadow-green-200`}></div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                    <p className={`text-sm font-black ${vendor.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                       {vendor.isOpen ? 'Open for Orders' : 'Store Closed'}
                    </p>
                 </div>
                 <button 
                   onClick={() => updateVendor(vendor.id, { isOpen: !vendor.isOpen })}
                   className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                     vendor.isOpen ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                   }`}
                 >
                   Toggle
                 </button>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                  Full Vendor Audit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-2xl font-black text-slate-800">Global Inventory Manager</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Item</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-4 flex items-center gap-4">
                      <img src={product.image} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-slate-800">{product.name}</span>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-600">
                      {vendors.find(v => v.id === product.vendorId)?.name}
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
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => toggleProductAvailability(product.id)}
                          className="text-xs font-bold text-slate-500 hover:text-orange-600"
                        >
                          Toggle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <form onSubmit={handleProductEdit} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-2xl font-black mb-6">Modify Platform Item</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Item Name</label>
                    <input 
                      type="text" 
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Global Price (₹)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                 </div>
              </div>
              <div className="flex gap-4 mt-8">
                 <button 
                   type="button"
                   onClick={() => setEditingProduct(null)}
                   className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200"
                 >
                    Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700"
                 >
                    Save Changes
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
