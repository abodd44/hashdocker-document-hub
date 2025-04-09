
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Moon, Sun, Languages } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, language, setLanguage, t } = useAppSettings();
  
  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  
  if (!user) return null;
  
  const handleUpdateProfile = () => {
    updateUser({ name, profilePicture });
    toast({
      title: t('profileUpdated'),
      description: "Your profile has been successfully updated.",
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('settings')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('editProfile')}</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePicture || "https://github.com/shadcn.png"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-url">Profile Picture URL</Label>
                <Input 
                  id="profile-url" 
                  placeholder="https://example.com/image.jpg" 
                  value={profilePicture || ''} 
                  onChange={(e) => setProfilePicture(e.target.value)} 
                />
              </div>
              
              <Button 
                onClick={handleUpdateProfile}
                className="w-full mt-4"
              >
                {t('save')}
              </Button>
            </CardContent>
          </Card>
          
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Change how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className={`w-full h-20 ${theme === 'light' ? 'border-2 border-hashBlue' : ''}`}
                      onClick={() => theme !== 'light' && toggleTheme()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Sun size={24} />
                        <span>{t('lightMode')}</span>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className={`w-full h-20 ${theme === 'dark' ? 'border-2 border-hashBlue' : ''}`}
                      onClick={() => theme !== 'dark' && toggleTheme()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Moon size={24} />
                        <span>{t('darkMode')}</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Language Settings */}
              <div className="space-y-4">
                <Label>Language</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant={language === 'en' ? 'default' : 'outline'}
                      className={`w-full h-20 ${language === 'en' ? 'border-2 border-hashBlue' : ''}`}
                      onClick={() => language !== 'en' && setLanguage('en')}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Languages size={24} />
                        <span>{t('english')}</span>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant={language === 'ar' ? 'default' : 'outline'}
                      className={`w-full h-20 ${language === 'ar' ? 'border-2 border-hashBlue' : ''}`}
                      onClick={() => language !== 'ar' && setLanguage('ar')}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Languages size={24} />
                        <span>{t('arabic')}</span>
                      </div>
                    </Button>
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

export default Settings;
