'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, Share2, Printer, Newspaper, Clock, Hash, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ... (Interface same rahegi)

export default function NewsDetailPage() {
  const { id } = useParams();
  const { language } = useTranslation();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/news/${id}`);
        const data = await res.json();
        setArticle(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (id) fetchArticle();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-zinc-50 flex items-center justify-center italic font-black text-4xl animate-pulse">LOADING...</div>;
  if (!article) return <div className="text-center py-20">Article not found.</div>;

  const title = language === 'hi' ? article.titleHi : article.titleEn;
  const content = language === 'hi' ? article.contentHi : article.contentEn;
  const imageUrl = article.image ? `${API_BASE}/uploads/news/${article.image}` : null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION (Image 1: Blurred Background) */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover scale-110 blur-xl opacity-30 dark:opacity-20" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-50 dark:to-zinc-950" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-5xl space-y-8">
            <Badge className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl">
              {article.category || 'PRESS RELEASE'}
            </Badge>
            <h1 className={`text-5xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.85] ${language === 'hi' ? 'font-hindi' : 'font-sans'}`}>
              {title}
            </h1>
            <div className="flex items-center justify-center gap-8 text-zinc-500 font-bold uppercase tracking-widest text-xs">
               <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {format(new Date(article.created_at), 'dd MMM yyyy')}</span>
               <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> 2 MIN READ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 2. MAIN FEATURE CARD (Image 2: Sharp Focal Point) */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
              {imageUrl && (
                <div className="relative aspect-[16/10] overflow-hidden p-4">
                  <img 
                    src={imageUrl} 
                    alt="Main" 
                    className="w-full h-full object-cover rounded-[2.5rem] shadow-inner" 
                  />
                  <div className="absolute top-10 left-10">
                     <Link href="/news">
                        <Button className="bg-white/80 dark:bg-black/80 backdrop-blur-md text-black dark:text-white rounded-full h-12 px-6 font-black hover:scale-105 transition-transform">
                           <ChevronLeft className="mr-2 h-5 w-5" /> BACK
                        </Button>
                     </Link>
                  </div>
                </div>
              )}

              {/* ARTICLE BODY */}
              <div className="p-8 md:p-16">
                <div className={`prose prose-xl max-w-none dark:prose-invert leading-[1.8] text-zinc-700 dark:text-zinc-300 ${language === 'hi' ? 'font-hindi text-3xl' : 'font-serif'}`}>
                  {content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-10 first-letter:text-5xl first-letter:font-black first-letter:text-primary">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. MODERN SIDEBAR (Glassmorphism) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-zinc-800 p-8 rounded-[3rem] sticky top-10 shadow-xl">
               <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <Hash className="h-4 w-4 text-primary" /> Quick Actions
               </h4>
               
               <div className="space-y-4">
                  <Button className="w-full h-16 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-md hover:scale-[1.02] transition-transform flex justify-between px-6">
                    SHARE THIS STORY <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-2 font-black text-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex justify-between px-6" onClick={() => window.print()}>
                    DOWNLOAD PDF <Printer className="h-5 w-5" />
                  </Button>
               </div>

               <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">More in {article.category}</p>
                  <Link href="/news" className="group flex items-center justify-between text-lg font-bold hover:text-primary transition-colors">
                     View Related News <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* DECORATIVE CARD */}
            <div className="bg-primary p-10 rounded-[3rem] text-white overflow-hidden relative group">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black leading-tight italic">Stay Ahead of the Curve.</h3>
                  <p className="mt-4 text-white/80 font-medium">Follow our official channels for real-time alerts.</p>
               </div>
               <Newspaper className="absolute -right-8 -bottom-8 h-40 w-40 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}