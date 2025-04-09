
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  FileEdit,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Document } from '@/contexts/DocumentsContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  viewOnly?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  viewOnly = false
}) => {
  const { t } = useAppSettings();

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(document.createdAt), { addSuffix: true });
  
  // Get status badge color
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <FileText size={18} className="mr-2 text-hashBlue" />
              {document.title}
            </CardTitle>
            <CardDescription>{document.originalFileName}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">{t('course')}:</span> {document.courseId || 'N/A'}
          </div>
          <div>
            <span className="font-medium">{t('submissionDate')}:</span> {formattedDate}
          </div>
          <div className="col-span-2">
            <span className="font-medium">{t('documentType')}:</span> {document.type.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onView(document)}
        >
          <Eye size={16} className="mr-1" />
          {t('view')}
        </Button>
        
        {!viewOnly && onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(document)}
          >
            <FileEdit size={16} className="mr-1" />
            {t('edit')}
          </Button>
        )}
        
        {!viewOnly && onDelete && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(document)}
          >
            <Trash2 size={16} className="mr-1" />
            {t('delete')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
