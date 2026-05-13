import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MessageSquare, ChevronDown, 
  BookOpen, GraduationCap, Users, Coffee, 
  Wallet, Clock, HeartPulse, Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import ScrollToTop from '../components/ui/ScrollToTop';

const FAQs = [
  {
    id: 'friends',
    question: 'Како да си направиш друштво на факултет?',
    answer: 'Биди отворен, разговарај со колеги и приклучи се на групни активности или проекти.',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    id: 'study',
    question: 'Како да учиш за колоквиум без паника?',
    answer: 'Учи постепено, не оставај за последен момент и прави кратки повторувања.',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-green-500/10 text-green-500'
  },
  {
    id: 'fail',
    question: 'Што ако паднеш предмет?',
    answer: 'Не е крај — анализирај каде згреши и пробај повторно со подобра подготовка.',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-red-500/10 text-red-500'
  },
  {
    id: 'places',
    question: 'Најдобри места за учење?',
    answer: 'Библиотека за фокус, дома за комфор или тивко кафе за промена на средина.',
    icon: <Search className="w-6 h-6" />,
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    id: 'balance',
    question: 'Како да балансираш факултет и работа?',
    answer: 'Прави строг распоред и постави приоритети (учење или работа кога е најважно).',
    icon: <Clock className="w-6 h-6" />,
    color: 'bg-orange-500/10 text-orange-500'
  },
  {
    id: 'money',
    question: 'Како да штедиш како студент?',
    answer: 'Купувај само потребно, готви дома и користи студентски попусти.',
    icon: <Wallet className="w-6 h-6" />,
    color: 'bg-emerald-500/10 text-emerald-500'
  },
  {
    id: 'anxiety',
    question: 'Како да се справиш со трема пред испит?',
    answer: 'Диши длабоко, повтори кратко и фокусирај се на тоа што го знаеш.',
    icon: <HeartPulse className="w-6 h-6" />,
    color: 'bg-pink-500/10 text-pink-500'
  },
  {
    id: 'professors',
    question: 'Како да запознаеш професори?',
    answer: 'Биди активен на предавања и поставувај прашања.',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-cyan-500/10 text-cyan-500'
  },
  {
    id: 'coffee',
    question: 'Кафе или библиотека за учење?',
    answer: 'Библиотека за концентрација, кафе ако ти одговара малку бучава.',
    icon: <Coffee className="w-6 h-6" />,
    color: 'bg-amber-500/10 text-amber-500'
  }
];

export default function Brucosi() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-primary selection:text-black">
      <ScrollToTop />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50 dark:opacity-100">
        <motion.div 
          animate={{ 
            x: [0, 40, 0], 
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 40, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[5%] -left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="relative min-h-[60vh] flex flex-col justify-center mb-24">
          {/* Background Image Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.1, rotate: 5, y: 50 }}
            animate={{ opacity: 0.7, scale: 1.6, rotate: 0, y: -80 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute right-0 lg:-right-20 -top-20 w-full lg:w-[80%] h-full pointer-events-none z-0 overflow-hidden"
          >
            <motion.img 
              animate={{ 
                y: [0, -30, 0],
                filter: ["brightness(1) saturate(1)", "brightness(1.3) saturate(1.2)", "brightness(1) saturate(1)"]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/public/post-images/Screenshot_2026-05-12_at_13.00.20-removebg-preview%20(1).png" 
              alt=""
              className="w-full h-full object-contain object-right-top drop-shadow-[0_0_80px_rgba(250,204,21,0.4)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="relative z-10 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-black uppercase text-[10px] tracking-[0.3em] backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3" />
              ВОДИЧ ЗА БРУКОШИ
            </motion.div>
            
            <div className="space-y-6 relative w-full">
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute -left-10 lg:-left-12 top-0 bottom-0 w-2 bg-primary rounded-full hidden md:block shadow-[0_0_20px_rgba(250,204,21,0.4)]" 
              />
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl md:text-9xl xl:text-[11rem] font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-[0.8] relative z-20"
              >
                ДОБРЕДОЈДЕ <br />
                НА <span className="text-primary drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">ФАКУЛТЕТ</span>.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-xl md:text-3xl text-[var(--text-muted)] font-medium leading-tight font-inter mt-12 bg-[var(--bg-main)]/50 backdrop-blur-sm p-4 -ml-4 rounded-xl inline-block"
              >
                Сè што треба да знаеш за да го преживееш (и уживаш) во студентскиот живот во Македонија.
              </motion.p>
            </div>
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-6 relative">
          <div className="absolute -left-20 top-0 bottom-0 w-px bg-border-main hidden xl:block" />
          
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-syne font-bold uppercase tracking-widest text-primary">Најчести прашања</h2>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="space-y-4">
            {FAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2rem] overflow-hidden transition-all duration-500",
                  openId === faq.id 
                    ? "border-primary/50 shadow-2xl scale-[1.01] bg-[var(--bg-tertiary)]" 
                    : "hover:bg-[calc(var(--bg-secondary)+20)] hover:border-primary/20 shadow-lg"
                )}
              >
                <button 
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)} 
                  className="w-full text-left p-8 md:p-10 flex items-center gap-6 md:gap-8 active:scale-[0.99] transition-transform"
                >
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-sm",
                    openId === faq.id ? "bg-primary text-black" : faq.color
                  )}>
                    {faq.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-xl md:text-3xl font-syne font-extrabold uppercase italic tracking-tighter transition-colors duration-500 leading-none",
                      openId === faq.id ? "text-primary" : "text-[var(--text-main)]"
                    )}>
                      {faq.question}
                    </h3>
                  </div>

                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-main)] transition-all duration-500",
                    openId === faq.id ? "bg-primary border-primary rotate-180" : "bg-transparent"
                  )}>
                    <ChevronDown className={cn("w-5 h-5", openId === faq.id ? "text-black" : "text-[var(--text-muted)]")} />
                  </div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 md:px-10 pb-10 pl-24 md:pl-36">
                        <div className="border-l-4 border-primary pl-8 md:pl-12 py-2">
                           <p className="text-[var(--text-muted)] text-xl md:text-2xl font-medium leading-relaxed font-inter italic">
                             {faq.answer}
                           </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Tips Section with Image Block */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4 self-center space-y-12">
            <div>
              <h2 className="text-5xl font-syne font-black uppercase italic text-[var(--text-main)] leading-none mb-6">
                БРЗИ <br /><span className="text-primary italic">СОВЕТИ</span> <br />ЗА ПОЧЕТОК
              </h2>
              <p className="text-[var(--text-muted)] font-inter text-lg">Неколку работи кои ќе ти го олеснат првиот месец.</p>
            </div>

            {/* Sub-image Block - The screenshot one */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative rounded-3xl overflow-hidden border-2 border-primary/30 group"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <img 
                src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/Brucoshi/Untitled%20folder/Screenshot%202026-05-12%20at%2012.59.56.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCcnVjb3NoaS9VbnRpdGxlZCBmb2xkZXIvU2NyZWVuc2hvdCAyMDI2LTA1LTEyIGF0IDEyLjU5LjU2LnBuZyIsImlhdCI6MTc3ODU4NDM0NiwiZXhwIjoxODEwMTIwMzQ2fQ.JzFDI8O_N4RHq_I5YS40HxxJbL-TGhMDo_auCTTitWw" 
                alt="Student Life Screenshot" 
                className="w-full grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { num: '01', title: 'КНИГИ', text: 'Не купувај нови книги веднаш. Прашај ги постарите колеги за скрипти.' },
              { num: '02', title: 'ХРАНА', text: 'Користи го правото на субвенциониран студентски оброк.' },
              { num: '03', title: 'ПРЕВОЗ', text: 'Извади си студентска „Скопска“ за бесплатен превоз во ЈСП.' },
              { num: '04', title: 'МРЕЖА', text: 'Приклучи се во групите на Facebook и WhatsApp за твојот смер.' },
              { num: '05', title: 'ПОПУСТИ', text: 'Користи ја ISIC картичката за попусти во продавници и кина.' },
              { num: '06', title: 'АКТИВНОСТ', text: 'Приклучи се во студентската организација на твојот факултет.' }
            ].map((tip, i) => (
              <motion.div 
                key={tip.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="p-10 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2.5rem] hover:border-primary/40 hover:bg-[calc(var(--bg-secondary)+10)] transition-all group"
              >
                <div className="text-primary font-black mb-6 text-sm tracking-widest group-hover:scale-110 origin-left transition-transform inline-block">
                  {tip.num}. {tip.title}
                </div>
                <p className="font-syne font-bold text-xl md:text-2xl leading-tight uppercase italic">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
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
