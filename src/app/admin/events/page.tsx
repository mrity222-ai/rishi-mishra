'use client';

import { useState, useEffect } from 'react';
// Check carefully: components folder ke andar admin folder hai ya nahi?
// Agar error aaye to check karein: event-form.tsx vs EventForm.tsx
import { EventsManager } from '@/components/admin/events-manager'; 
import { EventForm } from '@/components/admin/event-form'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar } from 'lucide-react';

export default function AdminEventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const API_URL = 'http://localhost:5000/api/events';

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to load events from database.");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err);
      toast({
        title: "Database Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    const isEditing = !!selectedEvent;
    // EDIT ke liye URL change hoga e.g., /api/events/2
    const url = isEditing ? `${API_URL}/${selectedEvent.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: formData, // FormData directly bhej rahe hain for Multer (images)
      });

      if (res.ok) {
        toast({
          title: isEditing ? "Event Updated" : "Event Created",
          description: `Successfully saved event details.`,
        });
        setIsModalOpen(false);
        setSelectedEvent(null);
        fetchEvents(); 
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed.");
      }
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto py-10 px-4 space-y-8">
        <EventsManager 
          events={events}
          isLoading={isLoading}
          error={error}
          onAddNew={handleAddNewClick}
          onEdit={handleEditClick}
          onRefresh={fetchEvents}
        />

        <Dialog 
          open={isModalOpen} 
          onOpenChange={(open) => {
            if (!isSaving) { 
              setIsModalOpen(open);
              if (!open) setSelectedEvent(null);
            }
          }}
        >
          <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto sm:rounded-2xl shadow-2xl border-accent/20 bg-white">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                {selectedEvent ? 'Edit Event Details' : 'Register New Event'}
              </DialogTitle>
            </DialogHeader>
            
            {isSaving && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="font-semibold text-lg animate-pulse">Processing Event...</p>
                </div>
              </div>
            )}

            <EventForm 
              event={selectedEvent} 
              onSave={handleSave} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}