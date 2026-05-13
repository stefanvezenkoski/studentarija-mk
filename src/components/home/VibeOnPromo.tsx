import React from 'react';
import { motion } from 'motion/react';
import { 
  Coffee, 
  Pizza, 
  ShoppingBag, 
  Dumbbell, 
  Car, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Smartphone,
  Info
} from 'lucide-react';

const benefits = [
  { icon: BookOpen, text: 'Едукација (Creative Hub, Data Masters)', color: 'bg-[#FF5C00]' },
  { icon: ShoppingBag, text: 'Шопинг (Sport M, Bella, Watch Club)', color: 'bg-[#FF5C00]' },
  { icon: Pizza, text: 'Храна (Domino\'s, Star Ocean, Bure)', color: 'bg-[#FF5C00]' },
  { icon: Coffee, text: 'Кафе-барови (M House, Broz, Nomad)', color: 'bg-[#FF5C00]' },
  { icon: Smartphone, text: 'Техника (HiCom, Mi Store)', color: 'bg-[#FF5C00]' },
  { icon: Dumbbell, text: 'Фитнес (ATG, EMS Fitness)', color: 'bg-[#FF5C00]' },
  { icon: Car, text: 'Авто-школи (Болана, Смарт)', color: 'bg-[#FF5C00]' },
];

export default function VibeOnPromo() {
  return (
    <section className="py-24 md:py-32 overflow-hidden bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative group">
          {/* Main Container */}
          <div className="relative bg-[#FF5C00] rounded-[3rem] md:rounded-[4rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-orange-500/20 border border-white/10">
            {/* Background Texture/Accents */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [12, 10, 12]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] right-[-10%] w-[80%] h-[150%] bg-white rotate-12 blur-[100px]" 
              />
            </div>

            {/* Left Content */}
            <div className="flex-1 p-10 md:p-20 relative z-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-3 rounded-xl shadow-lg border border-white/20"
                  >
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV6Wvp6gEe59jxyu_aSwLOB_BMUiAQm0-4Lg&s" 
                      alt="Sparkasse Bank" 
                      className="h-8 object-contain"
                    />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-white text-[12px] font-black uppercase tracking-[0.2em] leading-tight flex items-center gap-2">
                      SPARKASSE BANKA 
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="text-white/80">ОФИЦИЈАЛЕН ПАРТНЕР НА STUDENTARIJA</span>
                    </span>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-[80px] font-head font-black tracking-[-0.05em] uppercase leading-[0.8] text-white mb-10">
                  <motion.span 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="bg-[#00599a] inline-block px-6 py-2 rotate-1 mb-2 shadow-xl relative"
                  >
                    VIBE ON
                  </motion.span> <br />
                  <motion.span 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                    className="text-[#FF5C00] bg-white inline-block px-6 py-2 -rotate-2 mt-2 shadow-xl relative z-10"
                  >
                    КЛУБ
                  </motion.span>
                </h2>

                <div className="space-y-8">
                  <div className="text-xl md:text-3xl font-head font-bold tracking-tight leading-snug max-w-2xl relative">
                    Заедно со твојата картичка за 
                    <span className="relative inline-block mx-2 whitespace-nowrap">
                      <span className="relative z-10 italic">субвенциониран студентски оброк</span>
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="absolute bottom-0 left-0 w-full h-[6px] bg-[#00599a] origin-left rounded-full opacity-60"
                      />
                    </span>, 
                    добиваш и Vibe On клуб поволности!
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-4 text-white/70 max-w-xl bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl"
                  >
                    <Info className="w-6 h-6 shrink-0 text-white" />
                    <p className="text-sm font-medium leading-relaxed italic">
                      Твојата Visa картичка од Sparkasse Bank е твојот влез во светот на студентски попусти. <br />
                      <span className="text-white font-black uppercase tracking-widest text-[10px] mt-2 block">Користи ги привилегиите веднаш!</span>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Area */}
            <div className="w-full lg:w-[45%] bg-black/10 lg:bg-black/5 backdrop-blur-md p-10 md:p-20 relative overflow-hidden flex flex-col">
              <div className="relative z-10 flex flex-col h-full">
                <h4 className="text-white font-head font-black text-xs uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  ИСКОРИСТИ VIBE ON ПОПУСТ
                </h4>

                <div className="space-y-3 mb-10">
                  {benefits.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.08, type: "spring", stiffness: 100 }}
                      whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.15)" }}
                      className="group/item flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className="w-4 h-4 text-white/60 group-hover/item:text-white transition-colors" />
                        <span className="text-white font-head font-bold text-[10px] uppercase tracking-widest group-hover/item:tracking-[0.15em] transition-all">
                          {item.text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#000', color: '#fff' }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-auto w-full bg-white text-[#FF5C00] py-6 rounded-full font-head font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all border-2 border-transparent"
                >
                  ВИДИ ГИ СИТЕ ПОПУСТИ
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Decorative Circle */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.1, 0.05]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-white rounded-full blur-[50px] pointer-events-none" 
              />
            </div>
          </div>
          
          {/* Subtitle / Quote */}
          <div className="mt-20 flex flex-col lg:flex-row items-center justify-between gap-12 px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center lg:items-start group"
            >
              <h3 className="font-head font-black text-4xl md:text-6xl uppercase tracking-tighter leading-[0.85] text-center lg:text-left mb-6">
                <span className="bg-primary text-black px-4 py-1 inline-block mb-2">ИСТИТЕ НАВИКИ.</span> <br />
                <span className="text-[#FF5C00]">СО ПОМАЛА СМЕТКА.</span>
              </h3>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative h-12 w-48 mt-4"
              >
                <img 
                  src="https://cdn0.erstegroup.com/gemlip/v2/23DkuR8Q67KoeuhhfG2Kg63bjmpb/dam/mk/spkmk/www_sparkasse_mk/logos/sparkasse-logo-belo-01.jpg.c2959addbe599b7b.xywh.w3840w2560w1920w1280w1024w820w570w360w220w120w64_w820_r.webp" 
                  alt="Sparkasse Logo" 
                  className="h-full w-full object-contain opacity-50 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="w-16 h-16 rounded-full border-4 border-[var(--bg-main)] bg-zinc-800 overflow-hidden shadow-xl"
                  >
                    <img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="Student" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center md:items-start gap-2"
              >
                <span className="text-[12px] font-black uppercase tracking-widest text-[var(--text-muted)] leading-tight">
                  ПРИКЛУЧИ И СЕ <br />
                  НА
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="bg-[#00599a] text-white px-3 py-1 font-head font-black text-xl md:text-2xl uppercase tracking-tighter rotate-1 shadow-lg">
                    VIBE ON
                  </span>
                  <span className="text-[var(--text-main)] px-3 py-1 font-head font-black text-xl md:text-2xl uppercase tracking-tighter -rotate-1">
                    КЛУБОТ
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
