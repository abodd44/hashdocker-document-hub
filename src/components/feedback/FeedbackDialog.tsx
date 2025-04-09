
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Feedback } from '@/contexts/FeedbackContext';
import FeedbackForm from './FeedbackForm';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { format } from 'date-fns';
import { Reply } from 'lucide-react';

interface FeedbackDialogProps {
  feedback: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply?: (feedback: Feedback) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  feedback,
  open,
  onOpenChange,
  onReply
}) => {
  const { t } = useAppSettings();
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  
  if (!feedback) return null;
  
  const handleClose = () => {
    setShowReplyForm(false);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{feedback.subject}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <p>
              <span className="font-medium">From:</span> {feedback.senderName}
            </p>
            <p>
              <span className="font-medium">Date:</span> {format(new Date(feedback.createdAt), 'PPpp')}
            </p>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 whitespace-pre-line">
            {feedback.message}
          </div>
          
          {!showReplyForm && onReply && !feedback.replied && (
            <div className="flex justify-end">
              <Button
                onClick={() => setShowReplyForm(true)}
                className="flex items-center"
              >
                <Reply size={16} className="mr-1" />
                {t('send')}
              </Button>
            </div>
          )}
          
          {showReplyForm && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Reply</h3>
              <FeedbackForm
                receiverId={feedback.senderId}
                replyToId={feedback.id}
                onSuccess={handleClose}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
