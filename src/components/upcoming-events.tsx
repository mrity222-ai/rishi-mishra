'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfDay, isAfter, isSameDay } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { StaggerWrap, StaggerItem } from './animations';
import AnimatedText from './animated-text';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:5000';

export function UpcomingEvents() {
    const { t, language } = useTranslation();
    const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const locale = language === 'hi' ? hi : enUS;

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/events`);
                if (!res.ok) throw new Error("Could not fetch events");
                
                const data = await res.json();
                
                // --- FIXED FILTER LOGIC ---
                const today = startOfDay(new Date());

                const filtered = data
                    .filter((event: any) => {
                        const eventDate = new Date(event.date);
                        // Aaj ka event ya future ka event dikhayein
                        return isAfter(eventDate, today) || isSameDay(eventDate, today);
                    })
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 3);

                setUpcomingEvents(filtered);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto grid gap-8 md:grid-cols-3 py-16">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[400px] w-full rounded-xl" />)}
            </div>
        );
    }

    return (
        <section className="bg-background py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <AnimatedText el="h2" text={t('events_section_title')} className="text-3xl font-bold text-accent sm:text-4xl" />
                    <p className="text-muted-foreground mt-4">{t('events_section_desc')}</p>
                </div>

                {upcomingEvents.length > 0 ? (
                    <StaggerWrap className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((event) => {
                            const eventDate = new Date(event.date);
                            // Path check: /uploads/events/filename
                            const imageUrl = event.image ? `${API_BASE_URL}/uploads/events/${event.image}` : null;

                            return (
                                <StaggerItem key={event.id}>
                                    <Card className="flex h-full flex-col overflow-hidden bg-black/20 backdrop-blur-lg border border-accent hover:bg-black/30 transition-all">
                                        {imageUrl && (
                                            <div className="relative h-48 w-full">
                                                <img src={imageUrl} alt={event.eventName} className="w-full h-full object-cover" />
                                                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                                    {format(eventDate, 'MMM dd')}
                                                </div>
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-accent text-xl">{event.eventName}</CardTitle>
                                            <div className="text-sm text-muted-foreground space-y-1 pt-2">
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {format(eventDate, 'PPP', { locale })}</div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.location}</div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {language === 'hi' ? event.descriptionHi : (event.descriptionEn || event.descriptionHi)}
                                            </p>
                                        </CardContent>
                                        <CardFooter>
                                            <Button variant="outline" className="w-full border-accent/50" asChild>
                                                <Link href={`/events/${event.id}`}>{t('view_details')}</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </StaggerItem>
                            );
                        })}
                    </StaggerWrap>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-accent/20 rounded-2xl">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-accent">No Upcoming Events</h3>
                        <p className="text-muted-foreground">Please check back later for new updates.</p>
                        {/* Debug info - only for you to see */}
                        <p className="text-[10px] text-gray-700 mt-4">API URL: {API_BASE_URL}/api/events</p>
                    </div>
                )}
            </div>
        </section>
    );
}