
import React from 'react';
import { Feedback } from '@/contexts/FeedbackContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reply, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackListProps {
  feedbackItems: Feedback[];
  onView: (feedback: Feedback) => void;
  onReply?: (feedback: Feedback) => void;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ 
  feedbackItems,
  onView,
  onReply
}) => {
  const { t } = useAppSettings();

  if (feedbackItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No feedback messages found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbackItems.map((feedback) => (
        <Card key={feedback.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                {feedback.subject}
                {!feedback.read && (
                  <Badge className="ml-2 bg-hashBlue">New</Badge>
                )}
              </CardTitle>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <p className="text-sm font-medium">From: {feedback.senderName}</p>
              <p className="text-sm mt-2 line-clamp-2">{feedback.message}</p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onView(feedback)}
                className="flex items-center"
              >
                <Eye size={16} className="mr-1" />
                {t('view')}
              </Button>
              
              {onReply && !feedback.replied && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onReply(feedback)}
                  className="flex items-center"
                >
                  <Reply size={16} className="mr-1" />
                  {t('send')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
