import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MarqueeMessage } from '../../types';

interface DynamicMarqueeProps {
  className?: string;
  speed?: number;
}

export default function DynamicMarquee({ className = "", speed = 40 }: DynamicMarqueeProps) {
  const [messages, setMessages] = useState<MarqueeMessage[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('marquee_messages')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching marquee messages:', error);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        setMessages([
          { id: '1', text: 'ПАРТНЕРИ НА СТУДЕНТАРИЈА 2026', bg_color: '#f3f415', text_color: '#000000', is_active: true, priority: 0 },
          { id: '2', text: 'ЗАЕДНО ГРАДИМЕ ПОДОБРА ИДНИНА', bg_color: '#f3f415', text_color: '#000000', is_active: true, priority: 0 }
        ]);
      }
    }

    fetchMessages();
  }, []);

  if (messages.length === 0) return null;

  // We loop messages and inject scooters
  const displayMessages = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className={`overflow-hidden whitespace-nowrap relative z-40 flex h-28 ${className}`}>
      <motion.div 
        animate={{ x: [0, -4000] }}
        transition={{ duration: speed * 2, repeat: Infinity, ease: "linear" }}
        className="flex h-full min-w-max items-center"
      >
        {displayMessages.map((msg: any, i) => {
          const finalLink = msg.link_url || msg.url;
          const secondaryImage = msg.secondary_image_url;
          const isWolt = msg.text.toLowerCase().includes('wolt');
          const isTelekom = msg.text.toLowerCase().includes('telekom');
          const isSpecial = isWolt || isTelekom;

          const Content = (
            <div 
              style={{ 
                backgroundColor: isWolt ? '#00c1e8' : isTelekom ? '#e20074' : msg.bg_color, 
                color: isSpecial ? '#ffffff' : msg.text_color 
              }}
              className={`flex items-center gap-8 px-12 h-full border-r border-dark/5 hover:bg-white/5 transition-all cursor-pointer relative group/item ${isSpecial ? 'border-none' : ''}`}
            >
              {isWolt && (
                <div className="h-24 w-auto shrink-0 -ml-4">
                  <img 
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDhiZW1xamtwb3NlcGd0M2VrbWViY3loY2dzcm5tN2Q0a2MwcHllaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/KTf9DjoPljUYefiECZ/giphy.gif"
                    alt="Wolt Moving"
                    className="h-full w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {isTelekom && (
                <div className="h-24 w-auto shrink-0 -ml-4">
                  <img 
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTYzenJkeGFqOTRuaWptdmV4OTh3bGs1ZG5lcTBmNzZtd25oOGw3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Wi7Zj7BtI1syBcdfik/giphy.gif"
                    alt="Telekom Moving"
                    className="h-full w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {msg.logo_url && !isSpecial && (
                <div className="relative shrink-0 flex items-center">
                  <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
                  <img 
                    src={msg.logo_url} 
                    alt="" 
                    className="h-14 w-auto object-contain relative z-10" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              
              <div className="flex flex-col justify-center min-w-[200px]">
                <span className="text-[14px] font-black uppercase tracking-[0.4em] whitespace-nowrap leading-tight mb-1">
                  {msg.text}
                </span>
                {finalLink && (
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-current rounded-full" />
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Дознај Повеќе</span>
                   </div>
                )}
              </div>

              {secondaryImage && !isSpecial && (
                <div className="h-24 w-auto shrink-0 relative z-10 flex items-center p-2">
                  <img 
                    src={secondaryImage} 
                    alt="Promotion" 
                    className="h-full w-auto object-contain drop-shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="flex gap-4 items-center opacity-30 shrink-0">
                 <Sparkles className="w-5 h-5 fill-current" />
                 <div className="h-6 w-[1px] bg-current" />
              </div>
            </div>
          );

          return (
            <React.Fragment key={`${msg.id}-${i}`}>
              {finalLink ? (
                <a 
                  href={finalLink} 
                  target={finalLink.startsWith('http') ? '_blank' : '_self'} 
                  rel="noopener noreferrer"
                  className="h-full block z-50 pointer-events-auto"
                >
                  {Content}
                </a>
              ) : (
                <div className="h-full">
                  {Content}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </motion.div>
    </div>
  );
}
