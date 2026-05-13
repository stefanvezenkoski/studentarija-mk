import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, GraduationCap, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import type { HeroSlide } from '@/src/types';

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [messageOfDay, setMessageOfDay] = useState({ title: 'Студентска порака на денот', message: 'Добредојдовте!' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroRes, msgRes] = await Promise.all([
          supabase.from('hero_slides').select('*').eq('active', true).order('order_index', { ascending: true }),
          supabase.from('daily_messages').select('*').eq('active', true).order('created_at', { ascending: false })
        ]);

        if (heroRes.data) setSlides(heroRes.data);
        
        if (msgRes.data && msgRes.data.length > 0) {
          const messages = msgRes.data;
          
          // Check for priority messages first
          const priorityMessage = messages.find(m => m.is_priority);
          
          if (priorityMessage) {
            setMessageOfDay({
              title: 'Студентска порака на денот',
              message: priorityMessage.message
            });
          } else {
            // Pick a random one for the day (deterministic but random daily)
            const today = new Date();
            const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
            const dailyMessage = messages[dayOfYear % messages.length];
            
            setMessageOfDay({
              title: 'Студентска порака на денот',
              message: dailyMessage.message
            });
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-[var(--bg-main)]">
        {/* Empty while PageLoader is active */}
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="relative min-h-screen flex items-center bg-[var(--bg-main)] overflow-hidden group py-20 lg:py-0">
      {/* Dynamic Background with Noise and Gradient Masks */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 z-0"
        >
          {/* Layered Advanced Overlays */}
          <div className="absolute inset-0 bg-[var(--bg-main)]/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-main)] via-[var(--bg-main)]/10 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-transparent to-transparent z-10 pointer-events-none" />
          
          <img 
            src={slides[currentSlide].image_url} 
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover grayscale-[0.2] contrast-[1.05] brightness-[1.05]"
          />
          {/* Subtle Color Accent Overlay */}
          <div className="absolute inset-0 bg-primary/5 mix-blend-multiply z-20 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-30 pt-24 md:pt-32 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          {/* Left Column: Bold Editorial Typography */}
          <div className="lg:col-span-8">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="flex flex-col mb-8 md:mb-16">
                {slides[currentSlide].title.split(' ').map((word, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15 + 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <span className={`
                      text-[clamp(1.5rem,11vw,6.5rem)] font-mont font-black uppercase tracking-[-0.03em] leading-[0.95] block break-words px-1 py-1
                      ${i === 1 ? 'text-primary' : 'text-[var(--text-main)]'}
                      ${i === 2 ? 'outline-text' : ''}
                    `}>
                      {word}
                    </span>
                  </motion.div>
                ))}
              </div>

              {slides[currentSlide].subtitle && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mb-8 md:mb-14 max-w-lg relative"
                >
                  <p className="text-[var(--text-muted)] text-xl font-medium leading-[1.4] tracking-tight">
                    {slides[currentSlide].subtitle}
                  </p>
                  <div className="absolute -left-8 top-0 bottom-0 w-[2px] bg-primary/30" />
                </motion.div>
              )}

              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                {slides[currentSlide].link_url && (
                  <Link to={slides[currentSlide].link_url!}>
                    <motion.button 
                      whileHover={{ y: -5, backgroundColor: 'var(--text-main)', color: 'var(--bg-main)' }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-transparent border-2 border-[var(--border-main)] text-[var(--text-main)] px-14 py-6 rounded-full font-head font-black text-xs uppercase tracking-[0.3em] flex items-center gap-6 transition-colors duration-500"
                    >
                      ИСТРАЖИ СЕГА
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.button>
                  </Link>
                )}

                {/* Progressive Navigation */}
                <div className="flex items-center gap-4">
                  <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 px-4 h-12 rounded-full border border-black/5">
                    {slides.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-1000 ${i === currentSlide ? 'w-8 bg-black' : 'w-2 bg-black/10'}`} 
                      />
                    ))}
                  </div>
                  <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Editorial Object */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center h-full mt-16 md:mt-24 lg:mt-0">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: -1.5,
                  x: 0,
                  y: 0,
                  rotateY: 0
                }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1.2,
                  delay: 0.2
                }}
                className="relative group perspective-1000"
              >
                {/* Secondary Floating Wrapper for continuous life */}
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotateZ: [-1.5, -0.5, -1.5]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Visual Anchors: Sticky Tape Effects */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-black/10 backdrop-blur-sm -rotate-2 z-50 border-x border-white/20 shadow-sm opacity-60" />
                  <div className="absolute -bottom-4 left-1/4 w-24 h-8 bg-black/5 backdrop-blur-sm rotate-3 z-50 border-x border-white/10 shadow-sm opacity-40" />

                  {/* Floating Decorative Elements */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                  <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />

                  {/* Message of the Day Card */}
                  <motion.div 
                    whileHover={{ rotateY: 5, rotateX: -5 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-[280px] xs:w-[320px] md:w-[380px] h-[400px] xs:h-[480px] md:h-[540px] bg-white p-6 xs:p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-500 flex flex-col group/card border-[8px] md:border-[12px] border-white"
                  >
                    {/* Decorative Paper Clip */}
                    <div className="absolute top-10 right-10 z-50 pointer-events-none opacity-20 -rotate-12">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </div>

                    {/* Background Accents: Sketchy Doodles */}
                    <div className="absolute inset-0 opacity-[0.07] pointer-events-none group-hover/card:opacity-[0.15] transition-opacity duration-700">
                      <svg width="100%" height="100%" className="fill-none stroke-black stroke-[0.8]">
                        {/* Interactive Paths */}
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 2 }}
                          d="M20 100 Q40 80 60 100 T100 100" 
                        />
                        <motion.circle 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 2.5 }}
                          cx="320" cy="80" r="15" 
                        />
                        {/* Coffee Ring / Stain */}
                        <circle cx="60" cy="460" r="40" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="10 5" />
                        <circle cx="65" cy="465" r="35" strokeOpacity="0.05" strokeWidth="1" />
                        
                        <path d="M300 450 L340 490 M340 450 L300 490" />
                        <path d="M30 40 C50 30 70 50 90 40" />
                      </svg>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex flex-col gap-4 mt-2 mb-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="shrink-0 flex flex-col gap-2">
                          <span className="text-[10px] font-mont font-black tracking-[0.5em] text-black/30 uppercase block">ПОРАКА НА ДЕНОТ</span>
                          <div className="w-8 h-1 bg-primary" />
                        </div>
                        <div className="text-right flex flex-col items-end flex-1 min-w-0 gap-2">
                          <span className="text-[9px] font-mont font-black text-black/40 uppercase tracking-widest leading-tight whitespace-nowrap mb-1">
                            {new Date().toLocaleDateString('mk-MK', { weekday: 'long' })}<br />
                            {new Date().toLocaleDateString('mk-MK', { day: '2-digit', month: 'long' }).replace('.', '')}
                          </span>
                          
                          {/* Dynamic Vibe Sticker - Optimized size and position to prevent overlap */}
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-black text-primary px-2.5 py-1.5 rounded-lg shadow-lg border border-white/10 cursor-pointer shadow-black/10 translate-y-1"
                          >
                            <span className="text-[8px] font-mont font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                               <Zap className="w-2.5 h-2.5 fill-primary" /> Ден за факултет и кафе
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Message Content - Robust dynamic sizing with wrap safety */}
                    <div className="flex-1 min-h-0 relative z-10 overflow-hidden flex flex-col">
                      <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1">
                        <div className="min-h-full flex flex-wrap justify-center items-center content-center gap-x-2 gap-y-3 p-1">
                           {messageOfDay.message.split(' ').map((word, i) => {
                            const totalChars = messageOfDay.message.length;
                            
                            let fontSizeClass = 'text-3xl md:text-4xl';
                            if (totalChars > 160) {
                              fontSizeClass = 'text-[10px] md:text-xs leading-tight';
                            } else if (totalChars > 120) {
                              fontSizeClass = 'text-xs md:text-sm';
                            } else if (totalChars > 90) {
                              fontSizeClass = 'text-sm md:text-base';
                            } else if (totalChars > 60) {
                              fontSizeClass = 'text-base md:text-lg';
                            } else if (totalChars > 35) {
                              fontSizeClass = 'text-lg md:text-xl';
                            } else if (totalChars > 20) {
                              fontSizeClass = 'text-2xl md:text-3xl';
                            } else if (totalChars <= 15) {
                              fontSizeClass = 'text-4xl md:text-5xl';
                            }

                            return (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 1.5 + (i * 0.05), type: 'spring' }}
                                className="relative inline-block"
                              >
                                {/* Hand-drawn Highlighter Effect */}
                                <motion.span 
                                   animate={{ 
                                     rotate: i % 2 === 0 ? [-0.5, 0.5, -0.5] : [0.5, -0.5, 0.5],
                                     scale: [1, 1.01, 1] 
                                   }}
                                  transition={{ duration: 5, repeat: Infinity, delay: i * 0.2 }}
                                  className="absolute inset-0 -inset-x-2 -inset-y-0.5 bg-primary transform skew-x-[-4deg] z-0 shadow-sm opacity-95 rounded-sm" 
                                />
                                
                                <span className={`relative z-10 text-black font-mont font-black uppercase tracking-tight leading-none block px-1.5 break-words ${fontSizeClass}`}>
                                  {word}
                                </span>
                              </motion.span>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Top/Bottom Fade for better scroll indication if content overflows */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none opacity-50" />
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none opacity-50" />
                    </div>

                    {/* Footer with Yellow Backgrounds */}
                    <div className="mt-auto pt-6 border-t-2 border-black/5 flex items-end justify-between shrink-0 relative z-10">
                      <div className="flex flex-col gap-1.5">
                        <div className="bg-primary/90 px-2 py-0.5 transform -rotate-1 self-start shadow-sm">
                          <span className="text-[10px] font-mont font-black text-black uppercase tracking-[0.3em]">
                            #СТУДЕНТАРИЈА
                          </span>
                        </div>
                        <div className="bg-primary px-1.5 py-0.5 self-start">
                          <span className="text-[8px] font-mont font-bold text-black uppercase tracking-[0.1em]">
                            порака на денот
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1.5 mb-1">
                        {[1,2,3,4].map(i => (
                          <motion.div 
                            key={i} 
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-primary" 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Professional Paper/Felt Texture */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 2px var(--text-main);
        }
        .perspective {
          perspective: 2000px;
        }
      `}} />
    </section>
  );
}

