
import React from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';

const RoleSelection: React.FC = () => {
  const { setCurrentUser } = useApp();

  const roles = [
    {
      title: 'Student',
      role: UserRole.STUDENT,
      desc: 'Browse, Order, Track',
      icon: '🎓',
      color: 'bg-blue-600'
    },
    {
      title: 'Vendor',
      role: UserRole.VENDOR,
      desc: 'Manage Menu & Sales',
      icon: '🏪',
      color: 'bg-orange-600'
    },
    {
      title: 'Delivery',
      role: UserRole.DELIVERY,
      desc: 'Pickup & Earn Cash',
      icon: '🛵',
      color: 'bg-green-600'
    },
    {
      title: 'Admin',
      role: UserRole.ADMIN,
      desc: 'Platform Stats & Oversight',
      icon: '⚙️',
      color: 'bg-slate-600'
    }
  ];

  const handleSelect = (role: UserRole, title: string) => {
    setCurrentUser({
      id: role.toLowerCase() + '_1',
      name: `Test ${title}`,
      email: `${role.toLowerCase()}@gla.ac.in`,
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${role}`,
      vendorId: role === UserRole.VENDOR ? 'v1' : undefined
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-orange-200 mx-auto mb-6 transform -rotate-12">C</div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Campus Crave</h1>
        <p className="text-slate-500 max-w-md mx-auto font-medium">Hyper-local food & retail delivery ecosystem exclusive for GLA University.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {roles.map(r => (
          <button 
            key={r.role}
            onClick={() => handleSelect(r.role, r.title)}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center"
          >
            <div className={`text-5xl mb-6 group-hover:scale-125 transition-transform duration-300`}>
              {r.icon}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">{r.title}</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">{r.desc}</p>
            <div className={`w-12 h-12 rounded-full ${r.color} flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <footer className="mt-20 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
        <span>Mapped to GLA University Campus</span>
        <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
        <span>Version 1.0.0</span>
      </footer>
    </div>
  );
};

export default RoleSelection;
