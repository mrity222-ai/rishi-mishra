'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { useTranslation } from '@/hooks/use-translation';
import { Calendar, MapPin, Edit, Trash2, Plus, Loader2, ImageIcon } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

interface EventItem {
  id: number;
  eventName: string;
  location: string;
  date: string;
  image?: string;
}

interface EventsManagerProps {
  events: EventItem[] | null;
  isLoading?: boolean; // Optional banaya taaki page.tsx error na de
  error?: any;         // Optional banaya
  onAddNew?: () => void;
  onEdit: (event: EventItem) => void;
  onRefresh: () => void;
}

export function EventsManager({ 
  events = [], 
  isLoading, 
  error, 
  onAddNew, 
  onEdit, 
  onRefresh 
}: EventsManagerProps) {
  const { toast } = useToast();
  const { language } = useTranslation();
  const locale = language === 'hi' ? hi : enUS;
  
  const handleDelete = async (eventId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({ title: 'Event Removed', description: 'The event record has been deleted.' });
        onRefresh();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast({
        title: 'Connection Error',
        description: 'Server is not responding.',
        variant: 'destructive'
      });
    }
  };

  const formatDateSafely = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'PPP', { locale });
    } catch (e) {
      return dateStr || 'Date not set';
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 text-muted-foreground bg-white rounded-[2rem]">
      <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
      <p className="font-bold italic uppercase tracking-widest text-xs">Loading Schedule...</p>
    </div>
  );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-0 pb-8 gap-4">
        <div>
          <CardTitle className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Events Schedule
          </CardTitle>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Manage NGO programs & community meetings
          </p>
        </div>
        <Button onClick={onAddNew} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <Plus className="mr-2 h-5 w-5" /> Create Event
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        <div className="rounded-[2rem] border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[100px] font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 py-6 pl-8">Preview</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Event Info</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Date & Time</TableHead>
                <TableHead className="text-right font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events && events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 py-4">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100">
                        {event.image ? (
                          <img 
                            src={`${API_BASE_URL}/uploads/events/${event.image}`} 
                            alt="event" 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=No+Img'}}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-20">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 uppercase italic tracking-tight">{event.eventName}</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {event.date ? formatDateSafely(event.date) : 'TBD'}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => onEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-500 shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black uppercase italic tracking-tighter">Remove Event?</AlertDialogTitle>
                              <AlertDialogDescription className="font-medium">
                                This will permanently delete "{event.eventName}" from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(event.id)} 
                                className="bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-[10px]"
                              >
                                Confirm Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <Calendar className="h-12 w-12 mb-2" />
                      <p className="font-black uppercase italic">No Events Found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}