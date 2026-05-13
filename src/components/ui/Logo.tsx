import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  showIcon?: boolean;
}

export default function Logo({ className = "", showIcon = true, colorOverride }: LogoProps & { colorOverride?: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'site_config')
          .single();
        
        if (data?.value?.logo_url) {
          setLogoUrl(data.value.logo_url);
        }
      } catch (e) {
        console.error('Error fetching logo:', e);
      }
    }
    fetchLogo();
  }, []);

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt="Studentarija Logo" 
          className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
        />
      ) : showIcon && (
        <motion.div 
          whileHover={{ rotate: 12, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0"
        >
          <span className="text-dark font-black text-xl leading-none italic select-none">S</span>
        </motion.div>
      )}
      <div className="flex items-center leading-none whitespace-nowrap">
        <span className={cn(
          "font-mont font-black text-lg md:text-xl tracking-tighter uppercase",
          colorOverride || "text-dark-main"
        )}>
          СТУДЕНТАРИЈА
        </span>
        <span className="font-mont font-black text-lg md:text-xl tracking-tighter uppercase text-primary">
          .MK
        </span>
      </div>
    </Link>
  );
}
