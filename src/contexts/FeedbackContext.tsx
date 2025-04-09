
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { toast } from '@/components/ui/use-toast';

export interface Feedback {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
}

interface FeedbackContextType {
  feedback: Feedback[];
  sendFeedback: (receiverId: string, subject: string, message: string) => Promise<void>;
  markAsRead: (id: string) => void;
  replyToFeedback: (originalId: string, message: string) => Promise<void>;
  getUnreadFeedback: () => Feedback[];
  getFeedbackForUser: (userId: string) => Feedback[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

// Mock initial feedback data
const initialFeedback: Feedback[] = [
  {
    id: '1',
    senderId: '1234567',
    senderName: 'Ahmed Al-Jordani',
    receiverId: '7654321',
    subject: 'Question about assignment submission',
    message: 'I am having trouble submitting my assignment for the Database course. The system keeps giving me an error message.',
    createdAt: '2023-04-15T11:30:00Z',
    read: true,
    replied: true
  },
  {
    id: '2',
    senderId: '7654321',
    senderName: 'Dr. Mohammad Hashemi',
    receiverId: '1234567',
    subject: 'RE: Question about assignment submission',
    message: 'Please try clearing your browser cache and using a different browser. Let me know if the issue persists.',
    createdAt: '2023-04-15T14:45:00Z',
    read: false,
    replied: false
  }
];

export const FeedbackProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const { user } = useAuth();
  const { feedbackReceived } = useNotification();

  const sendFeedback = async (receiverId: string, subject: string, message: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send feedback",
        variant: "destructive"
      });
      return;
    }

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      receiverId,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      replied: false
    };

    setFeedback(prev => [newFeedback, ...prev]);

    // Notify the receiver
    feedbackReceived(receiverId, subject, user.name);

    toast({
      title: "Feedback sent",
      description: "Your feedback has been sent successfully.",
    });
  };

  const markAsRead = (id: string) => {
    setFeedback(prev =>
      prev.map(f =>
        f.id === id ? { ...f, read: true } : f
      )
    );
  };

  const replyToFeedback = async (originalId: string, message: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to reply to feedback",
        variant: "destructive"
      });
      return;
    }

    const originalFeedback = feedback.find(f => f.id === originalId);
    if (!originalFeedback) {
      toast({
        title: "Error",
        description: "Feedback not found",
        variant: "destructive"
      });
      return;
    }

    // Mark original as replied
    setFeedback(prev =>
      prev.map(f =>
        f.id === originalId ? { ...f, replied: true } : f
      )
    );

    // Add reply
    const replyFeedback: Feedback = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      receiverId: originalFeedback.senderId,
      subject: `RE: ${originalFeedback.subject}`,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      replied: false
    };

    setFeedback(prev => [replyFeedback, ...prev]);

    // Notify the receiver
    feedbackReceived(originalFeedback.senderId, `RE: ${originalFeedback.subject}`, user.name);

    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully.",
    });
  };

  const getUnreadFeedback = () => {
    if (!user) return [];
    return feedback.filter(f => f.receiverId === user.id && !f.read);
  };

  const getFeedbackForUser = (userId: string) => {
    return feedback.filter(f => f.receiverId === userId || f.senderId === userId);
  };

  return (
    <FeedbackContext.Provider value={{ 
      feedback,
      sendFeedback,
      markAsRead,
      replyToFeedback,
      getUnreadFeedback,
      getFeedbackForUser
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};
