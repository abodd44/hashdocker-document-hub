
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Document } from './DocumentsContext';
import { useToast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
  documentId?: string;
  feedbackId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  documentStatusChanged: (document: Document, status: 'approved' | 'rejected', comments?: string) => void;
  documentUploaded: (document: Document) => void;
  feedbackReceived: (userId: string, subject: string, fromName: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read && n.userId === user?.id).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // If the notification is for the current user, show a toast
    if (user && notification.userId === user.id) {
      toast({
        title: newNotification.title,
        description: newNotification.message,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    setNotifications(prev =>
      prev.map(notification =>
        notification.userId === user.id ? { ...notification, read: true } : notification
      )
    );
  };

  const documentStatusChanged = (document: Document, status: 'approved' | 'rejected', comments?: string) => {
    // Notify the student
    addNotification({
      userId: document.userId,
      title: status === 'approved' ? 'Document Approved' : 'Document Rejected',
      message: `Your document "${document.title}" has been ${status}${comments ? ` with comments: ${comments}` : ''}`,
      documentId: document.id,
      link: `/my-documents`
    });
  };

  const documentUploaded = (document: Document) => {
    // Notify all admins (in a real app, you'd get admin IDs from a database)
    addNotification({
      userId: '7654321', // Admin ID (hardcoded for demo)
      title: 'New Document Uploaded',
      message: `${document.userName} uploaded a new document: "${document.title}"`,
      documentId: document.id,
      link: '/admin/documents'
    });
  };

  const feedbackReceived = (userId: string, subject: string, fromName: string) => {
    addNotification({
      userId,
      title: 'New Feedback',
      message: `${fromName} sent feedback: "${subject}"`,
      link: '/feedback'
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      documentStatusChanged,
      documentUploaded,
      feedbackReceived
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
