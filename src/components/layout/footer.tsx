'use client';

import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';
import Logo from '../logo';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1-3.3 1.2c-.3 1.2-1 4.2-4.3 5.3s-5.3 1.2-6.3-1.2c-1.2-2.4-1.2-6.3 0-8.7s3.3-3.7 6.3-3.3c.3.3 1.2 1.2 1.2 1.2s-2.1-.3-4.3 1.2c-2.4 1.5-3.3 4.2-3.3 5.3s.7 2.1 2.3 3.3c1.5 1.2 4.3 2.3 6.3 1.2s3.3-3.3 3.3-4.3c0-1.2-1.2-2.3-1.2-2.3s1.2-.3 2.3-1.2c1.2-1 2.3-2.3 2.3-2.3s-1.2.3-2.3 0c-1.2-.3-2.3-1.2-2.3-1.2s2.1 1.2 3.3 0c1.2-.3 2.3-1.2 2.3-1.2s-1.2 1.2-2.3 1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23-1.54.91-1.77 1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.5 15.5V8.5L16 12l-6.5 3.5z"/>
    </svg>
);

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

  const socialLinks = [
    { href: '#', icon: <FacebookIcon className="h-5 w-5" />, label: 'Facebook' },
    { href: '#', icon: <TwitterIcon className="h-5 w-5" />, label: 'Twitter' },
    { href: '#', icon: <InstagramIcon className="h-5 w-5" />, label: 'Instagram' },
    { href: '#', icon: <YouTubeIcon className="h-5 w-5" />, label: 'YouTube' },
  ];

  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex flex-col items-start gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="text-white" />
            </Link>
            <p className="max-w-xs text-sm text-primary-foreground/80 leading-relaxed">
              {t('footer_tagline')}
            </p>
            <div className="flex space-x-3">
                {socialLinks.map((social) => (
                   <Button key={social.label} variant="outline" size="icon" asChild className="rounded-full border-primary-foreground/20 text-white hover:bg-accent hover:text-white hover:border-accent transition-all">
                     <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                       {social.icon}
                     </a>
                   </Button>
                ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="font-headline text-lg font-bold text-white mb-6">{t('footer_quick_links')}</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                        {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-white mb-6">{t('footer_contact')}</h3>
              <ul className="space-y-4 text-sm text-primary-foreground/70">
                <li className="flex flex-col gap-1">
                    <span className="text-accent font-bold text-xs uppercase tracking-wider">Email</span>
                    <a href="mailto:contact@rishimishra.in" className="hover:text-accent transition-colors">contact@rishimishra.in</a>
                </li>
                <li className="flex flex-col gap-1">
                    <span className="text-accent font-bold text-xs uppercase tracking-wider">Phone</span>
                    <a href="tel:+919876543210" className="hover:text-accent transition-colors">+91 9876543210</a>
                </li>
                <li className="flex flex-col gap-1">
                    <span className="text-accent font-bold text-xs uppercase tracking-wider">Location</span>
                    <span>Sarojini Nagar, Lucknow, UP</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="font-headline text-base font-bold text-white mb-4">Newsletter</h3>
              <p className="text-xs text-primary-foreground/60 mb-4">Stay updated with our latest initiatives and events.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent" />
                <Button size="sm" className="bg-accent text-white px-4 border-0">Join</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
                {year && <p>&copy; {year} {t('footer_copyright')}</p>}
                <p>{t('footer_disclaimer')}</p>
           </div>
        </div>
      </div>
    </footer>
  );
}
