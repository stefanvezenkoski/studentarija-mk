import { useState, useRef, useEffect } from 'react';
import { 
  Share2, Facebook, Twitter, MessageCircle, 
  Copy, Check, Link as LinkIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
  variant?: 'circular' | 'ghost' | 'standard';
}

export default function ShareButton({ title, url, className, variant = 'standard' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url: fullUrl,
        });
        setIsOpen(false);
        return true;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
    return false;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      color: 'hover:bg-blue-600 hover:text-white',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank'),
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      color: 'hover:bg-slate-900 hover:text-white',
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, '_blank'),
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'hover:bg-green-500 hover:text-white',
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + fullUrl)}`, '_blank'),
    },
  ];

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // On mobile, try native share first
    const shared = await handleNativeShare();
    if (!shared) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn("relative inline-block", className)} ref={menuRef}>
      <button
        onClick={handleClick}
        className={cn(
          "transition-all flex items-center justify-center",
          variant === 'circular' && "w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-primary hover:text-primary",
          variant === 'ghost' && "p-2 hover:text-primary opacity-60 hover:opacity-100",
          variant === 'standard' && "px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-dark"
        )}
      >
        <Share2 className={cn(variant === 'ghost' ? 'w-4 h-4' : 'w-5 h-5')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full right-0 mb-4 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] font-black uppercase text-white/30 px-3 py-2 tracking-widest border-b border-white/5 mb-1">
              Сподели објава
            </div>
            
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-white/70",
                  option.color
                )}
              >
                {option.icon}
                {option.name}
              </button>
            ))}

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-white/70 hover:bg-primary hover:text-dark mt-1"
            >
              <div className="flex items-center gap-3">
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                {copied ? 'Копирано' : 'Копирај линк'}
              </div>
              {!copied && <Copy className="w-3 h-3 opacity-30" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
