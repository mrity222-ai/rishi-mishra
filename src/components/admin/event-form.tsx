'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  MapPin, 
  ImageIcon, 
  Save, 
  UploadCloud, 
  Loader2 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/* ================= VALIDATION SCHEMA ================= */
const eventFormSchema = z.object({
  eventName: z.string().min(5, 'Event name kam se kam 5 characters ka hona chahiye'),
  date: z.string().min(1, 'Date zaroori hai'), // Input type="date" string return karta hai
  location: z.string().min(3, 'Location zaroori hai'),
  descriptionHi: z.string().min(20, 'Hindi description kam se kam 20 characters ki honi chahiye'),
  descriptionEn: z.string().min(20, 'English description kam se kam 20 characters ki honi chahiye'),
  image: z.any().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventItem {
  id?: number;
  eventName: string;
  date: string | Date;
  location: string;
  descriptionHi: string;
  descriptionEn: string;
  image?: string;
}

interface EventFormProps {
  event?: EventItem | null;
  onSave: (formData: FormData) => Promise<void>;
}

/* ================= COMPONENT ================= */
export function EventForm({ event, onSave }: EventFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: event?.eventName || '',
      location: event?.location || '',
      descriptionHi: event?.descriptionHi || '',
      descriptionEn: event?.descriptionEn || '',
      // Date ko YYYY-MM-DD format mein convert karna zaroori hai input field ke liye
      date: event?.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
      image: undefined,
    },
  });

  const selectedFile = form.watch('image');

  // Handle Image Preview
  useEffect(() => {
    if (selectedFile instanceof File) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (event?.image) {
      setPreviewUrl(`http://localhost:5000/uploads/events/${event.image}`);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile, event]);

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('eventName', values.eventName);
      formData.append('location', values.location);
      formData.append('descriptionHi', values.descriptionHi);
      formData.append('descriptionEn', values.descriptionEn);
      
      // Backend (MySQL) ke liye proper format: YYYY-MM-DD HH:mm:ss
      const mysqlDate = format(new Date(values.date), 'yyyy-MM-dd HH:mm:ss');
      formData.append('date', mysqlDate);

      if (values.image instanceof File) {
        formData.append('image', values.image);
      }

      await onSave(formData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-4 border rounded-lg bg-white shadow-sm">
        
        {/* EVENT NAME */}
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Annual Function 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DATE & LOCATION GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold">
                  <CalendarIcon size={16} /> Date
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold">
                  <MapPin size={16} /> Location
                </FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai, India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DESCRIPTION HINDI */}
        <FormField
          control={form.control}
          name="descriptionHi"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Hindi Description (हिंदी विवरण)</FormLabel>
              <FormControl>
                <Textarea 
                  rows={4} 
                  placeholder="कार्यक्रम के बारे में लिखें..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION ENGLISH */}
        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">English Description</FormLabel>
              <FormControl>
                <Textarea 
                  rows={4} 
                  placeholder="Describe the event details..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IMAGE UPLOAD & PREVIEW */}
        <div className="grid md:grid-cols-2 gap-6 items-end">
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold">
                  <UploadCloud size={16} /> Event Image
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>
                  Update ke waqt agar image change nahi karni toh ise khali chhod dein.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden relative">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <ImageIcon className="mx-auto mb-2 opacity-40" size={32} />
                <p className="text-xs">No Image Selected</p>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold transition-all" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          {event ? 'Update Event Details' : 'Publish New Event'}
        </Button>
      </form>
    </Form>
  );
}