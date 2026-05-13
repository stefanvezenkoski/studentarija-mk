import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Post, HeroSlide, StudentEvent } from '../types';
import { AnimatePresence, motion } from 'motion/react';

// Components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import LatestNews from '../components/home/LatestNews';
import StudentEvents from '../components/home/StudentEvents';
import VibeOnPromo from '../components/home/VibeOnPromo';
import Community from '../components/home/Community';
import QuickNav from '../components/home/QuickNav';
import Partners from '../components/home/Partners';
import Newsletter from '../components/home/Newsletter';
import ScrollToTop from '../components/ui/ScrollToTop';
import PageLoader from '../components/ui/PageLoader';
import DynamicMarquee from '../components/ui/DynamicMarquee';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, eventsRes, heroRes, citiesRes] = await Promise.all([
          supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('events')
            .select('*')
            .order('start_date', { ascending: true }),
          supabase
            .from('hero_slides')
            .select('*')
            .eq('active', true)
            .order('order_index', { ascending: true }),
          supabase
            .from('cities')
            .select('*')
            .order('name')
        ]);

        if (postsRes.data) {
          setPosts(postsRes.data as Post[]);
        }

        if (eventsRes.data) {
          setEvents(eventsRes.data as StudentEvent[]);
        }

        if (heroRes.data) {
          setHeroSlides(heroRes.data as HeroSlide[]);
        }

        if (citiesRes.data) {
          setCities(citiesRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
    
    // Real-time synchronization for posts
    const channel = supabase
      .channel('home-posts-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchData(); // Refresh all data on changes
        }
      )
      .subscribe();
    
    // Fixed 0.8s loader for fast access as requested
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  const news = posts.filter(p => p.type === 'news');
  const loaderImages = heroSlides.map(s => s.image_url);

  return (
    <>
      <AnimatePresence>
        {loading && <PageLoader />}
      </AnimatePresence>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Text Marquee (Big & Animated) */}
        <div className="absolute top-40 md:top-80 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none z-0">
          <motion.div
            animate={{ x: [-1000, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="text-[10rem] md:text-[25rem] font-head font-black whitespace-nowrap leading-none"
          >
            ВЕСТИ NEWS INFO ВЕСТИ NEWS INFO ВЕСТИ NEWS INFO
          </motion.div>
        </div>

        {/* Dynamic Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, 50, 0],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full"
          />
          <motion.div 
            animate={{ 
              x: [0, -150, 0], 
              y: [0, 100, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-48 w-[800px] h-[800px] bg-primary/5 blur-[180px] rounded-full"
          />
          {/* Neon Highlighter Marker Effects */}
          <div className="absolute top-[5%] -left-20 w-[600px] h-32 bg-primary/20 blur-[120px] -rotate-12 rounded-full pointer-events-none" />
          <div className="absolute top-[30%] -right-40 w-[800px] h-40 bg-primary/10 blur-[150px] rotate-12 rounded-full pointer-events-none" />
          <div className="absolute top-[60%] left-[20%] w-[500px] h-20 bg-primary/10 blur-[130px] rotate-6 rounded-full pointer-events-none" />
          <div className="absolute bottom-[10%] -left-10 w-[700px] h-24 bg-primary/15 blur-[110px] -rotate-3 rounded-full pointer-events-none" />
          
          {/* Concentrated Yellow Glows */}
          <div className="absolute top-[15%] left-[60%] w-40 h-40 bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[40%] right-[20%] w-60 h-60 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          {/* Yellow Marker Highlights */}
          <div className="absolute top-[20%] right-[10%] w-72 h-4 bg-primary/30 blur-2xl rotate-12 rounded-full" />
          <div className="absolute top-[80%] left-[5%] w-96 h-6 bg-primary/20 blur-2xl -rotate-6 rounded-full" />
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[80%] h-1 bg-primary/10 blur-xl rounded-full" />
          <div className="absolute top-[65%] right-[5%] w-60 h-32 bg-primary/5 blur-[100px] -rotate-45 rounded-full" />
          
          {/* Intense Marker Strokes */}
          <div className="absolute top-[35%] left-[10%] w-64 h-12 bg-primary/20 blur-xl -rotate-[15deg] rounded-full mix-blend-multiply transition-all duration-1000 group-hover:rotate-[-20deg]" />
          <div className="absolute bottom-[25%] right-[15%] w-80 h-16 bg-primary/15 blur-2xl rotate-[10deg] rounded-full mix-blend-multiply" />

          {/* Scribble/Marker Decorative Strokes */}
          <div className="absolute top-[20%] right-[15%] opacity-15 pointer-events-none">
            <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary hover:rotate-6 transition-transform duration-1000">
              <path d="M10 50C100 10 300 190 390 150" stroke="currentColor" strokeWidth="25" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute top-[75%] left-[10%] opacity-10 pointer-events-none rotate-12">
            <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M10 10C50 90 150 90 190 10" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute bottom-[40%] left-[5%] opacity-10 pointer-events-none -scale-x-100">
            <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M5 100C80 50 220 50 295 100" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
          
          {/* Subtle Grainy Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
        </div>

        <main className="relative z-10">
          <Hero />
          <LatestNews posts={news} />
          <StudentEvents events={events} dbCities={cities} />
          <Community />
          <Partners />
          <div className="relative z-20 py-24 -mt-12 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full transform scale-150" />
            <DynamicMarquee 
              className="relative transform rotate-1 skew-x-1 scale-105 shadow-[0_20px_60px_rgba(var(--primary-rgb),0.2)] h-28 border-y-2 border-dark/5 bg-[var(--bg-secondary)]/50 backdrop-blur-md" 
              speed={40} 
            />
          </div>
          <Newsletter />
        </main>
        <ScrollToTop />
      </div>
    </>
  );
}
