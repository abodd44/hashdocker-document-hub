
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Document } from '@/contexts/DocumentsContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface DocumentPreviewProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (document: Document, comments: string) => void;
  onReject?: (document: Document, comments: string) => void;
  isAdmin?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isAdmin = false
}) => {
  const { t } = useAppSettings();
  const [comments, setComments] = React.useState('');

  if (!document) return null;

  const getStatusBadge = () => {
    switch (document.status) {
      case 'approved':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 size={14} className="mr-1" />
            {t('approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle size={14} className="mr-1" />
            {t('rejected')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock size={14} className="mr-1" />
            {t('pending')}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <FileText size={20} className="mr-2" />
              {document.title}
            </DialogTitle>
            {getStatusBadge()}
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 my-3 text-sm">
          <div>
            <span className="font-medium">{t('submittedBy')}:</span> {document.userName}
          </div>
          <div>
            <span className="font-medium">{t('submissionDate')}:</span> {format(new Date(document.createdAt), 'PPP')}
          </div>
          <div>
            <span className="font-medium">{t('documentType')}:</span> {document.type.replace('_', ' ').toUpperCase()}
          </div>
          <div>
            <span className="font-medium">{t('course')}:</span> {document.courseId || 'N/A'}
          </div>
        </div>
        
        <div className="border rounded-md p-4 h-72 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <iframe 
            src={document.pdfUrl} 
            title={document.title}
            className="w-full h-full"
          />
        </div>
        
        {document.comments && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h4 className="font-medium mb-1">{t('comments')}:</h4>
            <p>{document.comments}</p>
          </div>
        )}
        
        {isAdmin && document.status === 'pending' && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">{t('comments')}:</label>
            <textarea 
              className="w-full p-2 border rounded-md dark:bg-gray-700 mb-3"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  onReject && onReject(document, comments);
                  onOpenChange(false);
                }}
              >
                <XCircle size={16} className="mr-1" />
                {t('deny')}
              </Button>
              
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onApprove && onApprove(document, comments);
                  onOpenChange(false);
                }}
              >
                <CheckCircle2 size={16} className="mr-1" />
                {t('approve')}
              </Button>
            </div>
          </div>
        )}
        
        {!isAdmin && (
          <div className="flex justify-end mt-3">
            <Button variant="outline" className="flex items-center">
              <Download size={16} className="mr-1" />
              {t('download')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
