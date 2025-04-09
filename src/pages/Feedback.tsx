
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useFeedback, Feedback as FeedbackType } from '@/contexts/FeedbackContext';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackList from '@/components/feedback/FeedbackList';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const Feedback: React.FC = () => {
  const { user } = useAuth();
  const { t } = useAppSettings();
  const { feedback, getFeedbackForUser, markAsRead } = useFeedback();
  
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  if (!user) return null;
  
  // Get feedback for current user
  const userFeedback = getFeedbackForUser(user.id);
  
  // Sort by date - newest first
  const sortedFeedback = [...userFeedback].sort(
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
  
  // Determine if the user is sending feedback to an admin
  let receiverId = '';
  if (user.role === 'student') {
    // If student, send feedback to admin (hardcoded for demo)
    receiverId = '7654321';
  } else {
    // If admin, do nothing - admins send feedback only in response
    receiverId = '';
  }

  return (
    <MainLayout>
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
        
        {user.role === 'student' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare size={20} className="mr-2" />
                {t('feedbackTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackForm receiverId={receiverId} />
            </CardContent>
          </Card>
        )}
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

export default Feedback;
