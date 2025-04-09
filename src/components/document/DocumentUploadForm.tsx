
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CourseContext';
import { useDocuments, DocumentType } from '@/contexts/DocumentsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Save, FileText } from 'lucide-react';

// Define form schema with zod
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['homework', 'absence', 'grade_review', 'other'] as const),
  courseId: z.string().optional(),
  file: z.instanceof(File).refine(
    (file) => {
      const acceptableFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'text/plain'
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      return acceptableFileTypes.includes(file.type) && 
             file.size <= maxSize &&
             !file.type.startsWith('video/') && 
             !file.type.startsWith('audio/');
    },
    'File must be a document, image, or text file under 5MB (no audio/video)'
  )
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentUploadFormProps {
  onUploadComplete?: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onUploadComplete }) => {
  const { t } = useAppSettings();
  const { uploadDocument } = useDocuments();
  const { user } = useAuth();
  const { getStudentCourses } = useCourses();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'homework',
    },
  });

  const userCourses = user ? getStudentCourses(user.id) : [];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      form.setValue('file', files[0]);
    }
  };

  const onSubmit = async (data: FormValues, isDraft: boolean = false) => {
    try {
      // In a real application, you would upload the file to a server
      // Here we simulate the process by creating object URLs
      const fileUrl = URL.createObjectURL(data.file);
      
      await uploadDocument({
        title: data.title,
        type: data.type as DocumentType,
        fileUrl,
        courseId: data.courseId,
        originalFileName: data.file.name,
      }, isDraft);

      form.reset();
      setSelectedFile(null);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while uploading the document.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Upload size={24} className="mr-2 text-hashBlue" />
          {t('uploadTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('documentTitle')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('documentType')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="homework">{t('documentTypeHomework')}</SelectItem>
                      <SelectItem value="absence">{t('documentTypeAbsence')}</SelectItem>
                      <SelectItem value="grade_review">{t('documentTypeGradeReview')}</SelectItem>
                      <SelectItem value="other">{t('documentTypeOther')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {userCourses.length > 0 && (
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('course')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>{t('fileUpload')}</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                      <Label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FileText size={36} className="text-hashBlue mb-2" />
                        {selectedFile ? (
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                        ) : (
                          <span className="text-sm text-gray-500">Click to upload file</span>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                        />
                      </Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const values = form.getValues();
                  const isValid = form.formState.isValid;
                  
                  if (isValid) {
                    onSubmit(values, true);
                  } else {
                    form.trigger();
                  }
                }}
                className="flex items-center"
              >
                <Save size={16} className="mr-1" />
                {t('saveAsDraft')}
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  const values = form.getValues();
                  const isValid = form.formState.isValid;
                  
                  if (isValid) {
                    onSubmit(values);
                  } else {
                    form.trigger();
                  }
                }}
                className="flex items-center"
              >
                <Upload size={16} className="mr-1" />
                {t('uploadButton')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadForm;
