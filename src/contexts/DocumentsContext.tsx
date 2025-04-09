
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useAppSettings } from './AppSettingsContext';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';
export type DocumentType = 'homework' | 'absence' | 'grade_review' | 'other';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  originalFileName: string;
  pdfUrl: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  courseId?: string;
  userId: string;
  userName: string;
  isDraft: boolean;
  comments?: string;
}

interface DocumentsContextType {
  documents: Document[];
  draftDocuments: Document[];
  uploadDocument: (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'pdfUrl' | 'userId' | 'userName'>, isDraft: boolean) => Promise<void>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  approveDocument: (id: string, comments?: string) => Promise<void>;
  rejectDocument: (id: string, comments?: string) => Promise<void>;
  getDocumentsByUser: (userId: string) => Document[];
  getPendingDocuments: () => Document[];
}

// Mock initial documents data
const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Database Assignment',
    type: 'homework',
    fileUrl: '/documents/assignment.docx',
    originalFileName: 'assignment.docx',
    pdfUrl: '/documents/assignment.pdf',
    status: 'approved',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-03-16T08:45:00Z',
    courseId: 'CS101',
    userId: '1234567',
    userName: 'Ahmed Al-Jordani',
    isDraft: false
  },
  {
    id: '2',
    title: 'Absence Request - Midterm Week',
    type: 'absence',
    fileUrl: '/documents/absence.docx',
    originalFileName: 'medical_note.docx',
    pdfUrl: '/documents/absence.pdf',
    status: 'pending',
    createdAt: '2023-04-10T14:20:00Z',
    updatedAt: '2023-04-10T14:20:00Z',
    courseId: 'MATH201',
    userId: '1234567',
    userName: 'Ahmed Al-Jordani',
    isDraft: false
  }
];

const initialDrafts: Document[] = [
  {
    id: 'draft-1',
    title: 'Grade Review - Final Exam',
    type: 'grade_review',
    fileUrl: '/documents/grade_review_draft.docx',
    originalFileName: 'grade_review_draft.docx',
    pdfUrl: '/documents/grade_review_draft.pdf',
    status: 'pending',
    createdAt: '2023-05-01T09:15:00Z',
    updatedAt: '2023-05-01T09:15:00Z',
    courseId: 'ENG105',
    userId: '1234567',
    userName: 'Ahmed Al-Jordani',
    isDraft: true
  }
];

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [draftDocuments, setDraftDocuments] = useState<Document[]>(initialDrafts);
  const { user } = useAuth();
  const { t } = useAppSettings();

  // Convert a file to PDF (mock implementation)
  const convertToPdf = async (file: string): Promise<string> => {
    // In a real app, this would call an API to convert the file
    // Here we just simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000));
    return file.replace(/\.[^/.]+$/, '.pdf');
  };

  const uploadDocument = async (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'pdfUrl' | 'userId' | 'userName'>, isDraft: boolean) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload documents",
        variant: "destructive"
      });
      return;
    }

    // Convert file to PDF
    const pdfUrl = await convertToPdf(data.fileUrl);

    const newDocument: Document = {
      ...data,
      id: `${isDraft ? 'draft-' : ''}${Date.now()}`,
      pdfUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      isDraft
    };

    if (isDraft) {
      setDraftDocuments(prev => [...prev, newDocument]);
      toast({
        title: t('draftSaved'),
        description: data.title
      });
    } else {
      setDocuments(prev => [...prev, newDocument]);
      toast({
        title: t('uploadSuccess'),
        description: data.title
      });
    }
  };

  const updateDocument = async (id: string, data: Partial<Document>) => {
    const isDraft = id.startsWith('draft-');
    
    if (isDraft) {
      setDraftDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, ...data, updatedAt: new Date().toISOString() } : doc
      ));
    } else {
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, ...data, updatedAt: new Date().toISOString() } : doc
      ));
    }

    toast({
      title: "Document updated",
      description: `${data.title || 'Document'} has been updated.`
    });
  };

  const deleteDocument = async (id: string) => {
    const isDraft = id.startsWith('draft-');
    
    if (isDraft) {
      setDraftDocuments(prev => prev.filter(doc => doc.id !== id));
    } else {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }

    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted."
    });
  };

  const approveDocument = async (id: string, comments?: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'approved', comments, updatedAt: new Date().toISOString() } : doc
    ));

    toast({
      title: "Document approved",
      description: "The document has been approved."
    });
  };

  const rejectDocument = async (id: string, comments?: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'rejected', comments, updatedAt: new Date().toISOString() } : doc
    ));

    toast({
      title: "Document rejected",
      description: "The document has been rejected."
    });
  };

  const getDocumentsByUser = (userId: string) => {
    return documents.filter(doc => doc.userId === userId);
  };

  const getPendingDocuments = () => {
    return documents.filter(doc => doc.status === 'pending');
  };

  return (
    <DocumentsContext.Provider value={{ 
      documents, 
      draftDocuments, 
      uploadDocument, 
      updateDocument,
      deleteDocument,
      approveDocument,
      rejectDocument,
      getDocumentsByUser,
      getPendingDocuments
    }}>
      {children}
    </DocumentsContext.Provider>
  );
};
