import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { 
  Loader2, Plus, Trash2, Edit2, 
  ChevronDown, Search, MessageSquare, Sparkles
} from 'lucide-react';
import { useAdmin } from '@/src/hooks/useAdmin';
import { cn } from '@/src/lib/utils';
import { FAQ as FAQType } from '@/src/types';

export default function FAQ() {
  const { isAdmin } = useAdmin();
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'Генерално' });
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeCategory, setActiveCategory] = useState('Сите');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const categories = ['Сите', 'Генерално', 'Студенти', 'Превоз', 'Сместување'];

  async function fetchFaqs() {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (!error && data) {
      setFaqs(data);
    }
    setLoading(false);
  }

  const handleAdd = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('faq')
        .insert([{
          ...newFaq,
          order_index: faqs.length
        }])
        .select()
        .single();

      if (error) throw error;
      setFaqs([...faqs, data]);
      setIsAdding(false);
      setNewFaq({ question: '', answer: '', category: 'Генерално' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<FAQType>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('faq')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setFaqs(faqs.map(f => f.id === id ? { ...f, ...updates } : f));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Дали сте сигурни?')) return;
    try {
      const { error } = await supabase.from('faq').delete().eq('id', id);
      if (error) throw error;
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Сите' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-primary selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-50 dark:opacity-100">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-primary/15 dark:bg-primary/10 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-32 relative z-10">
        {/* Header Section - Modern & Sophisticated */}
        <div className="flex flex-col items-start gap-6 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-black uppercase text-[10px] tracking-[0.3em] backdrop-blur-md"
          >
            <Sparkles className="w-3 h-3" />
            ПОМОШ И ИНФОРМАЦИИ
          </motion.div>
          
          <div className="space-y-4 relative w-full">
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute -left-8 top-0 bottom-0 w-2 bg-primary rounded-full hidden md:block shadow-[0_0_20px_rgba(250,204,21,0.4)]" 
            />
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-[0.9] relative z-10"
            >
              НАЈЧЕСТО <span className="text-primary drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">ПОСТАВУВАНИ</span><br />
              ПРАШАЊА.
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '160px' }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="h-3 bg-primary mt-8 rounded-full shadow-[0_4px_15px_rgba(250,204,21,0.3)]"
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-xl md:text-2xl text-[var(--text-muted)] font-medium leading-relaxed font-inter mt-8"
            >
              Најди ги сите одговори поврзани со студентскиот живот, превозот, стипендиите и многу повеќе.
            </motion.p>
          </div>
        </div>

        {/* Search & Categories - Clean Glass Style */}
        <div className="flex flex-col gap-10 mb-20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-primary transition-all group-focus-within:scale-110" />
              <input 
                type="text"
                placeholder="Пребарај прашање..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] focus:border-primary rounded-[2.5rem] py-8 pl-20 pr-10 text-xl md:text-2xl font-bold text-[var(--text-main)] outline-none transition-all placeholder:opacity-30 font-inter shadow-2xl shadow-black/5"
              />
            </div>

            {isAdmin && (
              <button 
                onClick={() => setIsAdding(true)}
                className="px-10 py-8 bg-primary text-black rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(250,204,21,0.3)] flex items-center justify-center gap-4 shrink-0"
              >
                <Plus className="w-6 h-6" />
                Ново Прашање
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.05) }}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.15em] transition-all border-2",
                  activeCategory === cat 
                    ? "bg-primary text-black border-primary shadow-[0_15px_30px_rgba(250,204,21,0.4)] scale-110 z-10" 
                    : "bg-[var(--bg-secondary)] text-[var(--text-main)] border-primary/30 hover:border-primary hover:bg-[var(--bg-tertiary)] shadow-xl shadow-black/5"
                )}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-[2.5rem] p-10 mb-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-head font-black uppercase italic dark:text-white">Ново прашање</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      placeholder="Прашање..."
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                      className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 text-lg font-bold outline-none focus:border-primary dark:text-white"
                    />
                    <select 
                      value={newFaq.category}
                      onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                      className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-primary dark:text-white"
                    >
                      {categories.filter(c => c !== 'Сите').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <textarea 
                    placeholder="Одговор..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    rows={4}
                    className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-primary dark:text-white resize-none"
                  />
                  <div className="flex gap-4">
                    <button onClick={handleAdd} disabled={isSaving} className="flex-1 bg-primary text-white dark:text-zinc-900 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110">
                      {isSaving ? 'Се зачувува...' : 'Зачувај'}
                    </button>
                    <button onClick={() => setIsAdding(false)} className="px-8 py-4 bg-zinc-200 dark:bg-white/5 text-zinc-500 dark:text-white/50 rounded-xl font-black uppercase text-xs tracking-widest">
                      Откажи
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className={cn(
                  "group bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2.5rem] overflow-hidden transition-all duration-500",
                  openId === faq.id 
                    ? "border-primary/50 shadow-2xl scale-[1.01] bg-[var(--bg-tertiary)]" 
                    : "hover:bg-[var(--hover-bg)] hover:border-[var(--text-muted)]/20 shadow-lg shadow-black/5"
                )}
              >
                <div onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="p-10 cursor-pointer flex items-center gap-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                    openId === faq.id ? "bg-primary text-black" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] group-hover:text-primary"
                  )}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-2xl font-syne font-black uppercase italic tracking-tighter transition-colors duration-500",
                      openId === faq.id ? "text-primary" : "text-[var(--text-main)]"
                    )}>
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    {isAdmin && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(faq.id); }} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }} className="p-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                    <ChevronDown className={cn("w-6 h-6 transition-transform duration-500 text-zinc-400", openId === faq.id && "rotate-180 text-primary")} />
                  </div>
                </div>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-10 pb-12 pl-32 pr-10">
                        <div className="border-l-2 border-primary pl-10 py-2">
                           <p className="text-[var(--text-muted)] text-xl font-medium leading-relaxed font-inter">
                             {faq.answer}
                           </p>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
