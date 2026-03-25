'use client';

import * as React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { StaggerWrap, StaggerItem } from './animations';
import AnimatedText from './animated-text';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

/**
 * NGO Mission Impact Section
 * Replaces the previous Upcoming Events list with an impactful introductory section.
 */
export function UpcomingEvents() {
    return (
        <section className="bg-white py-24 md:py-32 overflow-hidden border-y border-slate-50 selection:bg-emerald-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-16 lg:grid-cols-2 items-center">
                    
                    {/* Left Column: Content */}
                    <StaggerWrap className="space-y-8 order-2 lg:order-1">
                        <StaggerItem>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                <Heart className="h-4 w-4 fill-emerald-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Social Impact</span>
                            </div>
                        </StaggerItem>
                        
                        <StaggerItem>
                            <AnimatedText 
                                el="h2" 
                                text="A small step for a better tomorrow in Uttar Pradesh." 
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter" 
                            />
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                                Dedicated to uplifting lives through education, social justice, and rural empowerment. 
                                Based in Sarojini Nagar, Lucknow, we strive to create a more equitable future for every citizen in Uttar Pradesh.
                            </p>
                        </StaggerItem>

                        <StaggerItem className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-16 px-10 text-lg font-bold shadow-green hover-shadow-green transition-all hover:scale-105 active:scale-95 group border-none">
                                <Link href="/contact" className="flex items-center gap-3">
                                    Become a Volunteer
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="lg" className="rounded-2xl h-16 px-8 text-slate-600 hover:bg-slate-50 font-bold border border-slate-100">
                                <Link href="/initiatives">Explore Initiatives</Link>
                            </Button>
                        </StaggerItem>
                    </StaggerWrap>

                    {/* Right Column: Visuals */}
                    <StaggerItem className="relative lg:pl-10 order-1 lg:order-2">
                        <div className="relative group">
                            {/* Artistic Background blobs */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 -z-10 group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl opacity-40 -z-10 group-hover:scale-110 transition-transform duration-1000 delay-150" />
                            
                            <div className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-square w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-slate-100 transition-all duration-700 group-hover:shadow-green">
                                <img 
                                    src="https://images.unsplash.com/photo-1686624386665-4cd01b96d0f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
                                    alt="Volunteers teaching children in Uttar Pradesh" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    data-ai-hint="volunteers children"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Impact Badge */}
                            <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20 transition-all hover:scale-110">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                        <Heart className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                                    </div>
                                    <span className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Active In UP</span>
                                </div>
                            </div>
                        </div>
                    </StaggerItem>
                </div>
            </div>
        </section>
    );
}
