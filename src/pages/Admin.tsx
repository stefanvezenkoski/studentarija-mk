import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Save, Plus, Trash2, X, ChevronRight, LayoutDashboard, 
  ArrowLeft, LogIn, Edit2, Clock, CheckCircle2, Upload, Zap,
  Image as ImageIcon, Link as LinkIcon, Copy, Quote, GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TiptapEditor from '../components/admin/TiptapEditor';

interface Category {
  id: string;
  name: string;
  emoji: string;
  default_color: string;
}

interface Notification {
  id: string;
  category_id: string;
  title: string;
  message: string;
  text_color?: string;
  custom_emoji?: string;
  expires_at?: string;
  created_at: string;
}

const mkToEn: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ѓ': 'gj', 'е': 'e', 'ж': 'zh', 'з': 'z', 'ѕ': 'dz', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ќ': 'kj', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'џ': 'dzh', 'ш': 'sh'
};

const internalPaths = ['/', '/admin', '/posts', '/events', '/partners', '/oglasi', '/jsp', '/about-us', '/faq', '/search', '/stipendii', '/join-us', '/brucosi', '/aplikacija-obrok', '/studentski-domovi', '/studentski-obrok', '/upisi-2025-26', '/upisi-2026-27', '/prodolzuvanje-stipendii'];

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .split('')
    .map(c => mkToEn[c] || c)
    .join('')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
};

export default function AdminPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [dbCities, setDbCities] = useState<any[]>([]);
  const [dbEventCategories, setDbEventCategories] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [dailyMessages, setDailyMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'posts' | 'events' | 'hero' | 'daily-messages' | 'navigation' | 'pages' | 'settings'>('posts');
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [navName, setNavName] = useState('');
  const [navHref, setNavHref] = useState('');
  const [navDesc, setNavDesc] = useState('');
  const [navCategory, setNavCategory] = useState<'aktuelno' | 'main'>('aktuelno');
  const [navOrder, setNavOrder] = useState('0');
  const [createPageForLink, setCreatePageForLink] = useState(false);
  
  // Custom Pages State
  const [customPages, setCustomPages] = useState<any[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageImageUrl, setPageImageUrl] = useState('');
  const [pageIsPublished, setPageIsPublished] = useState(true);
  const [pageFile, setPageFile] = useState<File | null>(null);
  const [addToNav, setAddToNav] = useState(false);

  const [loading, setLoading] = useState(false);

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventPrice, setEventPrice] = useState('Бесплатно');
  const [eventIsFeatured, setEventIsFeatured] = useState(false);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventTicketLink, setEventTicketLink] = useState('');
  const [eventFile, setEventFile] = useState<File | null>(null);
  
  // Notification Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [emoji, setEmoji] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Daily Message Form State
  const [msgContent, setMsgContent] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [msgActive, setMsgActive] = useState(true);

  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'news' | 'event' | 'job' | 'opportunity'>('news');
  const [postCategory, setPostCategory] = useState('');
  const [postCity, setPostCity] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postGallery, setPostGallery] = useState<string[]>([]);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [postBadge, setPostBadge] = useState<any>('');
  const [postRegistrationLink, setPostRegistrationLink] = useState('');

  // Hero Slide Form State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroLinkUrl, setHeroLinkUrl] = useState('');
  const [heroOrder, setHeroOrder] = useState('0');
  const [heroActive, setHeroActive] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // Settings State
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id, u.email);
      else {
        setIsAdmin(false);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id, u.email);
      else {
        setIsAdmin(false);
        setAuthLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId: string, userEmail?: string) {
    setAuthLoading(true);
    try {
      if (userEmail === 'stefan.vezenkoski@finki.ukim.mk') {
        setIsAdmin(true);
        return;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setIsAdmin(!!data && !error);
    } catch (err) {
      setIsAdmin(false);
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchData() {
    try {
      const [catsRes, notesRes, postsRes, eventsRes, heroRes, dailyRes, settingsRes, dbCitiesRes, dbEventCatsRes, navRes, pagesRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('start_date', { ascending: true }),
        supabase.from('hero_slides').select('*').order('order_index', { ascending: true }),
        supabase.from('daily_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('app_settings').select('*').eq('key', 'site_config').single(),
        supabase.from('cities').select('*').order('name'),
        supabase.from('event_categories').select('*').order('name'),
        supabase.from('navigation_links').select('*').order('order_index', { ascending: true }),
        supabase.from('custom_pages').select('*').order('title', { ascending: true })
      ]);
      
      if (catsRes.data) setCategories(catsRes.data);
      if (navRes.data) setNavLinks(navRes.data);
      if (pagesRes.data) setCustomPages(pagesRes.data);
      if (dbCitiesRes.data && dbCitiesRes.data.length > 0) {
        setDbCities(dbCitiesRes.data);
        if (!eventCity) setEventCity(dbCitiesRes.data[0].name);
      }
      if (dbEventCatsRes.data && dbEventCatsRes.data.length > 0) {
        setDbEventCategories(dbEventCatsRes.data);
        if (!eventCategory) setEventCategory(dbEventCatsRes.data[0].name);
      }
      if (notesRes.data) setNotifications(notesRes.data as Notification[]);
      if (postsRes.data) setPosts(postsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (heroRes.data) setHeroSlides(heroRes.data);
      if (dailyRes.data) setDailyMessages(dailyRes.data);
      if (settingsRes.data) {
        setLogoUrl(settingsRes.data.value?.logo_url || '');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  useEffect(() => {
    if (isAdmin === true) {
      fetchData();
    } else if (isAdmin === false && user) {
      navigate('/');
    }
  }, [isAdmin, user, navigate]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (activeTab === 'navigation') {
      const sourceId = source.droppableId;
      const destId = destination.droppableId;
      
      const sourceItems = navLinks.filter(l => l.category === sourceId).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      const destItems = navLinks.filter(l => l.category === destId).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      
      // Moving within columns or between columns
      const movingItem = sourceItems[source.index];
      
      if (sourceId === destId) {
        // Just reordering within same category
        const updatedSourceItems = Array.from(sourceItems);
        const [reorderedItem] = updatedSourceItems.splice(source.index, 1);
        updatedSourceItems.splice(destination.index, 0, reorderedItem);
        
        // Update all order_index in the local state objects too
        const updatedWithIndices = updatedSourceItems.map((item, index) => ({
          ...item,
          order_index: index
        }));

        // Update state
        setNavLinks(prev => {
          const others = prev.filter(l => l.category !== sourceId);
          return [...others, ...updatedWithIndices];
        });

        // Update all order_index in DB for this category
        const updates = updatedWithIndices.map((item) => 
          supabase.from('navigation_links').update({ order_index: item.order_index }).eq('id', item.id)
        );
        await Promise.all(updates);
      } else {
        // Moving between categories
        const updatedSourceItems = Array.from(sourceItems);
        const updatedDestItems = Array.from(destItems);
        const [movedItem] = updatedSourceItems.splice(source.index, 1);
        
        // Update category and indices
        movedItem.category = destId;
        updatedDestItems.splice(destination.index, 0, movedItem);
        
        const sourceWithIndices = updatedSourceItems.map((item, index) => ({
          ...item,
          order_index: index,
          category: sourceId
        }));
        const destWithIndices = updatedDestItems.map((item, index) => ({
          ...item,
          order_index: index,
          category: destId
        }));

        setNavLinks(prev => {
          const others = prev.filter(l => l.category !== sourceId && l.category !== destId);
          return [...others, ...sourceWithIndices, ...destWithIndices];
        });

        // Update DB
        const updates = [
          ...sourceWithIndices.map((item) => 
            supabase.from('navigation_links').update({ order_index: item.order_index, category: sourceId }).eq('id', item.id)
          ),
          ...destWithIndices.map((item) => 
            supabase.from('navigation_links').update({ order_index: item.order_index, category: destId }).eq('id', item.id)
          )
        ];
        await Promise.all(updates);
      }
    } 
    else if (activeTab === 'daily-messages') {
      const items = Array.from(dailyMessages);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      // Rule: Top item is priority
      const updatedItems = items.map((item, index) => ({
        ...item,
        is_priority: index === 0
      }));
      
      setDailyMessages(updatedItems);

      // Update all in DB
      const updates = updatedItems.map((item) => 
        supabase.from('daily_messages').update({ is_priority: item.is_priority }).eq('id', item.id)
      );
      await Promise.all(updates);
    }
  };

  const createRequiredPages = async () => {
    setLoading(true);
    try {
      const required = [
        { name: 'Приклучи се', slug: 'join-us', oldHref: '/join-us' },
        { name: 'Продолжување на стипендии', slug: 'prodolzuvanje-stipendii', oldHref: '/prodolzuvanje-stipendii' },
        { name: 'Студентски домови', slug: 'studentski-domovi', oldHref: '/studentski-domovi' },
        { name: 'Апликација за оброк', slug: 'aplikacija-obrok', oldHref: '/aplikacija-obrok' },
        { name: 'Уписи 2026/27', slug: 'upisi-2026-27', oldHref: '/upisi-2026/27' },
        { name: 'Уписи 2025/26', slug: 'upisi-2025-26', oldHref: '/upisi-2025/26' },
        { name: 'Студентски оброк', slug: 'studentski-obrok', oldHref: '/studentski-obrok' },
        { name: 'Бруцоши', slug: 'brucosi', oldHref: '/brucosi' }
      ];

      for (const req of required) {
        // Create page if not exists
        const { data: existingPage } = await supabase
          .from('custom_pages')
          .select('id')
          .eq('slug', req.slug)
          .single();

        if (!existingPage) {
          await supabase.from('custom_pages').insert([{
            title: req.name,
            slug: req.slug,
            content: `<h3>${req.name}</h3><p>Наскоро повеќе информации за ${req.name}...</p>`,
            is_published: true,
            updated_at: new Date().toISOString()
          }]);
        }

        // Update nav links that might be using the old href or just the slug
        await supabase
          .from('navigation_links')
          .update({ href: `/${req.slug}` })
          .or(`href.eq.${req.oldHref},href.eq./${req.slug},href.eq./page/${req.slug}`);
      }

      await fetchData();
      alert('Сите страни се успешно креирани и линковите се ажурирани!');
    } catch (err: any) {
      alert('Грешка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => supabase.auth.signOut();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert('Грешка при најава: ' + error.message);
    } catch (err: any) {
      alert('Грешка: ' + err.message);
    }
    setLoading(false);
  };

  // New management states
  const [newCityName, setNewCityName] = useState('');
  const [newEventCatName, setNewEventCatName] = useState('');

  const handleAddCity = async () => {
    if (!newCityName) return;
    const { error } = await supabase.from('cities').insert([{ name: newCityName }]);
    if (error) alert(error.message);
    else { setNewCityName(''); fetchData(); }
  };

  const handleAddEventCat = async () => {
    if (!newEventCatName) return;
    const { error } = await supabase.from('event_categories').insert([{ name: newEventCatName }]);
    if (error) alert(error.message);
    else { setNewEventCatName(''); fetchData(); }
  };

  const handleDeleteCity = async (id: string) => {
    if (!confirm('Сигурно?')) return;
    await supabase.from('cities').delete().eq('id', id);
    fetchData();
  };

  const handleDeleteEventCat = async (id: string) => {
    if (!confirm('Сигурно?')) return;
    await supabase.from('event_categories').delete().eq('id', id);
    fetchData();
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCat(catId);
    const cat = categories.find(c => c.id === catId);
    if (cat && !editingId) {
      setTextColor(cat.default_color);
      setEmoji(cat.emoji);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPostTitle('');
    setMessage('');
    setExpiresAt('');
    // Event reset
    setEventTitle('');
    setEventDate('');
    if (dbCities.length > 0) setEventCity(dbCities[0].name);
    else setEventCity('');
    
    if (dbEventCategories.length > 0) setEventCategory(dbEventCategories[0].name);
    else setEventCategory('');

    setEventPrice('Бесплатно');
    setEventIsFeatured(false);
    setEventImageUrl('');
    setEventTicketLink('');
    setEventFile(null);
    setPostExcerpt('');
    setPostContent('');
    setPostType('news');
    setPostCategory('');
    setPostCity('');
    setPostImageUrl('');
    setPostGallery([]);
    setPostFile(null);
    setGalleryFiles([]);
    setPostBadge('');
    setPostRegistrationLink('');
    // Hero reset
    setHeroTitle('');
    setHeroSubtitle('');
    setHeroLinkUrl('');
    setHeroOrder('0');
    setHeroActive(true);
    setHeroImageUrl('');
    setHeroFile(null);
    // Daily reset
    setMsgContent('');
    setIsPriority(false);
    setMsgActive(true);
    
    setNavCategory('aktuelno');
    setNavOrder('0');
    setCreatePageForLink(false);
    // Page reset
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setPageImageUrl('');
    setPageIsPublished(true);
    setPageFile(null);
    
    if (categories.length > 0) {
      setSelectedCat(categories[0].id);
      setTextColor(categories[0].default_color);
      setEmoji(categories[0].emoji);
      setPostCategory(categories[0].name);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPostFile(file);
    
    // Optional: preview or auto-upload
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Немате привилегии за оваа акција');
      return;
    }
    setLoading(true);
    
    try {
      if (activeTab === 'notifications') {
        const payload = {
          category_id: selectedCat,
          title,
          message,
          text_color: textColor,
          custom_emoji: emoji,
          expires_at: expiresAt || null
        };

        if (editingId) {
          const { error } = await supabase.from('notifications').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('notifications').insert([payload]);
          if (error) throw error;
        }
      } else if (activeTab === 'navigation') {
        let finalOrder = parseInt(navOrder) || 0;
        
        if (!editingId) {
          // Auto-calculate next order index for new links
          const categoryLinks = navLinks.filter(l => l.category === navCategory);
          if (categoryLinks.length > 0) {
            const maxOrder = Math.max(...categoryLinks.map(l => l.order_index || 0));
            finalOrder = maxOrder + 1;
          }
        }

        const payload = {
          name: navName,
          href: navHref,
          description: navDesc,
          category: navCategory,
          order_index: finalOrder
        };

        if (editingId) {
          const { error } = await supabase.from('navigation_links').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          // If createPageForLink is true, we need to handle slug generation and page creation
          let finalHref = navHref;
          
          if (createPageForLink) {
            const slug = generateSlug(navName);
              
            finalHref = `/${slug}`;
            
            // Check if page already exists
            const { data: existingPage } = await supabase
              .from('custom_pages')
              .select('id')
              .eq('slug', slug)
              .single();
              
            if (!existingPage) {
              const { error: pageError } = await supabase.from('custom_pages').insert([{
                title: navName,
                slug: slug,
                content: `<p>Содржина за ${navName}...</p>`,
                is_published: true,
                updated_at: new Date().toISOString()
              }]);
              if (pageError) throw pageError;
            }
          }

          const { error } = await supabase.from('navigation_links').insert([{
            ...payload,
            href: finalHref
          }]);
          if (error) throw error;
        }
      } else if (activeTab === 'hero') {
        let finalImageUrl = heroImageUrl;
        if (heroFile) {
          const uploadedUrl = await uploadImage(heroFile);
          if (uploadedUrl) finalImageUrl = uploadedUrl;
          else throw new Error('Грешка при прикачување на сликата');
        }

        const payload = {
          title: heroTitle,
          subtitle: heroSubtitle,
          link_url: heroLinkUrl,
          image_url: finalImageUrl,
          order_index: parseInt(heroOrder) || 0,
          active: heroActive
        };

        if (editingId) {
          const { error } = await supabase.from('hero_slides').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('hero_slides').insert([payload]);
          if (error) throw error;
        }
      } else if (activeTab === 'daily-messages') {
        const payload = {
          message: msgContent,
          is_priority: isPriority,
          active: msgActive
        };

        if (editingId) {
          const { error } = await supabase.from('daily_messages').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('daily_messages').insert([payload]);
          if (error) throw error;
        }
      } else if (activeTab === 'events') {
        let finalImageUrl = eventImageUrl;
        if (eventFile) {
          const uploadedUrl = await uploadImage(eventFile);
          if (uploadedUrl) finalImageUrl = uploadedUrl;
          else throw new Error('Грешка при прикачување на сликата');
        }

        const payload = {
          title: eventTitle,
          start_date: eventDate,
          city: eventCity,
          category: eventCategory,
          price: eventPrice || 'Бесплатно',
          image_url: finalImageUrl || null,
          ticket_link: eventTicketLink || null,
          is_featured: eventIsFeatured
        };

        if (editingId) {
          const { error } = await supabase.from('events').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('events').insert([payload]);
          if (error) throw error;
        }
      } else if (activeTab === 'posts') {
        let finalImageUrl = postImageUrl;
        let finalGallery = [...postGallery];
        
        if (postFile) {
          const uploadedUrl = await uploadImage(postFile);
          if (uploadedUrl) finalImageUrl = uploadedUrl;
          else throw new Error('Грешка при прикачување на насловната слика');
        }

        if (galleryFiles.length > 0) {
          const uploadedUrls = await Promise.all(
            galleryFiles.map(file => uploadImage(file))
          );
          const validUrls = uploadedUrls.filter(url => url !== null) as string[];
          finalGallery = [...finalGallery, ...validUrls];
        }

        const payload = {
          title: postTitle,
          excerpt: postExcerpt,
          content: postContent,
          type: postType,
          category: postCategory,
          city: postCity || null,
          image_url: finalImageUrl || null,
          gallery: finalGallery,
          badge: postBadge || null,
          registration_link: postRegistrationLink || null
        };

        if (editingId) {
          const { error } = await supabase.from('posts').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('posts').insert([{ ...payload, published_at: new Date().toISOString() }]);
          if (error) throw error;
        }
      } else if (activeTab === 'pages') {
        let finalImageUrl = pageImageUrl;
        if (pageFile) {
          const uploadedUrl = await uploadImage(pageFile);
          if (uploadedUrl) finalImageUrl = uploadedUrl;
          else throw new Error('Грешка при прикачување на сликата');
        }

        const payload = {
          title: pageTitle,
          slug: pageSlug.replace(/^\/+|\/+$/g, '').trim(),
          content: pageContent,
          image_url: finalImageUrl,
          is_published: pageIsPublished,
          updated_at: new Date().toISOString()
        };

        if (editingId) {
          const { error } = await supabase.from('custom_pages').update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { data: newPage, error } = await supabase.from('custom_pages').insert([payload]).select().single();
          if (error) throw error;

          // Auto-add to navigation if checked
          if (addToNav && newPage) {
            const categoryLinks = navLinks.filter(l => l.category === 'main');
            const maxOrder = categoryLinks.length > 0 ? Math.max(...categoryLinks.map(l => l.order_index || 0)) : -1;
            
            await supabase.from('navigation_links').insert([{
              name: pageTitle,
              href: `/${pageSlug.replace(/^\/+|\/+$/g, '').trim()}`,
              description: 'Ново додадена страна',
              category: 'main',
              order_index: maxOrder + 1
            }]);
          }
        }
      }
      
      resetForm();
      fetchData();
      alert('Успешно зачувано!');
    } catch (err: any) {
      alert('Грешка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'notifications') {
      setTitle(item.title);
      setMessage(item.message);
      setSelectedCat(item.category_id);
      setTextColor(item.text_color || '#ffffff');
      setEmoji(item.custom_emoji || '');
      setExpiresAt(item.expires_at ? new Date(item.expires_at).toISOString().slice(0, 16) : '');
    } else if (activeTab === 'navigation') {
      setNavName(item.name);
      setNavHref(item.href);
      setNavDesc(item.description || '');
      setNavCategory(item.category || 'aktuelno');
      setNavOrder(item.order_index?.toString() || '0');
    } else if (activeTab === 'hero') {
      setHeroTitle(item.title);
      setHeroSubtitle(item.subtitle || '');
      setHeroLinkUrl(item.link_url || '');
      setHeroImageUrl(item.image_url || '');
      setHeroOrder(item.order_index.toString());
      setHeroActive(item.active);
    } else if (activeTab === 'daily-messages') {
      setMsgContent(item.message);
      setIsPriority(item.is_priority);
      setMsgActive(item.active);
    } else if (activeTab === 'events') {
      setEventTitle(item.title);
      setEventDate(item.start_date || '');
      setEventCity(item.city || '');
      setEventCategory(item.category || '');
      setEventPrice(item.price || 'Бесплатно');
      setEventIsFeatured(item.is_featured || false);
      setEventImageUrl(item.image_url || '');
      setEventTicketLink(item.ticket_link || '');
    } else if (activeTab === 'posts') {
      setPostTitle(item.title);
      setPostExcerpt(item.excerpt || '');
      setPostContent(item.content || '');
      setPostType(item.type);
      setPostCategory(item.category);
      setPostCity(item.city || '');
      setPostImageUrl(item.image_url || '');
      setPostBadge(item.badge || '');
      setPostRegistrationLink(item.registration_link || '');
    } else if (activeTab === 'pages') {
      setPageTitle(item.title);
      setPageSlug(item.slug);
      setPageContent(item.content || '');
      setPageImageUrl(item.image_url || '');
      setPageIsPublished(item.is_published);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert('Немате привилегии за оваа акција');
      return;
    }
    if (!confirm('Дали сте сигурни?')) return;
    
    setLoading(true);
    try {
      let table = 'notifications';
      if (activeTab === 'posts') table = 'posts';
      if (activeTab === 'events') table = 'events';
      if (activeTab === 'hero') table = 'hero_slides';
      if (activeTab === 'daily-messages') table = 'daily_messages';
      if (activeTab === 'navigation') table = 'navigation_links';
      if (activeTab === 'pages') table = 'custom_pages';
      
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      if (activeTab === 'notifications') {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else if (activeTab === 'hero') {
        setHeroSlides(prev => prev.filter(h => h.id !== id));
      } else if (activeTab === 'daily-messages') {
        setDailyMessages(prev => prev.filter(m => m.id !== id));
      } else if (activeTab === 'navigation') {
        setNavLinks(prev => prev.filter(l => l.id !== id));
      } else if (activeTab === 'pages') {
        setCustomPages(prev => prev.filter(p => p.id !== id));
      } else {
        setPosts(prev => prev.filter(p => p.id !== id));
      }
      alert('Успешно избришано!');
    } catch (err: any) {
      alert(`Грешка при бришење: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || isAdmin === false) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[var(--bg-secondary)] p-10 rounded-3xl border border-[var(--border-main)] shadow-2xl">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 mx-auto">
            <LogIn className="w-8 h-8 text-dark" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-center mb-2">Најави се</h1>
          <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-8">Внесете ги вашите податоци за пристап</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Е-пошта</label>
              <input 
                type="email" placeholder="пр: stefan@finki.ukim.mk" 
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:outline-none focus:border-primary placeholder:text-[var(--text-muted)] text-zinc-900 dark:text-white"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Лозинка</label>
              <input 
                type="password" placeholder="••••••••" 
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:outline-none focus:border-primary placeholder:text-[var(--text-muted)] text-zinc-900 dark:text-white"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all mt-4">
              {loading ? <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : 'Најави се'}
            </button>
          </form>
          <button onClick={() => navigate('/')} className="w-full mt-6 text-[10px] font-bold text-[var(--text-muted)] uppercase hover:text-primary transition-colors tracking-widest">
            Назад кон почетна
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-dark" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter truncate max-w-[200px] md:max-w-none">
                Здраво, {user?.email ? user.email.split('@')[0] : 'Стефан'}
              </h1>
              <p className="text-[var(--text-muted)] text-[8px] md:text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Админ Панел
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLogout} 
              className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all"
            >
              Одјави се
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-primary bg-[var(--bg-secondary)] px-4 py-2 rounded-lg border border-[var(--border-main)]"
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 mb-8 bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border-main)] w-full overflow-x-auto custom-scrollbar whitespace-nowrap scroll-smooth no-scrollbar md:no-scrollbar-none">
          <button 
            onClick={() => { setActiveTab('notifications'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'notifications' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Известувања
          </button>
          <button 
            onClick={() => { setActiveTab('posts'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'posts' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Вести
          </button>
          <button 
            onClick={() => { setActiveTab('events'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'events' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Настани
          </button>
          <button 
            onClick={() => { setActiveTab('hero'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'hero' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Издвоени вести (почетна)
          </button>
          <button 
            onClick={() => { setActiveTab('daily-messages'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'daily-messages' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Пораки на денот
          </button>
          <button 
            onClick={() => { setActiveTab('navigation'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'navigation' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Мени
          </button>
          <button 
            onClick={() => { setActiveTab('pages'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'pages' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Додај нови страници
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); resetForm(); }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeTab === 'settings' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-white'}`}
          >
            Главни подесувања
          </button>
        </div>

        <div className={`grid grid-cols-1 gap-10 ${activeTab === 'posts' || activeTab === 'pages' ? 'lg:grid-cols-12' : 'lg:grid-cols-12'}`}>
          {/* Form Section */}
          <div className={`${activeTab === 'posts' || activeTab === 'pages' ? 'lg:col-span-12' : 'lg:col-span-12 xl:col-span-5'}`}>
            <form onSubmit={handleSubmit} className={`space-y-8 bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[var(--border-main)] shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-primary/5 group/form ${activeTab !== 'posts' && activeTab !== 'pages' ? 'xl:sticky xl:top-24 max-h-[none] xl:max-h-[85vh] xl:overflow-y-auto custom-scrollbar' : ''}`}>
              {/* Background accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] -z-10 rounded-full animate-pulse" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 blur-[100px] -z-10 rounded-full animate-pulse decoration-1000" />

              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 text-white">
                    <span className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20 group-hover/form:scale-110 transition-transform">
                      {editingId ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
                    </span>
                    {editingId ? 'Измени содржина' : 'Нова содржина'}
                  </h2>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] ml-[64px]">
                    {activeTab === 'posts' ? 'Креирај или уреди блог пост / вест' : activeTab === 'pages' ? 'Уреди статична страна' : 'Пополни ги полињата подолу'}
                  </p>
                </div>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                  >
                    Откажи
                  </button>
                )}
              </div>

              <div className={activeTab === 'pages' ? 'grid grid-cols-1 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                <div className={activeTab === 'pages' ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>

              {activeTab === 'notifications' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Категорија</label>
                    <select 
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold appearance-none cursor-pointer focus:border-primary focus:outline-none text-zinc-900 dark:text-white"
                      value={selectedCat}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Боја на текст (Hex)</label>
                    <div className="flex gap-2">
                      <input type="color" className="w-14 h-14 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" value={textColor} onChange={e => setTextColor(e.target.value)} />
                      <input type="text" className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-mono text-sm uppercase focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={textColor} onChange={e => setTextColor(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Наслов</label>
                    <input required className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={title} onChange={e => setTitle(e.target.value)} placeholder="пр: СТИПЕНДИИ 2024" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Порака</label>
                    <textarea required className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-semibold min-h-[80px] focus:border-primary focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400" value={message} onChange={e => setMessage(e.target.value)} placeholder="Внеси детали..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Рок до кога трае</label>
                    <input type="datetime-local" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
                  </div>
                </>
              ) : activeTab === 'hero' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Наслов</label>
                    <input required className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="ИСТАКНАТА ВЕСТ" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Поднаслов</label>
                    <input className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="Краток опис за оваа слика..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Линк (Член/Пост/URL)</label>
                    <input className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500" value={heroLinkUrl} onChange={e => setHeroLinkUrl(e.target.value)} placeholder="https://... или /post/uuid" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Слика</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-[var(--bg-tertiary)] border border-dashed border-[var(--border-main)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-colors">
                          <Upload className={`w-5 h-5 ${heroFile ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-center truncate max-w-full px-2">
                            {heroFile ? heroFile.name : 'Избери слика...'}
                          </span>
                        </div>
                      </div>
                      <input 
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white text-xs placeholder:text-zinc-500" 
                        value={heroImageUrl} 
                        onChange={e => setHeroImageUrl(e.target.value)} 
                        placeholder="Или внеси URL..." 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Редослед</label>
                      <input type="number" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={heroOrder} onChange={e => setHeroOrder(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input type="checkbox" id="heroActive" checked={heroActive} onChange={e => setHeroActive(e.target.checked)} className="w-5 h-5 rounded border-white/10 bg-[var(--bg-tertiary)] text-primary focus:ring-primary" />
                      <label htmlFor="heroActive" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] cursor-pointer">Активна</label>
                    </div>
                  </div>
                </>
              ) : activeTab === 'navigation' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Име на линкот</label>
                    <input required className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={navName} onChange={e => setNavName(e.target.value)} placeholder="пр: Стипендии" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Патека (href)</label>
                    <div className="flex gap-2">
                      <input required className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={navHref} onChange={e => setNavHref(e.target.value)} placeholder="/stipendii" />
                      {customPages.length > 0 && (
                        <select 
                          className="bg-[var(--bg-tertiary)] border border-[var(--border-main)] px-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white text-[10px] appearance-none cursor-pointer hover:border-primary transition-all"
                          onChange={(e) => {
                            if (e.target.value) setNavHref(`/${e.target.value}`);
                          }}
                          value=""
                        >
                          <option value="" disabled>ЛИНИЈА ДО СТРАНА...</option>
                          {customPages.map(p => (
                            <option key={p.id} value={p.slug}>{p.title}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Краток опис (за подмени)</label>
                    <input className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={navDesc} onChange={e => setNavDesc(e.target.value)} placeholder="Сите активни конкурси" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Категорија</label>
                    <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white appearance-none" value={navCategory} onChange={e => setNavCategory(e.target.value as any)}>
                      <option value="aktuelno">АКТУЕЛНО (Подмени)</option>
                      <option value="main">MAIN (Главно мени)</option>
                    </select>
                  </div>
                  
                  {!editingId && (
                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="create-page"
                        checked={createPageForLink}
                        onChange={e => setCreatePageForLink(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border-main)] bg-[var(--bg-tertiary)] text-primary focus:ring-primary"
                      />
                      <label htmlFor="create-page" className="text-xs font-bold uppercase tracking-widest text-primary">Автоматски креирај страна за овој линк</label>
                    </div>
                  )}
                </>
              ) : activeTab === 'pages' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Наслов на страната</label>
                    <input required className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder="пр: Правила за стипендии" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">URL (slug)</label>
                    <input required className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white" value={pageSlug} onChange={e => setPageSlug(e.target.value)} placeholder="pravila-za-stipendii" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Содржина (Визуелен едитор)</label>
                    <TiptapEditor 
                      content={pageContent} 
                      onChange={setPageContent} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Слика на страната (опционално)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPageFile(e.target.files[0]);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-[var(--bg-tertiary)] border border-dashed border-[var(--border-main)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-colors">
                          <Upload className={`w-5 h-5 ${pageFile ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-center truncate max-w-full px-2">
                            {pageFile ? pageFile.name : 'Избери слика...'}
                          </span>
                        </div>
                      </div>
                      <input 
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white text-xs" 
                        value={pageImageUrl} 
                        onChange={e => setPageImageUrl(e.target.value)} 
                        placeholder="Или внеси URL..." 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="page-published"
                        checked={pageIsPublished}
                        onChange={e => setPageIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border-main)] bg-[var(--bg-tertiary)] text-primary focus:ring-primary"
                      />
                      <label htmlFor="page-published" className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Објавена</label>
                    </div>
                    
                    {!editingId && (
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="add-to-nav"
                          checked={addToNav}
                          onChange={e => setAddToNav(e.target.checked)}
                          className="w-4 h-4 rounded border-[var(--border-main)] bg-[var(--bg-tertiary)] text-primary focus:ring-primary"
                        />
                        <label htmlFor="add-to-nav" className="text-xs font-bold uppercase tracking-widest text-primary">Автоматски додади во мени (ГЛАВНО МЕНИ)</label>
                      </div>
                    )}
                  </div>
                </>
              ) : activeTab === 'daily-messages' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Порака</label>
                    <textarea 
                      required 
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white min-h-[120px] placeholder:text-zinc-500" 
                      value={msgContent} 
                      onChange={e => setMsgContent(e.target.value)} 
                      placeholder="Внеси ја пораката за денес..." 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isPriority" 
                        checked={isPriority} 
                        onChange={e => setIsPriority(e.target.checked)} 
                        className="w-5 h-5 rounded border-white/10 bg-[var(--bg-tertiary)] text-primary focus:ring-primary" 
                      />
                      <label htmlFor="isPriority" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] cursor-pointer">
                        Приоритетна (Најгоре)
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="msgActive" 
                        checked={msgActive} 
                        onChange={e => setMsgActive(e.target.checked)} 
                        className="w-5 h-5 rounded border-white/10 bg-[var(--bg-tertiary)] text-primary focus:ring-primary" 
                      />
                      <label htmlFor="msgActive" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] cursor-pointer">
                        Активна
                      </label>
                    </div>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase leading-relaxed mt-2 italic">
                    * Ако е означена како приоритетна, оваа порака ќе биде главна. Можеш да го менуваш редоследот со влечење.
                  </p>
                </>
              ) : activeTab === 'settings' ? (
                <>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-6">Општи подесувања</h3>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Лого на сајтот</label>
                    <div className="flex flex-col gap-6 p-6 bg-[var(--bg-tertiary)] border border-[var(--border-main)] rounded-3xl">
                      <div className="w-full aspect-video bg-dark rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                          <img src={logoUrl} className="max-h-full max-w-full object-contain p-4" alt="Logo preview" />
                        ) : (
                          <span className="text-[10px] font-black uppercase text-zinc-700">Нема лого</span>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="relative group">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-full bg-dark border border-dashed border-[var(--border-main)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-colors">
                            <Upload className={`w-5 h-5 ${logoFile ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                              {logoFile ? logoFile.name : 'Избери ново лого...'}
                            </span>
                          </div>
                        </div>
                        <input 
                          className="w-full bg-dark border border-[var(--border-main)] p-4 rounded-xl font-bold focus:border-primary focus:outline-none text-zinc-900 dark:text-white text-xs placeholder:text-zinc-500" 
                          value={logoUrl} 
                          onChange={e => setLogoUrl(e.target.value)} 
                          placeholder="Или внеси URL на логото..." 
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={async () => {
                        setSettingsLoading(true);
                        try {
                          let finalUrl = logoUrl;
                          if (logoFile) {
                            const uploaded = await uploadImage(logoFile);
                            if (uploaded) finalUrl = uploaded;
                          }

                          const { error } = await supabase
                            .from('app_settings')
                            .upsert({ 
                              key: 'site_config', 
                              value: { logo_url: finalUrl } 
                            });

                          if (error) throw error;
                          alert('Успешно зачувано!');
                          setLogoUrl(finalUrl);
                        } catch (err) {
                          console.error(err);
                          alert('Грешка при зачувување');
                        } finally {
                          setSettingsLoading(false);
                        }
                      }}
                      disabled={settingsLoading}
                      className="w-full bg-primary text-dark font-black py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                      {settingsLoading ? <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : 'ЗАЧУВАЈ ЛОГО'}
                    </button>

                    <div className="pt-10 border-t border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Системски алатки</h4>
                      <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase mb-4 leading-relaxed">
                          Брзо креирање на сите потребни страни и ажурирање на линковите во менито.
                        </p>
                        <button 
                          type="button"
                          onClick={() => {
                            if(confirm('Дали сте сигурни дека сакате да ги креирате сите недостапни страни (join-us, brucosi, stipendii...) и да ги поврзете?')) {
                              createRequiredPages();
                            }
                          }}
                          className="w-full bg-primary/10 border border-primary/30 text-primary font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:bg-primary hover:text-dark transition-all"
                        >
                          КРЕИРАЈ ГИ СИТЕ ПОТРЕБНИ СТРАНИ
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-zinc-500 text-[10px] font-black uppercase text-center py-10 border border-dashed border-white/10 rounded-2xl">
                {activeTab === 'posts' || activeTab === 'events' ? `Управувајте со ${activeTab === 'posts' ? 'вестите' : 'настаните'} директно на нивната страна` : 'Избери таб за да додадеш содржина'}
              </p>
              )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full bg-primary text-dark font-black py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 ${(activeTab === 'posts' || activeTab === 'events') ? 'hidden' : ''}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" /> : (editingId ? 'Зачувај промени' : (activeTab === 'notifications' ? 'Објави ја веста' : activeTab === 'hero' ? 'Додади херо слика' : activeTab === 'daily-messages' ? 'Додади порака' : activeTab === 'navigation' ? 'Додади линк' : activeTab === 'pages' ? 'Креирај страна' : 'Објави го постот'))}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className={`${activeTab === 'posts' || activeTab === 'pages' ? 'lg:col-span-12' : 'lg:col-span-12 xl:col-span-7'} space-y-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">
                {activeTab === 'notifications' ? 'Уреди известувања' : activeTab === 'hero' ? 'Уреди херо слики' : activeTab === 'daily-messages' ? 'Уреди пораки на денот' : activeTab === 'navigation' ? 'Уреди навигација' : activeTab === 'pages' ? 'Уреди страни' : activeTab === 'settings' ? 'Системски информации' : 'Уреди постови'}
              </h2>
              <div className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-main)] rounded-full text-[10px] font-black uppercase">
                {activeTab === 'notifications' ? notifications.length : activeTab === 'navigation' ? navLinks.length : activeTab === 'pages' ? customPages.length : activeTab === 'hero' ? heroSlides.length : activeTab === 'daily-messages' ? dailyMessages.length : activeTab === 'settings' ? '1' : posts.length} активни
              </div>
            </div>
            
            <div className="space-y-4">
              {activeTab === 'notifications' ? (
                notifications.length > 0 ? (
                  notifications.map((note) => {
                    const cat = categories.find(c => c.id === note.category_id);
                    return (
                      <div key={note.id} className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-5 rounded-2xl group relative overflow-hidden">
                        <div className="flex items-start justify-between gap-4 relative z-10">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-2xl border border-[var(--border-main)] group-hover:border-primary/30 transition-colors">
                              {note.custom_emoji || cat?.emoji || '🔔'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: note.text_color || cat?.default_color }}>{cat?.name}</span>
                                <span className="w-1 h-1 rounded-full bg-[var(--border-main)]" />
                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(note.created_at).toLocaleDateString('mk-MK')}
                                </span>
                              </div>
                              <h3 className="font-bold text-base leading-tight mb-1">{note.title}</h3>
                              <p className="text-xs text-[var(--text-muted)] font-medium line-clamp-2 leading-relaxed">{note.message}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 shrink-0">
                            <button 
                              onClick={() => handleEdit(note)}
                              className="p-2.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-xl hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                              title="Измени"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(note.id)}
                              className="p-2.5 bg-[var(--bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                              title="Избриши"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-24 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-main)]">
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Нема објавени известувања</p>
                  </div>
                )
              ) : activeTab === 'navigation' ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Menu Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">Главно мени (MAIN)</h3>
                      </div>
                      <Droppable droppableId="main">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[200px] p-4 bg-[var(--bg-tertiary)]/30 rounded-3xl border border-dashed border-[var(--border-main)]">
                            {navLinks.filter(l => l.category === 'main').sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-4 rounded-2xl group relative overflow-hidden"
                                  >
                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                      <div className="flex items-start gap-3">
                                        <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-primary transition-colors">
                                          <GripVertical className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-sm leading-tight mb-1">{link.name}</h4>
                                          <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed truncate max-w-[150px]">{link.href}</p>
                                          {link.href.startsWith('/') && !internalPaths.includes(link.href) && !customPages.some(p => `/${p.slug}` === link.href) && (
                                            <button 
                                              onClick={async () => {
                                                const slug = link.href.replace(/^\//, '');
                                                const { error } = await supabase.from('custom_pages').insert([{
                                                  title: link.name,
                                                  slug: slug,
                                                  content: `<p>Содржина за ${link.name}...</p>`,
                                                  is_published: true,
                                                  updated_at: new Date().toISOString()
                                                }]);
                                                if (error) alert(error.message);
                                                else {
                                                  alert('Страната е успешно креирана!');
                                                  fetchData();
                                                }
                                              }}
                                              className="mt-1 text-[9px] font-black uppercase text-primary hover:underline flex items-center gap-1"
                                            >
                                              <Plus className="w-2.5 h-2.5" /> Креирај ја оваа страна
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-1 shrink-0">
                                        <button 
                                          onClick={() => handleEdit(link)}
                                          className="p-1.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-lg hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDelete(link.id)}
                                          className="p-1.5 bg-[var(--bg-tertiary)] text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {/* Aktuelno Column */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">Актуелно (Подмени)</h3>
                      </div>
                      <Droppable droppableId="aktuelno">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[200px] p-4 bg-[var(--bg-tertiary)]/30 rounded-3xl border border-dashed border-[var(--border-main)]">
                            {navLinks.filter(l => l.category === 'aktuelno').sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-4 rounded-2xl group relative overflow-hidden"
                                  >
                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                      <div className="flex items-start gap-3">
                                        <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-primary transition-colors">
                                          <GripVertical className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-sm leading-tight mb-1">{link.name}</h4>
                                          <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed truncate max-w-[150px]">{link.href}</p>
                                          {link.href.startsWith('/') && !internalPaths.includes(link.href) && !customPages.some(p => `/${p.slug}` === link.href) && (
                                            <button 
                                              onClick={async () => {
                                                const slug = link.href.replace(/^\//, '');
                                                const { error } = await supabase.from('custom_pages').insert([{
                                                  title: link.name,
                                                  slug: slug,
                                                  content: `<p>Содржина за ${link.name}...</p>`,
                                                  is_published: true,
                                                  updated_at: new Date().toISOString()
                                                }]);
                                                if (error) alert(error.message);
                                                else {
                                                  alert('Страната е успешно креирана!');
                                                  fetchData();
                                                }
                                              }}
                                              className="mt-1 text-[9px] font-black uppercase text-primary hover:underline flex items-center gap-1"
                                            >
                                              <Plus className="w-2.5 h-2.5" /> Креирај ја оваа страна
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-1 shrink-0">
                                        <button 
                                          onClick={() => handleEdit(link)}
                                          className="p-1.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-lg hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDelete(link.id)}
                                          className="p-1.5 bg-[var(--bg-tertiary)] text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </DragDropContext>
              ) : activeTab === 'hero' ? (
                heroSlides.length > 0 ? (
                  heroSlides.map((slide) => (
                    <div key={slide.id} className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-5 rounded-2xl group relative overflow-hidden">
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-main)] overflow-hidden">
                            <img src={slide.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${slide.active ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                {slide.active ? 'АКТИВНА' : 'НЕАКТИВНА'}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[var(--border-main)]" />
                              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                Редослед: {slide.order_index}
                              </span>
                            </div>
                            <h3 className="font-bold text-base leading-tight mb-1">{slide.title}</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium line-clamp-1">{slide.subtitle}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 shrink-0">
                          <button 
                            onClick={() => handleEdit(slide)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-xl hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(slide.id)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-main)]">
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Нема објавени херо слики</p>
                  </div>
                )
              ) : activeTab === 'pages' ? (
                customPages.length > 0 ? (
                  customPages.map((p) => (
                    <div key={p.id} className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-5 rounded-2xl group relative overflow-hidden">
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-main)] overflow-hidden shrink-0">
                            {p.image_url ? (
                              <img src={p.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${p.is_published ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                                {p.is_published ? 'ОБЈАВЕНА' : 'СКРИЕНА'}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[var(--border-main)]" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                /{p.slug}
                              </span>
                            </div>
                            <h3 className="font-bold text-base leading-tight mb-1">{p.title}</h3>
                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
                              Последна измена: {new Date(p.updated_at).toLocaleDateString('mk-MK')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 shrink-0">
                          <button 
                            onClick={async () => {
                              try {
                                const { data, error } = await supabase
                                  .from('custom_pages')
                                  .select('content')
                                  .eq('id', p.id)
                                  .single();
                                if (data) {
                                  // Update the pageContent state for editing
                                  setPageContent(data.content);
                                }
                                handleEdit(p);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-xl hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-main)]">
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Нема креирано страни</p>
                  </div>
                )
              ) : activeTab === 'daily-messages' ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="daily-messages">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {dailyMessages.length > 0 ? (
                          dailyMessages.map((msg, index) => (
                            <Draggable key={msg.id} draggableId={msg.id} index={index}>
                              {(provided) => (
                                <div 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-5 rounded-2xl group relative overflow-hidden"
                                >
                                  <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="flex items-start gap-4">
                                      <div {...provided.dragHandleProps} className="p-2 mr-2 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-primary transition-colors">
                                        <GripVertical className="w-5 h-5" />
                                      </div>
                                      <div className={`w-12 h-12 rounded-xl border border-[var(--border-main)] flex items-center justify-center shrink-0 ${msg.is_priority ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[var(--bg-tertiary)]'}`}>
                                        {msg.is_priority ? <Zap className="w-5 h-5" /> : <Quote className="w-5 h-5 text-[var(--text-muted)]" />}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${msg.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {msg.active ? 'АКТИВНА' : 'НЕАКТИВНА'}
                                          </span>
                                          {msg.is_priority && (
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary text-dark">
                                              ПРИОРИТЕТ
                                            </span>
                                          )}
                                          <span className="w-1 h-1 rounded-full bg-[var(--border-main)]" />
                                          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            {new Date(msg.created_at).toLocaleDateString('mk-MK')}
                                          </span>
                                        </div>
                                        <p className="text-sm font-bold leading-relaxed">{msg.message}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 shrink-0">
                                      <button 
                                        onClick={() => handleEdit(msg)}
                                        className="p-2.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-xl hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-2.5 bg-[var(--bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="text-center py-24 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-main)]">
                            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Нема објавени пораки</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : activeTab === 'events' ? (
                events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-5 rounded-2xl group relative overflow-hidden">
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-main)] shrink-0">
                            {event.image_url ? (
                              <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl grayscale opacity-20">📅</div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">{event.category}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--border-main)]" />
                              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{new Date(event.start_date).toLocaleDateString('mk-MK')}</span>
                            </div>
                            <h4 className="font-bold text-base leading-tight mb-1">{event.title}</h4>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{event.city}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button 
                            onClick={() => handleEdit(event)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-xl hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(event.id)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-main)]">
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Нема објавени настани</p>
                  </div>
                )
              ) : activeTab === 'settings' ? (
                <div className="space-y-8">
                  <div className="bg-primary/5 border border-primary/20 p-10 rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <Zap className="text-dark w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tighter text-white">Управување со податоци</h3>
                        <p className="text-xs text-primary font-bold uppercase tracking-widest">Додај или избриши градови и категории</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white border-b border-[var(--border-main)] pb-2 mb-4">Градови</h4>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-3 rounded-xl font-bold text-zinc-900 dark:text-white text-xs placeholder:text-zinc-500" 
                            placeholder="Нов град..." 
                            value={newCityName}
                            onChange={e => setNewCityName(e.target.value)}
                          />
                          <button onClick={handleAddCity} className="bg-primary text-dark p-3 rounded-xl hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {dbCities.map(city => (
                            <div key={city.id} className="flex items-center justify-between bg-[var(--bg-tertiary)]/50 p-3 rounded-xl border border-[var(--border-main)]">
                              <span className="text-xs font-bold uppercase">{city.name}</span>
                              <button onClick={() => handleDeleteCity(city.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white border-b border-[var(--border-main)] pb-2 mb-4">Категории на настани</h4>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-main)] p-3 rounded-xl font-bold text-zinc-900 dark:text-white text-xs placeholder:text-zinc-500" 
                            placeholder="Нова категорија..." 
                            value={newEventCatName}
                            onChange={e => setNewEventCatName(e.target.value)}
                          />
                          <button onClick={handleAddEventCat} className="bg-primary text-dark p-3 rounded-xl hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {dbEventCategories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between bg-[var(--bg-tertiary)]/50 p-3 rounded-xl border border-[var(--border-main)]">
                              <span className="text-xs font-bold uppercase">{cat.name}</span>
                              <button onClick={() => handleDeleteEventCat(cat.id)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-8 rounded-3xl mt-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Системски информации</h4>
                    <p className="text-[var(--text-muted)] text-xs font-medium leading-relaxed">
                      Сите промени направени овде директно влијаат врз опциите при креирање на нови настани и филтрите на почетната страна.
                    </p>
                  </div>
                </div>
              ) : (
                posts.filter(p => p.type === 'news').length > 0 ? (
                  posts.filter(p => p.type === 'news').map((post) => (
                    <div key={post.id} className="bg-[var(--bg-secondary)] border border-[var(--border-main)] p-5 rounded-2xl group relative overflow-hidden">
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-main)] shrink-0">
                            {post.image_url ? (
                              <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl grayscale opacity-20">📰</div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">{post.category}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--border-main)]" />
                              <span className="text-[10px] font-black uppercase text-zinc-500 italic">{post.type}</span>
                            </div>
                            <h4 className="font-bold text-base leading-tight mb-1">{post.title}</h4>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{post.city || 'Македонија'}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button 
                            onClick={() => handleEdit(post)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-[var(--text-main)] rounded-xl hover:bg-primary hover:text-dark transition-all border border-[var(--border-main)]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-2.5 bg-[var(--bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-[var(--border-main)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-main)]">
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Нема објавени постови</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
