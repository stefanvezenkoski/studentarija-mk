import { motion } from 'motion/react';
import { 
  Instagram, Heart,
  Zap, Quote, Globe, ShieldCheck,
  Sparkles,
  ArrowDown
} from 'lucide-react';
import GradualBlur from '../components/GradualBlur';
import { cn } from '@/src/lib/utils';

/**
 * [COMMUNICATION STYLE]
 * Optimized for performance. Minimal lag.
 * Colors: White, Black, Yellow (#facc15).
 */

const Section = ({ 
  children, 
  className,
  light = false,
  blurPosition = 'bottom'
}: { 
  children: React.ReactNode; 
  className?: string;
  light?: boolean;
  blurPosition?: 'top' | 'bottom' | 'left' | 'right';
}) => (
  <section className={cn(
    "relative min-h-[70vh] md:min-h-screen overflow-hidden flex flex-col justify-center",
    light ? "bg-[#facc15] text-black" : "bg-black text-[#facc15]",
    className
  )}>
    <div className="max-w-7xl mx-auto w-full z-10 px-6 md:px-12 py-32">
      {children}
    </div>
    
    <GradualBlur
      target="parent"
      position={blurPosition}
      height="10rem"
      strength={2}
      divCount={4}
      curve="bezier"
      exponential={true}
      opacity={1}
    />
  </section>
);

const BigText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn(
    "font-syne font-black text-5xl md:text-[10vw] leading-[0.85] tracking-tighter uppercase mb-12",
    className
  )}>
    {children}
  </h2>
);

export default function AboutUs() {
  return (
    <div className="w-full bg-[#facc15] selection:bg-black selection:text-[#facc15]">
      {/* 1. Hero Section */}
      <Section className="min-h-screen">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 inline-flex items-center gap-3 px-6 py-2 bg-[#facc15] text-black rounded-full font-syne font-bold text-sm uppercase tracking-widest"
          >
            <Sparkles size={18} /> Дигитална Еволуција
          </motion.div>
          
          <BigText className="text-white transform -skew-x-6">
            ПОВЕЌЕ ОД<br />
            <span className="text-[#facc15] italic">ИНСТАГРАМ.</span>
          </BigText>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end mt-16">
            <p className="font-dm text-2xl md:text-5xl font-medium leading-[1.1] tracking-tight text-zinc-300">
              Главниот извор на информации веќе им припаѓа на социјалните мрежи.
            </p>
            <div className="flex justify-center md:justify-end">
              <img 
                src="input_file_2.png" 
                className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-[5rem] border-4 border-[#facc15] shadow-2xl rotate-3" 
                alt="Evolution" 
              />
            </div>
          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[#facc15]"
        >
          <ArrowDown size={40} />
        </motion.div>
      </Section>

      {/* 2. The Story Section - Modern Image Grid */}
      <Section light blurPosition="top">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <BigText className="text-black">
              ОД <span className="text-primary italic">PAINT</span> <br />
              ДО ДЕНЕС.
            </BigText>
            <div className="space-y-8 font-dm text-xl md:text-3xl leading-relaxed text-black/80">
              <p>
                Студентарија обединува речиси <strong>40.000 студенти</strong>. Нашите мемиња се многу значаен, неразделив елемент.
              </p>
              <div className="p-10 bg-black text-[#facc15] rounded-[4rem] border-4 border-white shadow-xl">
                <Quote size={48} className="mb-6 opacity-50" />
                <p className="italic font-bold text-2xl md:text-4xl text-white">
                  „Сѐ започна со меме создадено во Paint.“
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
             <img 
               src="input_file_6.png" 
               className="w-full aspect-square object-cover rounded-[6rem] border-8 border-black shadow-2xl" 
               alt="Origin Story" 
             />
          </div>
        </div>
      </Section>

      {/* 3. Social Media & Habits */}
      <Section className="py-60">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <BigText className="text-white">
            ЗОШТО <br />
            <span className="text-[#facc15] italic">IG STORY?</span>
          </BigText>
          <p className="font-dm text-2xl md:text-5xl font-medium leading-[1.1] mb-20 text-zinc-400">
            Младите сакаат информации <strong>веднаш</strong>. Инстаграм Стори е медиумот за брзо консумирање.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12 border-t border-white/10">
             <div className="flex flex-col items-center gap-6">
                <Zap size={64} className="text-[#facc15]" />
                <span className="font-syne font-black text-xl uppercase italic">Брзина</span>
             </div>
             <div className="flex flex-col items-center gap-6">
                <Globe size={64} className="text-[#facc15]" />
                <span className="font-syne font-black text-xl uppercase italic">Пристап</span>
             </div>
             <div className="flex flex-col items-center gap-6">
                <ShieldCheck size={64} className="text-[#facc15]" />
                <span className="font-syne font-black text-xl uppercase italic">Етика</span>
             </div>
          </div>
        </div>
      </Section>

      {/* 4. Full Width Visual - Optimized */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <img 
          src="input_file_4.png" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" 
          alt="Community Event" 
        />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <BigText className="text-[#facc15] text-center !mb-0 tracking-[-0.05em]">
            ЗАЕДНИЦА <br /> БЕЗ ГРАНИЦИ.
          </BigText>
        </div>
        <GradualBlur position="top" height="15rem" strength={3} />
        <GradualBlur position="bottom" height="15rem" strength={3} />
      </div>

      {/* 5. Team & Media Literacy */}
      <Section light className="py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-12 mb-12">
            <BigText className="text-black">
              МЕДИУМСКА <br />
              <span className="text-primary italic">ПИСМЕНОСТ.</span>
            </BigText>
          </div>
          <div className="lg:col-span-5">
             <img 
               src="input_file_5.png" 
               className="w-full aspect-[3/4] object-cover rounded-[5rem] border-8 border-black shadow-2xl" 
               alt="Our Team" 
             />
          </div>
          <div className="lg:col-span-7 space-y-12">
            <p className="font-dm text-2xl md:text-4xl leading-tight text-black/80">
              Разликувањето на веродостојните извори е вистински предизвик во дигиталната ера. Ние вложуваме во едукација.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-black/5 rounded-[3rem] border-2 border-black/10">
                 <h4 className="font-syne font-black text-2xl mb-4 italic text-black">ФОКУС</h4>
                 <p className="font-dm text-lg">Критичка анализа на секоја информација.</p>
               </div>
               <div className="p-8 bg-black/5 rounded-[3rem] border-2 border-black/10">
                 <h4 className="font-syne font-black text-2xl mb-4 italic text-black">МИСИЈА</h4>
                 <p className="font-dm text-lg">Одговорно ангажирање во дигиталниот свет.</p>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Interaction Gallery - Performance Focused */}
      <section className="bg-black py-40 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-16">
            <img 
              src="input_file_3.png" 
              className="w-full h-[60vh] object-cover rounded-[4rem] border-2 border-white/10" 
              alt="Portrait" 
            />
            <img 
              src="input_file_0.png" 
              className="w-full aspect-square object-cover rounded-[4rem]" 
              alt="App Info" 
            />
          </div>
          <div className="space-y-16 pt-32">
            <img 
              src="input_file_1.png" 
              className="w-full aspect-square object-cover rounded-[4rem] border-4 border-[#facc15]" 
              alt="UI Result" 
            />
            <BigText className="text-white !text-5xl md:!text-8xl">
              ИНСТАНТ <br /> <span className="text-[#facc15]">FEEDBACK.</span>
            </BigText>
          </div>
        </div>
      </section>

      {/* 7. Final Footer Section */}
      <Section className="py-80 text-center flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <img 
            src="input_file_7.png" 
            className="w-full h-full object-cover grayscale" 
            alt="Final Crowd" 
          />
        </div>
        
        <BigText className="text-white italic relative z-10">
          ОДИМЕ <br />
          <span className="text-[#facc15]">ПОНАТАМУ.</span>
        </BigText>
        
        <div className="flex flex-wrap justify-center gap-10 relative z-10">
          <a 
            href="https://instagram.com/studentarijamk" 
            target="_blank"
            className="group px-16 py-8 bg-[#facc15] text-black font-syne font-black text-3xl uppercase rounded-full hover:scale-105 transition-all flex items-center gap-6 shadow-[0_0_80px_rgba(250,204,21,0.4)]"
          >
            СЛЕДИ НЕ <Instagram size={40} />
          </a>
        </div>
        
        <div className="mt-40 flex items-center gap-8 opacity-20 relative z-10 border-t border-white/20 pt-12 w-full max-w-xl justify-center">
           <Heart className="text-white fill-white" />
           <span className="font-dm font-bold text-sm uppercase tracking-[0.6em]">2017 - 2026</span>
        </div>
      </Section>
    </div>
  );
}
