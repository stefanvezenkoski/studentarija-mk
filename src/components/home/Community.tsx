import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Instagram, Music, Facebook, Linkedin } from 'lucide-react';

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (!hasAnimated) {
          animate(count, value, { duration, ease: "easeOut" });
          setHasAnimated(true);
        }
      }}
    >
      {rounded}
    </motion.span>
  );
}

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/studentarijamk/',
    icon: Instagram,
    color: 'hover:bg-[#E1306C]',
    brandColor: '#E1306C'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@studentarijamk',
    icon: Music,
    color: 'hover:bg-black',
    brandColor: '#000000'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/studentarijamk',
    icon: Facebook,
    color: 'hover:bg-[#1877F2]',
    brandColor: '#1877F2'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/studentarijamk/posts/?feedView=all',
    icon: Linkedin,
    color: 'hover:bg-[#0A66C2]',
    brandColor: '#0A66C2'
  }
];

export default function Community() {
  return (
    <section className="py-16 px-8 bg-[var(--bg-main)] relative overflow-hidden text-center selection:bg-primary selection:text-black">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 selection:bg-primary selection:text-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4 block">
            ПРИДРУЖИ СЕ НА
          </span>
          <h2 className="text-[clamp(2rem,8vw,4.5rem)] font-head font-black tracking-[-0.04em] uppercase leading-tight text-[var(--text-main)] italic">
            <span className="bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">ЗАЕДНИЦАТА</span>
          </h2>
          <div className="mt-12 flex flex-col items-center">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-6">
              НАЈГОЛЕМАТА СТУДЕНТСКА МРЕЖА НА <span className="text-[#E1306C] font-black italic">INSTAGRAM</span>
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <motion.div 
                initial={{ rotate: 0, y: 0 }}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [-2, -1, -2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div 
                  className="absolute inset-0 bg-primary shadow-[0_10px_40px_rgba(250,204,21,0.3)] -rotate-2"
                />
                <span className="relative z-10 block text-dark font-head font-black text-[clamp(3.5rem,15vw,8rem)] px-8 py-3 tracking-tighter">
                  <Counter value={60000} />+
                </span>
              </motion.div>
              
              <h3 className="text-[clamp(3rem,12vw,6rem)] font-head font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">
                СТУДЕНТИ
              </h3>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-primary font-black uppercase tracking-[0.6em] text-[12px] mt-8"
            >
              ВО МАКЕДОНИЈА
            </motion.p>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {socialLinks.map((social, idx) => (
            <motion.a
              key={social.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-main)] py-4 px-8 rounded-2xl text-[var(--text-main)] transition-all shadow-xl group ${social.color}`}
            >
              <div className="p-2 rounded-lg bg-[var(--bg-tertiary)] group-hover:bg-white/20 group-hover:text-white">
                <social.icon className="w-5 h-5" />
              </div>
              <span className="font-head font-black text-sm uppercase tracking-wider">
                {social.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
