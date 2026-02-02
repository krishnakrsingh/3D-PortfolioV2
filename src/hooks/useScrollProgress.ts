import { useState, useEffect, useRef } from 'react';

interface ScrollProgress {
  progress: number;
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    scrollDirection: null,
  });
  
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
        
        const direction = currentScrollY > lastScrollY.current 
          ? 'down' 
          : currentScrollY < lastScrollY.current 
            ? 'up' 
            : null;
        
        lastScrollY.current = currentScrollY;
        
        setScrollProgress({
          progress: Math.min(Math.max(progress, 0), 1),
          scrollY: currentScrollY,
          scrollDirection: direction,
        });
        
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return scrollProgress;
}
