'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

// Schema update: Image URL ki jagah ab hum title aur optional file validation use karenge
const galleryFormSchema = z.object({
  title: z.string().min(3, 'Title is required (min 3 chars)'),
  // File validation manually handle karenge handleSave mein
});

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

interface GalleryFormProps {
  galleryImage?: any | null;
  onSave: (formData: FormData) => Promise<void>;
}

export function GalleryForm({ galleryImage, onSave }: GalleryFormProps) {
  const isEditing = !!galleryImage;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: galleryImage?.title || '',
    },
  });

  // Preview logic
  useEffect(() => {
    if (galleryImage?.image) {
      setPreviewUrl(`http://localhost:5000/uploads/gallery/${galleryImage.image}`);
    }
  }, [galleryImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: GalleryFormValues) => {
    if (!selectedFile && !isEditing) {
      alert("Please select an image first!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      if (selectedFile) {
        formData.append('gallery', selectedFile); // Backend 'gallery' field expect kar raha hai
      }
      
      await onSave(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Side: Upload Zone */}
            <div className="space-y-4">
              <Label>Photo Upload</Label>
              <div 
                className={`relative aspect-square rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-muted/30 ${
                  !previewUrl ? 'hover:border-primary hover:bg-primary/5' : 'border-solid border-border'
                }`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(isEditing ? `http://localhost:5000/uploads/gallery/${galleryImage.image}` : null);
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <span className="text-sm font-medium">Click to upload photo</span>
                    <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Right Side: Details */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Title / Caption</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Annual Function 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                  <ImageIcon size={14} /> Info
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Image will be stored on your local server. For best results, use a 1:1 square or 4:3 landscape ratio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Photo' : 'Upload to Gallery'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}