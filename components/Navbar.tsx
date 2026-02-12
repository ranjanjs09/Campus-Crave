
import React from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser, cart } = useApp();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">C</div>
        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Campus Crave
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold">{currentUser.name}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{currentUser.role}</span>
          </div>
        )}
        
        {currentUser?.role === UserRole.STUDENT && (
          <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cart.length}
              </span>
            )}
          </div>
        )}

        <button 
          onClick={() => setCurrentUser(null)}
          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
