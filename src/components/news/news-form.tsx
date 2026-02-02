'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { ImageIcon, UploadCloud, X, Loader2, Languages, Save } from 'lucide-react';

// Form Validation Schema
const newsFormSchema = z.object({
  titleEn: z.string().min(5, 'English title must be at least 5 characters.'),
  titleHi: z.string().min(5, 'Hindi title is required.'),
  contentEn: z.string().min(20, 'English content is too short.'),
  contentHi: z.string().min(20, 'Hindi content is too short.'),
  category: z.string().min(1, 'Please select a category'),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

interface NewsItem {
  id?: number | string;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  image?: string;
  category?: string;
}

interface NewsFormProps {
  article?: NewsItem | null;
  onSave: (formData: FormData) => void;
  isSaving?: boolean;
}

export function NewsForm({ article, onSave, isSaving = false }: NewsFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      titleEn: article?.titleEn || '',
      titleHi: article?.titleHi || '',
      contentEn: article?.contentEn || '',
      contentHi: article?.contentHi || '',
      category: article?.category || 'General',
    },
  });

  // Handle existing image for edit mode
  useEffect(() => {
    if (article?.image && !selectedFile) {
      setPreviewUrl(`http://localhost:5000/uploads/news/${article.image}`);
    }
  }, [article]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(article?.image ? `http://localhost:5000/uploads/news/${article.image}` : null);
  };

  const onSubmit = (values: NewsFormValues) => {
    const formData = new FormData();
    formData.append('titleEn', values.titleEn);
    formData.append('titleHi', values.titleHi);
    formData.append('contentEn', values.contentEn);
    formData.append('contentHi', values.contentHi);
    formData.append('category', values.category);
    
    // 'news' field name must match backend: upload.single('news')
    if (selectedFile) {
      formData.append('news', selectedFile);
    }
    
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Languages className="h-5 w-5" /> Dual-Language Entry Enabled
            </div>
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                    <FormLabel className="font-bold text-xs uppercase tracking-wider">Category:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-[160px] h-9 shadow-sm">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Alert">Alert</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English Section */}
          <div className="space-y-4 p-4 rounded-xl border bg-card">
            <Badge variant="secondary" className="mb-2">English Content</Badge>
            <FormField control={form.control} name="titleEn" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Headline</FormLabel>
                <FormControl><Input placeholder="News title in English..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contentEn" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Article Body</FormLabel>
                <FormControl><Textarea rows={8} className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Hindi Section */}
          <div className="space-y-4 p-4 rounded-xl border bg-primary/5 border-primary/10">
            <Badge className="mb-2 bg-primary">हिंदी सामग्री</Badge>
            <FormField control={form.control} name="titleHi" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-primary">मुख्य शीर्षक</FormLabel>
                <FormControl><Input className="font-hindi border-primary/20" placeholder="हिंदी में शीर्षक..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contentHi" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-primary">समाचार का विवरण</FormLabel>
                <FormControl><Textarea rows={8} className="font-hindi resize-none border-primary/20" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Media Upload Area */}
        <div className="p-6 border-2 border-dashed rounded-2xl bg-muted/30">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
                <label className="flex flex-col items-center justify-center h-40 border-2 border-primary/20 border-dashed rounded-xl cursor-pointer bg-background hover:bg-primary/5 transition-all">
                    <UploadCloud className="h-10 w-10 text-primary mb-2" />
                    <span className="text-sm font-bold">Click to Upload Feature Image</span>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>
            <div className="w-full md:w-1/2 h-40 relative rounded-xl overflow-hidden border bg-muted">
                {previewUrl ? (
                    <>
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                        <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={removeSelectedFile}><X className="h-4 w-4"/></Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20"><ImageIcon className="h-12 w-12" /></div>
                )}
            </div>
          </div>
        </div>

        <Button disabled={isSaving} type="submit" className="w-full h-14 text-lg font-bold shadow-xl">
          {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
          {article ? 'Update Article' : 'Publish News Article'}
        </Button>
      </form>
    </Form>
  );
}