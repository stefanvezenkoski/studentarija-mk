import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, Clock, User, Tag, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [faqResults, setFaqResults] = useState<any[]>([]);
  const [eventResults, setEventResults] = useState<any[]>([]);
  const [pageResults, setPageResults] = useState<any[]>([]);
  const [adResults, setAdResults] = useState<any[]>([]);
  const [busResults, setBusResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      
      try {
        const [
          postsResp,
          faqResp,
          eventsResp,
          pagesResp,
          adsResp,
          busResp
        ] = await Promise.all([
          supabase.from('posts').select('*').or(`title.ilike.%${query}%,content.ilike.%${query}%`).limit(10),
          supabase.from('faq').select('*').or(`question.ilike.%${query}%,answer.ilike.%${query}%`).limit(5),
          supabase.from('events').select('*').or(`title.ilike.%${query}%,description.ilike.%${query}%`).limit(10),
          supabase.from('custom_pages').select('*').or(`title.ilike.%${query}%,content.ilike.%${query}%`).limit(5),
          supabase.from('ads').select('*').or(`title.ilike.%${query}%,description.ilike.%${query}%`).limit(5),
          supabase.from('bus_lines').select('*').or(`number.ilike.%${query}%,route.ilike.%${query}%`).limit(5)
        ]);
          
        setResults(postsResp.data || []);
        setFaqResults(faqResp.data || []);
        setEventResults(eventsResp.data || []);
        setPageResults(pagesResp.data || []);
        setAdResults(adsResp.data || []);
        setBusResults(busResp.data || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResults();
  }, [query]);

  const hasAnyResults = results.length > 0 || 
                       faqResults.length > 0 || 
                       eventResults.length > 0 || 
                       pageResults.length > 0 || 
                       adResults.length > 0 || 
                       busResults.length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6 opacity-40">
            <SearchIcon className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.4em]">Резултати од пребарување</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-syne font-black text-[var(--text-main)] italic tracking-tighter uppercase leading-none">
            Пребарување за: <span className="text-primary">"{query}"</span>
          </h1>
        </header>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-[var(--bg-secondary)] rounded-[2.5rem] animate-pulse border border-[var(--border-main)]" />
            ))}
          </div>
        ) : hasAnyResults ? (
          <div className="space-y-20">
            {/* Posts */}
            {results.length > 0 && (
              <div className="grid gap-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-60">Објави ({results.length})</h2>
                {results.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      to={`/post/${post.id}`}
                      className="group block p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary transition-all shadow-xl shadow-black/5"
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                             <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                               {post.category || 'Објава'}
                             </span>
                           </div>
                           <h3 className="text-2xl md:text-3xl font-syne font-black text-[var(--text-main)] group-hover:text-primary transition-colors leading-tight uppercase italic tracking-tighter">
                             {post.title}
                           </h3>
                        </div>
                        <div className="w-16 h-16 rounded-[2rem] bg-[var(--bg-tertiary)] flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                          <ArrowRight className="w-8 h-8" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Events */}
            {eventResults.length > 0 && (
              <div className="grid gap-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-60">Настани ({eventResults.length})</h2>
                {eventResults.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a 
                      href={event.ticket_link || '/events'}
                      target={event.ticket_link ? "_blank" : "_self"}
                      className="group block p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary transition-all shadow-xl shadow-black/5"
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                             <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                               {event.category || 'Настан'}
                             </span>
                             <span className="text-xs font-bold text-[var(--text-muted)] uppercase">{event.city}</span>
                           </div>
                           <h3 className="text-2xl md:text-3xl font-syne font-black text-[var(--text-main)] group-hover:text-primary transition-colors leading-tight uppercase italic tracking-tighter">
                             {event.title}
                           </h3>
                        </div>
                        <div className="w-16 h-16 rounded-[2rem] bg-[var(--bg-tertiary)] flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                          <Tag className="w-8 h-8" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Ads / Oglasi */}
            {adResults.length > 0 && (
              <div className="grid gap-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-60">Огласи ({adResults.length})</h2>
                {adResults.map((ad, i) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      to="/oglasi"
                      className="group block p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary transition-all shadow-xl shadow-black/5"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <Tag className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-tight">
                            {ad.title}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{ad.price} • {ad.location}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Bus Lines / JSP */}
            {busResults.length > 0 && (
              <div className="grid gap-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-60">ЈСП Линии ({busResults.length})</h2>
                {busResults.map((bus, i) => (
                  <motion.div
                    key={bus.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      to="/jsp"
                      className="group block p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary transition-all shadow-xl shadow-black/5"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center font-head font-black italic text-xl">
                          {bus.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-tight">
                            {bus.route}
                          </h3>
                        </div>
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Custom Pages */}
            {pageResults.length > 0 && (
              <div className="grid gap-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-60">Страници ({pageResults.length})</h2>
                {pageResults.map((page, i) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      to={`/${page.slug}`}
                      className="group block p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary transition-all shadow-xl shadow-black/5"
                    >
                      <div className="flex items-center gap-8">
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter">
                            {page.title}
                          </h3>
                        </div>
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* FAQ */}
            {faqResults.length > 0 && (
              <div className="grid gap-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 opacity-60">Прашања и одговори ({faqResults.length})</h2>
                {faqResults.map((faq, i) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (results.length + i) * 0.1 }}
                  >
                    <Link 
                      to="/faq"
                      className="group block p-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[3rem] hover:border-primary transition-all shadow-xl shadow-black/5"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-syne font-black text-[var(--text-main)] uppercase italic tracking-tighter">
                            {faq.question}
                          </h3>
                        </div>
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center space-y-8 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[4rem]">
             <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-10">
                <SearchIcon className="w-12 h-12 text-[var(--text-muted)] opacity-20" />
             </div>
             <p className="text-2xl font-syne font-black text-[var(--text-main)] uppercase tracking-tighter">Нема резултати за ова пребарување</p>
             <button 
               onClick={() => window.history.back()}
               className="px-10 py-5 bg-primary text-black font-syne font-black uppercase rounded-[2rem] tracking-widest hover:scale-105 active:scale-95 transition-all"
             >
               Оди назад
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
