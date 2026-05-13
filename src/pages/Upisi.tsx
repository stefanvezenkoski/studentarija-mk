import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, BookOpen, Clock, FileText, 
  MapPin, CheckCircle2, Info, ArrowRight,
  ExternalLink, GraduationCap, ChevronDown,
  Calculator
} from 'lucide-react';
import { cn } from '../lib/utils';
import ScrollToTop from '../components/ui/ScrollToTop';

const UNIS = [
  {
    name: "УКИМ - Скопје",
    tag: "Државен",
    desc: "Најголемиот и најстариот универзитет во Македонија.",
    link: "https://www.ukim.edu.mk"
  },
  {
    name: "УГД - Штип",
    tag: "Државен",
    desc: "Модерен универзитет со силен фокус на практична работа.",
    link: "https://www.ugd.edu.mk"
  },
  {
    name: "УКЛО - Битола",
    tag: "Државен",
    desc: "Регионален центар за високо образование во југозападна Македонија.",
    link: "https://www.uklo.edu.mk"
  },
  {
    name: "УТ - Тетово",
    tag: "Државен",
    desc: "Државен универзитет во Тетово со разновидни студиски програми.",
    link: "https://www.unite.edu.mk"
  }
];

const DEADLINES = [
  {
    period: "ПРВ РОК",
    date: "Крај на Август",
    desc: "Најголем број на слободни места и најголема конкуренција."
  },
  {
    period: "ВТОР РОК",
    date: "Почеток на Септември",
    desc: "За пополнување на преостанатите слободни квоти."
  },
  {
    period: "ТРЕТ РОК",
    date: "Крај на Септември",
    desc: "Последна шанса за запишување на факултетите со слободни места."
  }
];

const DOCUMENTS = [
  { id: 1, title: "Пријава за запишување", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  { id: 2, title: "Оригинални свидетелства (I-IV)", icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
  { id: 3, title: "Диплома за завршена матура", icon: <GraduationCap className="w-5 h-5 text-purple-500" /> },
  { id: 4, title: "Извод од матична книга на родени", icon: <Info className="w-5 h-5 text-green-500" /> },
  { id: 5, title: "Доказ за државјанство", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
  { id: 6, title: "Уплатници за такси", icon: <BookOpen className="w-5 h-5 text-red-500" /> }
];

const FAQS_UPISI = [
  {
    q: "Дали може да аплицирам на повеќе факултети?",
    a: "Да, можеш да аплицираш на повеќе факултети, но во секој рок оригиналните документи можеш да ги поднесеш само на еден факултет/смер."
  },
  {
    q: "Што е тоа државна vs. приватна квота?",
    a: "Државната квота е со партиципација од 200 евра годишно, додека приватната (со кофинансирање) е 400 евра годишно на државните универзитети."
  },
  {
    q: "Како се врши електронското пријавување?",
    a: "Преку системот i-upisi.mk каде што ги внесуваш твоите податоци пред да ги однесеш физичките документи на факултетот."
  }
];

export default function Upisi() {
  const [activeTab, setActiveTab] = useState<'rokovi' | 'dokumenti'>('rokovi');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-primary selection:text-black overflow-x-hidden">
      <ScrollToTop />
      
      {/* Background Stylized Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-60">
        <div className="absolute top-[20%] right-[-10%] text-[25vw] font-syne font-black text-primary/5 leading-none select-none -rotate-12">
          2025
        </div>
        <div className="absolute bottom-[10%] left-[-5%] text-[20vw] font-syne font-black text-primary/5 leading-none select-none rotate-12">
          2026
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="relative min-h-[50vh] flex flex-col justify-center mb-32">
          <div className="relative z-10 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black uppercase text-[11px] tracking-[0.4em] backdrop-blur-md shadow-xl shadow-primary/5"
            >
              <GraduationCap className="w-4 h-4" />
              ИНФОРМАЦИИ ЗА УПИСИ
            </motion.div>
            
            <div className="space-y-6 relative w-full">
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute -left-10 lg:-left-12 top-0 bottom-0 w-2 bg-primary rounded-full hidden md:block shadow-[0_0_30px_rgba(250,204,21,0.5)]" 
              />
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl md:text-9xl xl:text-[12rem] font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-[0.75] relative z-20"
              >
                УПИСИ <br />
                <span className="text-primary italic drop-shadow-[0_0_40px_rgba(250,204,21,0.4)]">2025/26</span>.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-xl md:text-3xl text-[var(--text-muted)] font-medium leading-tight font-inter mt-12 bg-[var(--bg-main)]/60 backdrop-blur-md p-6 -ml-6 rounded-2xl inline-block border border-[var(--border-main)] shadow-2xl"
              >
                Комплетен водич за идните студенти: <br />
                Рокови, документи и важни информации за сите универзитети.
              </motion.p>
            </div>
          </div>
          
          {/* Decorative floating graphic representing application */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 0.1, scale: 2, rotate: 10 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute right-0 top-0 pointer-events-none"
          >
             <FileText className="w-96 h-96 text-primary" />
          </motion.div>
        </div>

        {/* Action Tabs / Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-syne font-black uppercase italic text-[var(--text-main)] leading-none">
                Што треба да <br /><span className="text-primary">ЗНАЕШ?</span>
              </h2>
              <p className="text-[var(--text-muted)] font-inter text-xl leading-relaxed">
                Запишувањето на факултет е еден од најважните чекори. Подготви се навреме за да го избегнеш стресот во последен момент.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setActiveTab('rokovi')}
                className={cn(
                  "p-8 text-left rounded-[2rem] transition-all duration-500 border-2",
                  activeTab === 'rokovi' 
                    ? "bg-primary text-black border-primary shadow-2xl shadow-primary/20 scale-[1.02]" 
                    : "bg-[var(--bg-secondary)] text-[var(--text-main)] border-[var(--border-main)] hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                   <Clock className="w-8 h-8 font-black" />
                   <ArrowRight className={cn("w-6 h-6 transition-transform", activeTab === 'rokovi' ? "translate-x-0" : "-translate-x-4 opacity-0")} />
                </div>
                <h3 className="text-2xl font-syne font-black uppercase italic tracking-tighter">Важни Рокови</h3>
                <p className={cn("text-sm mt-2 font-bold uppercase tracking-widest", activeTab === 'rokovi' ? "text-black/70" : "text-[var(--text-muted)]")}>
                   Кога се пријавува?
                </p>
              </button>

              <button 
                onClick={() => setActiveTab('dokumenti')}
                className={cn(
                  "p-8 text-left rounded-[2rem] transition-all duration-500 border-2",
                  activeTab === 'dokumenti' 
                    ? "bg-primary text-black border-primary shadow-2xl shadow-primary/20 scale-[1.02]" 
                    : "bg-[var(--bg-secondary)] text-[var(--text-main)] border-[var(--border-main)] hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                   <FileText className="w-8 h-8 font-black" />
                   <ArrowRight className={cn("w-6 h-6 transition-transform", activeTab === 'dokumenti' ? "translate-x-0" : "-translate-x-4 opacity-0")} />
                </div>
                <h3 className="text-2xl font-syne font-black uppercase italic tracking-tighter">Потребни Документи</h3>
                <p className={cn("text-sm mt-2 font-bold uppercase tracking-widest", activeTab === 'dokumenti' ? "text-black/70" : "text-[var(--text-muted)]")}>
                   Што ти е потребно?
                </p>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeTab === 'rokovi' ? (
                <motion.div 
                  key="rokovi"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {DEADLINES.map((d, i) => (
                    <div key={i} className="group p-10 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary/40 transition-all shadow-lg hover:shadow-2xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="text-primary font-black mb-2 tracking-[0.2em]">{d.period}</div>
                          <h4 className="text-4xl font-syne font-black uppercase italic text-[var(--text-main)]">{d.date}</h4>
                        </div>
                        <div className="max-w-xs text-[var(--text-muted)] font-medium font-inter text-lg">
                          {d.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] flex items-start gap-4">
                    <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <p className="text-sm font-medium text-[var(--text-muted)]">
                      * Датумите се приближни и зависат од официјалниот конкурс на Министерството за образование и наука. Проверувајте ги страниците на факултетите редовно.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="dokumenti"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {DOCUMENTS.map((doc) => (
                    <div key={doc.id} className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2.5rem] flex flex-col justify-between hover:border-primary/30 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        {doc.icon}
                      </div>
                      <h4 className="text-xl font-syne font-black uppercase italic text-[var(--text-main)] leading-none">{doc.title}</h4>
                    </div>
                  ))}
                  <div className="sm:col-span-2 p-10 bg-primary/10 border-2 border-dashed border-primary/30 rounded-[3rem] text-center mt-6">
                     <p className="font-syne font-bold uppercase tracking-widest text-[var(--text-main)]">Совет: Направи два сета фотокопии од сите документи и завери ги на нотар пред да ги предадеш оригиналите.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="mt-48 space-y-16">
          <div className="flex items-center gap-6">
            <h2 className="text-4xl md:text-6xl font-syne font-black uppercase italic text-[var(--text-main)]">
              ОДБЕРИ <span className="text-primary">УНИВЕРЗИТЕТ</span>
            </h2>
            <div className="h-px flex-1 bg-[var(--border-main)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {UNIS.map((uni, i) => (
              <motion.a
                key={i}
                href={uni.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -10 }}
                className="group p-10 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] flex flex-col justify-between min-h-[320px] transition-all hover:bg-[var(--bg-tertiary)] hover:border-primary/30 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="px-4 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                      {uni.tag}
                    </span>
                    <ExternalLink className="w-5 h-5 text-[var(--text-muted)] group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-3xl font-syne font-black uppercase italic tracking-tighter mb-4 leading-none">
                    {uni.name}
                  </h3>
                  <p className="text-[var(--text-muted)] font-inter font-medium text-sm leading-relaxed">
                    {uni.desc}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                  ПОСЕТИ САЈТ <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Calculating points placeholder section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 p-12 md:p-20 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[4rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-20" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 rounded-xl text-primary font-black uppercase text-[10px] tracking-widest mb-6">
                  <Calculator className="w-4 h-4" /> КАЛКУЛАТОР ЗА ПОЕНИ
                </div>
                <h2 className="text-5xl font-syne font-black uppercase italic tracking-tighter mb-8 leading-none">
                  КАКО СЕ ПРЕСМЕТУВААТ <br /><span className="text-primary italic">ПОЕНИТЕ?</span>
                </h2>
                <div className="space-y-6 text-xl text-[var(--text-muted)] font-medium font-inter">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center shrink-0 font-black">1</div>
                      <p><span className="text-[var(--text-main)] font-black">60 поени</span> - Од успехот во средно образование (свидетелства).</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center shrink-0 font-black">2</div>
                      <p><span className="text-[var(--text-main)] font-black">40 поени</span> - Од државната матура (екстерни и интерни испити).</p>
                   </div>
                </div>
                <button className="mt-12 px-10 py-5 bg-primary text-black rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                  ПРЕСМЕТАЈ ПОЕНИ (НАСКОРО)
                </button>
             </div>
             
             <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 animate-pulse" />
                   <div className="w-64 h-64 border-8 border-primary rounded-[3rem] rotate-12 flex items-center justify-center bg-[var(--bg-main)] shadow-2xl relative z-10">
                      <span className="text-8xl font-syne font-black text-primary italic drop-shadow-xl select-none">%</span>
                   </div>
                   <div className="absolute -bottom-8 -left-8 w-32 h-32 border-4 border-[var(--border-main)] rounded-[2rem] -rotate-12 bg-[var(--bg-secondary)] flex items-center justify-center z-20 shadow-2xl">
                      <span className="text-4xl font-syne font-black text-primary italic">100</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mt-48 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-syne font-black uppercase italic text-[var(--text-main)] mb-4">
              ЧЕСТО ПОСТАВУВАНИ <span className="text-primary">ПРАШАЊА</span>
            </h2>
            <p className="text-[var(--text-muted)] font-inter text-lg">Сè што ги интересира идните студенти на едно место.</p>
          </div>

          <div className="space-y-4">
            {FAQS_UPISI.map((faq, i) => (
              <div 
                key={i}
                className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-3xl overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-8 flex items-center justify-between gap-6"
                >
                  <span className="text-xl font-syne font-black uppercase italic text-[var(--text-main)] leading-tight">
                    {faq.q}
                  </span>
                  <ChevronDown className={cn("w-6 h-6 text-primary transition-transform", openFaq === i && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-8 pb-8">
                        <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border-l-4 border-primary text-[var(--text-muted)] font-inter font-medium leading-relaxed italic">
                          {faq.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-40 p-12 md:p-20 bg-primary/10 border-4 border-dashed border-primary/30 rounded-[3rem] text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full" />
          
          <h2 className="text-4xl md:text-6xl font-syne font-black uppercase italic tracking-tighter mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ИМАШ ПРАШАЊЕ?
          </h2>
          <p className="text-xl md:text-2xl text-[var(--text-muted)] font-bold mb-12 max-w-2xl mx-auto font-inter">
            Доколку не најде одговор овде, пиши ни на социјалните мрежи и ќе ти помогнеме!
          </p>
          <a 
            href="https://instagram.com/studentarija"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-black rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
          >
            Пиши ни на Instagram
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// All icons imported at top
