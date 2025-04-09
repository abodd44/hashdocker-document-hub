
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useDocuments, Document } from '@/contexts/DocumentsContext';
import { useNotification } from '@/contexts/NotificationContext';
import DocumentCard from '@/components/document/DocumentCard';
import DocumentPreview from '@/components/document/DocumentPreview';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

const AdminDocuments: React.FC = () => {
  const { t } = useAppSettings();
  const { documents, approveDocument, rejectDocument } = useDocuments();
  const { documentStatusChanged } = useNotification();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };
  
  const handleApprove = (document: Document, comments: string) => {
    approveDocument(document.id, comments);
    documentStatusChanged(document, 'approved', comments);
  };
  
  const handleReject = (document: Document, comments: string) => {
    rejectDocument(document.id, comments);
    documentStatusChanged(document, 'rejected', comments);
  };
  
  return (
    <MainLayout adminOnly>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('allDocuments')}</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">{t('pending')}</SelectItem>
              <SelectItem value="approved">{t('approved')}</SelectItem>
              <SelectItem value="rejected">{t('rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('noDocuments')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={handleView}
                viewOnly
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Document Preview Modal */}
      <DocumentPreview 
        document={selectedDocument} 
        open={showPreview} 
        onOpenChange={setShowPreview}
        onApprove={handleApprove}
        onReject={handleReject}
        isAdmin
      />
    </MainLayout>
  );
};

export default AdminDocuments;
