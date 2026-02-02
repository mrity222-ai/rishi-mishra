'use client';

import { useTranslation } from '@/hooks/use-translation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import React, { useEffect, useState } from 'react';
import { StaggerWrap, StaggerItem } from '@/components/animations';
import AnimatedText from '@/components/animated-text';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, ImageIcon, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const bannerImage = PlaceHolderImages.find(p => p.id === 'gallery-1');

export default function EventsPage() {
  const { t, language } = useTranslation();
  const locale = language === 'hi' ? hi : enUS;

  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<any>(null);

  const API_BASE_URL = 'http://localhost:5000';

  // 1. Fetch Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Search & Filter Logic
  useEffect(() => {
    const filtered = allEvents.filter(event => 
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredEvents(filtered);
  }, [searchQuery, allEvents]);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Banner Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-24 mb-12"
        style={{ backgroundImage: bannerImage ? `url(${bannerImage.imageUrl})` : 'none' }}
      >
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="relative container mx-auto px-4 text-center text-primary-foreground">
          <StaggerItem>
            <AnimatedText
              el="h1"
              text={language === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Events'}
              className="font-headline text-4xl md:text-6xl font-black tracking-tighter drop-shadow-lg"
            />
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/90 italic">
              {language === 'hi' 
                ? 'हमारे समुदाय के नवीनतम कार्यक्रमों और समारोहों से जुड़ें।' 
                : 'Connect with our community through latest events and celebrations.'}
            </p>
          </StaggerItem>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12 -mt-20 z-20">
          <div className="bg-card p-2 rounded-2xl shadow-2xl border border-accent/20 backdrop-blur-md flex items-center">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder={language === 'hi' ? "कार्यक्रम खोजें..." : "Search events..."}
              className="border-none focus-visible:ring-0 text-lg bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <StaggerWrap className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({length: 6}).map((_, i) => <EventSkeleton key={i} />)}
          </StaggerWrap>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 text-destructive bg-destructive/5 rounded-3xl border border-dashed border-destructive">
            <p className="text-xl font-bold">Error loading events. Please check your backend connection.</p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && filteredEvents.length > 0 ? (
          <StaggerWrap className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const imageUrl = event.image ? `${API_BASE_URL}/uploads/events/${event.image}` : null;

              return (
                <StaggerItem key={event.id}>
                  <Card className="flex h-full flex-col overflow-hidden bg-black/5 hover:bg-black/10 backdrop-blur-sm border-accent/10 transition-all duration-500 hover:shadow-2xl group rounded-[2rem]">
                    {/* Image */}
                    <div className="relative h-60 w-full overflow-hidden bg-muted">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={event.eventName} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-30">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-md border-none px-3 py-1">
                          {event.type || 'Event'}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                        <Calendar className="h-3 w-3" />
                        {event.date ? format(parseISO(event.date), 'MMM dd, yyyy', { locale }) : 'TBA'}
                      </div>
                      <CardTitle className="font-headline text-2xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                         {event.eventName}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                        {language === 'hi' ? event.descriptionHi : (event.descriptionEn || event.descriptionHi)}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full rounded-xl group-hover:bg-primary group-hover:text-white transition-all font-bold" asChild>
                        <Link href={`/events/${event.id}`}>
                          {language === 'hi' ? 'विवरण देखें' : 'View Details'}
                          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrap>
        ) : (
          !isLoading && (
            <div className="text-center py-32 border-2 border-dashed rounded-[3rem] opacity-40">
              <p className="text-2xl font-bold tracking-tighter uppercase italic">No Events Found</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Badge Component (Local if not imported)
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}

const EventSkeleton = () => (
    <Card className="flex h-full flex-col overflow-hidden rounded-[2rem]">
        <Skeleton className="h-60 w-full" />
        <div className="p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full mt-4" />
        </div>
    </Card>
);