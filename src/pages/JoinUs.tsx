import { motion } from 'motion/react';
import { GraduationCap, Send, User, Instagram, Video, MessageSquare, Camera, Sparkles, Award } from 'lucide-react';
import { useState } from 'react';

export default function JoinUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    handle: '',
    bio: '',
    videoLink: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Благодариме за апликацијата! 🚀');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] overflow-x-hidden pt-20">
      {/* Background Decorative Text */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
        <div className="flex whitespace-nowrap gap-20 text-[20vw] font-head font-black uppercase italic animate-marquee">
          {Array(5).fill("ПРИДРУЖИ СЕ ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
        <div className="flex whitespace-nowrap gap-20 text-[20vw] font-head font-black uppercase italic animate-marquee-reverse mt-20">
          {Array(5).fill("СТУДЕНТАРИЈА ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* Abstract Drawings/Squiggles placeholders using CSS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-30 dark:opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Hand-drawn style lines */}
          <motion.path 
            d="M5,15 Q20,10 35,15 T65,10 T95,15" 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="0.2" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path 
            d="M10,85 Q40,95 70,85 T110,95" 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
          {/* Scribbles */}
          <path d="M80,20 L85,25 M85,20 L80,25" stroke="var(--primary)" strokeWidth="0.3" opacity="0.5" />
          <path d="M15,70 L20,75 M20,70 L15,75" stroke="var(--primary)" strokeWidth="0.3" opacity="0.5" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="0.05" strokeDasharray="1 2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-40">
        {/* Header Section */}
        <header className="mb-24 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center gap-4 mb-12"
          >
            <img 
              src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/studentarija-logo/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdHVkZW50YXJpamEtbG9nby9sb2dvLnBuZyIsImlhdCI6MTc3ODU0NjgxOCwiZXhwIjoxODEwMDgyODE4fQ.ms769xFY_sLK1MyRlDiTmhkUtS5DnXw8mXi2p8-7P-g" 
              alt="Studentarija Logo" 
              className="h-24 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-head font-black uppercase tracking-tighter mb-8 italic leading-[1.1] text-[#facc15]"
          >
            БИДИ НОВОТО <span className="italic">ЛИЦЕ</span> НА <span className="bg-[#facc15] text-black px-4 py-1 inline-block mx-1 not-italic">СТУДЕНТАРИЈА</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold uppercase tracking-tight text-[#666666] dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Бараме <span className="text-[#facc15] italic">амбициозни, креативни и луди</span> луѓе кои сакаат да бидат дел од најголемата студентска заедница.
          </motion.p>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center"
          >
            <img 
              src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/pridruzi-se/IMG_9658-removebg-preview%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcmlkcnV6aS1zZS9JTUdfOTY1OC1yZW1vdmViZy1wcmV2aWV3ICgxKS5wbmciLCJpYXQiOjE3Nzg1NDY0OTYsImV4cCI6MTgxMDA4MjQ5Nn0.Ohq-10R1Ut8oQsDyR7jGVxk2aBvRj8cy0mxYw88-N9w" 
              alt="Studentarija Face Hero"
              className="w-48 md:w-64 object-contain filter drop-shadow-[0_20px_50px_rgba(250,204,21,0.3)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </header>

        <section className="mb-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "ИНСПИРАЦИЈА", text: "Биди дел од платформата која секојдневно ги инспирира студентите." },
            { title: "КРЕАТИВНОСТ", text: "Твоите идеи се добредојдени. Имаме целосна слобода за нови формати." },
            { title: "ЗАБАВА", text: "Студентскиот живот е хаос, а ние сме тука да го документираме." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border-2 border-dashed border-primary/30 rounded-[2rem] hover:border-primary transition-all group"
            >
              <h4 className="text-xl font-head font-black uppercase italic text-primary mb-4 group-hover:scale-110 origin-left transition-transform">{item.title}</h4>
              <p className="text-sm font-bold text-[#666666] dark:text-zinc-400 uppercase tracking-tight leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3rem] shadow-xl relative overflow-hidden group hover:border-primary transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
              
              <div className="mb-8 w-16 h-16 bg-[#facc15] rounded-2xl flex items-center justify-center text-dark group-hover:rotate-12 transition-transform shadow-lg">
                <Camera className="w-8 h-8" />
              </div>

              <h2 className="text-3xl font-head font-black uppercase italic tracking-tight text-[#facc15] mb-6">БАРАМЕ НОВИ ЛИЦА!</h2>
              <ul className="space-y-6">
                {[
                  { icon: <Sparkles className="w-5 h-5" />, text: "Ако си опуштен/а пред камера..." },
                  { icon: <MessageSquare className="w-5 h-5" />, text: "Се чувствуваш креативно и ти е забавно да раскажуваш приказни..." },
                  { icon: <GraduationCap className="w-5 h-5" />, text: "А уживаш во студентскиот хаос..." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg font-bold text-[#666666] dark:text-zinc-300">
                    <div className="mt-1 text-[#facc15]">{item.icon}</div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black border-4 border-[#facc15]/20 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-2xl font-head font-black uppercase italic tracking-tighter text-white mb-4">
                  ОВОЈ Е <span className="text-[#facc15]">ТВОЈОТ МОМЕНТ!</span>
                </h3>
                <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest leading-relaxed">
                  Не чекај, пријави се и стани дел од тимот кој го менува студентскиот живот во Македонија.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#facc15]/10 rounded-full blur-3xl" />
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-main)] p-10 rounded-[3.5rem] shadow-2xl relative"
          >
            <div className="absolute -top-10 -right-6 w-28 h-28 bg-white border-2 border-primary rounded-3xl rotate-12 flex items-center justify-center text-black shadow-2xl z-20 overflow-hidden">
              <img 
                src="https://gvksxgwsocfispsgrwgm.supabase.co/storage/v1/object/sign/studentarija-logo/b0e41917-22be-4cdf-a9d1-7d40376e3b34.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MzdlNjYxZC01YzY3LTRiNDgtODdmMy03YTBlM2QyM2ZiNDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdHVkZW50YXJpamEtbG9nby9iMGU0MTkxNy0yMmJlLTRjZGYtYTlkMS03ZDQwMzc2ZTNiMzQucG5nIiwiaWF0IjoxNzc4NTQ2NjMwLCJleHAiOjE4MTAwODI2MzB9.6Gq-RUFIhRVmaTL8nmNm_2q13DRxWg1gN69O56o0sTs"
                alt="Award Icon"
                className="w-20 h-20 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <h2 className="text-3xl font-head font-black uppercase italic tracking-tight text-[#facc15] mb-10">ПРИЈАВИ СЕ ТУКА</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#666666] ml-2">Име и презиме</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    required
                    type="text"
                    className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-main)] p-4 pl-12 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all"
                    placeholder="Марко Марковски"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#666666] ml-2">Е-маил адреса</label>
                <div className="relative">
                  <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    required
                    type="email"
                    className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-main)] p-4 pl-12 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all"
                    placeholder="marko@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#666666] ml-2">Instagram / TikTok handle</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    required
                    type="text"
                    className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-main)] p-4 pl-12 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all"
                    placeholder="@korisnicko_ime"
                    value={formData.handle}
                    onChange={e => setFormData({...formData, handle: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#666666] ml-2">Линк до твое видео (опционално)</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="url"
                    className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-main)] p-4 pl-12 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all"
                    placeholder="https://tiktok.com/..."
                    value={formData.videoLink}
                    onChange={e => setFormData({...formData, videoLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#666666] ml-2">Зошто сакаш да ни се придружиш?</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-main)] p-4 rounded-2xl font-bold focus:border-primary focus:outline-none transition-all resize-none"
                  placeholder="Допиши нешто за себе..."
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#facc15] text-black p-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                АПЛИЦИРАЈ СЕГА <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer Section Style like Scholarships */}
        <div className="mt-40 bg-zinc-50 dark:bg-zinc-900 border-t-8 border-[#facc15] p-16 rounded-[4rem] relative overflow-hidden border border-black/5 dark:border-white/5 transition-colors">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#facc15]/5 rounded-full blur-[100px] opacity-20" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <h4 className="text-[#facc15] font-black uppercase text-xl tracking-[0.4em] mb-8 italic">Побрзај!</h4>
            <p className="text-black dark:text-white font-bold uppercase tracking-tight max-w-3xl leading-relaxed text-lg opacity-80">
              Бројот на места е ограничен. Ги контактираме само оние кои ќе влезат во потесен круг. Среќно!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
