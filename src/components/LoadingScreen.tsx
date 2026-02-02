import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [phase, setPhase] = useState<'enter' | 'spin' | 'move'>('enter');

  useEffect(() => {
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';

    // Start the sequence
    const sequence = async () => {
      // Phase 1: Enter (Zoom in) handled by initial animation
      await new Promise(r => setTimeout(r, 800)); // Slightly reduced wait for entry
      setPhase('spin');

      await new Promise(r => setTimeout(r, 1500)); // Spin for a bit (reduced from 2000)

      // Find the hero vinyl
      const heroVinyl = document.getElementById('hero-vinyl');
      if (heroVinyl) {
        const rect = heroVinyl.getBoundingClientRect();
        setTargetRect(rect);
        setPhase('move');
      } else {
        onComplete();
      }
    };

    // Start sequence immediately
    const timer = setTimeout(() => {
      sequence();
    }, 50);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Cleanup when "move" animation finishes
  const handleMoveComplete = () => {
    if (phase === 'move') {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background Backdrop - Spotlight Gradient */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black will-change-opacity transform-gpu"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'move' ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Audio Visualizer Waves - Fades out during move */}
      <motion.div
        className="absolute z-0 will-change-transform transform-gpu"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: phase === 'move' ? 0 : 1, // Fade out when moving
          scale: phase === 'move' ? 1.5 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Multiple pulsing rings */}
        {[...Array(2)].map((_, i) => ( // Reduced to 2 rings
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border border-white/5"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* The Vinyl Container - wraps the rotating vinyl and static shadow */}
      <motion.div
        initial={{ scale: 0 }}
        animate={
          phase === 'enter' ? { scale: 1.5, x: 0, y: 0 } :
            phase === 'spin' ? { scale: 1.5, x: 0, y: 0 } :
              phase === 'move' && targetRect ? {
                x: targetRect.left + targetRect.width / 2 - window.innerWidth / 2,
                y: targetRect.top + targetRect.height / 2 - window.innerHeight / 2,
                scale: targetRect.width / 180, // Match visual size
              } : {}
        }
        transition={{
          scale: { duration: 1, ease: "backOut" },
          x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }}
        onLayoutAnimationComplete={phase === 'move' ? handleMoveComplete : undefined}
        onAnimationComplete={phase === 'move' ? handleMoveComplete : undefined}
        className="relative flex items-center justify-center z-10 will-change-transform transform-gpu"
        style={{ width: 180, height: 180 }}
      >
        {/* Static Shadow Wrapper (Doesn't Rotate) */}
        <div className="absolute inset-0 rounded-full shadow-2xl shadow-black/80 pointer-events-none" />

        {/* Rotating Vinyl */}
        <motion.div
          className="relative w-full h-full rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
          style={{ willChange: 'transform' }}
        >
          {/* Grooves - Simplified for performance */}
          <div className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, transparent 30%, #222 31%, transparent 32%, #222 34%, transparent 35%, #222 37%, transparent 38%, #222 41%, transparent 42%, #222 45%, transparent 46%, #222 50%, transparent 51%)'
            }}
          />

          {/* Glass Reflection - Simplified */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

          {/* Label */}
          <div className="relative w-[35%] h-[35%] bg-[#e0aa3e] rounded-full border-4 border-black flex items-center justify-center shadow-inner z-10">
            <div className="absolute inset-0 rounded-full border border-black/20 opacity-50" />
          </div>

          {/* Spindle */}
          <div className="absolute w-[3%] h-[3%] bg-black rounded-full z-20" />
        </motion.div>
      </motion.div>
    </div>
  );
}
