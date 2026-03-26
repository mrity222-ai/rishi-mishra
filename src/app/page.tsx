'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StaggerWrap, StaggerItem } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { UpcomingEvents } from '@/components/upcoming-events';
import { useTranslation } from '@/hooks/use-translation';
import Autoplay from 'embla-carousel-autoplay';
import { BookOpen, HeartHandshake, Users, ArrowRight, Plus, Newspaper } from 'lucide-react';
import AnimatedText from '@/components/animated-text';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const NewsSkeleton = () => (
    <StaggerItem>
        <Card className="flex h-full flex-col overflow-hidden border-none bg-slate-50 rounded-[2.5rem]">
            <Skeleton className="h-64 w-full" />
            <div className="p-8 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </Card>
    </StaggerItem>
);

export default function Home() {
  const { t, language } = useTranslation();
  const autoplayPlugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [api, setApi] = React.useState<CarouselApi>();
  
  const [data, setData] = useState({
    articles: [],
    initiatives: [],
    heroImages: [],
    gallery: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Robust Image Parsing Utility
  const parseImageField = (imgData: any): string => {
    try {
      if (!imgData) return '';
      const parsed = typeof imgData === 'string' ? JSON.parse(imgData) : imgData;
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return typeof imgData === 'string' ? imgData : '';
    }
  };

  const getImageUrl = useCallback((path: string | undefined, type: string) => {
    if (!path) return 'https://placehold.co/800x600?text=NGO+Impact';
    if (path.startsWith('http')) return path; 
    return `${API_URL}/uploads/${type}/${path}`;
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const endpoints = ['news', 'initiatives', 'hero', 'gallery'];
        const [news, initiatives, hero, gallery] = await Promise.all(
          endpoints.map(endpoint => 
            fetch(`${API_URL}/api/${endpoint}`).then(res => res.ok ? res.json() : [])
          )
        );
        setData({ articles: news, initiatives, heroImages: hero, gallery });
      } catch (error) {
        console.error("Critical: Backend connection failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const initiativeIcons: Record<string, React.ReactNode> = {
    ngo: <HeartHandshake className="h-8 w-8" />,
    kisan: <Users className="h-8 w-8" />,
    youth: <BookOpen className="h-8 w-8" />,
  };

  return (
    <div className="flex flex-col bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[85vh] md:h-[90vh] text-white overflow-hidden bg-slate-900">
        <Carousel setApi={setApi} opts={{ loop: true }} plugins={[autoplayPlugin.current]} className="absolute inset-0 w-full h-full">
          <CarouselContent className='h-full m-0'>
            {isLoading ? (
              <CarouselItem className='p-0'><Skeleton className="w-full h-full bg-slate-800" /></CarouselItem>
            ) : data.heroImages.length > 0 ? (
                data.heroImages.map((img: any) => (
                  <CarouselItem key={img.id} className='h-full p-0'>
                    <div className="relative w-full h-full">
                      <img 
                        src={getImageUrl(img.image || img.imageUrl, 'hero')} 
                        alt="NGO Banner" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/50" />
                    </div>
                  </CarouselItem>
                ))
            ) : (
                <CarouselItem className='p-0'>
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-950" />
                </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
        
        <div className="relative z-10 flex flex-col h-full items-center justify-center text-center px-6 max-w-5xl mx-auto">
            <AnimatedText el="h1" text={t('hero_name')} className="font-headline text-5xl md:text-8xl font-black tracking-tighter" />
            <AnimatedText el="p" text={t('hero_titles')} className="mt-6 text-lg md:text-xl text-gray-100 font-medium max-w-3xl" />
            <StaggerWrap className="mt-12">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-white hover:text-emerald-600 rounded-full px-10 h-14 font-bold shadow-2xl transition-all">
                  <Link href="/contact">{t('hero_cta_support')}</Link>
                </Button>
            </StaggerWrap>
        </div>
      </section>

      <UpcomingEvents />
      
      {/* --- INITIATIVES SECTION --- */}
      <section className="bg-slate-50/50 py-24 md:py-32 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
            <div className="space-y-4 max-w-2xl">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-2">
                Our Strategic Pillars
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
                Transforming Lives <br />
                <span className="text-emerald-600 italic">Through Action</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                We deploy targeted initiatives designed to address the most pressing social, educational, and economic challenges in our community.
              </p>
            </div>
            <Button variant="outline" asChild className="rounded-2xl h-14 px-8 border-slate-200 hover:bg-white shadow-sm font-bold text-slate-600">
              <Link href="/initiatives">
                Explore All Missions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
              : data.initiatives.slice(0, 6).map((item: any, index: number) => (
                  <StaggerItem key={item.id}>
                    <div className="group relative bg-white rounded-[3rem] p-4 border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-700 hover:-translate-y-3 hover:shadow-emerald-500/10">
                      <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8">
                        <img 
                          src={getImageUrl(item.image, 'initiatives')} 
                          alt={item.titleEn} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Glass Icon */}
                        <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                          {initiativeIcons[item.slug] || <HeartHandshake className="h-7 w-7" />}
                        </div>
                      </div>

                      <div className="px-4 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-[2px] w-8 bg-emerald-500 rounded-full" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Node</span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                          {language === 'hi' ? item.titleHi : item.titleEn}
                        </h3>
                        
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                          {language === 'hi' ? (item.descriptionHi || item.descriptionEn) : item.descriptionEn}
                        </p>

                        <Link 
                          href={`/initiatives/${item.slug}`} 
                          className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase text-xs tracking-widest group/link"
                        >
                          Discover Impact
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center transition-all duration-300 group-hover/link:bg-emerald-600 group-hover/link:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
          </div>
        </div>
      </section>

      {/* --- NEWS SECTION --- */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-emerald-600">
              Latest <span className="text-slate-900">Updates</span>
            </h2>
            <p className="text-slate-500 font-medium tracking-wide italic mt-4">Insights & stories from our journey</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
              : data.articles.slice(0, 3).map((article: any) => {
                  const displayImage = parseImageField(article.images || article.image || article.imageUrl);

                  return (
                    <StaggerItem key={article.id}>
                      <Link href={`/news/${article.id}`} className="group block h-full">
                        <Card className="h-full bg-white border-none rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                          <div className="relative h-64 md:h-72 overflow-hidden bg-slate-100 flex items-center justify-center">
                            {displayImage ? (
                              <img 
                                src={getImageUrl(displayImage, 'news')} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                alt="news" 
                              />
                            ) : (
                              <Newspaper className="h-16 w-16 text-slate-200" />
                            )}
                            <div className="absolute top-6 left-6 bg-emerald-600 text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                              {article.publishDate || article.created_at 
                                ? new Date(article.publishDate || article.created_at).toLocaleDateString() 
                                : 'NEW'}
                            </div>
                          </div>

                          <CardHeader className="p-8 text-center">
                            <CardTitle className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {language === 'hi' ? (article.titleHi || article.titleEn) : article.titleEn}
                            </CardTitle>
                            <p className="text-slate-400 text-sm italic mt-4 line-clamp-2">
                              {language === 'hi' ? (article.contentHi || article.contentEn) : article.contentEn}
                            </p>
                          </CardHeader>
                          <CardFooter className="justify-center pb-8 mt-auto">
                             <span className="flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                               Read Full Report <Plus size={14} strokeWidth={3} />
                             </span>
                          </CardFooter>
                        </Card>
                      </Link>
                    </StaggerItem>
                  );
                })
            }
          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-emerald-600">
              Gallery <span className="text-slate-900" style={{ WebkitTextStroke: '1px #059669', color: 'transparent' }}>Glimpse</span>
            </h2>
            <div className="w-16 h-1 bg-emerald-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[200px] md:auto-rows-[300px]">
            {!isLoading && data.gallery.slice(0, 6).map((item, i) => {
              const displayImage = parseImageField(item.image);
              return (
                <div key={item.id} className={`group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] cursor-pointer shadow-lg hover:shadow-emerald-500/20 transition-all duration-700 ${i === 0 ? "md:col-span-2 md:row-span-2" : i === 3 ? "md:col-span-2" : ""}`}>
                  <img 
                    src={getImageUrl(displayImage, "gallery")} 
                    alt="Gallery" 
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-10 text-center items-center">
                    <p className="text-white text-[10px] md:text-xs font-black tracking-widest uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-all">View Project</p>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-emerald-600 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all delay-75">
                      <Plus size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 md:mt-24 flex flex-col items-center">
             <div className="w-px h-16 bg-slate-200 mb-8 hidden md:block" />
             <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-slate-900 text-white px-10 md:px-14 py-6 md:py-8 text-xs md:text-sm font-black tracking-[0.2em] transition-all hover:scale-105 shadow-xl">
               <Link href="/gallery">VIEW ALL COLLECTIONS</Link>
             </Button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
