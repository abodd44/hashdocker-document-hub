
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="flex items-center justify-center mb-5 px-2 py-3">
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
        </div>
        
        <ul className="space-y-2 font-medium">
          {isStudent && (
            <>
              <SidebarItem 
                to="/dashboard" 
                icon={<LayoutDashboard size={20} />} 
                label={t('dashboard')} 
                active={isActive('/dashboard')} 
              />
              <SidebarItem 
                to="/my-documents" 
                icon={<FileText size={20} />} 
                label={t('myDocuments')} 
                active={isActive('/my-documents')} 
              />
              <SidebarItem 
                to="/upload" 
                icon={<Upload size={20} />} 
                label={t('uploadDocument')} 
                active={isActive('/upload')} 
              />
              <SidebarItem 
                to="/drafts" 
                icon={<FileEdit size={20} />} 
                label={t('draftDocuments')} 
                active={isActive('/drafts')} 
              />
              <SidebarItem 
                to="/courses" 
                icon={<BookOpen size={20} />} 
                label={t('courses')} 
                active={isActive('/courses')} 
              />
              <SidebarItem 
                to="/feedback" 
                icon={<MessageSquare size={20} />} 
                label={t('feedback')} 
                active={isActive('/feedback')} 
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
              />
              <SidebarItem 
                to="/admin/documents" 
                icon={<FileText size={20} />} 
                label={t('allDocuments')} 
                active={isActive('/admin/documents')} 
              />
              <SidebarItem 
                to="/admin/pending" 
                icon={<List size={20} />} 
                label={t('pendingDocuments')} 
                active={isActive('/admin/pending')} 
              />
              <SidebarItem 
                to="/admin/feedback" 
                icon={<MessageSquare size={20} />} 
                label={t('feedback')} 
                active={isActive('/admin/feedback')} 
              />
            </>
          )}
          
          <SidebarItem 
            to="/settings" 
            icon={<Settings size={20} />} 
            label={t('settings')} 
            active={isActive('/settings')} 
          />
          
          <li>
            <button
              onClick={logout}
              className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={20} className="text-gray-500 dark:text-gray-400" />
              <span className="ms-3">{t('logout')}</span>
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
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => {
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
        <span className={cn(
          "ms-3",
          active && "font-medium"
        )}>
          {label}
        </span>
      </Link>
    </li>
  );
};
