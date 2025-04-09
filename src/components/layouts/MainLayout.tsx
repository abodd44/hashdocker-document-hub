
import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true,
  adminOnly = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  const { language } = useAppSettings();
  
  // Redirect if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if not admin but page requires admin
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1">
          {isAuthenticated && <Navbar />}
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
