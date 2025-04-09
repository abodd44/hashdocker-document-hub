
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Send } from 'lucide-react';

// Define the schema for the feedback form
const formSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  receiverId: string;
  onSuccess?: () => void;
  replyToId?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ receiverId, onSuccess, replyToId }) => {
  const { t } = useAppSettings();
  const { sendFeedback, replyToFeedback } = useFeedback();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      if (replyToId) {
        await replyToFeedback(replyToId, data.message);
      } else {
        await sendFeedback(receiverId, data.subject, data.message);
      }
      
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!replyToId && (
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('subject')}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('feedbackPlaceholder')} 
                  rows={5}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" className="flex items-center">
            <Send size={16} className="mr-1" />
            {t('send')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
