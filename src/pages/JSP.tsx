import { motion } from 'motion/react';
import { Bus, Clock, Map as MapIcon, Info, FileText, Phone, MapPin, Smartphone, Apple } from 'lucide-react';
import BusStopMap from '../components/jsp/BusStopMap';

export default function JSP() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] overflow-x-hidden relative">
      {/* Background Marquee */}
      <div className="absolute top-40 left-0 w-full pointer-events-none pointer-events-none overflow-hidden select-none z-0">
        <motion.div
          animate={{ x: [-1000, 0] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 text-[20vw] font-head font-black uppercase italic text-primary opacity-[0.08]"
        >
          {Array(5).fill("ЈАВЕН ПРЕВОЗ ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
        {/* Header Section */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
              <Bus className="w-4 h-4" /> ЈСП СКОПЈЕ
            </div>
            <h1 className="text-6xl md:text-8xl font-head font-black uppercase tracking-tighter mb-8 italic leading-[0.9] text-[var(--text-main)]">
              ЈАВЕН <span className="text-primary">ПРЕВОЗ.</span>
            </h1>
            <div className="flex flex-col gap-4 mb-8">
              <p className="text-xl font-bold uppercase tracking-tight text-[var(--text-muted)] max-w-xl leading-relaxed">
                Сè што треба да знаете за <span className="text-primary italic">БЕСПЛАТЕН</span> ЈАВЕН ПРЕВОЗ за студенти во Скопје.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <a 
                  href="https://skopjebus.mk/mk/linii/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-dark px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                >
                  <MapIcon className="w-4 h-4" /> Возен ред & Линии
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.jsp.raspored.neoficijalno.app&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-main)] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all shadow-xl"
                >
                  <Smartphone className="w-4 h-4 text-primary" /> Android App
                </a>
                <a 
                  href="https://apps.apple.com/in/app/%D1%98%D1%81%D0%BF-%D1%80%D0%B0%D1%81%D0%BF%D0%BE%D1%80%D0%B5%D0%B4/id1599947408" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-main)] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all shadow-xl"
                >
                  <Apple className="w-4 h-4 text-primary" /> iOS App
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full" />
            <img 
              src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/jsp-pictures/IMG_9591-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJqc3AtcGljdHVyZXMvSU1HXzk1OTEtcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3Nzg1MDgzOTcsImV4cCI6MTgxMDA0NDM5N30.BFoZ64Nh_AOP21_Lmf5floZPCyiDlryoXPRgIaaraik" 
              alt="JSP Bus"
              className="relative z-10 w-full transform -rotate-3 hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
            />
          </motion.div>
        </header>

        {/* Top Notice Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-primary/10 border-2 border-primary/30 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative z-10 flex gap-6 items-center">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-dark shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-lg font-black uppercase tracking-tighter italic text-[var(--text-main)] leading-tight">
                На бруцошите што ќе извадат билет сега, истиот им важи до крајот на <span className="text-primary italic text-xl">2026</span> година!
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-y-16 translate-x-16" />
            <div className="relative z-10 flex gap-6 items-center">
              <div className="w-12 h-12 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl flex items-center justify-center text-primary shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-tight text-[var(--text-muted)] leading-relaxed">
                Студентскиот годишен билет за бесплатен превоз важи за неограничен број возења за сите линии (градски и приградски), но <span className="text-primary font-black italic">НЕ И ЗА ПРЕВОЗ ВО НОЌНА ТАРИФА.</span>
              </p>
            </div>
          </motion.div>
        </section>

        {/* Free Transport Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3rem] relative group hover:border-primary transition-all shadow-xl"
          >
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:rotate-12 transition-transform shadow-lg">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-head font-black uppercase mb-6 italic tracking-tight text-[var(--text-main)]">Право на билет</h3>
            <p className="text-[var(--text-muted)] font-medium leading-relaxed">
              Право на студентски годишен билет имаат сите <span className="text-primary font-bold">редовни студенти</span> на некој од државните факултети во Скопје на додипломски студии, без ограничување на возраста.
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3rem] relative group hover:border-primary transition-all shadow-xl"
          >
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:rotate-12 transition-transform shadow-lg">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-head font-black uppercase mb-6 italic tracking-tight text-[var(--text-main)]">Потребни документи</h3>
            <ul className="space-y-4 text-[var(--text-muted)] font-medium">
              <li className="flex gap-3"><span className="text-primary font-black">•</span> Потврда за редовен студент (не постара од еден месец)</li>
              <li className="flex gap-3"><span className="text-primary font-black">•</span> Оригинал индекс и лична карта на увид</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <div className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] h-full p-10 rounded-[3rem] relative overflow-hidden shadow-xl hover:border-primary transition-all">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-20" />
               <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-dark mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                 <Phone className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-head font-black uppercase mb-6 italic tracking-tight text-[var(--text-main)]">Контакт</h3>
               <p className="text-[var(--text-muted)] font-medium mb-8 leading-relaxed">
                 За дополнителни информации, можете да се обратите во ЈСП Скопје.
               </p>
               <div className="text-3xl font-head font-black text-primary tracking-tighter italic">02-3171-881</div>
            </div>
          </motion.div>
        </section>

        {/* Map Section */}
        <section className="mb-40">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
             <div className="max-w-2xl">
               <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">
                 <MapPin className="w-4 h-4" /> Билетари и центри
               </div>
               <h2 className="text-4xl md:text-6xl font-head font-black uppercase tracking-tighter italic leading-none text-[var(--text-main)] mb-6">
                 ЛОКАЦИИ НА <span className="text-primary">ЈСП СКОПЈЕ.</span>
               </h2>
               <p className="text-lg font-bold text-[var(--text-muted)] uppercase tracking-tight">
                 Процедурата за обезбедување на билет може да се врши во некој од центрите на ЈСП Скопје.
               </p>
             </div>
             <div className="relative group">
               <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <img 
                 src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/jsp-pictures/Screenshot_2026-05-11_at_16.00.01-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJqc3AtcGljdHVyZXMvU2NyZWVuc2hvdF8yMDI2LTA1LTExX2F0XzE2LjAwLjAxLXJlbW92ZWJnLXByZXZpZXcucG5nIiwiaWF0IjoxNzc4NTA4NDA2LCJleHAiOjE4MTAwNDQ0MDZ9.bARdjLwcKFinSsDjaW_EvuXBwhE2owEiwaqF2Kj2Xss"
                 alt="Bus Stop"
                 className="w-80 md:w-[450px] transform hover:scale-110 transition-all duration-500 drop-shadow-2xl relative z-10"
               />
             </div>
           </div>
           
           <BusStopMap />
        </section>



      </div>
    </div>
  );
}

