import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowLeft, 
  Sparkles, 
  SearchX, 
  ExternalLink, 
  Mail, 
  Users,
  Handshake,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Partner } from '../types';
import DynamicMarquee from '../components/ui/DynamicMarquee';

const FALLBACK_PARTNERS = [
  { id: '1', name: 'Telekom MK', description: 'Телекомуникации', color: '#E20074', logo_url: '' },
  { id: '2', name: 'Netaville.mk', description: 'Технологија', color: '#00FF41', logo_url: '' },
  { id: '3', name: 'Red Bull', description: 'Енергија', color: '#001DFF', logo_url: '' },
  { id: '4', name: 'Wolt', description: 'Достава', color: '#009DE0', logo_url: '' },
];

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPartners(data);
        } else {
          setPartners(FALLBACK_PARTNERS as Partner[]);
        }
      } catch (err) {
        console.error('Failed to load partners:', err);
        setPartners(FALLBACK_PARTNERS as Partner[]);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  // Animated counter for partnerships
  useEffect(() => {
    if (partners.length === 0) {
      setDisplayCount(0);
      return;
    }
    
    const target = partners.length;
    let current = 0;
    const duration = 2000; // 2 seconds
    const interval = Math.max(16, Math.floor(duration / target));
    
    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return partners.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, partners]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative overflow-hidden">
      {/* Background Text Marquee */}
      <div className="absolute top-40 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <motion.div
          animate={{ x: [-1200, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="text-[22rem] font-head font-black whitespace-nowrap leading-none"
        >
          ПАРТНЕРИ PARTNERS ПАРТНЕРИ PARTNERS ПАРТНЕРИ PARTNERS
        </motion.div>
      </div>

      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 80, 0], 
            y: [0, 40, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 80, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -left-48 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full"
        />
      </div>

      {/* Hero Section with Header & Global CTA */}
      <section className="relative pt-24 pb-12 z-30">
        <div className="max-w-7xl mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary transition-colors mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Назад до почетна</span>
            </Link>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 md:gap-20 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-12 h-[3px] bg-primary animate-pulse" />
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] flex items-center gap-2">
                  <Handshake className="w-4 h-4" /> Партнерска Мрежа
                </span>
              </div>
              
              <h1 className="text-7xl md:text-[115px] font-head font-black uppercase leading-none tracking-tighter mb-4 relative flex flex-col items-start gap-4">
                <motion.div 
                  initial={{ rotate: -1, x: -10 }}
                  whileHover={{ rotate: 1, x: 0, scale: 1.02 }}
                  className="bg-primary text-dark px-8 md:px-12 py-3 md:py-6 inline-block shadow-[15px_15px_0px_rgba(0,0,0,0.1)] md:shadow-[25px_25px_0px_rgba(0,0,0,0.05)] border-4 md:border-8 border-dark transform -skew-x-2 relative group cursor-default"
                >
                  <span className="relative z-10">НАШИТЕ</span>
                  <div className="absolute top-0 right-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Sparkles className="absolute -top-6 -right-6 w-12 h-12 text-primary fill-primary opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-12" />
                </motion.div>
                
                <motion.div 
                  initial={{ rotate: 1, x: 10 }}
                  whileHover={{ rotate: -1, x: 30, scale: 1.02 }}
                  className="bg-[var(--bg-secondary)] text-[var(--text-main)] px-8 md:px-12 py-3 md:py-6 inline-block border-4 md:border-8 border-primary shadow-[15px_15px_0px_rgba(var(--primary-rgb),0.2)] md:shadow-[25px_25px_0_rgba(var(--primary-rgb),0.1)] transform skew-x-2 cursor-default"
                >
                  ПАРТНЕРИ
                </motion.div>
              </h1>
              
              <p className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest max-w-sm mt-8 leading-relaxed opacity-60">
                Заедно со најдобрите брендови во Македонија креираме ексклузивни поволности за студентите.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-2 w-full max-w-md lg:mb-4"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-4 mb-2">Најди бренд</span>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary transition-colors z-10" />
                <input 
                  type="text" 
                  placeholder="Пребарувај партнери..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border-2 border-[var(--border-main)] rounded-[2.5rem] py-7 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary transition-all shadow-2xl relative z-10 text-[var(--text-main)] placeholder:text-[var(--text-muted)] group-hover:border-[var(--text-muted)]/30"
                />
              </div>
            </motion.div>
          </div>

          {/* HIGH-IMPACT PROMINENT CTA BOX */}
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className="relative mb-24 group"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-[4rem] group-hover:bg-primary/30 transition-colors opacity-50" />
            
            <div className="bg-[var(--bg-secondary)] border-4 md:border-8 border-primary rounded-[3rem] md:rounded-[5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl transition-all duration-300">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-20 pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center gap-3 bg-primary text-dark px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-lg">
                    <Handshake className="w-5 h-5" /> Стани партнер на заедницата
                  </div>
                  
                  <h2 className="text-4xl md:text-[64px] font-head font-black uppercase leading-[0.95] tracking-tighter mb-8 text-[var(--text-main)] max-w-2xl transition-colors">
                    <span className="bg-primary text-dark px-2">ПРЕТСТАВИ ГО</span> ТВОЈОТ БРЕНД ПРЕД <span className="bg-primary text-dark px-2">60k+</span> СЛЕДАЧИ НА СТУДЕНТАРИЈА
                  </h2>
                  
                  <p className="text-[var(--text-muted)] text-sm md:text-lg font-bold uppercase tracking-tight leading-relaxed max-w-xl mb-12 transition-colors">
                    Стани дел од најбрзо растечката студентска платформа во Македонија. Изгради долготрајна врска со твоите идни потрошувачи.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <a 
                      href="mailto:partneri@studentarija.mk" 
                      className="flex-1 flex items-center justify-center gap-4 bg-primary text-dark px-10 py-6 rounded-full text-xs font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl font-head"
                    >
                      <Mail className="w-6 h-6" />
                      <span>ПИШИ НИ МЕЈЛ</span>
                    </a>
                    <a 
                      href="https://forms.gle" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-4 bg-[var(--bg-main)] text-[var(--text-main)] border-2 border-[var(--border-main)] px-10 py-6 rounded-full text-xs font-black uppercase tracking-widest hover:border-primary transition-all shadow-xl font-head"
                    >
                      <Globe className="w-6 h-6" />
                      <span>ПОПОЛНИ ФОРМА</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-4 hidden lg:block">
                  <div className="space-y-6">
                    <div className="bg-[var(--bg-main)] border-2 border-[var(--border-main)] p-8 rounded-[3rem] transform hover:-translate-y-2 transition-transform shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-12 translate-x-12" />
                      <div className="text-7xl font-head font-black text-primary mb-1 tracking-tighter italic transform -skew-x-6">{displayCount}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] leading-tight">АКТИВНИ СКЛУЧЕНИ ПАРТВЕРСТВА</div>
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Separator */}
      <div className="relative z-40 mb-20">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-1/2 opacity-30" />
        <DynamicMarquee 
          className="relative transform -rotate-1 skew-x-1 scale-105 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] h-28 border-y-2 border-dark/10 bg-[var(--bg-secondary)]/50 backdrop-blur-md" 
          speed={35} 
        />
      </div>

      <section className="max-w-7xl mx-auto px-8 pb-32 z-30 relative">
        <div className="grid grid-cols-1 gap-16">
          {/* Partners Grid */}
          <div className="w-full">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex justify-center py-40">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredPartners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredPartners.map((partner, idx) => (
                    <motion.div
                      layout
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] p-8 hover:border-primary/50 transition-all duration-500 shadow-xl overflow-hidden relative flex flex-col"
                    >
                      {/* Logo Box */}
                      <div className="w-full aspect-square bg-white rounded-[2.5rem] flex items-center justify-center p-10 mb-8 shadow-inner group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                         {partner.logo_url ? (
                            <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain relative z-10" referrerPolicy="no-referrer" />
                         ) : (
                           <div className="text-6xl font-head font-black text-zinc-100 uppercase tracking-tighter opacity-10">LOGO</div>
                         )}
                         
                         {partner.secondary_image_url && (
                           <motion.div 
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-white z-20 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
                           >
                             <img 
                               src={partner.secondary_image_url} 
                               alt="Промоција" 
                               className="w-full h-full object-cover rounded-2xl" 
                               referrerPolicy="no-referrer"
                             />
                           </motion.div>
                         )}
                      </div>

                      <div className="flex flex-col gap-2 flex-grow">
                        <h3 className="text-2xl font-head font-black uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
                          {partner.name}
                        </h3>
                        <p className="text-[var(--text-muted)] text-[11px] font-medium leading-relaxed mb-6 mt-1 line-clamp-2">
                          {partner.description}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-[var(--border-main)]/30">
                          {partner.website_url && (
                             <a 
                               href={partner.website_url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="flex items-center justify-between w-full bg-primary text-dark px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg font-head"
                             >
                               <span>ИСКОРИСТИ</span>
                               <ExternalLink className="w-3.5 h-3.5" />
                             </a>
                          )}
                        </div>
                      </div>

                      {partner.is_featured && (
                        <div className="absolute top-6 right-6 p-2 bg-primary text-dark rounded-full shadow-2xl z-30">
                           <Sparkles className="w-3 h-3 fill-dark" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[var(--border-main)] rounded-[4rem] bg-[var(--bg-secondary)]/30 w-full text-center px-8">
                  <SearchX className="w-16 h-16 text-[var(--text-muted)] mb-8 opacity-20" />
                  <h3 className="text-3xl font-head font-black uppercase tracking-tighter mb-4 text-[var(--text-muted)]">Нема партнери</h3>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:underline"
                  >
                    ВРАТИ СЕ НАЗАД
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
