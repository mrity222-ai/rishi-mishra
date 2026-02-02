'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { ImageIcon, Save } from 'lucide-react';

// ✅ DB MATCHED SCHEMA
const heroFormSchema = z.object({
  subtitle: z.string().min(5, 'Description must be at least 5 characters'),
  display_order: z.coerce.number().min(0),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

interface HeroItem {
  id?: number;
  imageUrl?: string;
  description: string;
  display_order: number;
}

interface HeroFormProps {
  heroImage?: HeroItem | null;
  onSave: (data: FormData) => void;
}

export function HeroForm({ heroImage, onSave }: HeroFormProps) {

  // ✅ Correct image path
  const imgPath = heroImage?.imageUrl
    ? `http://localhost:5000/uploads/hero/${heroImage.imageUrl}`
    : null;

  const [previewUrl, setPreviewUrl] = useState<string | null>(imgPath);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      subtitle: heroImage?.description || '',
      display_order: heroImage?.display_order || 0,
    },
  });

  useEffect(() => {
    if (heroImage) {
      form.reset({
        subtitle: heroImage.description,
        display_order: heroImage.display_order,
      });
      setPreviewUrl(
        heroImage.imageUrl
          ? `http://localhost:5000/uploads/hero/${heroImage.imageUrl}`
          : null
      );
    }
  }, [heroImage, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (values: HeroFormValues) => {
    const formData = new FormData();

    // ✅ DB matched keys
    formData.append('subtitle', values.subtitle); // maps to description
    formData.append('display_order', values.display_order.toString());

    if (selectedFile) {
      formData.append('hero', selectedFile); // multer field
    }

    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Upload Hero Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                <p className="text-[10px] text-muted-foreground italic">
                  Leave empty to keep existing image
                </p>
              </div>

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Hero description text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative aspect-video border rounded-xl flex items-center justify-center bg-slate-50">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <ImageIcon className="h-10 w-10 opacity-20" />
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {heroImage ? 'Update Hero' : 'Create Hero'}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
