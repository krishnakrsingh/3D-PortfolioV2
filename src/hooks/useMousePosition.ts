import { useState, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  
  const rafRef = useRef<number | null>(null);
  const pendingUpdate = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (pendingUpdate.current) {
        const { x, y } = pendingUpdate.current;
        setMousePosition({
          x,
          y,
          normalizedX: (x / window.innerWidth) * 2 - 1,
          normalizedY: -(y / window.innerHeight) * 2 + 1,
        });
        pendingUpdate.current = null;
      }
      rafRef.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      pendingUpdate.current = { x: event.clientX, y: event.clientY };
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return mousePosition;
}
