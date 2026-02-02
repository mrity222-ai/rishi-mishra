'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { StaggerWrap, StaggerItem } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { UpcomingEvents } from '@/components/upcoming-events';
import { useTranslation } from '@/hooks/use-translation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from 'embla-carousel-autoplay';
import { BookOpen, HeartHandshake, Users, ArrowRight, CalendarDays, ImageIcon, Maximize2, ExternalLink } from 'lucide-react';
import AnimatedText from '@/components/animated-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = 'http://localhost:5000'; 

const NewsSkeleton = () => (
    <StaggerItem>
        <Card className="flex h-full flex-col overflow-hidden bg-black/20 backdrop-blur-lg border border-accent">
            <Skeleton className="h-56 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-6 w-28" />
            </CardFooter>
        </Card>
    </StaggerItem>
);

export default function Home() {
  const { t, language } = useTranslation();
  const autoplayPlugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const [articles, setArticles] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingInitiatives, setIsLoadingInitiatives] = useState(true);
  const [isLoadingHeroImages, setIsLoadingHeroImages] = useState(true);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const getImageUrl = (path: string | undefined, type: string) => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    if (path.startsWith('http')) return path; 
    return `${API_BASE_URL}/uploads/${type}/${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = `${API_BASE_URL}/api`;
      try {
        const [newsRes, initRes, heroRes, galleryRes] = await Promise.all([
            fetch(`${baseUrl}/news`),
            fetch(`${baseUrl}/initiatives`),
            fetch(`${baseUrl}/hero`),
            fetch(`${baseUrl}/gallery`)
        ]);

        if (newsRes.ok) setArticles(await newsRes.json());
        if (initRes.ok) setInitiatives(await initRes.json());
        if (heroRes.ok) setHeroImages(await heroRes.json());
        if (galleryRes.ok) setGallery(await galleryRes.json());

      } catch (error) {
        console.error("Backend connection error:", error);
      } finally {
        setIsLoadingNews(false);
        setIsLoadingInitiatives(false);
        setIsLoadingHeroImages(false);
        setIsLoadingGallery(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const initiativeIcons: { [key: string]: React.ReactNode } = {
    ngo: <HeartHandshake className="h-8 w-8 text-primary" />,
    kisan: <Users className="h-8 w-8 text-primary" />,
    youth: <BookOpen className="h-8 w-8 text-primary" />,
    welfare: <HeartHandshake className="h-8 w-8 text-primary" />,
  };

  const testimonials = [
    { quoteKey: 'testimonial_quote_1', authorKey: 'testimonial_author_1', roleKey: 'testimonial_role_1', image: PlaceHolderImages.find(p => p.id === 'testimonial-person-1') },
    { quoteKey: 'testimonial_quote_2', authorKey: 'testimonial_author_2', roleKey: 'testimonial_role_2', image: PlaceHolderImages.find(p => p.id === 'testimonial-person-2') },
    { quoteKey: 'testimonial_quote_3', authorKey: 'testimonial_author_3', roleKey: 'testimonial_role_3', image: PlaceHolderImages.find(p => p.id === 'testimonial-person-3') },
  ];

  return (
    <div className="flex flex-col scroll-smooth">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] text-white overflow-hidden">
        <Carousel setApi={setApi} opts={{ loop: true }} plugins={[autoplayPlugin.current]} className="absolute inset-0 w-full h-full">
          <CarouselContent className='h-full'>
            {isLoadingHeroImages ? (
              <CarouselItem className='h-full'><Skeleton className="w-full h-full bg-slate-800" /></CarouselItem>
            ) : (
              heroImages.length > 0 ? (
                heroImages.map((img) => (
                  <CarouselItem key={img.id} className='h-full'>
                    <div className="relative w-full h-full overflow-hidden">
                      <img 
                        src={getImageUrl(img.image || img.imageUrl, 'hero')} 
                        alt="Hero Image" 
                        className="w-full h-full object-cover transition-transform duration-[10000ms] scale-110 motion-safe:hover:scale-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className='h-full'>
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center text-white/50">
                    <p>Add hero images from admin panel</p>
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <div className="absolute bottom-12 left-0 right-0 z-20">
              <div className="relative mx-auto max-w-xs flex items-center justify-center gap-8">
                  <CarouselPrevious className="static translate-y-0 text-white bg-white/10 hover:bg-accent border-white/20 transition-all" />
                  <div className="text-center text-sm tracking-[0.3em] font-mono font-bold">
                    {current > 0 && count > 0 ? `${String(current).padStart(2, '0')} / ${String(count).padStart(2, '0')}` : '00 / 00'}
                  </div>
                  <CarouselNext className="static translate-y-0 text-white bg-white/10 hover:bg-accent border-white/20 transition-all" />
              </div>
          </div>
        </Carousel>
        
        <div className="relative z-10 flex flex-col h-full items-center justify-center text-center px-4">
            <AnimatedText el="h1" text={t('hero_name')} className="font-headline text-5xl font-black sm:text-8xl drop-shadow-2xl tracking-tighter" />
            <AnimatedText el="p" text={t('hero_titles')} className="mt-4 text-lg text-gray-200 sm:text-3xl font-light max-w-3xl drop-shadow-md" />
            <StaggerWrap className="mt-10">
                <StaggerItem className="flex flex-wrap justify-center gap-6">
                  <Button asChild size="lg" className="bg-accent hover:bg-white hover:text-accent shadow-xl px-8 h-14 text-lg font-bold transition-all hover:scale-105 active:scale-95"><Link href="/contact">{t('hero_cta_support')}</Link></Button>
                  <Button asChild size="lg" variant="outline" className="text-white border-white/30 bg-white/5 backdrop-blur-md hover:bg-white hover:text-black shadow-xl px-8 h-14 text-lg font-bold transition-all hover:scale-105 active:scale-95"><Link href="/about">{t('hero_cta_about')}</Link></Button>
                </StaggerItem>
            </StaggerWrap>
        </div>
      </section>

      <UpcomingEvents />
      
      {/* Initiatives Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <StaggerWrap className="text-left">
              <div className="flex items-center gap-2 text-accent font-bold tracking-widest uppercase text-sm mb-2">
                <div className="h-[2px] w-8 bg-accent"></div> Our Focus
              </div>
              <AnimatedText el="h2" text={t('home_initiatives_title')} className="font-headline text-4xl font-black text-foreground sm:text-5xl" />
            </StaggerWrap>
            <Button asChild variant="ghost" className="text-accent font-bold hover:bg-accent/10 group">
              <Link href="/initiatives" className="flex items-center gap-2">View All Initiatives <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></Link>
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingInitiatives ? Array.from({length: 3}).map((_, i) => <NewsSkeleton key={i} />) : 
              initiatives.slice(0, 3).map((item) => (
              <StaggerItem key={item.id}>
                <Card className="flex h-full flex-col overflow-hidden bg-card/50 backdrop-blur-sm border border-border hover:border-accent hover:shadow-[0_0_30px_rgba(var(--accent),0.1)] transition-all duration-500 group">
                  <div className="relative h-56 w-full overflow-hidden">
                    {item.image ? (
                        <img 
                            src={getImageUrl(item.image, 'initiatives')} 
                            alt={item.titleEn} 
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-muted text-muted-foreground"><ImageIcon className="opacity-20" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4 relative">
                    <div className="bg-accent/10 p-3 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                        {initiativeIcons[item.slug] || <HeartHandshake className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-2xl font-black group-hover:text-accent transition-colors">
                        {language === 'hi' ? item.titleHi : item.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-muted-foreground/80 leading-relaxed line-clamp-3 italic">
                    {language === 'hi' ? item.descriptionHi : item.descriptionEn}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" asChild className="p-0 text-accent font-bold group/btn">
                        <Link href={`/initiatives/${item.slug}`} className="flex items-center">Learn More <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <section className="bg-muted/30 py-24 border-y border-accent/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <StaggerWrap className="text-center md:text-left">
              <AnimatedText 
                el="h2" 
                text={language === 'hi' ? 'हमारी गैलरी' : 'Our Gallery'} 
                className="font-headline text-4xl font-black text-foreground sm:text-5xl" 
              />
              <p className="text-muted-foreground mt-3 text-lg font-light">
                {language === 'hi' ? 'हमारी गतिविधियों की कुछ झलकियाँ' : 'Glimpses of our recent community work and events'}
              </p>
            </StaggerWrap>
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white transition-all px-8 h-12 rounded-full font-bold shadow-lg">
              <Link href="/gallery" className="flex items-center gap-2">{language === 'hi' ? 'सभी फोटो देखें' : 'Enter Full Gallery'} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoadingGallery ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl bg-accent/5" />
              ))
            ) : (
              gallery.slice(0, 8).map((item) => (
                <StaggerItem key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-md hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={getImageUrl(item.image, 'gallery')} 
                    alt={item.title} 
                    className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <p className="text-white text-lg font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-accent text-xs mt-2 font-black uppercase tracking-[0.2em]">
                       <Maximize2 size={14} /> Full View
                    </div>
                  </div>
                </StaggerItem>
              ))
            )}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-background py-24">
          <div className="container mx-auto px-4 md:px-6">
              <div className="flex justify-between items-center mb-16">
                <StaggerWrap>
                    <AnimatedText el="h2" text={t('news_page_title')} className="font-headline text-4xl font-black text-foreground sm:text-5xl" />
                </StaggerWrap>
                <Button asChild variant="ghost" className="hidden md:flex text-accent font-bold group">
                  <Link href="/news" className="flex items-center gap-2">Read All News <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></Link>
                </Button>
              </div>

              <div className="grid gap-10 md:grid-cols-3">
                  {isLoadingNews ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />) :
                   articles.slice(0, 3).map((article) => (
                      <StaggerItem key={article.id}>
                          <Card className="flex h-full flex-col overflow-hidden border-none bg-transparent group cursor-pointer">
                              {(article.image || article.imageUrl) && (
                                <div className="relative h-64 w-full overflow-hidden rounded-3xl mb-6 shadow-lg">
                                    <img 
                                        src={getImageUrl(article.image || article.imageUrl, 'news')} 
                                        alt="news" 
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                                        Update
                                    </div>
                                </div>
                              )}
                              <CardHeader className="p-0">
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold mb-3 uppercase tracking-widest">
                                      <CalendarDays className="h-4 w-4 text-accent" />
                                      <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : ''}</span>
                                  </div>
                                  <CardTitle className="text-2xl font-black leading-tight group-hover:text-accent transition-colors line-clamp-2">
                                      {language === 'hi' ? article.titleHi : article.titleEn}
                                  </CardTitle>
                              </CardHeader>
                              <CardContent className="p-0 mt-4 flex-grow text-muted-foreground/80 line-clamp-3 text-lg leading-relaxed">
                                  {language === 'hi' ? article.contentHi : article.contentEn}
                              </CardContent>
                              <CardFooter className="p-0 mt-6">
                                  <Button variant="link" asChild className="px-0 text-accent font-black text-lg group/link">
                                      <Link href={`/news/${article.id}`} className="flex items-center">{t('read_article')} <ArrowRight className="ml-2 h-5 w-5 group-hover/link:translate-x-2 transition-transform" /></Link>
                                  </Button>
                              </CardFooter>
                          </Card>
                      </StaggerItem>
                  ))}
              </div>
              <div className="mt-12 flex md:hidden justify-center">
                <Button asChild variant="outline" className="border-accent text-accent w-full h-12 rounded-xl">
                  <Link href="/news">View All News</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Carousel opts={{ loop: true }} plugins={[autoplayPlugin.current]} className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="border-0 bg-transparent shadow-none text-center">
                    <CardContent className="p-6">
                      <div className="relative inline-block mb-10">
                        {testimonial.image && (
                          <Avatar className="h-32 w-32 border-[6px] border-white shadow-2xl relative z-10">
                            <AvatarImage src={testimonial.image.imageUrl} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-accent p-3 rounded-2xl text-white shadow-xl z-20">
                          <BookOpen size={20} />
                        </div>
                      </div>
                      <p className="text-2xl md:text-4xl font-medium italic leading-relaxed text-foreground tracking-tight px-4">
                        "{t(testimonial.quoteKey as any)}"
                      </p>
                      <div className="mt-12">
                        <p className="font-black text-accent text-2xl uppercase tracking-tighter">{t(testimonial.authorKey as any)}</p>
                        <p className="text-xs text-muted-foreground tracking-[0.4em] uppercase mt-2 font-bold">{t(testimonial.roleKey as any)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </div>
  );
}