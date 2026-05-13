import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, ArrowLeft, Loader2, Edit3, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { mk } from 'date-fns/locale';
import { useAdmin } from '@/src/hooks/useAdmin';
import TiptapEditor from '@/src/components/admin/TiptapEditor';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPage() {
      if (!slug) return;
      setLoading(true);
      
      // Normalize slug: remove leading/trailing slashes
      const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
      
      try {
        // Try to match the slug in various formats to be safe
        const { data: results, error } = await supabase
          .from('custom_pages')
          .select('*')
          .or(`slug.eq.${normalizedSlug},slug.eq./${normalizedSlug},slug.eq.page/${normalizedSlug},slug.eq./page/${normalizedSlug},slug.ilike.${normalizedSlug}`)
          .limit(1);

        if (error || !results || results.length === 0) {
          console.error('Page not found for slug:', normalizedSlug, error);
          setPage(null);
        } else {
          const data = results[0];
          setPage(data);
          setEditContent(data.content || '');
        }
      } catch (err) {
        console.error('Error fetching dynamic page:', err);
        setPage(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  const handleSave = async () => {
    if (!page) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('custom_pages')
        .update({ 
          content: editContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id);

      if (error) throw error;
      
      setPage({ ...page, content: editContent, updated_at: new Date().toISOString() });
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Грешка при зачувување');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] p-8 text-center">
        <h1 className="text-6xl font-head font-black mb-4">404</h1>
        <p className="text-[var(--text-muted)] uppercase tracking-widest font-bold mb-8">Страната не е пронајдена</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-dark px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all"
        >
          НАЗАД КОН ПОЧЕТНА
        </button>
      </div>
    );
  }

  const isHtml = editContent.includes('<') && editContent.includes('>');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-32 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Назад
          </motion.button>

          {isAdmin && !isEditing && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-dark transition-all border border-primary/20"
            >
              <Edit3 className="w-4 h-4" />
              Уреди страна
            </motion.button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-[var(--border-main)] opacity-20" />
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary whitespace-nowrap">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(page.updated_at), 'dd MMMM yyyy', { locale: mk })}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                СТУДЕНТАРИЈА
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-head font-black uppercase leading-[0.9] tracking-tighter mb-12 text-white italic">
            {page.title}
          </h1>

          {page.image_url && !isEditing && (
            <div className="relative aspect-[16/9] mb-16 rounded-[2rem] overflow-hidden border border-[var(--border-main)]">
              <img 
                src={page.image_url} 
                alt={page.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-12 pb-4 border-b border-white/10">
                    <h2 className="text-xl font-head uppercase text-primary italic">Режим на уредување страна</h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditContent(page.content);
                        }}
                        className="px-6 py-2 rounded-full border border-white/10 text-white/50 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                      >
                        Откажи
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 rounded-full bg-primary text-dark hover:scale-105 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        {isSaving ? 'Зачувување...' : <><Save className="w-4 h-4" /> Зачувај промени</>}
                      </button>
                    </div>
                  </div>
                  <TiptapEditor 
                    content={editContent} 
                    onChange={setEditContent} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rich-text-content prose prose-invert prose-p:text-zinc-400 prose-p:text-xl prose-p:leading-relaxed prose-headings:font-head prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-white prose-a:text-primary max-w-none"
                >
                  {isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                  ) : (
                    <ReactMarkdown>{page.content}</ReactMarkdown>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
