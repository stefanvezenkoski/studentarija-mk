import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Home, Bus, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  category_id: string;
  text_color?: string;
  custom_emoji?: string;
  expires_at?: string;
  created_at: string;
  categories?: {
    name: string;
    emoji: string;
    default_color: string;
  }
}

const formatTimeLabel = (expiresAt?: string) => {
  if (!expiresAt) return 'НОВО';
  const now = new Date();
  const exp = new Date(expiresAt);
  const diffMs = exp.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'ИСТЕЧЕНО';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} мин`;
  }
  if (diffHours < 24) return `${diffHours}ч`;
  return `${Math.floor(diffHours / 24)}д`;
};

export default function Ticker() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  async function fetchNotifications() {
    try {
      const [notesRes, catsRes] = await Promise.all([
        supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('categories')
          .select('*')
      ]);
      
      if (notesRes.error) throw notesRes.error;
      
      if (notesRes.data) {
        const now = new Date();
        const mapped = notesRes.data.map((n: any) => ({
          ...n,
          categories: catsRes.data?.find(c => c.id === n.category_id)
        })).filter((n: any) => {
          if (!n.expires_at) return true;
          return new Date(n.expires_at) > now;
        });
        
        setNotifications(mapped);
      }
    } catch (err) {
      console.warn('Ticker fetch error:', err);
    }
  }

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('ticker-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-[var(--bg-main)] text-[var(--text-main)] h-12 md:h-14 overflow-hidden border-b border-[var(--border-main)] flex items-stretch relative z-40 w-full">
      {/* Label Section */}
      <div className="bg-primary px-4 md:px-8 flex items-center gap-3 shrink-0 relative z-20 shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
        <Bell className="w-5 h-5 text-dark fill-dark/10" />
        <span className="font-head font-black text-dark text-xs md:text-sm tracking-tighter uppercase">Известувања</span>
      </div>

      {/* Ticker Section */}
      <div className="flex-1 relative flex items-center overflow-hidden bg-black/20">
        <motion.div 
          className="flex items-center gap-10 md:gap-20 pl-10"
          animate={{ x: [0, -2000] }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {notifications.length > 0 ? (
            [...notifications, ...notifications, ...notifications].map((notif, idx) => (
              <div key={`${notif.id}-${idx}`} className="flex items-center gap-4 shrink-0 border-r border-[var(--border-main)] pr-10 md:pr-20 group">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-main)] text-lg">
                    {notif.custom_emoji || notif.categories?.emoji || '🔔'}
                  </div>
                  <div className="flex flex-col">
                    <span 
                      className="text-[10px] font-black uppercase tracking-tight"
                      style={{ color: notif.text_color || notif.categories?.default_color || 'var(--primary)' }}
                    >
                      {notif.categories?.name || 'ИЗВЕСТУВАЊЕ'}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-main)] max-w-[200px] truncate md:max-w-none">
                      {notif.title}
                    </span>
                  </div>
                </div>
                <div className="bg-[var(--text-main)] px-3 py-1 rounded text-[9px] font-black text-[var(--bg-main)] group-hover:bg-primary group-hover:text-dark transition-colors shrink-0">
                  {formatTimeLabel(notif.expires_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest pl-10 opacity-50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Вчитување на нови информации...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


