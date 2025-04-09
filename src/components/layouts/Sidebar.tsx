
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  FileEdit, 
  BookOpen, 
  MessageSquare,
  Settings, 
  LogOut,
  List,
  Check,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const { t } = useAppSettings();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed transition-all duration-300 ease-in-out z-10`}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-5 px-2 py-3">
          {!collapsed && (
            <>
              <img 
                src="/logo-hu.png" 
                alt="Hashemite University" 
                className="h-12"
                onError={(e) => {
                  // Fallback if image isn't available
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-lg font-semibold ms-2 text-hashBlue dark:text-white">HashDoc</span>
            </>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <List size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <ul className="space-y-2 font-medium">
          {isStudent && (
            <>
              <SidebarItem 
                to="/dashboard" 
                icon={<LayoutDashboard size={20} />} 
                label={t('dashboard')} 
                active={isActive('/dashboard')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/my-documents" 
                icon={<FileText size={20} />} 
                label={t('myDocuments')} 
                active={isActive('/my-documents')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/upload" 
                icon={<Upload size={20} />} 
                label={t('uploadDocument')} 
                active={isActive('/upload')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/drafts" 
                icon={<FileEdit size={20} />} 
                label={t('draftDocuments')} 
                active={isActive('/drafts')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/courses" 
                icon={<BookOpen size={20} />} 
                label={t('courses')} 
                active={isActive('/courses')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/feedback" 
                icon={<MessageSquare size={20} />} 
                label={t('feedback')} 
                active={isActive('/feedback')} 
                collapsed={collapsed}
              />
            </>
          )}
          
          {isAdmin && (
            <>
              <SidebarItem 
                to="/admin/dashboard" 
                icon={<LayoutDashboard size={20} />} 
                label={t('dashboard')} 
                active={isActive('/admin/dashboard')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/admin/documents" 
                icon={<FileText size={20} />} 
                label={t('allDocuments')} 
                active={isActive('/admin/documents')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/admin/pending" 
                icon={<List size={20} />} 
                label={t('pendingDocuments')} 
                active={isActive('/admin/pending')} 
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/admin/feedback" 
                icon={<MessageSquare size={20} />} 
                label={t('feedback')} 
                active={isActive('/admin/feedback')} 
                collapsed={collapsed}
              />
            </>
          )}
          
          <SidebarItem 
            to="/settings" 
            icon={<Settings size={20} />} 
            label={t('settings')} 
            active={isActive('/settings')} 
            collapsed={collapsed}
          />
          
          <li>
            <button
              onClick={logout}
              className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={20} className="text-gray-500 dark:text-gray-400" />
              {!collapsed && <span className="ms-3">{t('logout')}</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active, collapsed }) => {
  return (
    <li>
      <Link 
        to={to} 
        className={cn(
          "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
          active && "bg-hashBlue-100 dark:bg-hashBlue-900"
        )}
      >
        <span className={cn(
          "text-gray-500 dark:text-gray-400",
          active && "text-hashBlue-500 dark:text-hashBlue-400"
        )}>
          {icon}
        </span>
        {!collapsed && (
          <span className={cn(
            "ms-3",
            active && "font-medium"
          )}>
            {label}
          </span>
        )}
      </Link>
    </li>
  );
};
