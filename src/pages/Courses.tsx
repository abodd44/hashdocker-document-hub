
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CourseContext';
import CourseCard from '@/components/course/CourseCard';

const Courses: React.FC = () => {
  const { user } = useAuth();
  const { t } = useAppSettings();
  const { getStudentCourses } = useCourses();
  
  if (!user) return null;
  
  const courses = user.role === 'student' ? getStudentCourses(user.id) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('courses')}</h1>
        
        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No courses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Courses;
