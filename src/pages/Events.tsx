import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Ticket,
  Filter, Plus, Edit2, Trash2, X, Upload, Save, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { StudentEvent } from '../types';
import { cn } from '../lib/utils';

export default function Events() {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState('СИТЕ ГРАДОВИ');
  const [activeCategory, setActiveCategory] = useState('СИТЕ КАТЕГОРИИ');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCity, setEventCity] = useState('Скопје');
  const [eventCategory, setEventCategory] = useState('Едукација и Кариера');
  const [eventPrice, setEventPrice] = useState('Бесплатно');
  const [eventIsFeatured, setEventIsFeatured] = useState(false);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventTicketLink, setEventTicketLink] = useState('');
  const [eventFile, setEventFile] = useState<File | null>(null);

  const categories = ['СИТЕ КАТЕГОРИИ', 'Едукација и Кариера', 'Забави и Социјализација', 'Култура и Активизам', 'Спорт и Рекреација', 'Администрација и Инфо'];
  const cities = ['СИТЕ ГРАДОВИ', 'Скопје', 'Штип', 'Тетово', 'Битола', 'Прилеп', 'Кичево', 'Струга', 'Свети Николе'];

  useEffect(() => {
    fetchEvents();
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    if (session.user.email === 'stefan.vezenkoski@finki.ukim.mk') {
      setIsAdmin(true);
      return;
    }

    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (data) setIsAdmin(true);
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setEventTitle('');
    setEventDate('');
    setEventCity('Скопје');
    setEventCategory('Едукација и Кариера');
    setEventPrice('Бесплатно');
    setEventIsFeatured(false);
    setEventImageUrl('');
    setEventTicketLink('');
    setEventFile(null);
    setShowForm(false);
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setEventTitle(event.title || '');
    setEventDate(event.start_date || '');
    setEventCity(event.city || 'Скопје');
    setEventCategory(event.category || 'Едукација и Кариера');
    setEventPrice(event.price || 'Бесплатно');
    setEventIsFeatured(event.is_featured || false);
    setEventImageUrl(event.image_url || '');
    setEventTicketLink(event.ticket_link || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Дали сте сигурни дека сакате да го избришете настанот?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
      alert('Грешка при бришење');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = eventImageUrl;
      if (eventFile) {
        const uploaded = await uploadImage(eventFile);
        if (uploaded) finalImageUrl = uploaded;
      }

      const eventData = {
        title: eventTitle,
        start_date: eventDate,
        city: eventCity,
        category: eventCategory,
        price: eventPrice,
        is_featured: eventIsFeatured,
        image_url: finalImageUrl,
        ticket_link: eventTicketLink
      };

      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);
        if (error) throw error;
      }

      await fetchEvents();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Грешка при зачувување');
    } finally {
      setIsSubmitting(false);
    }
  };

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesCity = activeCity === 'СИТЕ ГРАДОВИ' || event.city === activeCity;
    const matchesCategory = activeCategory === 'СИТЕ КАТЕГОРИИ' || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (selectedDate) {
      const d = new Date(event.start_date);
      matchesDate = d.getDate() === selectedDate.getDate() && 
                    d.getMonth() === selectedDate.getMonth() &&
                    d.getFullYear() === selectedDate.getFullYear();
    }
    
    return matchesCity && matchesCategory && matchesSearch && matchesDate;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Previous month padding
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    
    return days;
  };

  const monthName = currentDate.toLocaleString('mk-MK', { month: 'long' }).toUpperCase();
  const year = currentDate.getFullYear();

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const formatTime = (dateIso: string) => {
    if (dateIso.includes('T')) {
      const timePart = dateIso.split('T')[1];
      if (timePart) return timePart.substring(0, 5);
    }
    const d = new Date(dateIso);
    return d.toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (dateIso: string) => {
    const d = new Date(dateIso);
    return new Intl.DateTimeFormat('mk-MK', { day: 'numeric', month: 'long' }).format(d).toUpperCase();
  };

  const featuredEvent = filteredEvents.find(e => e.is_featured);
  const otherEvents = filteredEvents.filter(e => e.id !== featuredEvent?.id);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative overflow-hidden">
      {/* Background Text Marquee (Big & Animated) */}
      <div className="absolute top-40 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <motion.div
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="text-[20rem] font-head font-black whitespace-nowrap leading-none"
        >
          НАСТАНИ EVENTS НАСТАНИ EVENTS НАСТАНИ EVENTS
        </motion.div>
      </div>

      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -150, 0], 
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[180px] rounded-full"
        />
      </div>

      {/* Header */}
      <section className="relative pt-24 pb-12 overflow-hidden z-30">
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
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-[3px] bg-primary" />
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Настани и Култура</span>
              </div>
              <h1 className="text-6xl md:text-[100px] font-head font-black uppercase leading-[0.8] tracking-tighter mb-4 drop-shadow-2xl max-w-min">
                <span className="bg-primary text-dark px-6 py-2 inline-block mb-2">Студентски</span>
                <br />
                <span className="bg-primary text-dark px-6 py-2 inline-block">Настани</span>
              </h1>
            </motion.div>

            <div className="flex flex-col gap-6 w-full max-w-xl">
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-primary text-dark py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 border-4 border-dark/10 group"
                >
                  {showForm ? <X className="w-5 h-5 group-hover:rotate-90 transition-transform" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                  {showForm ? 'Затвори панел' : 'Додади нов настан'}
                </motion.button>
              )}
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-2 w-full lg:mb-4"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-4 mb-2 opacity-50">Најди го твојот настан</span>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary transition-colors z-10" />
                  <input 
                    type="text" 
                    placeholder="Пребарувај по наслов или град..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border-2 border-[var(--border-main)] rounded-[2.5rem] py-7 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary transition-all shadow-2xl relative z-10 text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="overflow-hidden mt-12"
              >
                <div className="p-1 bg-gradient-to-br from-primary via-primary/20 to-transparent rounded-[3rem]">
                  <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] backdrop-blur-3xl p-10 rounded-[2.9rem] shadow-2xl space-y-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center border border-primary/20">
                          {editingId ? <Edit2 className="w-6 h-6 text-dark" /> : <Plus className="w-6 h-6 text-dark" />}
                        </div>
                        <div>
                          <h2 className="text-2xl font-head font-black uppercase tracking-tight">{editingId ? 'Измени настан' : 'Нов настан'}</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Сите полиња се задолжителни</p>
                        </div>
                      </div>
                      <button type="button" onClick={resetForm} className="p-3 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-main)] hover:bg-red-500 hover:text-white transition-all text-[var(--text-muted)]">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Име на настанот</label>
                          <input 
                            required 
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-2xl focus:border-primary focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400" 
                            value={eventTitle} 
                            onChange={e => setEventTitle(e.target.value)} 
                            placeholder="пр: Студентска Журка 2026" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Град</label>
                            <select 
                              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-sm uppercase tracking-widest focus:border-primary focus:outline-none text-zinc-900 dark:text-white appearance-none cursor-pointer" 
                              value={eventCity} 
                              onChange={e => setEventCity(e.target.value)}
                            >
                              {cities.filter(c => c !== 'СИТЕ ГРАДОВИ').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Датум и време</label>
                            <input 
                              type="datetime-local" 
                              required 
                              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-sm focus:border-primary focus:outline-none text-zinc-900 dark:text-white" 
                              value={eventDate} 
                              onChange={e => setEventDate(e.target.value)} 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Категорија</label>
                            <select 
                              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-sm uppercase tracking-widest focus:border-primary focus:outline-none text-zinc-900 dark:text-white appearance-none cursor-pointer" 
                              value={eventCategory} 
                              onChange={e => setEventCategory(e.target.value)}
                            >
                              {categories.filter(c => c !== 'СИТЕ КАТЕГОРИИ').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Цена / Партиципација</label>
                            <input 
                              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-sm focus:border-primary focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400" 
                              value={eventPrice} 
                              onChange={e => setEventPrice(e.target.value)} 
                              placeholder="пр: Бесплатно" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Лого / Слика</label>
                            <div className="relative">
                              <input type="file" accept="image/*" onChange={e => setEventFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <div className="w-full bg-[var(--bg-tertiary)] border border-dashed border-[var(--border-main)] p-5 rounded-3xl flex items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all">
                                <Upload className={`w-5 h-5 ${eventFile ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                                  {eventFile ? eventFile.name : 'Прикачи слика'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 pt-10">
                            <input 
                              type="checkbox" 
                              id="featured-event" 
                              checked={eventIsFeatured} 
                              onChange={e => setEventIsFeatured(e.target.checked)}
                              className="w-5 h-5 rounded border-[var(--border-main)] bg-[var(--bg-tertiary)] text-primary focus:ring-primary" 
                            />
                            <label htmlFor="featured-event" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] cursor-pointer">Топ настан</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-6 pt-10 border-t border-[var(--border-main)]">
                      <button type="button" onClick={resetForm} className="px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-[var(--text-muted)] hover:text-white transition-colors">Откажи</button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="bg-primary text-dark px-16 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {editingId ? 'Зачувајмени' : 'Објави настан'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Hero Marquee Divider */}
      <div className="bg-primary py-8 overflow-hidden whitespace-nowrap border-y border-dark/10 relative z-40 my-12 transform -rotate-1 scale-105 shadow-2xl">
        <motion.div 
          animate={{ x: [-1500, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center"
        >
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl font-head font-black uppercase tracking-tighter text-dark hover:scale-110 transition-transform cursor-default">СИТЕ СТУДЕНТСКИ НАСТАНИ НА ЕДНО МЕСТО</span>
              <Sparkles className="w-8 h-8 text-dark fill-dark animate-pulse" />
              <span className="text-4xl font-head font-black uppercase tracking-tighter text-dark">СТУДЕНТСКИ ЖИВОТ ВО МАКЕДОНИЈА 2026</span>
              <div className="w-5 h-5 bg-dark rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Featured Event Hero Section */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-8 mb-24 z-30 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a 
              href={featuredEvent.ticket_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-[600px] md:h-[750px] rounded-[4rem] overflow-hidden group cursor-pointer border-2 border-primary/30 bg-white block shadow-[0_50px_100px_-20px_rgba(var(--primary-rgb),0.2)]"
            >
              <img 
                src={featuredEvent.image_url} 
                alt={featuredEvent.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-40 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-10 md:p-20 flex flex-col md:flex-row md:items-end justify-between gap-12 z-10 text-dark">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="bg-primary text-dark px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">
                      {featuredEvent.category}
                    </span>
                    <span className="flex items-center gap-2 text-dark text-[12px] font-bold uppercase tracking-widest bg-white/40 px-4 py-2.5 rounded-full backdrop-blur-md border border-dark/10">
                      <MapPin className="w-4 h-4 text-primary" /> {featuredEvent.city}
                    </span>
                  </div>
                  
                  <h3 className="text-5xl md:text-[100px] font-head font-black uppercase leading-[0.8] tracking-tighter mb-12 drop-shadow-none text-dark">
                    {featuredEvent.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-12 border-t border-dark/10 pt-12">
                    <div className="flex flex-col gap-3">
                      <span className="text-dark/40 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" /> ДАТУМ
                      </span>
                      <span className="font-head font-black text-3xl tracking-tight text-dark">{formatDateLabel(featuredEvent.start_date)}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-dark/40 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" /> ВРЕМЕ
                      </span>
                      <span className="font-head font-black text-3xl tracking-tight text-dark">
                        {formatTime(featuredEvent.start_date)}ч
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-dark/40 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> ПАРТИЦИПАЦИЈА
                      </span>
                      <span className="text-primary font-head font-black text-3xl tracking-tight drop-shadow-none">{featuredEvent.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary text-dark w-28 h-28 rounded-full flex items-center justify-center shadow-2xl shrink-0 transition-all group-hover:scale-110 group-hover:rotate-[15deg] group-hover:bg-dark group-hover:text-primary border-8 border-dark/5">
                  <Ticket className="w-12 h-12" />
                </div>
              </div>

              <div className="absolute top-0 right-0 p-10 md:p-20 z-20 flex flex-col items-end gap-4">
                <div className="flex items-center gap-3 bg-[#ff3b30] text-white px-8 py-4 rounded-full shadow-2xl pointer-events-none transform rotate-3 scale-110 mb-4">
                  <Sparkles className="w-6 h-6 fill-white animate-pulse" />
                  <span className="text-[12px] font-black uppercase tracking-[0.3em]">ПОПУЛАРНО СЕГА</span>
                </div>
                {isAdmin && (
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.preventDefault(); handleEdit(featuredEvent); }}
                      className="p-5 bg-white/40 backdrop-blur-xl border-4 border-dark/10 rounded-[2rem] text-dark shadow-2xl hover:bg-primary hover:scale-105 transition-all"
                    >
                      <Edit2 className="w-8 h-8" />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); handleDelete(featuredEvent.id); }}
                      className="p-5 bg-white/40 backdrop-blur-xl border-4 border-dark/10 rounded-[2rem] text-red-600 shadow-2xl hover:bg-red-500 hover:text-white hover:scale-105 transition-all"
                    >
                      <Trash2 className="w-8 h-8" />
                    </button>
                  </div>
                )}
              </div>
            </a>
          </motion.div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-8 pb-32 z-30 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 space-y-12"
          >
            {/* Interactive Calendar Widget */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 grayscale opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <CalendarIcon size={120} />
              </div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-head font-black tracking-tighter text-xl">{monthName} <span className="text-primary">{year}</span></h3>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-6 relative z-10">
                {['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] font-black text-[var(--text-muted)] py-2">{d}</div>
                ))}
                {getDaysInMonth(currentDate).map((day, i) => {
                  const hasEvents = events.some(e => {
                    const d = new Date(e.start_date);
                    return d.getDate() === day.day && d.getMonth() === day.date.getMonth() && d.getFullYear() === day.date.getFullYear();
                  });
                  
                  const isSelected = selectedDate && 
                    selectedDate.getDate() === day.day && 
                    selectedDate.getMonth() === day.date.getMonth() && 
                    selectedDate.getFullYear() === day.date.getFullYear();

                  const today = new Date();
                  const isToday = day.date.getDate() === today.getDate() && 
                                  day.date.getMonth() === today.getMonth() && 
                                  day.date.getFullYear() === today.getFullYear();

                  return (
                    <button 
                      key={i} 
                      onClick={() => setSelectedDate(isSelected ? null : day.date)}
                      className={cn(
                        "aspect-square flex items-center justify-center text-[11px] font-bold rounded-full relative cursor-pointer transition-all",
                        day.currentMonth ? 'text-[var(--text-main)] font-black' : 'text-[var(--text-muted)] opacity-30',
                        isSelected ? 'bg-primary text-dark scale-110 shadow-lg z-10 font-bold' : 
                        isToday ? 'bg-primary/40 border-2 border-primary text-[var(--text-main)] shadow-md z-10' :
                        hasEvents ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20' : 'hover:bg-primary/5'
                      )}
                    >
                      {day.day}
                      {hasEvents && (
                        <div className={cn(
                          "absolute bottom-1 w-1 h-1 rounded-full",
                          isSelected || isToday ? "bg-dark" : "bg-primary"
                        )} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 pt-4 border-t border-[var(--border-main)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    {selectedDate ? `${selectedDate.getDate()} ${monthName.slice(0, 3)}` : 'Избери датум'}
                  </span>
                </div>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    ИСЧИСТИ
                  </button>
                )}
              </div>
            </div>

            {/* City Filters */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Филтрирај по Град</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`
                      px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
                      ${activeCity === city 
                        ? 'bg-primary border-primary text-dark shadow-lg shadow-primary/20 scale-105' 
                        : 'bg-[var(--bg-secondary)] border-[var(--border-main)] text-[var(--text-muted)] hover:border-primary hover:text-primary'}
                    `}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">По Категорија</span>
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                      ${activeCategory === cat 
                        ? 'bg-[var(--bg-secondary)] border-primary text-primary shadow-xl ring-1 ring-primary' 
                        : 'bg-[var(--bg-secondary)] border-[var(--border-main)] text-[var(--text-muted)] hover:border-primary'}
                    `}
                  >
                    {cat}
                    {activeCategory === cat && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content: Events Grid */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherEvents.length > 0 ? (
                  otherEvents.map((event, idx) => (
                    <motion.a
                      key={event.id}
                      href={event.ticket_link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      layout
                      className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer border border-[var(--border-main)] bg-[var(--bg-secondary)] shadow-xl"
                    >
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/40 to-transparent" />
                      
                      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
                        <span className="bg-primary text-dark px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                          {event.category}
                        </span>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.preventDefault(); handleEdit(event); }}
                              className="p-2.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-dark shadow-xl hover:bg-primary transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.preventDefault(); handleDelete(event.id); }}
                              className="p-2.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-red-600 shadow-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                          <span className="flex items-center gap-1.5 bg-[var(--bg-main)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border-main)]">
                            <CalendarIcon className="w-3 h-3" /> {new Date(event.start_date).toLocaleDateString('mk-MK', { day: 'numeric', month: 'long' })}
                          </span>
                          <span className="flex items-center gap-1.5 bg-[var(--bg-main)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border-main)]">
                            <CalendarIcon className="w-3 h-3" /> {formatTime(event.start_date)}ч
                          </span>
                        </div>
                        <h4 className="text-3xl font-head font-black uppercase tracking-tighter leading-tight drop-shadow-md mb-4 text-[var(--text-main)] group-hover:text-primary transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--border-main)]/50">
                          <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">
                            <MapPin className="w-3 h-3 text-primary" /> {event.city}
                          </span>
                          <div className="w-10 h-10 bg-primary group-hover:bg-[var(--bg-main)] rounded-full flex items-center justify-center transition-colors shadow-lg">
                            <Ticket className="w-5 h-5 text-dark group-hover:text-primary transition-transform group-hover:rotate-12" />
                          </div>
                        </div>
                      </div>

                      {event.is_featured && (
                        <div className="absolute top-6 right-6 p-2 bg-[#ff3b30] text-white rounded-full shadow-2xl z-20 animate-bounce">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </motion.a>
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center bg-[var(--bg-secondary)] rounded-[3rem] border border-dashed border-[var(--border-main)]">
                    <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">Нема пронајдено настани</p>
                    <button 
                      onClick={() => { 
                        setActiveCity('СИТЕ ГРАДОВИ'); 
                        setActiveCategory('СИТЕ КАТЕГОРИИ'); 
                        setSearchQuery(''); 
                        setSelectedDate(null);
                      }}
                      className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      Ресетирај ги филтрите
                    </button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
