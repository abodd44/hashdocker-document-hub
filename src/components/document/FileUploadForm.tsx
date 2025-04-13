
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDocuments } from '@/contexts/DocumentsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { toast } from '@/components/ui/use-toast';
import { Upload, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Define form schema with zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file: z.instanceof(File).optional()
});

type FormValues = z.infer<typeof formSchema>;

export const FileUploadForm: React.FC = () => {
  const { t } = useAppSettings();
  const { uploadDocument } = useDocuments();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      form.setValue('file', files[0]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (!selectedFile) {
        toast({
          title: "Error",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        return;
      }

      const fileUrl = URL.createObjectURL(selectedFile);
      
      await uploadDocument({
        title: data.title,
        type: 'other',
        fileUrl,
        originalFileName: selectedFile.name,
        isDraft: false
      }, false);

      form.reset();
      setSelectedFile(null);
      
      toast({
        title: t('uploadSuccess'),
        description: data.title
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while uploading the file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fileTitle')}</FormLabel>
              <FormControl>
                <Input placeholder="Enter file title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>{t('selectFile')}</FormLabel>
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
                      <span className="text-sm text-gray-500">{t('clickToUpload')}</span>
                    )}
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="flex items-center"
            disabled={!selectedFile}
          >
            <Upload size={16} className="mr-2" />
            {t('upload')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
