
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppSettingsProvider } from "@/contexts/AppSettingsContext";
import { DocumentsProvider } from "@/contexts/DocumentsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { CourseProvider } from "@/contexts/CourseContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyDocuments from "./pages/MyDocuments";
import Upload from "./pages/Upload";
import DraftDocuments from "./pages/DraftDocuments";
import Courses from "./pages/Courses";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDocuments from "./pages/admin/AdminDocuments";
import PendingDocuments from "./pages/admin/PendingDocuments";
import AdminFeedback from "./pages/admin/AdminFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppSettingsProvider>
        <AuthProvider>
          <DocumentsProvider>
            <NotificationProvider>
              <FeedbackProvider>
                <CourseProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      
                      {/* Student Routes */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/my-documents" element={<MyDocuments />} />
                      <Route path="/upload" element={<Upload />} />
                      <Route path="/drafts" element={<DraftDocuments />} />
                      <Route path="/courses" element={<Courses />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/settings" element={<Settings />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/documents" element={<AdminDocuments />} />
                      <Route path="/admin/pending" element={<PendingDocuments />} />
                      <Route path="/admin/feedback" element={<AdminFeedback />} />
                      
                      {/* Redirect root to login */}
                      <Route path="/" element={<Navigate to="/login" replace />} />
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </CourseProvider>
              </FeedbackProvider>
            </NotificationProvider>
          </DocumentsProvider>
        </AuthProvider>
      </AppSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
