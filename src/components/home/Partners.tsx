import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  color?: string;
}

const FALLBACK_PARTNERS = [
  { id: '1', name: 'Telekom MK', description: 'Телекомуникации', color: '#E20074', logo_url: '' },
  { id: '2', name: 'Netaville.mk', description: 'Технологија', color: '#00FF41', logo_url: '' },
  { id: '3', name: 'Red Bull', description: 'Енергија', color: '#001DFF', logo_url: '' },
  { id: '4', name: 'Wolt', description: 'Достава', color: '#009DE0', logo_url: '' },
];

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Database fetch error:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setPartners(data);
        } else {
          setPartners(FALLBACK_PARTNERS as Partner[]);
        }
      } catch (err) {
        console.error('Failed to load partners from database:', err);
        setPartners(FALLBACK_PARTNERS as Partner[]);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  const displayPartners = partners.length > 0 ? partners : FALLBACK_PARTNERS;
  // If we have very few partners, duplicate them to ensure smooth marquee
  const tickerItems = displayPartners.length < 5 
    ? [...displayPartners, ...displayPartners, ...displayPartners, ...displayPartners] 
    : displayPartners;

  return (
    <section className="py-24 bg-[var(--bg-main)] border-t border-[var(--border-main)] overflow-hidden selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-8 mb-20 flex flex-col items-center text-center">
        <div className="relative">
          <h2 className="text-3xl md:text-6xl font-head font-black tracking-[-0.04em] uppercase leading-tight text-[var(--text-main)] flex flex-wrap justify-center items-center gap-x-4">
            <span>СТУДЕНТИТЕ ПОДДРЖАНИ</span> 
            <span className="opacity-40">ОД</span>
            <span className="relative inline-block px-6 py-2 italic overflow-hidden">
              <span className="relative z-10 text-dark">НАЈДОБРИТЕ</span>
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
                className="absolute inset-0 bg-primary -z-0 -rotate-1 origin-left pointer-events-none"
              />
            </span>
          </h2>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="flex overflow-hidden gap-8 group py-10 relative">
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10" />

        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="flex shrink-0 items-center gap-8 min-w-full"
          >
            {tickerItems.map((partner, tickerIdx) => (
              <div 
                key={`${partner.id}-${tickerIdx}`} 
                className="flex items-center gap-6 bg-[var(--bg-secondary)] border border-[var(--border-main)] px-12 py-8 rounded-[30px] group/item hover:border-[var(--border-main)] transition-all cursor-pointer whitespace-nowrap"
              >
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-xl group-hover/item:scale-110 transition-transform"
                >
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain p-2 md:p-3" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-5xl">🏢</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-head font-black uppercase tracking-tighter text-[var(--text-main)]">
                    {partner.name}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {partner.description}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <Link to="/partners">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--text-main)', color: 'var(--bg-main)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-main)] text-[var(--text-main)] px-10 py-4 rounded-full font-head font-black text-[11px] uppercase tracking-widest hover:border-transparent transition-all shadow-xl"
          >
            ВИДИ ГИ СИТЕ ПАРТНЕРИ
          </motion.button>
        </Link>
        
        <Link to="/partners">
          <motion.button 
            whileHover={{ scale: 1.1, color: 'var(--selection-bg)', letterSpacing: '0.5em' }}
            className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-all cursor-pointer"
          >
            + СТАНЕТЕ ПАРТНЕР
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

