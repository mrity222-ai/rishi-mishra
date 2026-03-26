'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StaggerWrap, StaggerItem } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { UpcomingEvents } from '@/components/upcoming-events';
import { useTranslation } from '@/hooks/use-translation';
import Autoplay from 'embla-carousel-autoplay';
import { BookOpen, HeartHandshake, Users, ArrowRight, Plus, Newspaper, Heart, Leaf, GraduationCap, Droplets, Laptop, TreePine, Zap, Target, Fingerprint, BarChart3 } from 'lucide-react';
import AnimatedText from '@/components/animated-text';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [filter, setFilter] = useState('All');
  
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
    default: <Heart className="h-8 w-8" />
  };

  // Stats Data
  const stats = [
    { label: language === 'hi' ? 'प्रभावित जीवन' : 'Lives Impacted', value: '10K+', icon: <Users className="h-5 w-5" /> },
    { label: language === 'hi' ? 'सक्रिय परियोजनाएं' : 'Active Projects', value: '50+', icon: <Leaf className="h-5 w-5" /> },
    { label: language === 'hi' ? 'स्वयंसेवक' : 'Volunteers', value: '500+', icon: <Heart className="h-5 w-5" /> },
    { label: language === 'hi' ? 'अवार्ड्स' : 'Awards Won', value: '15+', icon: <Plus className="h-5 w-5" /> },
  ];

  // Filtering Logic
  const filteredInitiatives = useMemo(() => {
    if (filter === 'All') return data.initiatives;
    return data.initiatives.filter((item: any) => {
        if (filter === 'Education') return item.slug?.includes('youth') || item.titleEn?.toLowerCase().includes('education');
        if (filter === 'Social') return item.slug?.includes('ngo') || item.titleEn?.toLowerCase().includes('social');
        if (filter === 'Agriculture') return item.slug?.includes('kisan') || item.titleEn?.toLowerCase().includes('farmer');
        return true;
    });
  }, [filter, data.initiatives]);

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
      
      {/* --- INITIATIVES SECTION: REDESIGNED --- */}
      <section className="bg-[#F9FAFB] py-24 md:py-32 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-40 -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-40 -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
            <div className="space-y-6 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Zap className="h-3 w-3" />
                {language === 'hi' ? 'संचालन इकाइयाँ / लाइव' : 'Operational Units / Live'}
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[0.95]">
                  {language === 'hi' ? 'हमारी पहल' : 'Our Initiatives.'}
                </h2>
              </div>
              
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                {language === 'hi' 
                  ? 'वैश्विक प्रभाव और प्रणालीगत बुनियादी ढांचे के विकास के लिए डिज़ाइन किए गए उन्नत मॉड्यूलर सिस्टम तैनात करना।'
                  : 'Deploying advanced modular systems designed for global impact and systemic infrastructure development.'}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Button asChild className="rounded-2xl h-16 px-10 bg-slate-900 hover:bg-emerald-600 text-white shadow-xl shadow-slate-200 hover:shadow-emerald-200 transition-all duration-500 font-bold group">
                <Link href="/initiatives" className="flex items-center gap-3">
                  {language === 'hi' ? 'सभी मिशन देखें' : 'Explore All Missions'}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4 group hover:bg-white transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-12">
            {['All', 'Social', 'Education', 'Agriculture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
                  filter === cat 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
              : (
                <AnimatePresence mode='popLayout'>
                  {filteredInitiatives.slice(0, 6).map((item: any, index: number) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <div className="group relative bg-white rounded-[3rem] p-4 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(16,185,129,0.12)] flex flex-col h-full overflow-hidden">
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/20 rounded-[3rem] transition-all duration-700 -z-10" />
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8">
                          <img 
                            src={getImageUrl(item.image, 'initiatives')} 
                            alt={item.titleEn} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                          <div className="absolute top-6 right-6">
                            <Badge className="bg-white/20 backdrop-blur-xl border border-white/30 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">
                              {language === 'hi' ? 'सक्रिय' : 'Active Now'}
                            </Badge>
                          </div>
                          <div className="absolute bottom-6 left-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                            {initiativeIcons[item.slug] || initiativeIcons.default}
                          </div>
                          {index === 0 && (
                            <div className="absolute top-6 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="px-4 pb-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-[2px] w-8 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Strategic Node</span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                            {language === 'hi' ? item.titleHi : item.titleEn}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium flex-grow">
                            {language === 'hi' ? (item.descriptionHi || item.descriptionEn) : item.descriptionEn}
                          </p>
                          <div className="pt-6 border-t border-slate-100">
                            <Link 
                              href={`/initiatives/${item.slug}`} 
                              className="inline-flex items-center gap-3 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] group/link"
                            >
                              {language === 'hi' ? 'प्रभाव देखें' : 'Discover Impact'}
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-all duration-300 group-hover/link:bg-emerald-600 group-hover/link:text-white">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
          </div>
        </div>
      </section>

      {/* --- INSIGHTS SECTION (Latest Updates) --- */}
      <section className="bg-[#F8FAFC] py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
            <div className="space-y-4 max-w-2xl">
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-2">
                Field Reports & Updates
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
                Latest <span className="text-emerald-600 italic">Insights</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Exploring the voices and stories behind our social missions.
              </p>
            </div>
            <Button variant="ghost" asChild className="rounded-2xl h-14 px-8 text-slate-600 hover:bg-white shadow-sm font-bold border border-slate-100">
              <Link href="/news">
                Explore Full Archive <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
              : data.articles.slice(0, 3).map((article: any, index: number) => {
                  const displayImage = parseImageField(article.images || article.image || article.imageUrl);
                  const isHero = index === 0;

                  return (
                    <StaggerItem key={article.id} className={isHero ? "md:col-span-2" : ""}>
                      <Link href={`/news/${article.id}`} className="group block h-full">
                        <div className={cn(
                          "relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-premium transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl flex flex-col",
                          isHero ? "md:flex-row md:h-[450px]" : "h-full"
                        )}>
                          <div className={cn(
                            "relative overflow-hidden bg-slate-100 flex items-center justify-center",
                            isHero ? "md:w-1/2 h-64 md:h-full" : "aspect-video"
                          )}>
                            {displayImage ? (
                              <img 
                                src={getImageUrl(displayImage, 'news')} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                alt="news" 
                              />
                            ) : (
                              <Newspaper className="h-16 w-16 text-slate-200" />
                            )}
                            <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg">
                              {article.publishDate || article.created_at 
                                ? new Date(article.publishDate || article.created_at).toLocaleDateString() 
                                : 'NEW'}
                            </div>
                          </div>
                          <div className={cn(
                            "p-8 md:p-12 flex flex-col justify-center",
                            isHero ? "md:w-1/2" : "flex-1"
                          )}>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="h-[2px] w-8 bg-emerald-500 rounded-full" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Field Story</span>
                            </div>
                            <h3 className={cn(
                              "font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2",
                              isHero ? "text-3xl md:text-4xl" : "text-2xl"
                            )}>
                              {language === 'hi' ? (article.titleHi || article.titleEn) : article.titleEn}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium italic">
                              {language === 'hi' ? (article.contentHi || article.contentEn) : article.contentEn}
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                              Read Detailed Report <Plus size={14} strokeWidth={3} />
                            </div>
                          </div>
                        </div>
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
