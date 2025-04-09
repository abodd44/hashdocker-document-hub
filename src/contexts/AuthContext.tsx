
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export type UserRole = 'student' | 'admin' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  courses?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data for demonstration
const mockStudents = [
  { 
    id: '1234567', 
    password: 'student123', 
    name: 'Ahmed Al-Jordani',
    role: 'student' as const,
    profilePicture: '/profile-student.jpg',
    courses: ['CS101', 'MATH201', 'ENG105']
  }
];

const mockAdmins = [
  { 
    id: '7654321', 
    password: 'admin123', 
    name: 'Dr. Mohammad Hashemi',
    role: 'admin' as const,
    profilePicture: '/profile-admin.jpg'
  }
];

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (id: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let foundUser;
    if (role === 'student') {
      foundUser = mockStudents.find(s => s.id === id && s.password === password);
    } else if (role === 'admin') {
      foundUser = mockAdmins.find(a => a.id === id && a.password === password);
    }

    if (foundUser) {
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid ID or password. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
