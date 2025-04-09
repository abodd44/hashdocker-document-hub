
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Link } from 'react-router-dom';
import { FileText, Upload, FileEdit, BookOpen, MessageSquare, Settings } from 'lucide-react';

interface ActionProps {
  icon: React.ReactNode;
  label: string;
  link: string;
  color?: string;
}

const Action: React.FC<ActionProps> = ({ icon, label, link, color = "bg-hashBlue hover:bg-hashBlue-600" }) => {
  return (
    <Link to={link}>
      <Button
        variant="outline"
        className={`h-24 w-full border-2 flex flex-col items-center justify-center gap-2 hover:${color} hover:text-white transition-colors`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Button>
    </Link>
  );
};

interface DashboardActionsProps {
  userRole: 'student' | 'admin';
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ userRole }) => {
  const { t } = useAppSettings();
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userRole === 'student' && (
            <>
              <Action 
                icon={<FileText size={24} />} 
                label={t('myDocuments')} 
                link="/my-documents" 
              />
              <Action 
                icon={<Upload size={24} />} 
                label={t('uploadDocument')} 
                link="/upload" 
                color="bg-green-600 hover:bg-green-700" 
              />
              <Action 
                icon={<FileEdit size={24} />} 
                label={t('draftDocuments')} 
                link="/drafts" 
              />
              <Action 
                icon={<BookOpen size={24} />} 
                label={t('courses')} 
                link="/courses" 
              />
              <Action 
                icon={<MessageSquare size={24} />} 
                label={t('feedback')} 
                link="/feedback" 
              />
              <Action 
                icon={<Settings size={24} />} 
                label={t('settings')} 
                link="/settings" 
              />
            </>
          )}
          
          {userRole === 'admin' && (
            <>
              <Action 
                icon={<FileText size={24} />} 
                label={t('allDocuments')} 
                link="/admin/documents" 
              />
              <Action 
                icon={<FileText size={24} />} 
                label={t('pendingDocuments')} 
                link="/admin/pending" 
                color="bg-yellow-600 hover:bg-yellow-700" 
              />
              <Action 
                icon={<MessageSquare size={24} />} 
                label={t('feedback')} 
                link="/admin/feedback" 
              />
              <Action 
                icon={<Settings size={24} />} 
                label={t('settings')} 
                link="/settings" 
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActions;
