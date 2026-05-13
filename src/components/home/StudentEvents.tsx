import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { StudentEvent } from '../../types';

interface Props {
  events: StudentEvent[];
  dbCities?: any[];
}

export default function StudentEvents({ events: initialEvents, dbCities = [] }: Props) {
  const [activeCity, setActiveCity] = useState('СИТЕ');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    
    return days;
  };

  const monthName = currentDate.toLocaleString('mk-MK', { month: 'long' }).toUpperCase();
  const yearNum = currentDate.getFullYear();

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const cities = useMemo(() => {
    if (dbCities && dbCities.length > 0) {
      return ['СИТЕ', ...dbCities.map(c => c.name)].map(c => c.toUpperCase());
    }
    return ['СИТЕ'];
  }, [dbCities]);

  const filteredEvents = useMemo(() => {
    let filtered = initialEvents;
    
    if (activeCity !== 'СИТЕ') {
      filtered = filtered.filter(e => e.city.toUpperCase() === activeCity);
    }
    
    if (selectedDate) {
      filtered = filtered.filter(e => {
        const d = new Date(e.start_date);
        return d.getDate() === selectedDate.getDate() && 
               d.getMonth() === selectedDate.getMonth() &&
               d.getFullYear() === selectedDate.getFullYear();
      });
    }

    return [...filtered].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });
  }, [initialEvents, activeCity, selectedDate]);

  const featuredEvent = filteredEvents.find(e => e.is_featured) || filteredEvents[0];
  const otherEvents = filteredEvents.filter(e => e.id !== featuredEvent?.id);

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

  return (
    <section id="events" className="py-24 md:py-32 bg-[var(--bg-main)] border-t border-[var(--border-main)] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24 relative z-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="min-w-0"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[3px] w-14 bg-primary" />
              <div className="bg-primary px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark shadow-sm">КАЛЕНДАР</span>
              </div>
            </div>

            <div className="relative">
              <h2 className="text-[clamp(2.5rem,10vw,85px)] font-head font-black tracking-[-0.05em] uppercase leading-[0.85] text-[var(--text-main)] relative z-10 drop-shadow-2xl">
                ПРЕТСТОЈНИ <br />
                <span className="relative inline-block mt-4 md:mt-1">
                  <span className="relative z-10 italic px-4 text-dark drop-shadow-sm">НАСТАНИ</span>
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                    className="absolute inset-0 bg-primary -rotate-1 origin-left shadow-[15px_15px_30px_-10px_rgba(var(--primary-rgb),0.5)] pointer-events-none"
                  />
                </span>
              </h2>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8 w-full max-w-full lg:max-w-[420px] lg:ml-auto relative">
            {/* Interactive Calendar Widget - Same as /events */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group w-full lg:mr-4">
              <div className="absolute top-0 right-0 p-8 grayscale opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <CalendarIcon size={120} />
              </div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-head font-black tracking-tighter text-xl">{monthName} <span className="text-primary">{yearNum}</span></h3>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors border border-[var(--border-main)]">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors border border-[var(--border-main)]">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-6 relative z-10">
                {['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] font-black text-[var(--text-muted)] py-2">{d}</div>
                ))}
                {getDaysInMonth(currentDate).map((day, i) => {
                  const hasEventsForDate = initialEvents.some(e => {
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
                        hasEventsForDate ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20' : 'hover:bg-primary/5'
                      )}
                    >
                      <span className={cn(isSelected ? "text-dark" : "")}>{day.day}</span>
                      {hasEventsForDate && (
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

            <div className="flex flex-nowrap overflow-x-auto no-scrollbar justify-start md:justify-center gap-2 w-full lg:pr-4 pb-2 md:pb-0">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeCity === city
                      ? "bg-primary text-dark shadow-xl shadow-primary/30"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-primary/30"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top CTA */}
        <Link
          to="/events"
          className="w-full py-8 mb-16 rounded-[2.5rem] border-2 border-dashed border-[var(--border-main)] flex flex-row items-center justify-center gap-6 group hover:border-primary/50 transition-all bg-[var(--bg-secondary)]/30 cursor-pointer block text-center"
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span className="font-head font-black text-[14px] uppercase tracking-[0.4em] text-[var(--text-main)]">СИТЕ НАСТАНИ НА ЕДНО МЕСТО</span>
          </div>
          <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            ВИДИ ГО ЦЕЛОСНИОТ КАЛЕНДАР <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={`${activeCity}-${selectedDate}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {featuredEvent && (
                <div className="relative">
                  <a 
                    href={featuredEvent.ticket_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-[450px] md:h-[650px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group cursor-pointer border border-primary/20 bg-[var(--bg-secondary)] block shadow-2xl"
                  >
                    <img 
                      src={featuredEvent.image_url} 
                      alt={featuredEvent.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-40 group-hover:opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/40 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 xs:p-8 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10 z-10 text-[var(--text-main)]">
                      <div className="max-w-3xl w-full">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                          <span className="bg-primary text-black px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] shadow-xl">
                            {featuredEvent.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-[var(--text-main)]/90 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> {featuredEvent.city}
                          </span>
                        </div>
                        
                        <h3 className="text-[clamp(1.6rem,8vw,5.5rem)] font-head font-black uppercase leading-[0.95] md:leading-[0.8] tracking-tighter mb-8 md:mb-12 drop-shadow-sm text-[var(--text-main)]">
                          {featuredEvent.title}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-6 md:gap-10 border-t border-[var(--border-main)] pt-8 md:pt-10">
                          <div className="flex flex-col gap-1 md:gap-2">
                            <span className="text-[var(--text-muted)] text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-primary" /> Датум
                            </span>
                            <span className="font-head font-black text-lg md:text-2xl tracking-tight text-[var(--text-main)]">{formatDateLabel(featuredEvent.start_date)}</span>
                          </div>
                          <div className="flex flex-col gap-1 md:gap-2">
                            <span className="text-[var(--text-muted)] text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-primary" /> Време
                            </span>
                            <span className="font-head font-black text-lg md:text-2xl tracking-tight text-[var(--text-main)]">
                              {formatTime(featuredEvent.start_date)}ч
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 md:gap-2">
                            <span className="text-[var(--text-muted)] text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-primary" /> Град
                            </span>
                            <span className="font-head font-black text-lg md:text-2xl tracking-tight text-[var(--text-main)]">{featuredEvent.city}</span>
                          </div>
                          <div className="flex flex-col gap-1 md:gap-2">
                            <span className="text-[var(--text-muted)] text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-primary" /> Цена
                            </span>
                            <span className="text-primary font-head font-black text-lg md:text-2xl tracking-tight drop-shadow-none">{featuredEvent.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary text-black w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl shrink-0 transition-all group-hover:scale-110 group-hover:rotate-[15deg] group-hover:bg-[var(--text-main)] group-hover:text-[var(--bg-main)] border-[3px] md:border-4 border-black/5 self-end md:self-auto mb-4 md:mb-0">
                        <ArrowRight className="w-7 h-7 md:w-10 md:h-10" />
                      </div>
                    </div>
                  </a>

                  <div className="absolute top-10 right-10 flex items-center gap-2 bg-[#ff3b30] text-white px-6 py-3 rounded-full shadow-2xl z-20 pointer-events-none transform rotate-3">
                    <Sparkles className="w-5 h-5 fill-white animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">ПОПУЛАРНО</span>
                  </div>
                </div>
              )}

              {otherEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherEvents.map((event, idx) => (
                    <motion.a
                      key={event.id}
                      href={event.ticket_link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden cursor-pointer border border-[var(--border-main)] bg-[var(--bg-secondary)] block"
                    >
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/40 to-transparent pointer-events-none" />
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="bg-primary text-dark px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                            {event.category}
                          </span>
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full group-hover:bg-primary group-hover:border-primary group-hover:text-dark transition-all">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-4 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mb-3">
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-primary" /> {formatDateLabel(event.start_date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-primary" /> {formatTime(event.start_date)}
                            </span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> {event.city}</span>
                          </div>
                          <h4 className="text-2xl md:text-3xl font-head font-black text-[var(--text-main)] uppercase leading-tight tracking-tight group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-main)] rounded-[3rem] bg-[var(--bg-secondary)]/30"
            >
              <CalendarIcon className="w-12 h-12 text-[var(--text-muted)] mb-6 opacity-20" />
              <p className="text-[var(--text-muted)] font-head font-black uppercase tracking-widest">Нема закажани настани за овој период</p>
              <button 
                onClick={() => { setActiveCity('СИТЕ'); setSelectedDate(null); }}
                className="mt-6 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:underline"
              >
                ПРИКАЖИ ГИ СИТЕ НАСТАНИ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

