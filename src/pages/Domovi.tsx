import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, MapPin, Users, Utensils, 
  Wifi, Shield, Zap, Info, 
  Building2, ArrowRight, ChevronDown, 
  Bed, Star, Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';
import ScrollToTop from '../components/ui/ScrollToTop';

const DORMS = [
  {
    id: 'goce',
    name: 'ГОЦЕ ДЕЛЧЕВ',
    city: 'Скопје',
    desc: 'Најголемиот студентски дом во државата, целосно реновиран во неколку блокови. Нуди модерно сместување и голема менза.',
    image: 'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/domovi/goce.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb21vdmkvZ29jZS5qcGciLCJpYXQiOjE3Nzg1ODc4NDEsImV4cCI6MTc3OTE5MjY0MX0.AePRQxrSx1SbcNs-MaTjJ32qUvA3S7apUI-spq6lQGQ',
    amenities: ['Реновиран', 'Менза', 'Библиотека', 'Центар'],
    rating: 4.5
  },
  {
    id: 'pelagonija',
    name: 'ПЕЛАГОНИЈА',
    city: 'Скопје',
    desc: 'Сместен во Кисела Вода, овој дом е познат по одличната социјална атмосфера и близината до неколку клучни факултети.',
    image: 'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/domovi/pelagonija.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb21vdmkvcGVsYWdvbmlqYS5qcGciLCJpYXQiOjE3Nzg1ODc4NzMsImV4cCI6MTc4MTE3OTg3M30.zcMOne2MBFN0NlRPWc60b4yuucrmW2BpmAb77ViO_8A',
    amenities: ['Социјален живот', 'Менза', 'Спортски терени'],
    rating: 4.2
  },
  {
    id: 'kuzman',
    name: 'КУЗМАН Ј. ПИТУ',
    city: 'Скопје',
    desc: 'Дом во самиот центар на Скопје. Најстариот дом со најдобра локација за студентите на економски, правен и филозофски факултет.',
    image: 'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/domovi/kuzman-josifovski-pitu-studentski-dom-foto-mon.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb21vdmkva3V6bWFuLWpvc2lmb3Zza2ktcGl0dS1zdHVkZW50c2tpLWRvbS1mb3RvLW1vbi5qcGVnIiwiaWF0IjoxNzc4NTg3ODY0LCJleHAiOjE3ODExNzk4NjR9.bSx38CbmP_59-FB7xGOTJGPKo82sZTnH1GVWGqhdP9c',
    amenities: ['Строг центар', 'Менза', 'Близина до факултети'],
    rating: 3.8
  },
  {
    id: 'stiv',
    name: 'СТИВ НАУМОВ',
    city: 'Скопје',
    desc: 'Лоциран во населбата Автокоманда, во непосредна близина на ПМФ, Технолошки и други технички факултети.',
    image: 'https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/domovi/stiv.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb21vdmkvc3Rpdi5qcGciLCJpYXQiOjE3Nzg1ODc4NzksImV4cCI6MTgxMDEyMzg3OX0.5G4VLRnJHL7Lo0FTQ543oQMiorcmje4E_V58JwUhXD4',
    amenities: ['Парк', 'Тивка околина', 'Посебни бараки'],
    rating: 3.5
  }
];

const REQUIREMENTS = [
  { 
    title: 'Државјанство', 
    desc: 'Да си државјанин на Р. Македонија.',
    icon: <Shield className="w-6 h-6" />
  },
  { 
    title: 'Статус', 
    desc: 'Да си редовен студент на државен универзитет.',
    icon: <GraduationCap className="w-6 h-6" />
  },
  { 
    title: 'Растојание', 
    desc: 'Живеалиштето да е надвор од местото на студирање.',
    icon: <MapPin className="w-6 h-6" />
  },
  { 
    title: 'Доход', 
    desc: 'Вкупниот приход во семејството да не надминува одреден лимит.',
    icon: <Wallet className="w-6 h-6" />
  }
];

const FAQS_DOMOVI = [
  {
    q: "Кога почнува аплицирањето за дом?",
    a: "Обично аплицирањето почнува во Јули за постарите студенти, а во Август/Септември за брукошите. Секогаш следете го сајтот на МОН."
  },
  {
    q: "Дали треба да плаќам ако не сум во центар?",
    a: "Постојат различни цени во зависност од тоа дали сте во државна квота или приватно сместување во домовите."
  },
  {
    q: "Што е потребно за влез во домот?",
    a: "Покрај решението за прием, ќе ви треба лекарско уверение и доказ за уплатени трошоци за сместување."
  },
  {
    q: "Дали има интернет во сите домови?",
    a: "Поголемиот дел од домовите сега нудат WiFi, но во некои соби студентите најчесто користат сопствени рутери."
  }
];

export default function Domovi() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-primary selection:text-black overflow-x-hidden">
      <ScrollToTop />
      
      {/* Dynamic Background Element */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-70">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="relative min-h-[60vh] flex flex-col justify-center mb-32">
          {/* Abstract House Shape behind text */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.1, scale: 1.5, rotate: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute right-0 top-0 pointer-events-none z-0"
          >
            <Home className="w-[30rem] h-[30rem] text-primary" />
          </motion.div>

          <div className="relative z-10 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black uppercase text-[11px] tracking-[0.4em] backdrop-blur-md shadow-xl"
            >
              <Building2 className="w-4 h-4" />
              СТУДЕНТСКИ ДОМОВИ
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
                className="text-7xl md:text-9xl xl:text-[11rem] font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-[0.75]"
              >
                ТВОЈОТ <br />
                <span className="text-primary italic drop-shadow-[0_0_40px_rgba(250,204,21,0.3)]">ВТОР ДОМ</span>.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-xl md:text-3xl text-[var(--text-muted)] font-medium leading-tight font-inter mt-12 bg-[var(--bg-main)]/60 backdrop-blur-md p-6 -ml-6 rounded-2xl inline-block border border-[var(--border-main)] shadow-2xl"
              >
                Сè за сместувањето во Македонија: <br />
                Информации за пријавување, цени и квалитет на живот во домовите.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Featured Dorms Grid */}
        <div className="space-y-16">
          <div className="flex items-center gap-8">
            <h2 className="text-4xl md:text-6xl font-syne font-black uppercase italic text-[var(--text-main)]">
              ПРЕГЛЕД НА <span className="text-primary">ДОМОВИ</span>
            </h2>
            <div className="h-px flex-1 bg-[var(--border-main)]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {DORMS.map((dorm, i) => (
              <motion.div
                key={dorm.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-xl"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-[45%] h-64 md:h-auto overflow-hidden relative">
                    <img 
                      src={dorm.image} 
                      alt={dorm.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="flex-1 p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">
                          {dorm.city}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="text-sm font-bold">{dorm.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-3xl font-syne font-black uppercase italic tracking-tighter mb-4">
                        {dorm.name}
                      </h3>
                      <p className="text-[var(--text-muted)] font-inter font-medium text-sm leading-relaxed mb-6">
                        {dorm.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dorm.amenities.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[var(--bg-tertiary)] rounded-lg text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mt-48 grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-5xl font-syne font-black uppercase italic text-[var(--text-main)] leading-none mb-6">
                Што ти е <br /><span className="text-primary">ПОТРЕБНО?</span>
              </h2>
              <p className="text-[var(--text-muted)] font-inter text-xl leading-relaxed">
                За да добиеш место во студентски дом, треба да ги исполнуваш следните основни критериуми поставени од Министерството.
              </p>
            </div>

            <div className="p-10 bg-primary/10 border-2 border-dashed border-primary/30 rounded-[3rem] relative">
               <Info className="w-10 h-10 text-primary mb-6 animate-pulse" />
               <p className="text-xl font-syne font-bold uppercase italic text-[var(--text-main)]">
                 Напомена: Рангирањето се врши по поени. Најголем број поени носат успехот и материјалната состојба на семејството.
               </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REQUIREMENTS.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] flex flex-col gap-6 hover:border-primary/40 transition-all hover:bg-[var(--bg-tertiary)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  {req.icon}
                </div>
                <div>
                  <h4 className="text-2xl font-syne font-black uppercase italic text-[var(--text-main)] mb-2 tracking-tighter">
                    {req.title}
                  </h4>
                  <p className="text-[var(--text-muted)] font-inter font-medium leading-tight">
                    {req.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-48 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-syne font-black uppercase italic text-[var(--text-main)] mb-4">
              ЧЕСТО ПОСТАВУВАНИ <span className="text-primary">ПРАШАЊА</span>
            </h2>
            <p className="text-[var(--text-muted)] font-inter text-lg">Одговори на најчестите дилеми околу студентското домување.</p>
          </div>

          <div className="space-y-4">
            {FAQS_DOMOVI.map((faq, i) => (
              <div 
                key={i}
                className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-3xl overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-8 flex items-center justify-between gap-6 hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <span className="text-xl font-syne font-black uppercase italic text-[var(--text-main)] leading-tight">
                    {faq.q}
                  </span>
                  <ChevronDown className={cn("w-6 h-6 text-primary transition-transform duration-500", openFaq === i && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 pb-8">
                        <div className="p-8 bg-[var(--bg-tertiary)] rounded-2xl border-l-4 border-primary text-[var(--text-muted)] font-inter font-medium text-lg leading-relaxed italic">
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
          className="mt-40 p-12 md:p-24 bg-primary/10 border-4 border-dashed border-primary/30 rounded-[4rem] text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary opacity-20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary opacity-20 blur-[100px] rounded-full" />
          
          <h2 className="text-5xl md:text-7xl font-syne font-black uppercase italic tracking-tighter mb-10 bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent">
            ПОТРЕБНА ТИ Е ПОМОШ <br /> ПРИ ПРИЈАВУВАЊЕ?
          </h2>
          <p className="text-xl md:text-3xl text-[var(--text-muted)] font-bold mb-14 max-w-3xl mx-auto font-inter leading-tight">
            Студентскиот живот започнува овде. Не дозволувај бирократијата да те сопре. Пиши ни!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://instagram.com/studentarija"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-14 py-7 bg-primary text-black rounded-full font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_20px_50px_rgba(250,204,21,0.4)] active:scale-95 transition-all outline-none"
            >
              Контактирај нè
            </a>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-14 py-7 bg-transparent border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-full font-black uppercase tracking-widest hover:bg-[var(--bg-secondary)] transition-all">
              Повеќе информации <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { GraduationCap, Calculator, ExternalLink } from 'lucide-react';
