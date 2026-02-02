'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { StaggerItem, StaggerWrap } from '@/components/animations';
import AnimatedText from '@/components/animated-text';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Maximize2, ImageIcon, Camera, ArrowUpRight, Search, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  titleHi?: string;
  created_at?: string;
}

export default function GalleryPage() {
  const { t, language } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);
  const [photoGallery, setPhotoGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return `${API_BASE_URL}/uploads/gallery/${path}`;
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          setPhotoGallery(data);
        }
      } catch (error) {
        console.error("MySQL Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredGallery = photoGallery.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.titleHi && item.titleHi.includes(searchQuery))
  );

  return (
    <div className="bg-[#ffffff] dark:bg-zinc-950 min-h-screen font-poppins selection:bg-primary/20">
      
      {/* --- CINEMATIC HERO SECTION WITH BACKGROUND IMAGE --- */}
      <section className="relative h-[70vh] flex items-center overflow-hidden border-b-4 border-black dark:border-zinc-800">
        
        {/* Background Image with Ken Burns Effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-ken-burns"
          style={{ 
            backgroundImage: `url('/h.jpeg')`,
          }}
        />
        
        {/* Multi-layer Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-20">
          <StaggerWrap className="max-w-4xl">
            <Badge className="mb-6 px-6 py-2 rounded-full bg-primary text-white border-none shadow-[0_0_20px_rgba(79,70,229,0.4)] animate-bounce">
              <Sparkles className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'विशेष गैलरी' : 'PREMIUM GALLERY'}
            </Badge>
            
            <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.9] mb-6 uppercase">
              {language === 'hi' ? 'दृश्य' : 'VISUAL'} 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 block">
                {language === 'hi' ? 'अनुभव' : 'ARCHIVES'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-xl leading-relaxed italic border-l-4 border-primary pl-6">
              {language === 'hi' 
                ? 'डिजिटल सशक्तिकरण की यात्रा को चित्रों के माध्यम से देखें।' 
                : 'A cinematic journey through our most impactful digital milestones.'}
            </p>

            {/* Glassmorphism Search inside Hero */}
            <div className="mt-10 relative max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder={language === 'hi' ? "तस्वीरें खोजें..." : "Explore the archive..."}
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/40 focus:ring-4 ring-primary/20 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </StaggerWrap>
        </div>
      </section>

      {/* --- MASONRY GRID SECTION --- */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-primary rounded-full" />
              <h2 className="text-3xl font-bold dark:text-white">
                {language === 'hi' ? 'सभी तस्वीरें' : 'All Memories'}
              </h2>
            </div>
            <span className="text-zinc-400 font-mono text-sm">{filteredGallery.length} Items Found</span>
          </div>

          <Dialog onOpenChange={(open) => !open && setSelectedImage(null)}>
            <div className="columns-1 gap-8 space-y-8 sm:columns-2 lg:columns-3 xl:columns-4">
              {isLoading ? (
                Array.from({length: 8}).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-[2.5rem] bg-zinc-200 dark:bg-zinc-900" />
                ))
              ) : (
                filteredGallery.map((photo) => {
                  const displayTitle = language === 'hi' && photo.titleHi ? photo.titleHi : photo.title;
                  const fullImgUrl = getImageUrl(photo.image);

                  return (
                    <StaggerItem key={photo.id} className="break-inside-avoid group">
                      <DialogTrigger asChild onClick={() => setSelectedImage({ src: fullImgUrl, alt: displayTitle })}>
                        <div className="relative cursor-pointer overflow-hidden rounded-[2.5rem] transition-all duration-700 hover:-translate-y-3">
                          
                          {/* Image with Parallax Hover */}
                          <div className="overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl group-hover:shadow-primary/20">
                            <img
                              src={fullImgUrl}
                              alt={displayTitle}
                              className="w-full h-auto object-cover transition-transform duration-[2s] group-hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                          
                          {/* Hover Glass Info Box */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-[2rem] translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                              <p className="text-white font-bold text-lg mb-2">{displayTitle}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-300 flex items-center gap-1">
                                  <Camera className="h-3 w-3" /> Captured Live
                                </span>
                                <div className="bg-white text-black p-2 rounded-full">
                                  <Maximize2 size={16} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                    </StaggerItem>
                  );
                })
              )}
            </div>

            {/* Empty State */}
            {!isLoading && filteredGallery.length === 0 && (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <ImageIcon className="h-20 w-20 text-zinc-200 mb-6 animate-pulse" />
                <h3 className="text-3xl font-light text-zinc-400">Nothing captured here yet.</h3>
              </div>
            )}

            {/* Lightbox */}
            {selectedImage && (
              <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-none rounded-[3rem] overflow-hidden">
                <DialogTitle className="sr-only">{selectedImage.alt}</DialogTitle>
                <div className="relative w-full h-full flex items-center justify-center">
                   <img
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 backdrop-blur-2xl bg-white/10 px-10 py-4 rounded-full border border-white/20">
                        <p className="text-white text-xl font-medium tracking-wide">{selectedImage.alt}</p>
                    </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </section>

      {/* Tailwind Animations */}
      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.15) translate(10px, -10px); }
          100% { transform: scale(1); }
        }
        .animate-ken-burns {
          animation: ken-burns 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}