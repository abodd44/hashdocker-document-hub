
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CourseContext';
import { useDocuments } from '@/contexts/DocumentsContext';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import DashboardActions from '@/components/dashboard/DashboardActions';
import CourseCard from '@/components/course/CourseCard';
import { FileText, Upload, CheckCircle2, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useAppSettings();
  const { getStudentCourses } = useCourses();
  const { documents, draftDocuments } = useDocuments();
  
  if (!user) return null;
  
  const userDocuments = documents.filter(doc => doc.userId === user.id);
  const pendingDocs = userDocuments.filter(doc => doc.status === 'pending').length;
  const approvedDocs = userDocuments.filter(doc => doc.status === 'approved').length;
  const totalDocs = userDocuments.length;
  
  const courses = user.role === 'student' ? getStudentCourses(user.id) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        
        {user.role === 'student' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                title={t('myDocuments')} 
                value={totalDocs} 
                icon={<FileText size={24} />} 
              />
              <StatCard 
                title={t('draftDocuments')} 
                value={draftDocuments.length} 
                icon={<Upload size={24} />} 
                color="bg-purple-500"
              />
              <StatCard 
                title={t('approved')} 
                value={approvedDocs} 
                icon={<CheckCircle2 size={24} />} 
                color="bg-green-500"
              />
              <StatCard 
                title={t('pending')} 
                value={pendingDocs} 
                icon={<Clock size={24} />} 
                color="bg-yellow-500"
              />
            </div>

            <DashboardActions userRole="student" />
            
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('courses')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </>
        )}
        
        {user.role === 'admin' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title={t('allDocuments')} 
                value={documents.length} 
                icon={<FileText size={24} />} 
              />
              <StatCard 
                title={t('approved')} 
                value={documents.filter(doc => doc.status === 'approved').length} 
                icon={<CheckCircle2 size={24} />} 
                color="bg-green-500"
              />
              <StatCard 
                title={t('pending')} 
                value={documents.filter(doc => doc.status === 'pending').length} 
                icon={<Clock size={24} />} 
                color="bg-yellow-500"
              />
            </div>
            
            <DashboardActions userRole="admin" />
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {documents
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 5)
                    .map(doc => (
                      <div key={doc.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-gray-500">{doc.userName}</p>
                        </div>
                        <div className="flex items-center">
                          {doc.status === 'approved' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {t('approved')}
                            </span>
                          )}
                          {doc.status === 'pending' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              {t('pending')}
                            </span>
                          )}
                          {doc.status === 'rejected' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              {t('rejected')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
