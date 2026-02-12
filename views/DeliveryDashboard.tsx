
import React, { useState } from 'react';
import { useApp } from '../store';
// Fix: VENDORS is exported from constants.ts, not types.ts
import { OrderStatus } from '../types';
import { VENDORS } from '../constants';

const DeliveryDashboard: React.FC = () => {
  const { currentUser, orders, updateOrderStatus } = useApp();
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});

  const availableOrders = orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP && !o.deliveryId);
  const myActiveOrders = orders.filter(o => o.deliveryId === currentUser?.id && o.status !== OrderStatus.DELIVERED);

  const handleVerifyOtp = (orderId: string, correctOtp: string) => {
    if (otpInputs[orderId] === correctOtp) {
      updateOrderStatus(orderId, OrderStatus.DELIVERED);
      alert('Order Delivered Successfully!');
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Delivery Partner Portal</h1>
        <p className="text-slate-500">Helping GLA students get their food on time.</p>
      </div>

      <div className="grid gap-10">
        {/* Pickup Queue */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></span>
            Available Pickups
          </h2>
          <div className="space-y-4">
            {availableOrders.length === 0 && (
              <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                No orders ready for pickup right now.
              </div>
            )}
            {availableOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.id}</p>
                  <p className="font-bold text-slate-800">{VENDORS.find(v => v.id === order.vendorId)?.name}</p>
                  <p className="text-xs text-slate-500">Pickup: {VENDORS.find(v => v.id === order.vendorId)?.location}</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs text-slate-400 mb-1">Total Fee</p>
                  <p className="font-black text-orange-600 text-xl">₹25</p>
                </div>
                <button 
                  onClick={() => updateOrderStatus(order.id, OrderStatus.OUT_FOR_DELIVERY, currentUser?.id)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all w-full md:w-auto"
                >
                  Claim & Pick Up
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* My Tasks */}
        <section>
          <h2 className="text-xl font-bold mb-6">Current Deliveries</h2>
          <div className="space-y-4">
            {myActiveOrders.length === 0 && (
              <div className="bg-slate-100 p-8 rounded-3xl text-center text-slate-400">
                You haven't claimed any orders yet.
              </div>
            )}
            {myActiveOrders.map(order => (
              <div key={order.id} className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-orange-500">OUT FOR DELIVERY</h3>
                    <p className="text-slate-400 text-sm">{order.id}</p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Amount</p>
                    <p className="font-black text-lg">₹{order.totalAmount}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-orange-400 uppercase mb-1 tracking-widest">Pickup Location</p>
                    <p className="font-bold">{VENDORS.find(v => v.id === order.vendorId)?.name}</p>
                    <p className="text-xs text-slate-400">{VENDORS.find(v => v.id === order.vendorId)?.location}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-orange-400 uppercase mb-1 tracking-widest">Dropoff Point</p>
                    <p className="font-bold text-xl">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Enter Customer OTP</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={4}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex-1 text-2xl font-black tracking-widest focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="XXXX"
                      value={otpInputs[order.id] || ''}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [order.id]: e.target.value })}
                    />
                    <button 
                      onClick={() => handleVerifyOtp(order.id, order.otp)}
                      className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all"
                    >
                      Verify & Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
