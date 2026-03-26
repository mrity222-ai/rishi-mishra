'use client';

import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube, Leaf } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/about', label: t('nav_about') },
    { href: '/initiatives', label: t('nav_initiatives') },
    { href: '/gallery', label: t('nav_gallery') },
    { href: '/news', label: t('nav_news') },
    { href: '/events', label: t('nav_events') },
    { href: '/contact', label: t('nav_contact') },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-primary text-white mt-20 rounded-t-[4rem] lg:rounded-t-[6rem] shadow-2xl border-t-8 border-saffron/20">
      {/* Agricultural Motifs Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        data-ai-hint="indian fields agriculture"
      />
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] translate-y-1/2" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-12">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Main Brand & Vision */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <Link href="/" className="inline-block group">
                <h2 className="font-headline text-6xl font-black tracking-tighter text-white transition-all group-hover:text-saffron">
                  {t('hero_name')}
                </h2>
                <div className="flex gap-1 mt-3">
                  <div className="h-2 w-20 bg-saffron rounded-full" />
                  <div className="h-2 w-4 bg-white/20 rounded-full" />
                </div>
              </Link>
              <p className="text-2xl font-bold italic text-white/90 leading-[1.1] max-w-md">
                "{t('footer_tagline')}"
              </p>
              <div className="flex items-center gap-3 text-white/40 font-black uppercase text-[10px] tracking-[0.3em]">
                <Leaf className="h-4 w-4 text-saffron fill-saffron" />
                <span>Serving Sarojini Nagar & Lucknow</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <SocialIcon href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Youtube className="h-5 w-5" />} />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid gap-12 sm:grid-cols-3">
            <div className="space-y-8">
              <h3 className="font-headline text-xs font-black uppercase tracking-[0.3em] text-saffron/80">
                Navigation
              </h3>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-white/60 hover:text-white transition-all font-bold flex items-center gap-0 hover:gap-3 group"
                    >
                      <span className="h-1.5 w-0 bg-saffron group-hover:w-4 transition-all rounded-full" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="font-headline text-xs font-black uppercase tracking-[0.3em] text-saffron/80">
                Connect Directly
              </h3>
              <ul className="space-y-6">
                <ContactItem 
                  icon={<Mail className="h-5 w-5" />} 
                  label="Email Support" 
                  value="contact@rishimishra.in" 
                  href="mailto:contact@rishimishra.in" 
                />
                <ContactItem 
                  icon={<Phone className="h-5 w-5" />} 
                  label="Office Helpline" 
                  value="+91 8874620222 ,9453233400" 
                  href="tel:+918874620222" 
                />
                <ContactItem 
                  icon={<MapPin className="h-5 w-5" />} 
                  label="Constituency Office" 
                  value="Sarojini Nagar, Lucknow" 
                />
              </ul>
            </div>

            <div className="space-y-8">
              <div className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Leaf className="h-24 w-24 text-white rotate-12" />
                </div>
                
                <h3 className="font-headline text-xl font-black text-white mb-2 relative z-10">Stay Updated</h3>
                <p className="text-[10px] font-bold text-white/40 mb-8 uppercase tracking-widest relative z-10">Kisan & Youth Welfare Updates</p>
                
                <div className="space-y-3 relative z-10">
                  <input 
                    type="email" 
                    placeholder="your.email@domain.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-saffron transition-all" 
                  />
                  <Button className="w-full bg-saffron hover:bg-white hover:text-primary text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl h-14 shadow-xl shadow-saffron/20 transition-all active:scale-95 group border-none">
                    Join Now <Send className="ml-2 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-32 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <div className="h-1 w-12 bg-saffron rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Official Portal</p>
              </div>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
                &copy; {year} {t('footer_copyright')}
              </p>
            </div>
            
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em]">
                {t('footer_disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      asChild 
      className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-saffron hover:text-white hover:border-saffron transition-all hover:-translate-y-2 shadow-lg"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {icon}
      </a>
    </Button>
  );
}

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-5 group cursor-pointer">
      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-saffron border border-white/10 group-hover:bg-saffron group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-xl">
        {icon}
      </div>
      <div className="space-y-0.5">
        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{label}</span>
        <span className="block text-sm font-bold text-white/70 group-hover:text-white transition-colors">{value}</span>
      </div>
    </div>
  );

  return href ? <a href={href} className="block">{content}</a> : content;
}
