import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Clock, HelpCircle, 
  ArrowRight, CheckCircle2, AlertCircle, 
  ChevronDown, ExternalLink, RefreshCcw,
  BookOpen, Landmark, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import ScrollToTop from '../components/ui/ScrollToTop';

const REFRESH_STEPS = [
  {
    title: "ПОТВРДА ЗА СТУДИИ",
    desc: "Земи потврда од студентски прашања дека си редовен студент за новата година.",
    icon: <FileText className="w-6 h-6" />
  },
  {
    title: "УВЕРЕНИЕ ЗА ИСПИТИ",
    desc: "Извештај со положени испити и просек (потврда од факултетот).",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    title: "ОНЛАЈН АПЛИКАЦИЈА",
    desc: "Прикачување на документите на официјалниот е-портал на МОН.",
    icon: <ExternalLink className="w-6 h-6" />
  }
];

const FAQS_REFRESH = [
  {
    q: "Дали треба да имам просек 8.0 за да продолжам?",
    a: "Да, за повеќето типови на стипендии (тип А и тип Б) услов е да се задржи просекот над 8.0 и да нема презапишани предмети од претходните години."
  },
  {
    q: "Што ако не ја продолжам навреме?",
    a: "Доколку ги пропуштите роковите (најчесто во текот на октомври), го губите правото на стипендија за таа академска година и истата нема да ви биде исплатена."
  },
  {
    q: "Дали треба да ги носам документите физички во МОН?",
    a: "Во последно време процесот е дигитализиран преку e-uslugi.mon.gov.mk, но се препорачува да се чуваат оригиналите доколку бидат побарани за увид."
  }
];

export default function ProdolzuvanjeStipendija() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-primary selection:text-black overflow-x-hidden">
      <ScrollToTop />
      
      {/* Background Kinetic Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-40">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] border border-primary/10 rounded-full"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-syne font-black text-primary/5 select-none pointer-events-none">
          STIP
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="relative min-h-[55vh] flex flex-col justify-center mb-32">
          <div className="relative z-10 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-black uppercase text-[11px] tracking-[0.4em] backdrop-blur-md shadow-2xl"
            >
              <RefreshCcw className="w-4 h-4 animate-spin-slow" />
              ОБНОВУВАЊЕ НА СТАТУС
            </motion.div>
            
            <div className="space-y-8 relative w-full">
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute -left-10 lg:-left-12 top-0 bottom-0 w-2.5 bg-primary rounded-full hidden md:block shadow-[0_0_40px_rgba(250,204,21,0.6)]" 
              />
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl xl:text-[10rem] font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-[0.8]"
              >
                ПРОДОЛЖИ <br />
                <span className="text-primary italic drop-shadow-[0_0_50px_rgba(250,204,21,0.4)]">СТИПЕНДИЈА</span>.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-xl md:text-4xl text-[var(--text-muted)] font-medium leading-tight font-inter mt-14 bg-[var(--bg-main)]/70 backdrop-blur-md p-8 -ml-8 rounded-[2.5rem] inline-block border border-[var(--border-main)] shadow-2xl"
              >
                Не дозволувај да го пропуштиш рокот. <br />
                Сè што треба да знаеш за продолжување на твојата стипендија во неколку чекори.
              </motion.p>
            </div>
          </div>

          {/* Floating Icon Decoration */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-1/4 pointer-events-none opacity-10 hidden xl:block"
          >
            <Landmark className="w-96 h-96 text-primary" />
          </motion.div>
        </div>

        {/* Process Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-48">
          {REFRESH_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-12 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3.5rem] hover:border-primary/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                {step.icon}
              </div>
              <div>
                <h3 className="text-2xl font-syne font-black uppercase italic tracking-tighter mb-4 leading-none">
                  {step.title}
                </h3>
                <p className="text-[var(--text-muted)] font-inter font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Requirements & Deadline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-syne font-black uppercase italic text-[var(--text-main)] leading-none">
                ДО КОГА Е <br /><span className="text-primary">РОКОТ?</span>
              </h2>
              <p className="text-[var(--text-muted)] font-inter text-2xl leading-relaxed">
                Вообичаено, аплицирањето за продолжување почнува на <span className="text-primary font-black">1-ви октомври</span> и трае до <span className="text-primary font-black">31-ви октомври</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-10 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] space-y-6">
                 <Clock className="w-10 h-10 text-primary" />
                 <h4 className="text-2xl font-syne font-black uppercase italic tracking-tighter">ВНИМАВАЈ</h4>
                 <p className="text-[var(--text-muted)] font-medium font-inter">Задоцнетите апликации автоматски се одбиваат од системот.</p>
              </div>
              <div className="p-10 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] space-y-6">
                 <AlertCircle className="w-10 h-10 text-primary" />
                 <h4 className="text-2xl font-syne font-black uppercase italic tracking-tighter">УСЛОВ</h4>
                 <p className="text-[var(--text-muted)] font-medium font-inter">Мора да си редовен студент за тековната академска година.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-12 md:p-16 bg-primary text-black rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(250,204,21,0.3)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
               <h3 className="text-4xl font-syne font-black uppercase italic tracking-tighter mb-8 leading-tight">
                 ПОТРЕБНИ <br />ДОКУМЕНТИ
               </h3>
               <ul className="space-y-6">
                 {[
                   "Потврда за редовен студент",
                   "Уверение со положени испити",
                   "Договор за стипендија (копија)",
                   "Потврда за просек (мин. 8.0)"
                 ].map((item, idx) => (
                   <li key={idx} className="flex gap-4 items-start font-inter font-black text-lg">
                     <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>

        {/* Dynamic FAQ */}
        <div className="mt-48 max-w-4xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-5xl md:text-7xl font-syne font-black uppercase italic text-[var(--text-main)] mb-6">
                ИМАШ <span className="text-primary italic">ДИЛЕМА?</span>
             </h2>
             <p className="text-[var(--text-muted)] font-inter text-xl">Најчестите прашања околу обновувањето на стипендиите.</p>
          </div>

          <div className="space-y-6">
            {FAQS_REFRESH.map((faq, i) => (
              <div 
                key={i}
                className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2.5rem] overflow-hidden transition-all hover:bg-[var(--bg-tertiary)]"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-10 flex items-center justify-between gap-8"
                >
                  <span className="text-2xl font-syne font-black uppercase italic text-[var(--text-main)] leading-tight tracking-tighter">
                    {faq.q}
                  </span>
                  <div className={cn(
                    "w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center transition-all duration-500",
                    openFaq === i ? "bg-primary text-black rotate-180" : "text-primary"
                  )}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-10 pb-10">
                        <div className="p-10 bg-[var(--bg-main)] rounded-[2rem] border-l-8 border-primary text-[var(--text-muted)] font-inter font-medium text-xl leading-relaxed italic shadow-inner">
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

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-48 p-16 md:p-32 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[5rem] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-40 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-5xl md:text-8xl font-syne font-black uppercase italic tracking-tighter mb-10 text-[var(--text-main)]">
              ПОДГОТВИ СЕ <span className="text-primary">НАВРЕМЕ</span>.
            </h2>
            <p className="text-xl md:text-3xl text-[var(--text-muted)] font-bold mb-16 max-w-3xl mx-auto font-inter leading-tight">
              Специјализираната платформа на МОН е местото каде што се случува магијата. Посети ја сега за да го провериш твојот статус.
            </p>
            <div className="flex flex-col sm:flex-row gap-8">
               <a 
                href="https://e-uslugi.mon.gov.mk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-16 py-8 bg-primary text-black rounded-full font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/30"
               >
                 ОФИЦИЈАЛЕН ПОРТАЛ <ExternalLink className="inline-block ml-3 w-5 h-5" />
               </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
