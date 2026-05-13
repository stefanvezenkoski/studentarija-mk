import { Instagram, Music, Facebook, Mail, Heart, ArrowUpRight, Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import Logo from '../ui/Logo';
import { cn } from '@/src/lib/utils';

export default function Footer() {
  const [dynamicNavLinks, setDynamicNavLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const { data } = await supabase
          .from('navigation_links')
          .select('*')
          .order('order_index', { ascending: true });
        if (data) setDynamicNavLinks(data);
      } catch (err) {
        console.error('Failed to fetch navigation in footer:', err);
      }
    };
    fetchNav();
  }, []);

  const aktuelnoLinks = [...dynamicNavLinks]
    .filter(l => l.category === 'aktuelno')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    
  const mainLinks = [...dynamicNavLinks]
    .filter(l => l.category === 'main')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] pt-32 pb-16 px-6 md:px-12 border-t border-[var(--border-main)] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          {/* Brand & Mission */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-8">
              <Logo className="scale-150 origin-left mb-12" />
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-syne font-black text-[var(--text-main)] leading-[0.9] uppercase italic tracking-tighter max-w-xl">
                ГЛАСОТ НА МАКЕДОНСКИТЕ <span className="text-primary">СТУДЕНТИ.</span>
              </h2>
              <p className="text-xl text-[var(--text-muted)] font-medium font-dm max-w-md leading-relaxed">
                Ние сме најголемата дигитална заедница. Информираме, забавуваме и се бориме за подобро студентско утре.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary font-inter">ПРИКЛУЧИ СЕ НА ЗАЕДНИЦАТА</span>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Instagram, label: 'Instagram', color: 'bg-[#E1306C]', url: 'https://instagram.com/studentarijamk' },
                  { icon: Send, label: 'Telegram', color: 'bg-[#0088cc]', url: '#' },
                  { icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]', url: '#' },
                  { icon: Mail, label: 'Email', color: 'bg-primary text-black', url: 'mailto:contact@studentarija.mk' }
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-16 h-16 rounded-[2rem] border border-[var(--border-main)] flex items-center justify-center transition-all duration-500 hover:shadow-xl hover:shadow-black/20",
                      social.color ? "hover:bg-white/10" : "bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <social.icon className="w-7 h-7" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-16 pt-8">
            <div className="space-y-12">
              <div className="space-y-8">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary font-inter block mb-10 opacity-70">АКТУЕЛНО</span>
                <nav className="flex flex-col gap-8">
                  {aktuelnoLinks.map((link) => (
                    <Link 
                      key={link.id || link.name}
                      to={link.href} 
                      className="group flex flex-col items-start gap-2"
                    >
                      <span className="text-2xl font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter group-hover:text-primary transition-all">
                        {link.name}
                      </span>
                      <span className="text-[10px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-[0.2em] font-inter">
                        {link.description || link.desc}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-8">
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary font-inter block mb-10 opacity-70">МЕНИ</span>
                <nav className="flex flex-col gap-6">
                  {mainLinks.map((link) => (
                    <Link 
                      key={link.id || link.name}
                      to={link.href}
                      className="text-2xl font-syne font-black text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase italic tracking-tighter transition-all flex items-center justify-between group"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all text-primary" />
                    </Link>
                  ))}
                  <Link to="/about-us" className="text-2xl font-syne font-black text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase italic tracking-tighter transition-all">За Нас</Link>
                  <Link to="/faq" className="text-2xl font-syne font-black text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase italic tracking-tighter transition-all">FAQ</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-16 border-t border-[var(--border-main)] flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="space-y-2">
               <p className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-[0.5em] font-inter">
                 © {currentYear} <span className="text-primary">СТУДЕНТАРИЈА.МК</span> 
               </p>
               <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40 font-inter">
                 СИТЕ ПРАВА СЕ ЗАДРЖАНИ.
               </p>
             </div>
             
             <div className="flex items-center gap-8">
               <Link to="#" className="text-[10px] font-black text-[var(--text-muted)] hover:text-primary uppercase tracking-[0.2em] transition-all font-inter">Приватност</Link>
               <Link to="#" className="text-[10px] font-black text-[var(--text-muted)] hover:text-primary uppercase tracking-[0.2em] transition-all font-inter">Услови за користење</Link>
             </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 group">
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] font-inter opacity-60">Од студентите</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500 group-hover:scale-125 transition-transform duration-500" />
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] font-inter opacity-60">за студентите</span>
             </div>
             <div className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-[0.3em] font-inter">
               Развиено <span className="text-primary italic tracking-tight">APEXIUM DEV</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
