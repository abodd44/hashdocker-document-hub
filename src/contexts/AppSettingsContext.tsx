
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark';
type LanguageType = 'en' | 'ar';

interface AppSettingsContextType {
  theme: ThemeType;
  language: LanguageType;
  toggleTheme: () => void;
  setLanguage: (language: LanguageType) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// Sample translations
const translations = {
  en: {
    dashboard: "Dashboard",
    documents: "Documents",
    myDocuments: "My Documents",
    uploadDocument: "Upload Document",
    draftDocuments: "Draft Documents",
    courses: "Courses",
    feedback: "Feedback",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    welcome: "Welcome to HashDoc",
    studentLogin: "Student Login",
    adminLogin: "Admin Login",
    universityId: "University ID",
    password: "Password",
    loginButton: "Login",
    errorInvalidCredentials: "Invalid credentials",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    english: "English",
    arabic: "Arabic",
    uploadTitle: "Upload New Document",
    documentTitle: "Document Title",
    documentType: "Document Type",
    fileUpload: "File Upload",
    uploadButton: "Upload",
    documentTypeHomework: "Homework",
    documentTypeAbsence: "Excuse of Absence",
    documentTypeGradeReview: "Grade Review Request",
    documentTypeOther: "Other",
    deleteConfirm: "Are you sure you want to delete this document?",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    send: "Send",
    subject: "Subject",
    message: "Message",
    status: "Status",
    course: "Course",
    dueDate: "Due Date",
    saveAsDraft: "Save as Draft",
    viewDetails: "View Details",
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    editProfile: "Edit Profile",
    save: "Save",
    profileUpdated: "Profile updated successfully",
    feedbackTitle: "Send Feedback",
    feedbackPlaceholder: "Write your feedback here...",
    feedbackSent: "Feedback sent successfully",
    newFeedback: "New Feedback",
    allDocuments: "All Documents",
    pendingDocuments: "Pending Documents",
    search: "Search",
    notificationTitle: "Notifications",
    noNotifications: "No notifications",
    seeAll: "See All",
    approveDeny: "Approve/Deny",
    approve: "Approve",
    deny: "Deny",
    submittedBy: "Submitted by",
    submissionDate: "Submission Date",
    noDocuments: "No documents found",
    uploadSuccess: "Document uploaded successfully",
    draftSaved: "Draft saved successfully"
  },
  ar: {
    dashboard: "لوحة القيادة",
    documents: "المستندات",
    myDocuments: "مستنداتي",
    uploadDocument: "رفع مستند",
    draftDocuments: "مسودات المستندات",
    courses: "المساقات",
    feedback: "التغذية الراجعة",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    welcome: "مرحبًا بك في هاشدوك",
    studentLogin: "تسجيل دخول الطالب",
    adminLogin: "تسجيل دخول المسؤول",
    universityId: "الرقم الجامعي",
    password: "كلمة المرور",
    loginButton: "تسجيل الدخول",
    errorInvalidCredentials: "بيانات غير صحيحة",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    english: "الإنجليزية",
    arabic: "العربية",
    uploadTitle: "رفع مستند جديد",
    documentTitle: "عنوان المستند",
    documentType: "نوع المستند",
    fileUpload: "رفع الملف",
    uploadButton: "رفع",
    documentTypeHomework: "واجب منزلي",
    documentTypeAbsence: "عذر غياب",
    documentTypeGradeReview: "طلب مراجعة علامة",
    documentTypeOther: "أخرى",
    deleteConfirm: "هل أنت متأكد من حذف هذا المستند؟",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    view: "عرض",
    send: "إرسال",
    subject: "الموضوع",
    message: "الرسالة",
    status: "الحالة",
    course: "المساق",
    dueDate: "تاريخ الاستحقاق",
    saveAsDraft: "حفظ كمسودة",
    viewDetails: "عرض التفاصيل",
    approved: "مقبول",
    pending: "قيد المراجعة",
    rejected: "مرفوض",
    editProfile: "تعديل الملف الشخصي",
    save: "حفظ",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح",
    feedbackTitle: "إرسال تغذية راجعة",
    feedbackPlaceholder: "اكتب تغذيتك الراجعة هنا...",
    feedbackSent: "تم إرسال التغذية الراجعة بنجاح",
    newFeedback: "تغذية راجعة جديدة",
    allDocuments: "جميع المستندات",
    pendingDocuments: "المستندات المعلقة",
    search: "بحث",
    notificationTitle: "الإشعارات",
    noNotifications: "لا توجد إشعارات",
    seeAll: "عرض الكل",
    approveDeny: "قبول/رفض",
    approve: "قبول",
    deny: "رفض",
    submittedBy: "مقدم من",
    submissionDate: "تاريخ التقديم",
    noDocuments: "لا توجد مستندات",
    uploadSuccess: "تم رفع المستند بنجاح",
    draftSaved: "تم حفظ المسودة بنجاح"
  }
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

export const AppSettingsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Get theme from localStorage or use 'light' as default
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'light';
  });

  const [language, setLanguageState] = useState<LanguageType>(() => {
    // Get language from localStorage or use 'en' as default
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as LanguageType) || 'en';
  });

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply language class to document
    if (language === 'ar') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
  };

  // Translation function
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <AppSettingsContext.Provider value={{ 
      theme, 
      language, 
      toggleTheme, 
      setLanguage,
      translations,
      t
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
