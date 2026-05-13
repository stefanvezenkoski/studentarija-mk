import { motion, useScroll, useTransform } from 'motion/react';
import { Clock, Eye, ChevronRight, ArrowRight, Share2 } from 'lucide-react';
import type { Post } from '@/src/types';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ShareButton from '@/src/components/ui/ShareButton';
import { formatDistanceToNow } from 'date-fns';
import { mk } from 'date-fns/locale';

interface Props {
  posts: Post[];
}

export default function LatestNews({ posts }: Props) {
  const newsItems = posts.slice(0, 6);
  
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Пред некое време';
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: mk });
    } catch (e) {
      return 'Неодамна';
    }
  };
  
  return (
    <section className="bg-dark border-y border-white/5 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-24 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-10 bg-primary" />
              <div className="bg-primary px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">АКТУЕЛНО</span>
              </div>
            </div>

            {/* Title Stack */}
            <div className="relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 'auto' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="bg-primary p-4 md:p-8 pr-12 md:pr-20 overflow-hidden inline-block shadow-[0_20px_60px_rgba(250,204,21,0.2)]"
              >
                <h2 className="text-4xl xs:text-5xl md:text-[clamp(4rem,10vw,120px)] font-head font-black tracking-[-0.05em] uppercase leading-none text-black whitespace-nowrap">
                  ПОСЛЕДНИ
                </h2>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl xs:text-6xl md:text-[clamp(5rem,12vw,140px)] font-head font-black tracking-[-0.02em] uppercase leading-none text-[var(--text-main)] italic -mt-4 md:-mt-12 ml-4 md:ml-12 drop-shadow-2xl relative z-10"
              >
                ВЕСТИ
              </motion.h2>
            </div>
          </motion.div>
          
          <Link 
            to="/posts"
            className="group flex flex-col items-start gap-1 bg-[var(--bg-secondary)] border border-[var(--border-main)] px-10 py-8 rounded-[2.5rem] font-head font-black text-[12px] uppercase tracking-widest transition-all shadow-xl hover:bg-primary hover:text-black hover:border-primary md:mb-12 text-[var(--text-main)]"
          >
            <div className="flex items-center gap-3">
              <span>ВИДИ ГИ</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
            <span>СИТЕ</span>
          </Link>
        </div>
      </div>
      
      {/* Infinite Carousel */}
      <div className="relative flex overflow-hidden group">
        <motion.div 
          className="flex gap-10 shrink-0 min-w-full px-5"
          animate={{ x: '-100%' }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {[...newsItems, ...newsItems].map((post, i) => (
            <Link 
              to={`/post/${post.id}`}
              key={`${post.id}-${i}`}
              className="w-[280px] xs:w-[320px] md:w-[500px] bg-[var(--bg-secondary)] rounded-[3rem] overflow-hidden border border-[var(--border-main)] flex flex-col group/card hover:border-primary transition-all duration-500 hover:shadow-[0_45px_100px_-20px_rgba(250,204,21,0.2)] hover:-translate-y-2 relative"
            >
              {/* Card Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 group-hover/card:bg-primary/20 transition-colors" />
              
              <div className="h-[240px] md:h-[400px] bg-zinc-900 relative overflow-hidden m-4 rounded-[2.5rem]">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-20">{i % 2 === 0 ? '📰' : '🗞️'}</div>
                )}
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-primary text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {post.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity pointer-events-none" />
              </div>
              
              <div className="p-10 md:p-12 pt-4 flex flex-col flex-1 relative">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3 text-[9px] font-black tracking-[0.2em] text-[var(--text-muted)] uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#facc15]" />
                    {formatTimeAgo(post.published_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest bg-[var(--hover-bg)] px-3 py-1.5 rounded-full border border-[var(--border-main)]">
                      <Eye className="w-3.5 h-3.5 text-primary" /> {post.views || 0}
                    </div>
                    <ShareButton 
                      title={post.title} 
                      url={`/post/${post.id}`} 
                      variant="ghost"
                    />
                  </div>
                </div>
                
                <h4 className="font-head font-black text-xl md:text-2xl leading-[1.2] text-[var(--text-main)] group-hover/card:text-primary transition-colors tracking-tight uppercase mb-4 decoration-primary/30 decoration-4 underline-offset-[10px] group-hover/card:underline">
                  {post.title}
                </h4>
                
                <p className="text-[var(--text-muted)] text-[12px] md:text-[14px] font-medium leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] group-hover/card:text-primary transition-all">
                    ЧИТАЈ <ArrowRight className="w-4 h-4 group-hover/card:translate-x-2 transition-transform" />
                  </div>
                  
                  {/* Visual flourish for the "powerful" feel */}
                  <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    {[1,2,3].map(dot => (
                      <div key={dot} className="w-1 h-1 rounded-full bg-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
        
        {/* Same duplicate for seamless loop */}
        <motion.div 
          className="flex gap-10 shrink-0 min-w-full px-5"
          animate={{ x: '-100%' }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {[...newsItems, ...newsItems].map((post, i) => (
            <Link 
              to={`/post/${post.id}`}
              key={`dup-${post.id}-${i}`}
              className="w-[280px] xs:w-[320px] md:w-[500px] bg-[var(--bg-secondary)] rounded-[3rem] overflow-hidden border border-[var(--border-main)] flex flex-col group/card hover:border-primary transition-all duration-500 hover:shadow-[0_45px_100px_-20px_rgba(250,204,21,0.2)] hover:-translate-y-2 relative"
            >
              {/* Card Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 group-hover/card:bg-primary/20 transition-colors" />

              <div className="h-[240px] md:h-[400px] bg-zinc-900 relative overflow-hidden m-4 rounded-[2.5rem]">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-20">{i % 2 === 0 ? '📰' : '🗞️'}</div>
                )}
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-primary text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {post.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity pointer-events-none" />
              </div>
              <div className="p-10 md:p-12 pt-4 flex flex-col flex-1 relative">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3 text-[9px] font-black tracking-[0.2em] text-[var(--text-muted)] uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#facc15]" />
                    {formatTimeAgo(post.published_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest bg-[var(--hover-bg)] px-3 py-1.5 rounded-full border border-[var(--border-main)]">
                      <Eye className="w-3.5 h-3.5 text-primary" /> {post.views || 0}
                    </div>
                    <ShareButton 
                      title={post.title} 
                      url={`/post/${post.id}`} 
                      variant="ghost"
                    />
                  </div>
                </div>
                <h4 className="font-head font-black text-xl md:text-2xl leading-[1.2] text-[var(--text-main)] group-hover/card:text-primary transition-colors tracking-tight uppercase mb-4 decoration-primary/30 decoration-4 underline-offset-[10px] group-hover/card:underline">
                  {post.title}
                </h4>
                <p className="text-[var(--text-muted)] text-[12px] md:text-[14px] font-medium leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] group-hover/card:text-primary transition-all">
                    ЧИТАЈ <ArrowRight className="w-4 h-4 group-hover/card:translate-x-2 transition-transform" />
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    {[1,2,3].map(dot => (
                      <div key={dot} className="w-1 h-1 rounded-full bg-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Decorative Guide */}
      <div className="max-w-7xl mx-auto px-8 mt-24 flex items-center gap-8">
        <div className="h-[1px] bg-[var(--border-main)] flex-1" />
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.8em] bg-[var(--bg-secondary)] px-8 py-3 rounded-full border border-[var(--border-main)]">ИНФОРМАТИВЕН СТУДЕНТСКИ СЕРВИС</span>
        <div className="h-[1px] bg-[var(--border-main)] flex-1" />
      </div>
    </section>
  );
}
