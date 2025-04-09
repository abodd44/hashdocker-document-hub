
import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { SidebarProvider } from '@/components/ui/sidebar';

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
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          {isAuthenticated && <Sidebar />}
          <div className="flex-1">
            {isAuthenticated && <Navbar />}
            <main className="container mx-auto px-4 py-6 mt-16">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
