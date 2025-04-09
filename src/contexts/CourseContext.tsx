
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  description?: string;
  schedule?: string;
}

interface CourseContextType {
  courses: Course[];
  getCourseById: (id: string) => Course | undefined;
  getStudentCourses: (studentId: string) => Course[];
}

// Mock courses data
const mockCourses: Course[] = [
  {
    id: 'CS101',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Mohammad Hashemi',
    description: 'This course introduces the fundamental concepts of computer science.',
    schedule: 'Sunday, Tuesday 10:00-11:30'
  },
  {
    id: 'MATH201',
    code: 'MATH201',
    name: 'Calculus II',
    instructor: 'Dr. Layla Al-Razi',
    description: 'Advanced calculus topics including integration techniques and series.',
    schedule: 'Monday, Wednesday 9:00-10:30'
  },
  {
    id: 'ENG105',
    code: 'ENG105',
    name: 'Academic English',
    instructor: 'Dr. Omar Khatib',
    description: 'Developing academic writing and communication skills for university students.',
    schedule: 'Tuesday, Thursday 13:00-14:30'
  }
];

// Mock student enrollments
const studentCourses: Record<string, string[]> = {
  '1234567': ['CS101', 'MATH201', 'ENG105']
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [courses] = useState<Course[]>(mockCourses);

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  const getStudentCourses = (studentId: string) => {
    const courseIds = studentCourses[studentId] || [];
    return courses.filter(course => courseIds.includes(course.id));
  };

  return (
    <CourseContext.Provider value={{
      courses,
      getCourseById,
      getStudentCourses
    }}>
      {children}
    </CourseContext.Provider>
  );
};
