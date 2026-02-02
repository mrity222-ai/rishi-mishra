import React from 'react';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

const API_BASE_URL = 'http://localhost:5000';

async function getEvent(id: string) {
  try {
    // Cache disable karne ke liye { cache: 'no-store' } use karein test ke waqt
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, { cache: 'no-store' });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// Next.js 15+ ke liye params ko await karna zaroori hai
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const event = await getEvent(id);

  // Agar data nahi mila toh yahan se error pakda jayega
  if (!event || !event.eventName) {
    return notFound();
  }

  const eventDate = parseISO(event.date);
  const imageUrl = event.image 
    ? `${API_BASE_URL}/uploads/events/${event.image}` 
    : null;

  return (
    <main className="min-h-screen bg-background pb-20">
       {/* Banner Section */}
       <div className="relative h-[45vh] w-full overflow-hidden bg-slate-900">
        {imageUrl && (
          <img src={imageUrl} alt={event.eventName} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-10 container mx-auto px-6">
          <Link href="/events" className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{event.eventName}</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
              {event.descriptionHi}
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 sticky top-24">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Calendar className="text-primary h-6 w-6" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase">Date</p>
                  <p className="font-bold">{format(eventDate, 'PPP')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-primary h-6 w-6" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase">Location</p>
                  <p className="font-bold">{event.location}</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-8 rounded-xl py-6 font-bold text-lg">Register Now</Button>
          </div>
        </aside>
      </div>
    </main>
  );
}