
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/contexts/CourseContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Upload, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { t } = useAppSettings();
  const navigate = useNavigate();
  
  const handleUpload = () => {
    navigate('/upload', { state: { courseId: course.id } });
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <BookOpen size={20} className="mr-2 text-hashBlue" />
          {course.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="mb-4 flex-1">
          <h3 className="font-semibold">{course.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Instructor: {course.instructor}
          </p>
          {course.schedule && (
            <p className="text-sm text-gray-500 mt-1">
              Schedule: {course.schedule}
            </p>
          )}
          {course.description && (
            <p className="text-sm mt-3 line-clamp-3">
              {course.description}
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleUpload}
            size="sm"
            className="flex items-center"
          >
            <Upload size={16} className="mr-1" />
            {t('uploadDocument')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
