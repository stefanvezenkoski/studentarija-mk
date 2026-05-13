import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { Loader2, Megaphone, Tag, MapPin, Phone, ExternalLink } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  contact: string;
  category: string;
  image_url: string;
}

export default function Oglasi() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Сите');

  useEffect(() => {
    async function fetchAds() {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAds(data);
      }
      setLoading(false);
    }
    fetchAds();
  }, []);

  const categories = ['Сите', ...new Set(ads.map(ad => ad.category))];
  const filteredAds = activeCategory === 'Сите' ? ads : ads.filter(ad => ad.category === activeCategory);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center mb-16 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6"
          >
            <Megaphone className="w-8 h-8" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-head font-black uppercase tracking-tighter mb-4 italic leading-none">
            ОГЛАСИ
          </h1>
          <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.4em] text-xs">Пронајди го она што ти треба</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                activeCategory === cat 
                  ? "bg-primary text-dark border-primary translate-y-[-2px] shadow-lg shadow-primary/20" 
                  : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ads Grid */}
        {filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredAds.map((ad, i) => (
                <motion.div
                  key={ad.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] overflow-hidden hover:border-primary/30 transition-all flex flex-col"
                >
                  <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 font-head font-black text-4xl italic">БЕЗ СЛИКА</div>
                    )}
                    <div className="absolute top-6 right-6 bg-primary text-dark px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                      {ad.price}
                    </div>
                  </div>
                  
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{ad.category}</span>
                    </div>
                    
                    <h3 className="text-2xl font-head font-black uppercase mb-4 group-hover:text-primary transition-colors leading-tight">
                      {ad.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                      {ad.description}
                    </p>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-3 text-zinc-500 text-sm">
                        <MapPin className="w-4 h-4 text-primary/50" />
                        <span className="font-bold">{ad.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 text-sm">
                        <Phone className="w-4 h-4 text-primary/50" />
                        <span className="font-bold">{ad.contact}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-10 py-4 bg-white/5 hover:bg-primary hover:text-dark border border-white/5 hover:border-primary transition-all rounded-2xl flex items-center justify-center gap-3 group/btn">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Детали за оглас</span>
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
             <p className="text-white/20 font-head font-black text-4xl uppercase italic">Нема пронајдено огласи</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from '@/src/lib/utils';
