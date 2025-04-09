
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useDocuments, Document } from '@/contexts/DocumentsContext';
import { useNotification } from '@/contexts/NotificationContext';
import DocumentCard from '@/components/document/DocumentCard';
import DocumentPreview from '@/components/document/DocumentPreview';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const PendingDocuments: React.FC = () => {
  const { t } = useAppSettings();
  const { documents, approveDocument, rejectDocument } = useDocuments();
  const { documentStatusChanged } = useNotification();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Get only pending documents
  const pendingDocuments = documents.filter(doc => doc.status === 'pending');
  
  // Filter documents by search
  const filteredDocuments = pendingDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
        <h1 className="text-3xl font-bold">{t('pendingDocuments')}</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pending documents found.
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

export default PendingDocuments;
