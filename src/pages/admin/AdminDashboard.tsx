
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useDocuments } from '@/contexts/DocumentsContext';
import StatCard from '@/components/dashboard/StatCard';
import DashboardActions from '@/components/dashboard/DashboardActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { t } = useAppSettings();
  const { documents } = useDocuments();
  
  const pendingDocs = documents.filter(doc => doc.status === 'pending').length;
  const approvedDocs = documents.filter(doc => doc.status === 'approved').length;
  const rejectedDocs = documents.filter(doc => doc.status === 'rejected').length;
  
  return (
    <MainLayout adminOnly>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title={t('allDocuments')} 
            value={documents.length} 
            icon={<FileText size={24} />} 
          />
          <StatCard 
            title={t('pending')} 
            value={pendingDocs} 
            icon={<Clock size={24} />} 
            color="bg-yellow-500"
          />
          <StatCard 
            title={t('approved')} 
            value={approvedDocs} 
            icon={<CheckCircle2 size={24} />} 
            color="bg-green-500"
          />
          <StatCard 
            title={t('rejected')} 
            value={rejectedDocs} 
            icon={<XCircle size={24} />} 
            color="bg-red-500"
          />
        </div>
        
        <DashboardActions userRole="admin" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Documents */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map(doc => (
                    <div key={doc.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.userName}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          doc.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {t(doc.status)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Today's Date:</span> {format(new Date(), 'PPP')}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Documents</span>
                    <span className="font-medium">{pendingDocs}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(pendingDocs / documents.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Approved Documents</span>
                    <span className="font-medium">{approvedDocs}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(approvedDocs / documents.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Rejected Documents</span>
                    <span className="font-medium">{rejectedDocs}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(rejectedDocs / documents.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
