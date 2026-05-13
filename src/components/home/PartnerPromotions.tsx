import { motion } from 'framer-motion';
import { ArrowRight, Tag, Briefcase, GraduationCap } from 'lucide-react';

const PROMOTIONS = [
  {
    id: 1,
    partner: 'Telekom MK',
    title: 'Платена пракса за 10 студенти во ИТ секторот',
    category: 'Кариера',
    icon: Briefcase,
    color: '#E20074',
    description: 'Отвори ги вратите на твојата кариера со Telekom MK. Аплицирај за тримесечна платена пракса.',
  },
  {
    id: 2,
    partner: 'Wolt',
    title: '15% попуст за сите студенти со индекс',
    category: 'Попусти',
    icon: Tag,
    color: '#009DE0',
    description: 'Користи го кодот STUDENT15 и добиј инстант попуст на твојата следна нарачка преку Wolt.',
  },
  {
    id: 3,
    partner: 'Sparkasse',
    title: 'Бесплатно одржување на студентска сметка',
    category: 'Едукација',
    icon: GraduationCap,
    color: '#ED1C24',
    description: 'Отвори студентска сметка во Sparkasse и добиј 0 денари провизија за одржување до крајот на студиите.',
  },
];

export default function PartnerPromotions() {
  return (
    <section className="py-24 bg-dark-2">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-1 bg-primary" />
              <span className="bg-primary text-dark px-3 py-1 text-[10px] font-black uppercase tracking-widest">ПРОМОЦИИ И ПОНУДИ</span>
            </div>
            <h2 className="text-6xl md:text-[140px] font-head font-black tracking-[-0.08em] uppercase leading-[0.7] flex flex-col">
              <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--text-main)' }}>ЕКСКЛУЗИВНО</span>
              <span className="relative inline-block mt-2 md:-mt-6 px-4 italic w-fit self-end">
                <span className="relative z-10 text-dark">ЗА ТЕБЕ</span>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                  className="absolute inset-0 bg-primary -z-10 origin-left skew-x-[-12deg]"
                />
              </span>
            </h2>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--text-main)', color: 'var(--bg-main)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 px-10 py-5 rounded-full font-head font-black text-[12px] uppercase tracking-widest transition-all shadow-xl"
          >
            ВИДИ ГИ СИТЕ ПОНУДИ
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROMOTIONS.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-dark border border-white/5 rounded-[40px] p-10 flex flex-col group relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none"
                style={{ backgroundColor: promo.color }}
              />

              <div className="flex items-center justify-between mb-8">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: promo.color }}
                >
                  <promo.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  {promo.category}
                </span>
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: promo.color }}>
                {promo.partner}
              </span>
              
              <h3 className="text-2xl font-head font-black uppercase leading-tight mb-6 group-hover:text-primary transition-colors">
                {promo.title}
              </h3>
              
              <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1">
                {promo.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all cursor-pointer">
                ДОЗНАЈ ПОВЕЌЕ <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
