
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
  PanelLeft,
  PanelRight,
  Menu
} from 'lucide-react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const { t, language } = useAppSettings();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  // Get appropriate panel icon based on language
  const PanelIcon = language === 'ar' ? PanelRight : PanelLeft;

  // Rename this to avoid conflict with the imported SidebarContent component
  const SidebarContentSection = () => (
    <>
      <SidebarHeader className="flex items-center pb-4">
        <img 
          src="/logo-hu.png" 
          alt="Hashemite University" 
          className="h-10"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <span className="ml-2 text-lg font-semibold text-hashBlue dark:text-white">HashDoc</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {isStudent && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/dashboard')} 
                  asChild 
                  tooltip={t('dashboard')}
                >
                  <Link to="/dashboard">
                    <LayoutDashboard size={20} />
                    <span>{t('dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/my-documents')} 
                  asChild 
                  tooltip={t('myDocuments')}
                >
                  <Link to="/my-documents">
                    <FileText size={20} />
                    <span>{t('myDocuments')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/upload')} 
                  asChild 
                  tooltip={t('uploadDocument')}
                >
                  <Link to="/upload">
                    <Upload size={20} />
                    <span>{t('uploadDocument')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/drafts')} 
                  asChild 
                  tooltip={t('draftDocuments')}
                >
                  <Link to="/drafts">
                    <FileEdit size={20} />
                    <span>{t('draftDocuments')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/courses')} 
                  asChild 
                  tooltip={t('courses')}
                >
                  <Link to="/courses">
                    <BookOpen size={20} />
                    <span>{t('courses')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/feedback')} 
                  asChild 
                  tooltip={t('feedback')}
                >
                  <Link to="/feedback">
                    <MessageSquare size={20} />
                    <span>{t('feedback')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          
          {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/admin/dashboard')} 
                  asChild 
                  tooltip={t('dashboard')}
                >
                  <Link to="/admin/dashboard">
                    <LayoutDashboard size={20} />
                    <span>{t('dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/admin/documents')} 
                  asChild 
                  tooltip={t('allDocuments')}
                >
                  <Link to="/admin/documents">
                    <FileText size={20} />
                    <span>{t('allDocuments')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/admin/pending')} 
                  asChild 
                  tooltip={t('pendingDocuments')}
                >
                  <Link to="/admin/pending">
                    <FileText size={20} />
                    <span>{t('pendingDocuments')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/admin/feedback')} 
                  asChild 
                  tooltip={t('feedback')}
                >
                  <Link to="/admin/feedback">
                    <MessageSquare size={20} />
                    <span>{t('feedback')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/settings')} 
              asChild 
              tooltip={t('settings')}
            >
              <Link to="/settings">
                <Settings size={20} />
                <span>{t('settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              tooltip={t('logout')}
            >
              <LogOut size={20} />
              <span>{t('logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild className={cn(
          "fixed top-4 z-50 md:hidden",
          language === 'ar' ? "right-4" : "left-4"
        )}>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Menu className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80%]">
          <div className="px-4 py-6">
            <SidebarContentSection />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <ShadcnSidebar side={language === 'ar' ? 'right' : 'left'}>
      <SidebarContentSection />
    </ShadcnSidebar>
  );
};
