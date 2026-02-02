'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { ImageIcon, Save, UploadCloud } from 'lucide-react';

const initiativeFormSchema = z.object({
  titleHi: z.string().min(2, 'Hindi Title is required'),
  titleEn: z.string().min(2, 'English Title is required'),
  descriptionHi: z.string().min(10, 'Hindi description is required'),
  descriptionEn: z.string().min(10, 'English description is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and hyphenated (e.g., test-slug)'),
  display_order: z.coerce.number().int().nonnegative(),
});

type InitiativeFormValues = z.infer<typeof initiativeFormSchema>;

export function InitiativeForm({ initiative, onSave }: { initiative?: any, onSave: (formData: FormData) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<InitiativeFormValues>({
    resolver: zodResolver(initiativeFormSchema),
    defaultValues: {
      titleHi: '',
      titleEn: '',
      descriptionHi: '',
      descriptionEn: '',
      slug: '',
      display_order: 0,
    },
  });

  // Watch titleEn to suggest slug automatically
  const watchedTitleEn = form.watch('titleEn');
  useEffect(() => {
    if (!initiative && watchedTitleEn) {
      const suggestedSlug = watchedTitleEn
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      form.setValue('slug', suggestedSlug);
    }
  }, [watchedTitleEn, form, initiative]);

  useEffect(() => {
    if (initiative) {
      form.reset({
        titleHi: initiative.titleHi || '',
        titleEn: initiative.titleEn || '',
        descriptionHi: initiative.descriptionHi || '',
        descriptionEn: initiative.descriptionEn || '',
        slug: initiative.slug || '',
        display_order: initiative.display_order || 0,
      });
      if (initiative.image) {
        setPreviewUrl(`http://localhost:5000/uploads/initiatives/${initiative.image}`);
      }
    }
  }, [initiative, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: InitiativeFormValues) => {
    const formData = new FormData();
    formData.append('slug', values.slug);
    formData.append('titleHi', values.titleHi);
    formData.append('titleEn', values.titleEn);
    formData.append('descriptionHi', values.descriptionHi);
    formData.append('descriptionEn', values.descriptionEn);
    formData.append('display_order', values.display_order.toString());

    if (selectedFile) {
      formData.append('initiative_img', selectedFile);
    }
    
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="titleHi" render={({ field }) => (
            <FormItem>
              <FormLabel>Title (Hindi)</FormLabel>
              <FormControl><Input placeholder="उदा. शिक्षा सहायता" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="titleEn" render={({ field }) => (
            <FormItem>
              <FormLabel>Title (English)</FormLabel>
              <FormControl><Input placeholder="e.g. Education Support" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug (Unique)</FormLabel>
              <FormControl><Input placeholder="education-support" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="display_order" render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="descriptionHi" render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Hindi)</FormLabel>
            <FormControl><Textarea rows={4} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="descriptionEn" render={({ field }) => (
          <FormItem>
            <FormLabel>Description (English)</FormLabel>
            <FormControl><Textarea rows={4} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end border-t pt-4">
          <FormItem>
            <FormLabel>Upload Image</FormLabel>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click to upload</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </FormItem>

          <div className="h-32 w-full rounded-lg border flex items-center justify-center overflow-hidden bg-black/5">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-10 w-10 opacity-20" />
            )}
          </div>
        </div>

        <Button type="submit" className="w-full gap-2 py-6 text-lg bg-green-600 hover:bg-green-700">
          <Save className="h-5 w-5" />
          {initiative ? 'Update Initiative' : 'Save to Database'}
        </Button>
      </form>
    </Form>
  );
}