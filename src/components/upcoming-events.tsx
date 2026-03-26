
'use client';

import * as React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { StaggerWrap, StaggerItem } from './animations';
import Link from 'next/link';
import { ArrowRight, Heart, Users, ShieldCheck, Megaphone, Tractor, TrendingUp, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * About Our Mission Section
 * A pixel-perfect replication of the modern NGO mission UI.
 */
export function UpcomingEvents() {
    const { language } = useTranslation();

    const missionPoints = [
        {
            icon: <ShieldCheck className="h-6 w-6 md:h-7 md:w-7" />,
            title: { hi: '🌾 अधिकार और सम्मान', en: '🌾 Rights & Dignity' },
            desc: { hi: 'किसानों के अधिकार और सम्मान की रक्षा करना', en: 'Protecting the rights and dignity of every farmer.' }
        },
        {
            icon: <Users className="h-6 w-6 md:h-7 md:w-7" />,
            title: { hi: '🤝 किसान एकता', en: '🤝 Farmer Unity' },
            desc: { hi: 'किसान एकता को मजबूत बनाना', en: 'Strengthening unity among farmers across the region.' }
        },
        {
            icon: <Megaphone className="h-6 w-6 md:h-7 md:w-7" />,
            title: { hi: '📢 सरकार तक आवाज़', en: '📢 Government Outreach' },
            desc: { hi: 'किसानों की समस्याओं को सरकार तक पहुँचाना', en: 'Voicing farmer concerns directly to government authorities.' }
        },
        {
            icon: <Tractor className="h-6 w-6 md:h-7 md:w-7" />,
            title: { hi: '🚜 कृषि जागरूकता', en: '🚜 Agri Awareness' },
            desc: { hi: 'कृषि से जुड़े मुद्दों पर जागरूकता फैलाना', en: 'Spreading awareness on agricultural issues and innovations.' }
        },
        {
            icon: <TrendingUp className="h-6 w-6 md:h-7 md:w-7" />,
            title: { hi: '📈 संगठन का विस्तार', en: '📈 Organization Growth' },
            desc: { hi: 'संगठन का विस्तार और नेतृत्व विकास', en: 'Expanding our reach and developing future grassroots leaders.' }
        },
        {
            icon: <HeartHandshake className="h-6 w-6 md:h-7 md:w-7" />,
            title: { hi: '💪 किसान का साथ', en: '💪 Farmer Support' },
            desc: { hi: 'हर किसान के साथ खड़े रहना (Support System)', en: 'Standing as a robust support system for every farmer in need.' }
        }
    ];

    return (
        <section className="bg-gradient-to-b from-white to-emerald-50/30 py-16 md:py-32 overflow-hidden border-y border-slate-50 selection:bg-emerald-100 font-sans">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 md:gap-16 lg:grid-cols-2 items-center">
                    
                    {/* LEFT SIDE: Image Collage */}
                    <div className="relative order-2 lg:order-1 h-[400px] sm:h-[500px] md:h-[650px] flex items-center justify-center">
                        <div className="relative w-full h-full max-w-lg">
                            {/* Top Left: Volunteers */}
                            <motion.div 
                                initial={{ opacity: 0, x: -30, y: -30 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute top-0 left-0 w-[48%] aspect-square z-20"
                            >
                                <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img 
                                        src="https://images.unsplash.com/photo-1559027615-cd26735550b4?auto=format&fit=crop&q=80&w=800" 
                                        alt="Volunteers smiling" 
                                        className="w-full h-full object-cover"
                                        data-ai-hint="volunteers smiling"
                                    />
                                </div>
                            </motion.div>

                            {/* Top Right: Elderly Care */}
                            <motion.div 
                                initial={{ opacity: 0, x: 30, y: -20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                className="absolute top-8 md:top-12 right-0 w-[52%] aspect-[4/5] z-10"
                            >
                                <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <img 
                                        src="https://images.unsplash.com/photo-1581578731522-aa0606660fb0?auto=format&fit=crop&q=80&w=800" 
                                        alt="Elderly care" 
                                        className="w-full h-full object-cover"
                                        data-ai-hint="elderly care"
                                    />
                                </div>
                            </motion.div>

                            {/* Bottom Left: Tree Plantation */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20, y: 30 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="absolute bottom-8 md:bottom-12 left-0 w-[52%] aspect-[4/5] z-30"
                            >
                                <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <img 
                                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" 
                                        alt="Tree planting" 
                                        className="w-full h-full object-cover"
                                        data-ai-hint="tree planting"
                                    />
                                </div>
                            </motion.div>

                            {/* Bottom Right: Animal Care */}
                            <motion.div 
                                initial={{ opacity: 0, x: 30, y: 30 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                className="absolute bottom-0 right-4 w-[48%] aspect-square z-40"
                            >
                                <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                                    <img 
                                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" 
                                        alt="Animal care" 
                                        className="w-full h-full object-cover"
                                        data-ai-hint="animal care"
                                    />
                                </div>
                            </motion.div>

                            {/* Floating Glassmorphism Elements */}
                            <motion.div 
                                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-white/40 z-20 shadow-xl pointer-events-none" 
                            />
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-1/4 right-1/4 w-12 h-12 md:w-16 md:h-16 bg-emerald-500/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-emerald-500/20 z-50 shadow-lg pointer-events-none" 
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE: Content Section */}
                    <StaggerWrap className="space-y-6 md:space-y-8 order-1 lg:order-2 text-center lg:text-left">
                        <StaggerItem className="flex justify-center lg:justify-start">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    {language === 'hi' ? 'हमारे मिशन के बारे में' : 'ABOUT OUR MISSION'}
                                </span>
                            </div>
                        </StaggerItem>
                        
                        <StaggerItem>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1] tracking-tight">
                                {language === 'hi' ? 'भारतीय किसान क्रांति यूनियन' : 'Bhartiya Kisan Kranti Union'}
                            </h2>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-xl font-medium mx-auto lg:mx-0 font-hindi">
                                एकता में शक्ति – किसान ही देश की ताकत
                            </p>
                        </StaggerItem>

                        {/* Bullet Points with Icons */}
                        <StaggerItem className="space-y-6 md:space-y-8 pt-4">
                            {missionPoints.map((point, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center lg:items-start gap-4 md:gap-6 group text-center sm:text-left">
                                    <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all group-hover:bg-emerald-600 group-hover:text-white shadow-sm">
                                        {point.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-900 text-lg md:text-xl uppercase tracking-tight">
                                            {language === 'hi' ? point.title.hi : point.title.en}
                                        </h4>
                                        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-md">
                                            {language === 'hi' ? point.desc.hi : point.desc.en}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </StaggerItem>

                        {/* CTA Button */}
                        <StaggerItem className="pt-6">
                            <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-16 px-12 text-lg font-bold shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 group border-none">
                                <Link href="/contact" className="flex items-center justify-center gap-3">
                                    {language === 'hi' ? 'हमारे मिशन से जुड़ें' : 'JOIN OUR MISSION'}
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </StaggerItem>

                        {/* Horizontal Stats Section */}
                        <StaggerItem className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 md:gap-12 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">1000+</div>
                                    <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        {language === 'hi' ? 'स्वयंसेवक' : 'Volunteers'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">10K+</div>
                                    <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        {language === 'hi' ? 'प्रभावित जीवन' : 'Lives Impacted'}
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    </StaggerWrap>

                </div>
            </div>
        </section>
    );
}
