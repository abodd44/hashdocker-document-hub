
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import DocumentUploadForm from '@/components/document/DocumentUploadForm';

const Upload: React.FC = () => {
  const { t } = useAppSettings();
  const location = useLocation();
  const courseId = location.state?.courseId;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('uploadDocument')}</h1>
        
        <DocumentUploadForm initialCourseId={courseId} />
      </div>
    </MainLayout>
  );
};

export default Upload;
