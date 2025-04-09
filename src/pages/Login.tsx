
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { LockKeyhole, User } from 'lucide-react';

// Define form schema with zod
const formSchema = z.object({
  id: z.string().length(7, 'University ID must be 7 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, theme, toggleTheme, language, setLanguage } = useAppSettings();
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const success = await login(data.id, data.password, role);
      if (success) {
        navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? "🔆" : "🌙"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="rounded-full"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-16 w-16 mb-2">
            <img 
              src="/logo-hu.png" 
              alt="Hashemite University Logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <CardTitle className="text-2xl text-center text-hashBlue">HashDoc</CardTitle>
          <CardDescription className="text-center">
            {t('welcome')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" onValueChange={(value) => setRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">{t('studentLogin')}</TabsTrigger>
              <TabsTrigger value="admin">{t('adminLogin')}</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('universityId')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input className="pl-10" placeholder="1234567" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input className="pl-10" type="password" placeholder="******" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-hashBlue hover:bg-hashBlue-600"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : t('loginButton')}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="px-8 text-center text-sm text-gray-500">
            The Hashemite University Document Management System
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
