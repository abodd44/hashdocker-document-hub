
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useFeedback, Feedback as FeedbackType } from '@/contexts/FeedbackContext';
import FeedbackList from '@/components/feedback/FeedbackList';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const AdminFeedback: React.FC = () => {
  const { user } = useAuth();
  const { t } = useAppSettings();
  const { feedback, markAsRead } = useFeedback();
  
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  if (!user || user.role !== 'admin') return null;
  
  // Sort by date - newest first
  const sortedFeedback = [...feedback].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Separate received and sent feedback
  const receivedFeedback = sortedFeedback.filter(f => f.receiverId === user.id);
  const sentFeedback = sortedFeedback.filter(f => f.senderId === user.id);
  
  const handleView = (feedback: FeedbackType) => {
    setSelectedFeedback(feedback);
    setShowFeedbackDialog(true);
    // Mark as read if it's a received feedback
    if (feedback.receiverId === user.id && !feedback.read) {
      markAsRead(feedback.id);
    }
  };
  
  const handleReply = (feedback: FeedbackType) => {
    setSelectedFeedback(feedback);
    setShowFeedbackDialog(true);
  };

  return (
    <MainLayout adminOnly>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('feedback')}</h1>
        
        <Tabs defaultValue="received">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="received" className="mt-6">
            {receivedFeedback.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No feedback received.
              </div>
            ) : (
              <FeedbackList 
                feedbackItems={receivedFeedback}
                onView={handleView}
                onReply={handleReply}
              />
            )}
          </TabsContent>
          
          <TabsContent value="sent" className="mt-6">
            {sentFeedback.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No feedback sent.
              </div>
            ) : (
              <FeedbackList 
                feedbackItems={sentFeedback}
                onView={handleView}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Feedback Dialog */}
      <FeedbackDialog 
        feedback={selectedFeedback}
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onReply={handleReply}
      />
    </MainLayout>
  );
};

export default AdminFeedback;
