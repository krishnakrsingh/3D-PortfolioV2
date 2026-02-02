import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { Hero } from './sections/Hero';
import { Systems } from './sections/Systems';
import { SelectedWork } from './sections/SelectedWork';
import { Philosophy } from './sections/Philosophy';
import { TimelineSection } from './sections/Timeline';
import { Contact } from './sections/Contact';
import { ShootingStars } from './components/ui/shooting-stars';
import { StarsBackground } from './components/ui/stars-background';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      ScrollTrigger.refresh();
    }
  }, [isLoading]);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Optimized Background with Shooting Stars */}
      <div className="fixed inset-0 w-full h-full bg-black z-0">
        <ShootingStars starColor="#F6DA9D" trailColor="#DC2626" minDelay={800} maxDelay={3000} />
        <StarsBackground starDensity={0.0002} />
      </div>

      {/* Main Content */}
      <main
        className="relative z-10 min-h-screen"
      >
        <Hero isLoading={isLoading} />

        {/* Defer heavy sections until loading is complete to optimize initial frame rate */}
        {!isLoading && (
          <div className="animate-in fade-in duration-1000">
            <Systems />
            <SelectedWork />
            <Philosophy />
            <TimelineSection />
            <Contact />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
