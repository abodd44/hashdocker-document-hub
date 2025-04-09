
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Bell, Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useAppSettings();
  const { notifications, markAsRead, unreadCount, markAllAsRead } = useNotification();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed right-0 left-64 z-10">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start">
          <span className="sr-only">HashDoc</span>
        </div>
        
        <div className="flex items-center">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-300" />
            ) : (
              <Moon size={20} />
            )}
          </Button>

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full mx-2"
                aria-label="Change language"
              >
                <Languages size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className={language === 'en' ? 'font-bold' : ''}>
                  {t('english')}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                <span className={language === 'ar' ? 'font-bold' : ''}>
                  {t('arabic')}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <div className="relative mx-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user.profilePicture || "https://github.com/shadcn.png"} 
                    alt={user.name} 
                  />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.id}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/settings">
                  {t('settings')}
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/logout">
                  {t('logout')}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('notificationTitle')}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-4 text-gray-500">{t('noNotifications')}</p>
            ) : (
              <div className="space-y-4">
                {notifications
                  .filter(notif => notif.userId === user.id)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(notification => (
                    <div 
                      key={notification.id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-hashBlue-600 font-semibold'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto mt-1 text-hashBlue"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setNotificationsOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => {
              markAllAsRead();
              setNotificationsOpen(false);
            }} className="ml-2">
              {t('seeAll')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
