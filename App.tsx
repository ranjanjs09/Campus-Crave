
import React from 'react';
import { AppProvider, useApp } from './store';
import { UserRole } from './types';
import Navbar from './components/Navbar';
import LoginPage from './views/LoginPage';
import StudentDashboard from './views/StudentDashboard';
import VendorDashboard from './views/VendorDashboard';
import DeliveryDashboard from './views/DeliveryDashboard';
import AdminDashboard from './views/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case UserRole.STUDENT:
        return <StudentDashboard />;
      case UserRole.VENDOR:
        return <VendorDashboard />;
      case UserRole.DELIVERY:
        return <DeliveryDashboard />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <main className="animate-in fade-in duration-700">
        {renderDashboard()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
