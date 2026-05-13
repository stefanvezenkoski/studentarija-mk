import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark, Sun, Moon, ArrowRight, LogOut, User as UserIcon, ChevronDown, Sparkles, Search, Command } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Logo from '../ui/Logo';

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract username from email
  const getUsername = (email: string | undefined) => {
    if (!email) return 'Корисник';
    return email.split('@')[0];
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (cleanQuery) {
      console.log('Searching for:', cleanQuery);
      navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
      setIsSearchOpen(false);
      setIsOpen(false);
      // Force scroll to top on search
      window.scrollTo(0, 0);
    }
  };

  const [isAktuelnoOpen, setIsAktuelnoOpen] = useState(false);
  const [dynamicNavLinks, setDynamicNavLinks] = useState<any[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const { data } = await supabase
          .from('navigation_links')
          .select('*')
          .order('order_index', { ascending: true });
        if (data) setDynamicNavLinks(data);
      } catch (err) {
        console.error('Failed to fetch navigation:', err);
      }
    };
    
    fetchNav();

    // Realtime subscription
    const channel = supabase
      .channel('nav-changes')
      .on('postgres_changes', { event: '*', table: 'navigation_links', schema: 'public' }, () => {
        fetchNav();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const aktuelnoLinks = [...dynamicNavLinks]
    .filter(l => l.category === 'aktuelno')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  
  if (!aktuelnoLinks.some(l => l.href === '/upisi-2025-26')) {
    aktuelnoLinks.push({
      id: 'upisi-static',
      name: 'УПИСИ 2025/26',
      href: '/upisi-2025-26',
      description: 'Рокови, документи и информации за уписи',
      order_index: 997
    });
  }

  if (!aktuelnoLinks.some(l => l.href === '/studentski-domovi')) {
    aktuelnoLinks.push({
      id: 'domovi-static',
      name: 'СТУДЕНТСКИ ДОМОВИ',
      href: '/studentski-domovi',
      description: 'Информации за прием во студентските домови',
      order_index: 997.5
    });
  }

  // Ensure Stipendii is present as a fallback
  if (!aktuelnoLinks.some(l => l.href === '/stipendii')) {
    aktuelnoLinks.push({
      id: 'stipendii-static',
      name: 'СТИПЕНДИИ',
      href: '/stipendii',
      description: 'Сè за државните студентски стипендии',
      order_index: 998
    });
  }

  if (!aktuelnoLinks.some(l => l.href === '/prodolzuvanje-stipendija')) {
    aktuelnoLinks.push({
      id: 'prodolzuvanje-static',
      name: 'ПРОДОЛЖУВАЊЕ СТИПЕНДИЈА',
      href: '/prodolzuvanje-stipendija',
      description: 'Информации за продолжување на постоечка стипендија',
      order_index: 998.5
    });
  }

  if (!aktuelnoLinks.some(l => l.href === '/brucosi')) {
    aktuelnoLinks.push({
      id: 'brucosi-static',
      name: 'БРУКОШИ',
      href: '/brucosi',
      description: 'Водич за нови студенти',
      order_index: 999
    });
  }

  const mainLinks = [...dynamicNavLinks]
    .filter(l => l.category === 'main')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial theme check
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id, u.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id, u.email);
      else setIsAdmin(false);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  async function checkAdmin(userId: string, email?: string) {
    if (email === 'stefan.vezenkoski@finki.ukim.mk') {
      setIsAdmin(true);
      return;
    }
    const { data } = await supabase.from('admin_users').select('*').eq('user_id', userId).single();
    setIsAdmin(!!data);
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header 
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-[var(--bg-main)]/90 backdrop-blur-xl py-3 border-b border-[var(--border-main)] shadow-xl" 
          : "bg-[var(--bg-main)] py-5 md:py-6 border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 h-full">
        {/* Strictly symmetric 3-column grid for perfect geometric centering */}
        <div className="flex items-center justify-between relative h-full">
          
          {/* Logo Column - Left aligned */}
          <div className="flex items-center shrink-0 mr-4">
            <div className="min-w-fit">
              <Logo colorOverride="text-[var(--text-main)]" />
            </div>
          </div>

          {/* Navigation Column - Strictly Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <nav className="flex items-center gap-1 bg-[var(--bg-tertiary)]/30 backdrop-blur-md p-1.5 rounded-2xl border border-[var(--border-main)]/50">
              <div 
                className="relative"
                onMouseEnter={() => setIsAktuelnoOpen(true)}
                onMouseLeave={() => setIsAktuelnoOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 transition-all px-3.5 py-2.5 rounded-xl font-mont font-black text-[11px] uppercase tracking-widest whitespace-nowrap",
                    isAktuelnoOpen ? "text-primary bg-[var(--bg-tertiary)] shadow-sm" : "text-[var(--text-main)]/60 hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)]/50"
                  )}
                >
                  АКТУЕЛНО
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isAktuelnoOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isAktuelnoOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-screen max-w-[480px] bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2rem] shadow-2xl p-5 z-[60] backdrop-blur-xl"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {aktuelnoLinks.map((link) => (
                          <Link
                            key={link.id || link.name}
                            to={link.href}
                            className="flex flex-col gap-1 p-4 rounded-[1.25rem] hover:bg-white/[0.04] border border-transparent hover:border-[var(--border-main)] transition-all group"
                          >
                            <span className="text-[13px] font-black text-[var(--text-main)] group-hover:text-primary transition-colors flex items-center justify-between">
                              {link.name}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {mainLinks.map((link, idx) => (
                <Link
                  key={link.id || link.name}
                  to={link.href}
                  className={cn(
                    "font-mont font-black text-[11px] uppercase tracking-widest px-3.5 py-2.5 rounded-xl transition-all relative group whitespace-nowrap",
                    idx > 4 && "hidden xl:inline-block",
                    pathname === link.href 
                      ? "text-primary bg-[var(--bg-tertiary)] shadow-sm" 
                      : "text-[var(--text-main)]/60 hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)]/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions Column - Right aligned, mirroring Logo width for balance */}
          <div className="flex justify-end items-center">
            <div className="flex items-center justify-end gap-3 md:gap-5 shrink-0">
              {/* Search - Stable implementation */}
              <div className="hidden lg:flex items-center">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center h-10">
                  <div className={cn(
                    "flex items-center bg-[var(--bg-tertiary)]/50 border border-[var(--border-main)] rounded-xl transition-all duration-300 overflow-hidden",
                    isSearchOpen ? "w-[120px] xl:w-[200px] px-3 border-primary" : "w-10 h-10 flex items-center justify-center"
                  )}>
                    <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className={cn("shrink-0", isSearchOpen ? "text-primary mr-2" : "text-[var(--text-muted)]")}>
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    {isSearchOpen && (
                      <input 
                        ref={searchInputRef}
                        type="text"
                        placeholder="Барај..."
                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        autoFocus
                        className="bg-transparent border-none outline-none text-[11px] font-mont font-bold text-[var(--text-main)] w-full placeholder:text-[var(--text-muted)] h-full"
                      />
                    )}
                  </div>
                </form>
              </div>

              {/* Interaction Items */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex p-1 bg-[var(--bg-tertiary)]/50 border border-[var(--border-main)] rounded-xl items-center relative h-8">
                  <motion.div
                    layout
                    className="absolute left-1 w-6 h-6 bg-primary rounded-lg shadow-lg"
                    animate={{ x: theme === 'dark' ? 28 : 0 }}
                  />
                  <button onClick={() => theme !== 'light' && toggleTheme()} className="w-6 h-6 rounded-xl flex items-center justify-center z-10 transition-colors">
                    <Sun className="w-3 h-3" />
                  </button>
                  <button onClick={() => theme !== 'dark' && toggleTheme()} className="w-6 h-6 rounded-xl flex items-center justify-center z-10 transition-colors ml-1">
                    <Moon className="w-3 h-3" />
                  </button>
                </div>

                {user ? (
                  <div className="flex items-center gap-2">
                    <div className="hidden lg:flex flex-col items-center gap-1.5">
                      <Link to="/admin">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center gap-1.5 px-4 h-9 bg-primary/10 hover:bg-primary hover:text-black border border-primary/20 rounded-xl text-primary transition-all duration-300", 
                            isAdmin && "border-primary/40 shadow-sm shadow-primary/20"
                          )}
                        >
                          {isAdmin ? <Landmark className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                          <span className="text-[9px] font-mont font-black uppercase tracking-widest whitespace-nowrap">
                            {isAdmin ? 'АДМИН ПАНЕЛ' : 'МОЈ ПРОФИЛ'}
                          </span>
                        </motion.div>
                      </Link>
                      <span className="text-[9px] font-mont font-bold text-[var(--text-main)] uppercase tracking-tight truncate max-w-[100px] opacity-70">
                        Здраво, {getUsername(user.email)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link to="/admin" className="lg:hidden">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 focus:outline-none shrink-0">
                          {isAdmin ? <Landmark className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-9 h-9 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center border border-red-500/10 hover:bg-red-500 hover:text-white transition-all shrink-0 active:scale-90"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => navigate('/admin')} className="flex items-center gap-2 px-5 h-11 bg-primary text-black rounded-xl shadow-lg hover:scale-105 hover:shadow-primary/20 transition-all active:scale-95 group font-mont font-black uppercase text-[11px] tracking-widest">
                    <UserIcon className="w-4 h-4" />
                    <span>ВЛЕЗ</span>
                  </button>
                )}
                
                <button className="lg:hidden w-10 h-10 flex items-center justify-center bg-primary text-black rounded-xl" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Complete Redesign for Superior UX */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 35, stiffness: 300, mass: 1 }}
            className="lg:hidden fixed inset-0 bg-[var(--bg-main)] z-[100] flex flex-col p-6 h-screen overflow-hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <Logo />
              <button 
                onClick={() => setIsOpen(false)}
                className="w-14 h-14 rounded-[2rem] bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-main)] border border-[var(--border-main)] active:scale-95 transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col gap-10 overflow-y-auto pb-40 scrollbar-hide">
              {/* Mobile Search Bar - Interactive */}
              <form 
                onSubmit={handleSearchSubmit}
                className="relative group"
              >
                <div className="flex items-center gap-4 px-6 py-5 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2rem] focus-within:border-primary transition-all">
                  <button type="submit">
                    <Search className="w-6 h-6 text-primary" />
                  </button>
                  <input 
                    type="text"
                    placeholder="Пребарај нешто..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    className="bg-transparent border-none outline-none text-xl font-black text-[var(--text-main)] w-full placeholder:text-[var(--text-muted)] font-inter"
                  />
                </div>
              </form>

              <div>
                <span className="text-[10px] font-mont font-black text-primary uppercase tracking-[0.5em] mb-6 block opacity-50 ml-2">ГЛАВНО МЕНИ</span>
                <div className="flex flex-col gap-4">
                  {mainLinks.map((link, i) => (
                    <motion.div
                      key={link.id || link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                        <Link
                        to={link.href}
                        className={cn(
                          "text-lg font-mont font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-2xl",
                          pathname === link.href ? "text-primary border-primary/30 bg-primary/5" : "text-[var(--text-main)]/60 hover:text-[var(--text-main)]"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                        <ArrowRight className={cn("w-4 h-4 transition-all text-primary", pathname === link.href ? "opacity-100" : "opacity-0")} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mont font-black text-primary uppercase tracking-[0.5em] mb-6 block opacity-50 ml-2">АКТУЕЛНО</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aktuelnoLinks.map((link, i) => (
                    <motion.div
                      key={link.id || link.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 + 0.3 }}
                    >
                      <Link
                        to={link.href}
                        className="flex flex-col p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-main)] hover:border-primary active:scale-[0.98] transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-base font-mont font-black text-[var(--text-main)] mb-1 flex items-center justify-between">
                           {link.name}
                           <ArrowRight className="w-4 h-4 text-primary opacity-50" />
                        </span>
                        <span className="text-[10px] font-mont font-medium text-[var(--text-muted)] leading-relaxed line-clamp-1">
                          {link.description || link.desc}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--border-main)] flex flex-col gap-5">
              {/* User/Welcome Section - Below the Admin Button for cleaner look */}
               {user ? (
                 <div className="flex flex-col gap-6">
                   <div className="flex flex-col items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--border-main)] p-6 rounded-[2rem] shadow-lg relative overflow-hidden group">
                     {/* Glass background decoration */}
                     <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -translate-y-12 translate-x-12" />
                     
                     <div className="flex items-center gap-4 w-full relative z-10">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-black shadow-xl",
                          isAdmin ? "bg-primary" : "bg-[var(--bg-tertiary)] text-[var(--text-main)]"
                        )}>
                           {isAdmin ? <Landmark className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Здраво,</div>
                          <div className="text-xl font-mont font-black uppercase tracking-tighter leading-none text-primary">
                             {isAdmin ? (user.email === 'stefan.vezenkoski@finki.ukim.mk' ? 'стефан.везенкоски' : getUsername(user.email)) : getUsername(user.email)}
                          </div>
                        </div>
                     </div>
                     
                     <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="w-full h-12 bg-primary text-black flex items-center justify-center gap-2 rounded-xl font-mont font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform"
                     >
                       {isAdmin ? <Landmark className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                       {isAdmin ? 'АДМИН ПАНЕЛ' : 'МОЈ ПРОФИЛ'}
                     </Link>
                   </div>
                   
                   <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full h-14 bg-red-500/10 text-red-500 flex items-center justify-center gap-3 rounded-2xl border border-red-500/10 active:scale-95 transition-all font-mont font-black uppercase tracking-widest text-[11px]"
                   >
                     <LogOut className="w-5 h-5" />
                     ОДЈАВИ СЕ
                   </button>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-4 h-16">
                   <button 
                     onClick={() => { navigate('/admin'); setIsOpen(false); }}
                     className="rounded-[1.25rem] bg-[var(--bg-tertiary)] text-[var(--text-main)] font-mont font-black uppercase tracking-widest text-xs border border-[var(--border-main)] active:scale-95 transition-all"
                   >
                     ВЛЕЗ
                   </button>
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="rounded-[1.25rem] bg-primary text-black font-mont font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                   >
                     КРЕИРАЈ
                   </button>
                 </div>
               )}
               
               <div className="flex items-center justify-center gap-6 py-4">
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Биди со нас на</span>
                  <div className="h-[1px] flex-1 bg-[var(--border-main)]" />
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl border border-[var(--border-main)] flex items-center justify-center opacity-40">📱</div>
                     <div className="w-10 h-10 rounded-xl border border-[var(--border-main)] flex items-center justify-center opacity-40">💬</div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
