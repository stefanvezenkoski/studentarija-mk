import { Send } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="px-8 py-24 bg-[var(--bg-secondary)] border-t border-[var(--border-main)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="text-left w-full lg:w-1/2">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">NEWSLETTER</span>
          <h2 className="text-4xl md:text-5xl font-head font-black tracking-tighter uppercase mb-6 leading-[1.1] text-[var(--text-main)]">
            Биди информиран <br /> пред сите.
          </h2>
          <p className="text-[var(--text-muted)] text-lg font-medium max-w-md">
            Добивај известувања за нови конкурси за стипендии директно на твојот е-маил.
          </p>
        </div>

        <div className="w-full lg:w-1/2">
          <form className="flex flex-col sm:flex-row gap-0 border border-[var(--border-main)] p-1 rounded-2xl focus-within:border-primary transition-colors overflow-hidden">
            <input 
              type="email" 
              placeholder="Твојот @email.com" 
              className="flex-1 bg-transparent px-8 py-5 outline-none font-bold placeholder:text-[var(--text-muted)]/30 text-[var(--text-main)]"
            />
            <button className="bg-primary text-black px-12 py-5 font-head font-black text-sm uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all shadow-2xl">
              OK
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
