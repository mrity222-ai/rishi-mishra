'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ArrowRight, Newspaper, 
  Sparkles, TrendingUp, Zap, Calendar, 
  ChevronRight, Globe 
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface NewsItem {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  image: string;
  created_at: string;
}

export default function NewsListingPage() {
  const { language } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'General', 'Event', 'Press Release', 'Alert'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/news');
        const data = await res.json();
        setNews(data);
        setFilteredNews(data);
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = news.filter(item => {
      const title = language === 'hi' ? item.titleHi : item.titleEn;
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory, news, language]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-zinc-950 font-poppins selection:bg-primary selection:text-white">
      
      {/* 1. BREAKING NEWS TICKER */}
      <div className="bg-black dark:bg-white text-white dark:text-black py-2 overflow-hidden whitespace-nowrap border-b border-zinc-800">
        <div className="flex animate-marquee items-center gap-8">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {language === 'hi' ? 'ब्रेकिंग न्यूज़: डिजिटल इंडिया मिशन ने पकड़ी रफ्तार' : 'BREAKING: Digital India Mission Gains Momentum'}
              <span className="opacity-30">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION WITH IMAGE & OVERLAY */}
      <div className="relative min-h-[75vh] flex items-center justify-center overflow-hidden border-b-[8px] border-black dark:border-zinc-800">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
          style={{ 
            backgroundImage: `url('/h.jpeg')`, 
          }}
        />
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-20 w-full text-center">
          <Badge className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Globe className="h-4 w-4 mr-2 text-primary" />
            {language === 'hi' ? 'ग्लोबल न्यूज़ डेस्क' : 'Global News Desk'}
          </Badge>

          <h1 className={`text-6xl md:text-[140px] font-black leading-none tracking-tighter text-white uppercase mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'hi' ? 'समाचार' : 'THE'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400 block md:inline md:ml-4">
              {language === 'hi' ? 'पत्रिका' : 'INSIGHT'}
            </span>
          </h1>

          <p className="text-zinc-300 max-w-2xl mx-auto text-xl md:text-3xl font-light italic drop-shadow-lg">
            {language === 'hi' 
              ? 'सटीक जानकारी, सबसे तेज।' 
              : 'Where clarity meets the speed of information.'}
          </p>
        </div>
      </div>

      {/* 3. NEOMORPHIC FLOATING SEARCH BAR */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-30">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] border-4 border-black dark:border-zinc-700 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)] flex flex-col md:flex-row gap-4 items-center transition-all hover:shadow-[16px_16px_0px_0px_rgba(79,70,229,1)]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
            <Input 
              placeholder={language === 'hi' ? "सर्च करें..." : "Search by keywords..."}
              className="pl-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-[1.8rem] text-xl font-semibold placeholder:text-zinc-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                  ${selectedCategory === cat 
                    ? 'bg-primary text-white scale-105 shadow-lg' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-black hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MAIN NEWS GRID */}
      <div className="max-w-7xl mx-auto px-4 py-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-zinc-200 dark:bg-zinc-900 animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredNews.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="group">
                <article className="h-full bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 rounded-[3rem] overflow-hidden transition-all duration-500 hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[15px_15px_0px_0px_rgba(79,70,229,0.4)] hover:-translate-y-2 flex flex-col">
                  
                  {/* Card Image */}
                  <div className="relative h-72 w-full overflow-hidden border-b-4 border-black dark:border-zinc-800">
                    {item.image ? (
                      <img 
                        src={`http://localhost:5000/uploads/news/${item.image}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="News"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-zinc-300" />
                      </div>
                    )}
                    <Badge className="absolute top-6 left-6 bg-yellow-400 text-black border-2 border-black font-black px-4 py-1 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {item.category || 'NEWS'}
                    </Badge>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                        {format(new Date(item.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    <h3 className={`text-2xl font-black mb-6 leading-tight group-hover:text-primary transition-colors line-clamp-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                      {language === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                    
                    <div className="mt-auto pt-6 border-t-2 border-dashed border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-sm font-black uppercase tracking-tighter flex items-center gap-2 group-hover:gap-4 transition-all">
                        {language === 'hi' ? 'पूरा पढ़ें' : 'View Story'}
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </span>
                      <ChevronRight className="h-5 w-5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CSS For Marquee Animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}