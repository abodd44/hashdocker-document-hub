
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { FileUploadForm } from '@/components/document/FileUploadForm';
import { useDocuments, Document } from '@/contexts/DocumentsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DocumentCard from '@/components/document/DocumentCard';
import DocumentPreview from '@/components/document/DocumentPreview';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const MyDocument: React.FC = () => {
  const { t } = useAppSettings();
  const { user } = useAuth();
  const { documents, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  if (!user) return null;
  
  // Get user documents and filter them
  const userDocuments = documents.filter(doc => doc.userId === user.id);
  
  const filteredDocuments = userDocuments.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesSearch;
  });
  
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
    console.log('Edit document:', document);
  };
  
  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('myDocument')}</h1>
        
        {/* File Upload Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('uploadNewFile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploadForm />
          </CardContent>
        </Card>
        
        {/* Search and Files List */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('myFiles')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Documents List */}
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {t('noFiles')}
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
          </CardContent>
        </Card>
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
              This action cannot be undone. This will permanently delete the file
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

export default MyDocument;
