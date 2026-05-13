import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Bell, GraduationCap, Home, Bus, Utensils, Briefcase, Calendar, FileText, HelpCircle, ArrowRight, Sparkles, RefreshCcw } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  text_color?: string;
  custom_emoji?: string;
  expires_at?: string;
  categories: {
    name: string;
    slug: string;
    emoji: string;
    default_color: string;
  }
}

export default function QuickNav() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select(`
            id,
            title,
            message,
            text_color,
            custom_emoji,
            expires_at,
            categories (
              name,
              slug,
              emoji,
              default_color
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        if (data) {
          setNotifications(data as any);
        }
      } catch (err) {
        console.warn('QuickNav Supabase fetch error:', err);
      }
    }
    fetchNotifications();

    const channel = supabase
      .channel('quick_nav_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = [
    { 
      id: 'stipendii', 
      title: 'Стипендии', 
      desc: 'Државни, приватни и странски стипендии за сите студенти.', 
      icon: GraduationCap,
      emoji: '🎓',
      color: 'bg-blue-500/10 text-blue-400',
      span: 'md:col-span-4 md:row-span-2',
      link: '/stipendii'
    },
    { 
      id: 'domovi', 
      title: 'Домови', 
      desc: 'Аплицирање, резултати и услови во студентските домови.', 
      icon: Home,
      emoji: '🏠',
      color: 'bg-orange-500/10 text-orange-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/studentski-domovi'
    },
    { 
      id: 'jsp', 
      title: 'Градски превоз', 
      desc: 'Бесплатен превоз и студентски картички.', 
      icon: Bus,
      emoji: '🚌',
      color: 'bg-cyan-500/10 text-cyan-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/jsp'
    },
    { 
      id: 'obrok', 
      title: 'Оброк', 
      desc: 'Дневен износ и објекти за субвенциониран оброк.', 
      icon: Utensils,
      emoji: '🍽️',
      color: 'bg-emerald-500/10 text-emerald-400',
      span: 'md:col-span-2 md:row-span-2',
      link: '/page/subvencioniran-obrok'
    },
    { 
      id: 'rabota', 
      title: 'Пракси', 
      desc: 'Најнови огласи за пракса и почетни кариери за студенти.', 
      icon: Briefcase,
      emoji: '💼',
      color: 'bg-amber-500/10 text-amber-400',
      span: 'md:col-span-4 md:row-span-1',
      link: '/oglasi'
    },
    { 
      id: 'nastani', 
      title: 'Настани', 
      desc: 'Хакатони, конференции и студентски собири.', 
      icon: Calendar,
      emoji: '📅',
      color: 'bg-rose-500/10 text-rose-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/events'
    },
    { 
      id: 'dokumenti', 
      title: 'Водичи', 
      desc: 'Потребни обрасци и административни совети.', 
      icon: FileText,
      emoji: '📄',
      color: 'bg-zinc-500/10 text-zinc-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/page/dokumenti'
    },
    { 
      id: 'faq', 
      title: 'FAQ', 
      desc: 'Најчесто поставувани прашања и брзи одговори.', 
      icon: HelpCircle,
      emoji: '❓',
      color: 'bg-red-500/10 text-red-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/faq'
    },
    { 
      id: 'brucosi', 
      title: 'Брукоши', 
      desc: 'Водич за нови студенти и студентски живот.', 
      icon: Sparkles,
      emoji: '✨',
      color: 'bg-yellow-500/10 text-yellow-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/brucosi'
    },
    { 
      id: 'upisi', 
      title: 'Уписи', 
      desc: 'Сè што ти е потребно за упис на факултет во новата академска година.', 
      icon: GraduationCap,
      emoji: '📑',
      color: 'bg-indigo-500/10 text-indigo-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/upisi-2025-26'
    },
    { 
      id: 'prodolzuvanje', 
      title: 'Продолжи Стипендија', 
      desc: 'Информации за продолжување на твојата стипендија.', 
      icon: RefreshCcw,
      emoji: '🔄',
      color: 'bg-emerald-500/10 text-emerald-400',
      span: 'md:col-span-2 md:row-span-1',
      link: '/prodolzuvanje-stipendija'
    },
  ];

  return (
    <section ref={containerRef} className="bg-[var(--bg-main)] overflow-hidden relative border-b border-[var(--border-main)] py-20">
      {/* Dynamic Cursor Spotlight */}
      <motion.div 
        className="pointer-events-none absolute -inset-px z-30 transition duration-300 md:block hidden"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 193, 7, 0.05), transparent 80%)`,
        }}
      />

      {/* Background Kinetic Marquee */}
      <div className="absolute top-1/2 left-0 w-full overflow-hidden pointer-events-none -translate-y-1/2 select-none z-0">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="text-[25vw] font-black whitespace-nowrap leading-none tracking-tighter text-primary/[0.08]"
        >
          СТИПЕНДИИ • ДОМОВИ • ОГЛАСИ • НАСТАНИ • СТИПЕНДИИ • ДОМОВИ • ОГЛАСИ • НАСТАНИ •
        </motion.div>
      </div>

      {/* Floating Abstract Symbols */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              x: mousePos.x * (0.02 + i * 0.01),
              y: mousePos.y * (0.02 + i * 0.01),
            }}
            transition={{ duration: 0.5 }}
            className="absolute text-primary/20 font-mono text-2xl"
            style={{ 
              top: `${15 * (i + 1)}%`, 
              left: `${12 * (i + 1)}%`,
            }}
          >
            {['{/}', '=>', '&&', '[]', '()', '::'][i]}
          </motion.div>
        ))}
      </div>

      {/* Top Notification Bar */}
      <div className="w-full h-14 bg-[var(--bg-main)] border-b border-[var(--border-main)] flex items-center overflow-x-auto no-scrollbar">
        <div className="h-full px-6 bg-primary flex items-center gap-3 shrink-0 relative z-20">
          <Bell className="w-4 h-4 text-dark fill-dark" />
          <span className="text-[10px] font-black uppercase tracking-widest text-dark">НОВО</span>
        </div>
        
        <div className="flex items-center divide-x divide-[var(--border-main)] h-full">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="px-8 min-w-[280px] flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--hover-bg)] rounded flex items-center justify-center text-lg">
                  {notif.custom_emoji || notif.categories.emoji}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] truncate max-w-[150px]">
                    {notif.categories.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-main)] font-bold truncate max-w-[150px]">
                    {notif.title}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-8 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-50">
              Следете ги најновите информации
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-48 relative">
        {/* Analog Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        <div className="relative mb-32 md:mb-52">
          {/* Label with kinetic line - Styled like the screenshot */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-14"
          >
            <div className="h-[4px] w-24 bg-primary" />
            <div className="bg-primary px-3 py-1">
              <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-dark whitespace-nowrap">БРЗА НАВИГАЦИЈА</span>
            </div>
          </motion.div>

          {/* Magnetic Heading - Styled to match screenshot (?) */}
          <div className="relative">
            <h2 className="flex flex-col text-[18vw] md:text-[14vw] font-head font-black leading-[0.74] tracking-[-0.07em] uppercase text-dark-main relative z-10">
              <div className="flex items-baseline">
                {["Ш", "Т", "О"].map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
              <div className="flex items-center">
                {["Б", "А", "Р", "А", "Ш"].map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + (i * 0.1) }}
                  >
                    {l}
                  </motion.span>
                ))}
                
                <motion.span 
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, type: "spring", damping: 12 }}
                  className="relative inline-flex items-center justify-center w-[1.1em] h-[1.1em] bg-primary text-dark rounded-full ml-[0.05em]"
                >
                  ?
                </motion.span>
              </div>
            </h2>
            
            {/* Background Halos - Modern decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-primary/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-primary/10 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-primary/5 rounded-full" />
            </div>
          </div>
        </div>

        {/* Organic Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3 }
              }}
            >
              <Link
                to={cat.link || '#'}
                className={cn(
                  "group relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center text-center justify-center overflow-hidden transition-all duration-700 h-full",
                  "bg-[var(--bg-secondary)] border border-[var(--border-main)] min-h-[220px] md:min-h-[250px]",
                  "hover:bg-[var(--hover-bg)] hover:border-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(255,193,7,0.1)]"
                )}
              >
                {/* Card Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none group-hover:opacity-[0.05] transition-opacity bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[1.2rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg mb-6 relative",
                    cat.color
                  )}>
                    <cat.icon className="w-7 h-7 md:w-8 md:h-8 relative z-10" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-head font-black tracking-tighter uppercase mb-2 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider leading-relaxed line-clamp-2 max-w-[180px]">
                    {cat.desc}
                  </p>
                </div>

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>

                {/* Ghost Symbol */}
                <div className="absolute -bottom-6 -right-6 text-7xl md:text-8xl opacity-[0.015] font-black group-hover:opacity-[0.03] group-hover:scale-110 transition-all duration-1000 grayscale pointer-events-none select-none">
                  {cat.emoji}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
