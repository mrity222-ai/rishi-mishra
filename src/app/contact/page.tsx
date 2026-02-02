'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StaggerWrap, StaggerItem } from '@/components/animations';
import AnimatedText from '@/components/animated-text';

// Social Icons Components
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1-3.3 1.2c-.3 1.2-1 4.2-4.3 5.3s-5.3 1.2-6.3-1.2c-1.2-2.4-1.2-6.3 0-8.7s3.3-3.7 6.3-3.3c.3.3 1.2 1.2 1.2 1.2s-2.1-.3-4.3 1.2c-2.4 1.5-3.3 4.2-3.3 5.3s.7 2.1 2.3 3.3c1.5 1.2 4.3 2.3 6.3 1.2s3.3-3.3 3.3-4.3c0-1.2-1.2-2.3-1.2-2.3s1.2-.3 2.3-1.2c1.2-1 2.3-2.3 2.3-2.3s-1.2.3-2.3 0c-1.2-.3-2.3-1.2-2.3-1.2s2.1 1.2 3.3 0c1.2-.3 2.3-1.2 2.3-1.2s-1.2 1.2-2.3 1.2z" /></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23-1.54.91-1.77 1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.5 15.5V8.5L16 12l-6.5 3.5z"/>
    </svg>
);

const bannerImage = PlaceHolderImages.find(p => p.id === 'gallery-2');

export default function ContactPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    phone: z.string().optional(),
    message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  // --- UPDATED ONSUBMIT FOR MYSQL BACKEND ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast({
        title: t('contact_form_success'),
        description: "We will get back to you shortly.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    }
  }

  const socialLinks = [
    { href: '#', icon: <FacebookIcon className="h-6 w-6" />, label: 'Facebook' },
    { href: '#', icon: <TwitterIcon className="h-6 w-6" />, label: 'Twitter' },
    { href: '#', icon: <InstagramIcon className="h-6 w-6" />, label: 'Instagram' },
    { href: '#', icon: <YouTubeIcon className="h-6 w-6" />, label: 'YouTube' },
  ];

  return (
    <div className="bg-background">
      {bannerImage ? (
        <section
          className="relative bg-cover bg-center bg-no-repeat py-20 md:py-28"
          style={{ backgroundImage: `url(${bannerImage.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
          <div className="relative container mx-auto px-4 md:px-6 text-center text-primary-foreground">
            <StaggerItem>
              <AnimatedText
                el="h1"
                text={t('contact_page_title')}
                className="font-headline text-4xl font-bold tracking-tight sm:text-5xl drop-shadow-md"
              />
              <AnimatedText
                el="p"
                text={t('contact_page_desc')}
                className="mx-auto mt-4 max-w-3xl text-lg text-primary-foreground/90 drop-shadow-sm"
              />
            </StaggerItem>
          </div>
        </section>
      ) : (
        <section className="bg-secondary py-10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <StaggerItem>
              <AnimatedText
                el="h1"
                text={t('contact_page_title')}
                className="font-headline text-4xl font-bold tracking-tight sm:text-5xl"
              />
              <AnimatedText
                el="p"
                text={t('contact_page_desc')}
                className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground"
              />
            </StaggerItem>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <StaggerWrap className="grid gap-12 lg:grid-cols-5">
            <StaggerItem className="lg:col-span-3">
              <Card className="bg-card backdrop-blur-lg border border-accent transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_form_name')}</FormLabel>
                            <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('contact_form_email')}</FormLabel>
                                <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('contact_form_phone')}</FormLabel>
                                <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_form_message')}</FormLabel>
                            <FormControl><Textarea placeholder="Tell us how we can help..." className="min-h-[120px]" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="lg" className="w-full sm:w-auto">{t('submit')}</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem className="space-y-8 lg:col-span-2">
              <Card className="bg-card border border-accent">
                <CardHeader>
                    <CardTitle className="font-headline text-accent text-xl">
                        {t('contact_info_title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a href="mailto:contact@rishimishra.in" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-6 w-6 text-accent" />
                    <span>contact@rishimishra.in</span>
                  </a>
                  <a href="tel:+919876543210" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="h-6 w-6 text-accent" />
                    <span>+91 9876543210</span>
                  </a>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <MapPin className="h-6 w-6 text-accent" />
                    <span>Sarojini Nagar, Lucknow, UP</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-accent">
                <CardHeader>
                    <CardTitle className="font-headline text-accent text-xl">
                        {t('contact_social_title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-4">
                    {socialLinks.map((social) => (
                        <Button key={social.label} variant="outline" size="icon" asChild className="hover:bg-accent hover:text-white">
                            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                {social.icon}
                            </a>
                        </Button>
                    ))}
                </CardContent>
              </Card>

              <Card className="bg-card border border-accent overflow-hidden">
                <CardHeader>
                    <CardTitle className="font-headline text-accent text-xl">
                        {t('contact_map_title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative h-64 w-full">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14248.243916982846!2d80.86438835!3d26.7742749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bf8f495555555%3A0x7d00000000000000!2sSarojini%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy"
                        ></iframe>
                    </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerWrap>
        </div>
      </section>
    </div>
  );
}