import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Landmark, FileCheck, Calendar, ExternalLink, ArrowRight, Info, Users, Award, BookOpen, Smartphone, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

export default function Scholarships() {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const renderWithHighlights = (text: string) => {
    const parts = text.split(/(<span.*?>.*?<\/span>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('<span')) {
        const content = part.replace(/<span.*?>|<\/span>/g, '');
        const isSans = part.includes('font-sans');
        return <span key={i} className={cn(isSans && "font-sans font-black", "text-[#facc15]")}>{content}</span>;
      }
      return part;
    });
  };

  const groups = [
    {
      id: 1,
      title: "ПРВА ГРУПА",
      subtitle: "Стипендии за студенти од социјални категории",
      description: "Наменета е за оние студенти кај кои месечните примања на семејството по член се пониски од <span className='font-sans'>75%</span> од просечната нето плата во РМ.",
      details: [
        "Месечни примања по член < <span className='font-sans'>34.100</span> ден (<span className='font-sans'>75%</span> од просечна плата <span className='font-sans'>45.468</span> ден)",
        "Положени на најмалку <span className='font-sans'>80%</span> од предвидените испити",
        "Дополнителни бодови за: студенти без родители, деца на самохрани родители, деца на корисници на социјална помош",
        "Наменета само за студенти на државен факултет"
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "ВТОРА ГРУПА",
      subtitle: "Стипендии за висок успех",
      description: "Наменета за студенти со одличен успех и положени <span className='font-sans'>90%</span> од испитите.",
      details: [
        "Положени најмалку <span className='font-sans'>90%</span> од испитите",
        "Информатика / Општествени / Хуманистички: просек <span className='font-sans'>9.01</span>",
        "Технички / Природни / Медицински / Биотехнички: просек <span className='font-sans'>8.51</span>",
        "Македонски јазик и книжевност: просек <span className='font-sans'>8.00</span>",
        "Уметности / Историја / Археологија / Преведување: просек <span className='font-sans'>7.50</span>",
        "Предност имаат студентите во повисока година и со 100% положени испити"
      ],
      color: "from-amber-400 to-orange-500"
    },
    {
      id: 3,
      title: "ТРЕТА ГРУПА",
      subtitle: "Стипендии за дефицитарни струки",
      description: "Наменета за природно-математички, технички, медицински и земјоделски науки.",
      details: [
        "Положени најмалку <span className='font-sans'>80%</span> од испитите",
        "Хемија, Физика, Математика: просек најмалку <span className='font-sans'>7.00</span> (Стипендија: <span className='font-sans'>18.000</span> ден)",
        "Земјоделски, Ветеринарни, Шумарски: просек најмалку <span className='font-sans'>8.00</span> (Стипендија: <span className='font-sans'>18.000</span> ден)",
        "Македонски јазик: просек од <span className='font-sans'>7.50</span> до <span className='font-sans'>8.50</span> (не повеќе!)",
        "Важи за ПМФ, Технички, Биотехнички и Медицински науки"
      ],
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 4,
      title: "ЧЕТВРТА ГРУПА",
      subtitle: "Стипендии за наставен кадар",
      description: "За студенти запишани во прва година на програми за образование на наставен кадар.",
      details: [
        "Успех остварен во текот на средното образование",
        "Дополнителен 1 бод за секоја година користена стипендија за талентирани ученици од МОН",
        "Наменета за предучилишно, основно и средно образование"
      ],
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] overflow-x-hidden pt-20">
      {/* Background Decorative Text */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
        <div className="flex whitespace-nowrap gap-20 text-[20vw] font-head font-black uppercase italic animate-marquee">
          {Array(5).fill("СТИПЕНДИИ ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
        <div className="flex whitespace-nowrap gap-20 text-[20vw] font-head font-black uppercase italic animate-marquee-reverse mt-20">
          {Array(5).fill("СТИПЕНДИИ ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-40">
        {/* Hero Section */}
        <header className="mb-32 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Award className="w-3.5 h-3.5" /> ДРЖАВНИ СТИПЕНДИИ 2025/2026
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-head font-black uppercase tracking-tighter mb-8 italic leading-[1.1] text-[#facc15]"
          >
            СЕ ШТО ТРЕБА <span className="italic">ДА ЗНАЕШ</span> ЗА <span className="bg-[#facc15] text-black px-4 py-1 inline-block mx-1 not-italic">СТУДЕНТСКИ СТИПЕНДИИ</span> <span className="italic font-sans tracking-tight">2025/26</span> ГОДИНА.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold uppercase tracking-tight text-[#666666] dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            И оваа година државата, преку <span className="text-[#facc15] italic text-2xl">МОН</span>, ќе додели околу <span className="text-[#facc15] italic text-2xl font-sans tracking-tight">3.000</span> нови државни студентски стипендии.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a 
              href="https://e-uslugi.mon.gov.mk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-primary text-dark px-10 py-5 rounded-[2.5rem] font-bold uppercase text-xs tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 ring-4 ring-transparent hover:ring-primary/20"
            >
              Аплицирај Електронски <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </header>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            viewport={{ once: true }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3rem] relative group hover:border-primary transition-all shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="w-14 h-14 bg-[#facc15] rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:rotate-12 transition-transform shadow-lg">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-head font-black uppercase mb-6 italic tracking-tight text-[#facc15]">Генерални Инфо</h3>
            <p className="text-[#666666] dark:text-zinc-400 font-medium mb-4 leading-relaxed">
              Стипендиите се наменети за редовни студенти на додипломски студии од прв циклус на јавните и приватните универзитети во Македонија.
            </p>
            <div className="bg-[#facc15]/10 border border-[#facc15]/20 p-4 rounded-2xl text-[10px] font-black text-[#facc15] uppercase tracking-widest">
              Секој студент може да аплицира само за ЕДНА група.
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3rem] relative group hover:border-primary transition-all shadow-xl"
          >
            <div className="w-14 h-14 bg-[#facc15] rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:rotate-12 transition-transform shadow-lg">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-head font-black uppercase mb-6 italic tracking-tight text-[#facc15]">Основни Услови</h3>
            <ul className="space-y-4 text-[#666666] dark:text-zinc-400 font-bold text-[12px] uppercase tracking-tight">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#facc15] rounded-full" /> Да си редовен студент</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#facc15] rounded-full" /> Да немаш повторувано година</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#facc15] rounded-full" /> Да си македонски државјанин</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#facc15] rounded-full" /> Да не користиш друга стипендија</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3rem] relative group hover:border-primary transition-all shadow-xl"
          >
            <div className="w-14 h-14 bg-[#facc15] rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:rotate-12 transition-transform shadow-lg">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-head font-black uppercase mb-6 italic tracking-tight text-[#facc15]">Рок за аплицирање</h3>
            <div className="text-5xl font-sans font-black text-[#facc15] tracking-tighter italic mb-4 border-b border-[#facc15]">1 - 15 <span className="font-head border-[#facc15]">НОЕМВРИ</span></div>
            <p className="text-[#666666] dark:text-zinc-400 font-medium leading-relaxed">
              Аплицирањето е исклучиво електронски. Документи не треба да се доставуваат во министерството.
            </p>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="mb-40">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-head font-black uppercase tracking-tighter italic mb-4 text-[#facc15] leading-none italic">КАТЕГОРИИ НА <span className="text-[#facc15] italic">СТИПЕНДИИ.</span></h2>
             <p className="text-[#666666] dark:text-zinc-400 font-bold uppercase tracking-widest text-sm">Избери категорија за детални информации</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {groups.map((group, idx) => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={activeGroup !== group.id ? { scale: 1.02 } : {}}
                viewport={{ once: true }}
                className={cn(
                  "bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] rounded-[3rem] overflow-hidden transition-all duration-300 shadow-2xl",
                  activeGroup === group.id ? "ring-2 ring-[#facc15] border-transparent z-20" : "hover:border-[#facc15]/50 z-10"
                )}
              >
                <div 
                  className="p-10 cursor-pointer flex items-center justify-between"
                  onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
                >
                  <div className="flex gap-8 items-center">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-[#facc15] bg-gradient-to-br shadow-xl shrink-0 border-[#fa3333]",
                      group.color
                    )}>
                      <GraduationCap className="w-8 h-8 text-[#facc15]" />
                    </div>
                    <div>
                      <h3 className="text-[#666666] font-black uppercase text-xs tracking-[0.3em] mb-2">{group.title}</h3>
                      <h4 className="text-2xl font-head font-black uppercase italic tracking-tighter text-[#facc15] leading-none mb-2">{group.subtitle}</h4>
                      <p className="text-[#666666] text-sm font-medium line-clamp-1">{renderWithHighlights(group.description)}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: activeGroup === group.id ? 180 : 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[#facc15] shrink-0"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  {activeGroup === group.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "circOut" }}
                      className="overflow-hidden bg-[var(--bg-tertiary)]/30"
                    >
                      <div className="p-10 pt-0">
                         <div className="h-[1px] w-full bg-[var(--border-main)] mb-10" />
                         <div className="flex flex-col gap-4">
                           {group.details.map((detail, i) => (
                             <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex gap-4 p-5 rounded-2xl bg-[var(--bg-main)]/50 border border-[var(--border-main)] text-[#666666] font-bold text-xs uppercase tracking-tight leading-relaxed shadow-sm"
                             >
                               <div className="w-2 h-2 rounded-full bg-[#facc15] mt-1.5 shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                               <div className="flex-1">{renderWithHighlights(detail)}</div>
                             </motion.div>
                           ))}
                         </div>
                         <div className="mt-10 p-6 rounded-[2rem] bg-[#facc15]/5 border border-[#facc15]/20 flex items-center gap-6">
                            <div className="w-12 h-12 bg-[#facc15] rounded-xl flex items-center justify-center text-black shrink-0">
                              <Smartphone className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-black text-[#facc15] uppercase tracking-[0.2em] mb-1">Потребна е апликација</p>
                               <p className="text-xs font-bold text-[#666666]">Дополнителни документи се пополнуваат дигитално на МОН порталот.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#facc15]" />
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-40">
          <div className="bg-black dark:bg-[#0a0a0a] border-4 border-[#facc15]/20 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl transition-colors">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#facc15]/5 rounded-full blur-[120px] -translate-y-32 translate-x-32" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-head font-black uppercase tracking-tighter italic mb-12 text-white leading-none">
                  ВИСИНА НА <span className="text-[#facc15] italic">СТИПЕНДИИТЕ.</span>
                </h2>
                <div className="space-y-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="p-12 md:p-14 rounded-[3.5rem] bg-[#121212] border-[3px] border-[#facc15] shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15]/5 rounded-full blur-3xl opacity-50" />
                    <p className="text-zinc-500 font-black text-[12px] uppercase tracking-[0.4em] mb-8">Основни стипендии</p>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-[#facc15] px-6 py-4 rounded-xl rotate-[-2deg] group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                        <span className="text-6xl md:text-7xl font-sans font-black text-black tracking-tighter">6.050</span>
                      </div>
                      <span className="text-2xl md:text-3xl font-head font-black uppercase tracking-tight text-white italic">ДЕН / МЕСЕЦ</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-6">Важи за сите категории освен дефицитарни струки.</p>
                  </motion.div>
 
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="p-12 md:p-14 rounded-[3.5rem] bg-[#121212] border-[3px] border-emerald-500 shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
                    <p className="text-zinc-500 font-black text-[12px] uppercase tracking-[0.4em] mb-8">Дефицитарни струки (Трета група)</p>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-[#facc15] px-6 py-4 rounded-xl rotate-[-2deg] group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                        <span className="text-6xl md:text-7xl font-sans font-black text-black tracking-tighter">18.000</span>
                      </div>
                      <span className="text-2xl md:text-3xl font-head font-black uppercase tracking-tight text-white italic">ДЕН / МЕСЕЦ</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-6">Посебни услови за Хемија, Физика, Математика и Земјоделски струки.</p>
                  </motion.div>
                </div>
              </div>
 
              <div className="bg-[#121212] border-2 border-[#facc15]/20 p-12 rounded-[3.5rem] shadow-xl relative overflow-hidden transition-colors">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#facc15]/5 rounded-full blur-3xl opacity-50" />
                <div className="w-16 h-16 bg-[#facc15] rounded-2xl flex items-center justify-center text-black mb-10 shadow-lg">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-head font-black uppercase mb-8 italic tracking-tight text-white leading-none">Рок и начин на исплата</h3>
                <p className="text-xl font-bold text-zinc-400 uppercase tracking-tight leading-relaxed mb-10">
                  Стипендиите се доделуваат за <span className="text-[#facc15] italic font-sans text-4xl">9</span> <span className="text-[#facc15] italic">МЕСЕЦИ</span> во годината, односно ќе ви бидат исплатени 9 месечни рати.
                </p>
                <div className="flex items-center gap-5 p-6 rounded-3xl bg-[#facc15]/10 border border-[#facc15]/20">
                  <div className="w-3 h-3 rounded-full bg-[#facc15] animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                  <span className="text-[12px] font-black text-[#facc15] uppercase tracking-[0.2em]">Автоматска исплата на трансакциска сметка</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Info Section */}
        <section className="mb-40">
           <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-head font-black uppercase tracking-tighter italic mb-4 text-[#facc15] leading-none italic">ДРУГИ ВАЖНИ <span className="text-[#facc15] italic">ИНФОРМАЦИИ.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-8 rounded-[2.5rem] hover:border-[#facc15] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-[#facc15] mb-6 group-hover:bg-[#facc15] group-hover:text-black transition-all">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-head font-black uppercase italic mb-4 text-[#facc15]">Нема гаранција</h4>
              <p className="text-sm font-bold text-[#666666] uppercase tracking-tight leading-relaxed">
                Исполнувањето на условите не значи автоматски стипендија. Бројот е ограничен и предност имаат студентите со повеќе бодови.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-8 rounded-[2.5rem] hover:border-[#facc15] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-[#facc15] mb-6 group-hover:bg-[#facc15] group-hover:text-black transition-all">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-head font-black uppercase italic mb-4 text-[#facc15]">Продолжување</h4>
              <p className="text-sm font-bold text-[#666666] uppercase tracking-tight leading-relaxed">
                Штом добиете стипендија, може да ја продолжувате секоја година до последната година на студии, под услов да ги исполнувате условите.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-8 rounded-[2.5rem] hover:border-[#facc15] transition-all group"
            >
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-[#facc15] mb-6 group-hover:bg-[#facc15] group-hover:text-black transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-head font-black uppercase italic mb-4 text-[#facc15]">Објава Резултати</h4>
              <p className="text-sm font-bold text-[#666666] uppercase tracking-tight leading-relaxed">
                Резултатите се очекуваат во декември и веднаш ќе ги споделиме на Студентарија. Решението ќе го добиете на МОН порталот.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 flex justify-center">
            <motion.div
               whileHover={{ scale: 1.05 }}
               className="inline-flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-full"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">🍀</div>
              <span className="text-emerald-500 font-head font-black uppercase italic tracking-tighter text-xl">Среќно на сите апликанти!</span>
            </motion.div>
          </div>
        </section>

        {/* Bank Promotion Card */}
        <section className="mt-40">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-[#FF5F00] dark:bg-zinc-900 border-2 border-transparent dark:border-white/10 p-12 md:p-20 rounded-[4rem] group transition-colors duration-500"
          >
            {/* Bank Card Decoration */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 translate-x-10 w-[400px] h-[250px] bg-white opacity-10 rounded-[2rem] -rotate-12 blur-3xl" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-20 w-[400px] h-[250px] bg-black opacity-10 rounded-[2rem] rotate-12 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="bg-white/20 px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md border border-white/30">
                    VIBE ON x SPARKASSE
                  </div>
                </div>
                <h2 className="text-5xl md:text-7xl font-head font-black uppercase tracking-tighter text-white dark:text-[#facc15] italic leading-none mb-10">
                  АПЛИЦИРАЈ СО <span className="text-black dark:text-white italic underline decoration-white">VIBE ON.</span>
                </h2>
                <p className="text-white dark:text-zinc-400 font-bold text-xl uppercase tracking-tight mb-12 max-w-xl opacity-90">
                  Уживај во низа поволности кога ќе ти легне стипендијата со дебитната картичка од Шпаркасе Банка.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Без провизија кон факултет",
                    "Без месечна членарина",
                    "4 бесплатни подигнувања",
                    "Поволности и попусти"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white dark:bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl text-black dark:text-white transition-colors">
                      <div className="w-8 h-8 bg-[#FF5F00] dark:bg-[#facc15] rounded-full flex items-center justify-center text-white dark:text-black">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [-8, -12, -8]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-black rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 flex flex-col justify-between relative overflow-hidden group">
                     {/* Card Details Visual */}
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-12 bg-gradient-to-r from-amber-400 to-amber-200 rounded-lg shadow-inner opacity-80" />
                        <div className="text-white text-3xl font-black italic tracking-tighter opacity-40">VIBE <span className="text-orange-500">ON</span></div>
                     </div>
                     <div>
                        <div className="text-white/40 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Sparkasse Bank</div>
                        <div className="text-white text-2xl font-mono tracking-widest mb-4">4567 8901 2345 6789</div>
                        <div className="flex gap-10">
                           <div>
                              <div className="text-white/30 text-[8px] font-black uppercase tracking-widest mb-1">VALID THRU</div>
                              <div className="text-white text-xs font-mono">12 / 28</div>
                           </div>
                           <div>
                              <div className="text-white/30 text-[8px] font-black uppercase tracking-widest mb-1">HOLDER</div>
                              <div className="text-white text-xs font-mono">MARKO MARKOVSKI</div>
                           </div>
                        </div>
                     </div>
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                  </div>
                </motion.div>
                
                {/* Visual Accent */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-[100px]" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer Notice */}
        <div className="mt-40 bg-zinc-50 dark:bg-zinc-900 border-t-8 border-[#facc15] p-16 rounded-[4rem] relative overflow-hidden border border-black/5 dark:border-white/5 transition-colors">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#facc15]/5 rounded-full blur-[100px] opacity-20" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <h4 className="text-[#facc15] font-black uppercase text-xl tracking-[0.4em] mb-8 italic">Напомена</h4>
            <p className="text-black dark:text-white font-bold uppercase tracking-tight max-w-3xl leading-relaxed text-lg opacity-80">
              Сите информации се преземени од официјалниот портал на МОН. За најточни и најнови информации, секогаш посетувајте ја страната <span className="text-[#facc15] italic">e-uslugi.mon.gov.mk</span> пред да аплицирате.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
