import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';
import { 
  Search, MapPin, 
  ArrowRight, SearchX, Sparkles, Share2,
  ArrowLeft, Calendar as CalendarIcon,
  Filter, Plus, Edit2, Trash2, X, Upload, Link as LinkIcon, Save
} from 'lucide-react';
import ShareButton from '../components/ui/ShareButton';
import { formatDistanceToNow } from 'date-fns';
import { mk } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../hooks/useAdmin';
import TiptapEditor from '../components/admin/TiptapEditor';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

const NEWS_CATEGORIES = [
  'Домови', 'ЈСП', 'Настани', 'Оброк', 'Останато', 'Пракса', 'Проблеми', 'Стипендии'
];

export default function Posts() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('СИТЕ');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | number | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState(NEWS_CATEGORIES[0]);
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postGallery, setPostGallery] = useState<string[]>([]);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchPosts();

    // Real-time synchronization
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchPosts(); // Refresh list on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPostTitle('');
    setPostExcerpt('');
    setPostContent('');
    setPostCategory(NEWS_CATEGORIES[0]);
    setPostImageUrl('');
    setPostGallery([]);
    setPostFile(null);
    setGalleryFiles([]);
    setShowForm(false);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setPostTitle(post.title || '');
    setPostExcerpt(post.excerpt || '');
    setPostContent(post.content || '');
    setPostCategory(post.category || NEWS_CATEGORIES[0]);
    setPostImageUrl(post.image_url || '');
    setPostGallery(post.gallery || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (postId: string | number) => {
    if (!isAdmin) {
      alert('Грешка: Немате админ привилегии во апликацијата.');
      return;
    }
    setPostIdToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postIdToDelete) return;
    setIsDeleting(true);
    
    console.log('--- ПОЧЕТОК НА БРИШЕЊЕ ---');
    console.log('ID:', postIdToDelete, 'Тип:', typeof postIdToDelete);
    
    try {
      // ОБИД 1: Како што е (ID може да е string или number)
      const { data: del1, error: err1 } = await supabase
        .from('posts')
        .delete()
        .eq('id', postIdToDelete)
        .select();

      if (del1 && del1.length > 0) {
        console.log('Успешно избришано (Обид 1)');
        setPosts(prev => prev.filter(p => p.id !== postIdToDelete));
        setIsDeleteModalOpen(false);
        return;
      }

      // ОБИД 2: Ако е string што личи на број, пробај како број
      if (typeof postIdToDelete === 'string' && !isNaN(Number(postIdToDelete))) {
        console.log('Обид 2: Бришење со конверзија во број...');
        const { data: del2, error: err2 } = await supabase
          .from('posts')
          .delete()
          .eq('id', Number(postIdToDelete))
          .select();

        if (del2 && del2.length > 0) {
          console.log('Успешно избришано (Обид 2)');
          setPosts(prev => prev.filter(p => p.id !== postIdToDelete));
          setIsDeleteModalOpen(false);
          return;
        }
        if (err2) console.error('Error in attempt 2:', err2);
      }

      if (err1) {
        alert(`Грешка од Supabase: ${err1.message}`);
      } else {
        alert(`ГРЕШКА: Објавата не е избришана. 
        
Ова обично значи дека Supabase RLS полисите блокираат "DELETE".
Одете во Supabase SQL Editor и извршете:
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;`);
      }
      
    } catch (err: any) {
      console.error('Crash:', err);
      alert(`Критична грешка: ${err.message}`);
    } finally {
      setIsDeleting(false);
      if (!isDeleteModalOpen) setPostIdToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = postImageUrl;
      if (postFile) {
        const uploaded = await uploadImage(postFile);
        if (uploaded) finalImageUrl = uploaded;
      }

      const uploadedGallery = await Promise.all(
        galleryFiles.map(file => uploadImage(file))
      );
      const newGallery = [...postGallery, ...uploadedGallery.filter(url => url !== null) as string[]];

      const postData = {
        title: postTitle,
        excerpt: postExcerpt,
        content: postContent,
        category: postCategory,
        image_url: finalImageUrl,
        gallery: newGallery,
        published_at: editingId ? undefined : new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postData]);
        if (error) throw error;
      }

      await fetchPosts();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Грешка при зачувување');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['СИТЕ', ...NEWS_CATEGORIES];

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'СИТЕ') {
      result = result.filter(p => p.category?.toUpperCase() === activeCategory.toUpperCase());
    }

    return result;
  }, [searchTerm, activeCategory, posts]);

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Неодамна';
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: mk });
    } catch (e) {
      return 'Неодамна';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <motion.div 
          animate={{ 
            x: [0, 80, 0], 
            y: [0, 40, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 80, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -left-48 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full"
        />
      </div>

      {/* Background Text Marquee */}
      <div className="absolute top-40 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <motion.div
          animate={{ x: [-1200, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="text-[22rem] font-head font-black whitespace-nowrap leading-none"
        >
          ВЕСТИ ЖУРНАЛ INFO ВЕСТИ ЖУРНАЛ INFO ВЕСТИ ЖУРНАЛ INFO
        </motion.div>
      </div>

      {/* Marquee Section */}
      <div className="bg-primary py-4 overflow-hidden whitespace-nowrap border-b border-dark/10 relative z-40 shadow-xl">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 items-center"
        >
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dark">ЧИТАЈ ТУКА</span>
              <Sparkles className="w-4 h-4 text-dark" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dark">СИТЕ ИНФОРМАЦИИ ЗА ТЕБЕ</span>
              <CalendarIcon className="w-4 h-4 text-dark" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Header Section */}
      <section className="relative pt-24 pb-12 overflow-hidden z-30">
        <div className="max-w-7xl mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary transition-colors mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Назад до почетна</span>
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-[3px] bg-primary" />
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Информативен Журнал</span>
              </div>
              <h1 className="text-6xl md:text-[100px] font-head font-black uppercase leading-[0.8] tracking-tighter mb-4 drop-shadow-2xl max-w-min">
                <span className="bg-primary text-dark px-6 py-2 inline-block mb-2">Сите</span>
                <br />
                <span className="bg-primary text-dark px-6 py-2 inline-block">Објави</span>
              </h1>
            </motion.div>

            <div className="flex flex-col gap-6 w-full max-w-xl">
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-primary text-dark py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 border-4 border-dark/10 group"
                >
                  {showForm ? <X className="w-5 h-5 group-hover:rotate-90 transition-transform" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                  {showForm ? 'Затвори панел' : 'Додади нова вест'}
                </motion.button>
              )}
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-2 w-full lg:mb-4"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-4 mb-2 opacity-50">Пребарувај во базата</span>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary transition-colors z-10" />
                  <input 
                    type="text" 
                    placeholder="Наслов или клучни зборови..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border-2 border-[var(--border-main)] rounded-[2.5rem] py-7 pl-16 pr-8 text-sm font-bold focus:outline-none focus:border-primary transition-all shadow-2xl relative z-10 text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="overflow-hidden mt-12"
              >
                <div className="p-1 bg-gradient-to-br from-primary via-primary/20 to-transparent rounded-[3rem]">
                  <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] backdrop-blur-3xl p-10 rounded-[2.9rem] shadow-2xl space-y-10">
                    <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center border border-primary/20">
                          {editingId ? <Edit2 className="w-6 h-6 text-dark" /> : <Plus className="w-6 h-6 text-dark" />}
                        </div>
                        <div>
                          <h2 className="text-2xl font-head font-black uppercase tracking-tight">{editingId ? 'Измени вест' : 'Нова вест'}</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Сите полиња се задолжителни</p>
                        </div>
                      </div>
                      <button type="button" onClick={resetForm} className="p-3 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-main)] hover:bg-red-500 hover:text-white transition-all text-[var(--text-muted)]">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Наслов</label>
                          <input 
                            required 
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-2xl focus:border-primary focus:outline-none text-[#232323] placeholder:text-zinc-400" 
                            value={postTitle} 
                            onChange={e => setPostTitle(e.target.value)} 
                            placeholder="Внеси наслов..." 
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Краток опис (за листа)</label>
                          <textarea 
                            required 
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-bold min-h-[120px] focus:border-primary focus:outline-none text-[#232323] placeholder:text-zinc-400 leading-relaxed" 
                            value={postExcerpt} 
                            onChange={e => setPostExcerpt(e.target.value)} 
                            placeholder="Краток вовед во темата..." 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Категорија</label>
                            <select 
                              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-5 rounded-3xl font-black text-sm uppercase tracking-widest focus:border-primary focus:outline-none text-[#232323] appearance-none cursor-pointer" 
                              value={postCategory} 
                              onChange={e => setPostCategory(e.target.value)}
                            >
                              {NEWS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Главна слика</label>
                            <div className="relative">
                              <input type="file" accept="image/*" onChange={e => setPostFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <div className="w-full bg-[var(--bg-tertiary)] border border-dashed border-[var(--border-main)] p-5 rounded-3xl flex items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all">
                                <Upload className={`w-5 h-5 ${postFile ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                                  {postFile ? postFile.name : 'Избери слика'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Целосна содржина</label>
                          <TiptapEditor content={postContent} onChange={setPostContent} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-6 pt-10 border-t border-[var(--border-main)]">
                      <button type="button" onClick={resetForm} className="px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-[var(--text-muted)] hover:text-white transition-colors">Откажи</button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="bg-primary text-dark px-16 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {editingId ? 'Зачувајмени' : 'Објави вест'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Grid Marquee Divider */}
      <div className="bg-primary py-8 overflow-hidden whitespace-nowrap border-y border-dark/10 relative z-40 my-12 transform -rotate-1 scale-105 shadow-2xl">
        <motion.div 
          animate={{ x: [-1500, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center"
        >
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl font-head font-black uppercase tracking-tighter text-dark hover:scale-110 transition-transform cursor-default">БИДИ ИНФОРМИРАН 24/7</span>
              <Sparkles className="w-8 h-8 text-dark fill-dark animate-pulse" />
              <span className="text-4xl font-head font-black uppercase tracking-tighter text-dark">СТУДЕНТСКИ ЖУРНАЛ 2026</span>
              <div className="w-5 h-5 bg-dark rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>

      <section className="max-w-7xl mx-auto px-8 pb-32 z-30 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 space-y-12"
          >
            {/* Category Filters */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Филтрирај по Категорија</span>
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-left
                      ${activeCategory === cat 
                        ? 'bg-[var(--bg-secondary)] border-primary text-primary shadow-xl ring-1 ring-primary' 
                        : 'bg-[var(--bg-secondary)] border-[var(--border-main)] text-[var(--text-muted)] hover:border-primary'}
                    `}
                  >
                    {cat}
                    {activeCategory === cat && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Stats */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 grayscale opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <Sparkles size={80} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-2">ВКУПНО ОБЈАВИ</span>
              <div className="text-6xl font-head font-black text-primary tracking-tighter">
                {filteredPosts.length}
              </div>
            </div>
          </motion.div>

          {/* Main Content: Posts Grid */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 w-full">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {filteredPosts.map((post, idx) => (
                    <motion.div
                      layout
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-[var(--bg-secondary)] rounded-[3rem] overflow-hidden border border-[var(--border-main)] flex flex-col h-full hover:border-primary/50 transition-all duration-500 hover:shadow-2xl relative"
                    >
                      <Link 
                        to={`/post/${post.id}`}
                        className="block h-full flex flex-col"
                      >
                        <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden m-4 rounded-[2rem]">
                          {post.image_url ? (
                            <img 
                              src={post.image_url} 
                              alt={post.title} 
                              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-20">📰</div>
                          )}
                          <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
                            <span className="bg-primary text-dark px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                              {post.category}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="p-8 md:p-10 pt-2 flex flex-col flex-1">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase">
                              {formatTimeAgo(post.published_at)}
                            </div>
                            {post.city && (
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-main)]/50 px-3 py-1 rounded-full border border-[var(--border-main)]">
                                <MapPin className="w-3 h-3 text-primary" /> {post.city}
                              </div>
                            )}
                          </div>

                          <h2 className="text-xl md:text-2xl font-head font-black tracking-tighter uppercase leading-tight mb-6 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-[var(--text-muted)] text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                            {post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 120) + (post.content && post.content.length > 120 ? '...' : '')}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-6 border-t border-[var(--border-main)]/50">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                              ПРОЧИТАЈ <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </div>
                            <div className="pointer-events-none">
                              <ShareButton 
                                title={post.title} 
                                url={`/post/${post.id}`} 
                                variant="ghost" 
                                className="group-hover:scale-110 transition-transform pointer-events-auto"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Admin Controls - Moved OUTSIDE Link */}
                      {isAdmin && (
                        <div className="absolute top-10 right-10 z-20 flex gap-2">
                          <button 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation(); 
                              handleEdit(post); 
                            }}
                            className="p-3 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-2xl hover:bg-primary hover:text-dark transition-all shadow-xl"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation(); 
                              handleDelete(post.id); 
                            }}
                            className="p-3 bg-black/60 backdrop-blur-md text-red-500 border border-white/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[var(--border-main)] rounded-[4rem] bg-[var(--bg-secondary)]/30 w-full text-center px-8">
                  <SearchX className="w-16 h-16 text-[var(--text-muted)] mb-8 opacity-20" />
                  <h3 className="text-3xl font-head font-black uppercase tracking-tighter mb-4 text-[var(--text-muted)]">Ништо не е пронајдено</h3>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveCategory('СИТЕ'); }}
                    className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:underline"
                  >
                    РЕСЕТИРАЈ ФИЛТРИ
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Bottom Marquee */}
      <div className="bg-primary py-12 overflow-hidden whitespace-nowrap border-t border-dark/10 relative z-40 mt-12">
        <motion.div 
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center"
        >
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl font-head font-black uppercase tracking-tighter text-dark">СИТЕ ИНФОРМАЦИИ НА ЕДНО МЕСТО</span>
              <Sparkles className="w-8 h-8 text-dark fill-dark" />
              <span className="text-4xl font-head font-black uppercase tracking-tighter text-dark">СТУДЕНТСКИ ЖИВОТ 2026</span>
              <div className="w-4 h-4 bg-dark rounded-full" />
            </div>
          ))}
        </motion.div>
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
