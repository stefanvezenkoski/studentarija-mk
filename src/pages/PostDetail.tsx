import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';
import { 
  ArrowLeft, Clock, Eye, MapPin, 
  ChevronLeft, ChevronRight, Calendar, Edit3, Trash2, X, Save
} from 'lucide-react';
import ShareButton from '../components/ui/ShareButton';
import { formatDistanceToNow } from 'date-fns';
import { mk } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../hooks/useAdmin';
import TiptapEditor from '../components/admin/TiptapEditor';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAdmin();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

  const hasIncremented = useRef(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      if (!hasIncremented.current) {
        incrementViews();
        hasIncremented.current = true;
      }

      // Real-time synchronization for this specific post
      const channel = supabase
        .channel(`post-${id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'posts', filter: `id=eq.${id}` },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              navigate('/posts');
            } else {
              fetchPost();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
      setEditContent(data.content || '');
    } catch (err: any) {
      console.error('Error fetching post:', err.message);
      setError('Објавата не е пронајдена');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    if (!id) return;
    try {
      // Using the RPC function we planned in SQL
      await supabase.rpc('increment_views', { post_id: id });
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  const handleSave = async () => {
    if (!post) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          content: editContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;
      
      setPost({ ...post, content: editContent, updated_at: new Date().toISOString() });
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Грешка при зачувување');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!post) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!post) return;
    setIsDeleting(true);
    
    console.log('--- ПОЧЕТОК НА БРИШЕЊЕ (PostDetail) ---');
    console.log('ID:', post.id, 'Тип:', typeof post.id);
    
    if (!isAdmin) {
      alert('Грешка: Немате админ привилегии.');
      return;
    }
    
    try {
      // Обид 1: Како што е
      const { data: del1, error: err1 } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .select();

      if (del1 && del1.length > 0) {
        setIsDeleteModalOpen(false);
        navigate('/posts');
        return;
      }

      // Обид 2: Како број
      if (typeof post.id === 'string' && !isNaN(Number(post.id))) {
        const { data: del2 } = await supabase
          .from('posts')
          .delete()
          .eq('id', Number(post.id))
          .select();

        if (del2 && del2.length > 0) {
          setIsDeleteModalOpen(false);
          navigate('/posts');
          return;
        }
      }

      if (err1) {
        alert(`Supabase Грешка: ${err1.message}`);
      } else {
        alert(`БЛОКАДА: Објавата постои, но Supabase сепак блокира бришење преку RLS! 
        
Одете во SQL Editor и извршете: 
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;`);
      }
      
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(`Критична грешка: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: mk });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-4xl font-head font-black text-white mb-4 uppercase tracking-tighter">{error || 'Грешка'}</h2>
        <Link to="/" className="text-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Назад на почетна
        </Link>
      </div>
    );
  }

  const gallery = [post.image_url, ...(post.gallery || [])].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-dark text-white pb-32">
      {/* Header / Navigation Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-12 h-12 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center group hover:border-primary transition-all overflow-hidden"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="pointer-events-auto">
          <ShareButton 
            title={post.title} 
            url={window.location.pathname} 
            variant="circular" 
            className="w-12 h-12"
          />
        </div>
      </div>

      {isAdmin && !isEditing && (
        <div className="fixed bottom-10 right-10 z-[60] flex flex-col gap-4">
          <motion.button 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="w-16 h-16 bg-red-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 transition-all border-4 border-dark overflow-hidden"
          >
            <Trash2 className="w-6 h-6" />
          </motion.button>
          <motion.button 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="w-16 h-16 bg-primary text-dark rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:shadow-primary/60 transition-all border-4 border-dark overflow-hidden"
          >
            <Edit3 className="w-6 h-6" />
          </motion.button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Image/Gallery Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900 group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={gallery[activeImage]} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-dark"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-dark"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-primary scale-105' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content Section */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="sticky top-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary px-4 py-1 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-dark">{post.category}</span>
                </div>
                {post.city && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    <MapPin className="w-3 h-3 text-primary" /> {post.city}
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-head font-black tracking-tighter uppercase leading-[0.9] text-[var(--text-main)] mb-8">
                {post.title}
              </h1>

              <div className="flex items-center gap-8 py-8 mb-12 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Објавено</div>
                    <div className="text-xs font-bold">{formatDate(post.published_at || post.created_at)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Прегледи</div>
                    <div className="text-xs font-bold">{post.views || 0}</div>
                  </div>
                </div>
              </div>

              {post.excerpt && (
                <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium leading-relaxed italic mb-12 border-l-4 border-primary pl-8">
                  {post.excerpt}
                </p>
              )}

              {post.registration_link && (
                <a 
                  href={post.registration_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-dark font-head font-black text-center py-6 rounded-3xl uppercase tracking-widest text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 block mb-8"
                >
                  Пријави се сеа
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Content Section */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <h2 className="text-xl font-head uppercase text-primary">Режим на уредување</h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditContent(post.content);
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
                        {isSaving ? 'Зачувување...' : <><Save className="w-4 h-4" /> Зачувај</>}
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
                >
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-12 text-center">Детали</h3>
                  <div className="rich-text-content prose prose-invert prose-p:text-xl prose-p:leading-relaxed prose-p:font-medium prose-p:text-zinc-300 prose-headings:font-head prose-headings:uppercase prose-headings:tracking-tighter max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.content || 'Оваа објава нема детална содржина.' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
