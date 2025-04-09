
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useDocuments, Document } from '@/contexts/DocumentsContext';
import DocumentCard from '@/components/document/DocumentCard';
import DocumentPreview from '@/components/document/DocumentPreview';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search } from 'lucide-react';

const DraftDocuments: React.FC = () => {
  const { user } = useAuth();
  const { t } = useAppSettings();
  const { draftDocuments, deleteDocument } = useDocuments();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  if (!user) return null;
  
  // Filter draft documents
  const filteredDocuments = draftDocuments.filter(doc => 
    doc.userId === user.id && 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id);
      setDocumentToDelete(null);
    }
  };
  
  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };
  
  const handleEdit = (document: Document) => {
    // In a real app, this would navigate to an edit page or open a modal
    console.log('Edit draft document:', document);
  };
  
  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('draftDocuments')}</h1>
        
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
        
        {/* Draft Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No draft documents found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!documentToDelete} 
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the draft
              "{documentToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default DraftDocuments;
