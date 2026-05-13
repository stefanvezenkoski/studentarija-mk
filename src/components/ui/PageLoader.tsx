import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';


export default function PageLoader() {
  const animationImages = [
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/1777945970866-9snm7.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/1777945970866-jmnuss.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/1777945970866-oturr.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/1777945970866-w8wlll.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/1777945970866-zf3qpa.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/1777948547167-ft0gjm.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/0.006232994073421483.png',
    'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/uploads/0.6701867771869205.png'
  ];

  const [counter, setCounter] = useState(0);
  const [currentImg, setCurrentImg] = useState(() => Math.floor(Math.random() * animationImages.length));
  const [glitch, setGlitch] = useState(false);

  const displayImages = animationImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 11);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const imgInterval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % displayImages.length);
      // Trigger a quick glitch effect coincident with image change
      setGlitch(true);
      setTimeout(() => setGlitch(false), 50);
    }, 150);

    return () => clearInterval(imgInterval);
  }, [displayImages.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: '-100%',
        transition: { duration: 0.6, ease: [0.7, 0, 0.3, 1] }
      }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center font-head"
    >
      {/* Background with Scanning Line Glitch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImg}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ 
            opacity: 0.5, 
            scale: 1, 
            filter: glitch ? 'blur(20px) hue-rotate(90deg)' : 'blur(0px)',
            x: glitch ? [2, -2, 0] : 0
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={displayImages[currentImg]}
            alt="Loading bg"
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
      </AnimatePresence>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Center Block */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="relative mb-8">
          {/* Main Logo Text with Glitch clones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h1 className="text-white font-black text-5xl md:text-8xl tracking-[-0.05em] uppercase relative">
              Студентарија<span className="text-primary italic">.mk</span>
              
              {/* Glitch layers */}
              {glitch && (
                <>
                  <span className="absolute top-0 left-0 -ml-1 text-red-500 opacity-70 animate-pulse">Студентарија.mk</span>
                  <span className="absolute top-0 left-0 ml-1 text-blue-500 opacity-70 animate-pulse">Студентарија.mk</span>
                </>
              )}
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-1 bg-primary w-full origin-left mt-2"
          />
        </div>

        {/* Counter Design */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-white text-6xl font-black tabular-nums">{counter}</span>
            <span className="text-primary font-bold text-xl">%</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-[1px] bg-white/10" />
            <div className="w-16 h-[1px] bg-white/10" />
          </div>
        </div>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
            className="w-1 h-1 bg-white" 
          />
        ))}
      </div>

      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Version 2.0.4</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Digital Student Hub</span>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-[2px] bg-primary animate-pulse" />
          <div className="w-8 h-[2px] bg-white/10" />
        </div>
      </div>

      {/* Global Grain/Noise */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
    </motion.div>
  );
}
