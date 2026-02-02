import { useRef } from 'react';
import AppleCardsCarouselDemo from '@/components/ui/apple-cards-carousel-demo';

export function Systems() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 md:py-16 bg-transparent"
    >
      <div className="px-4 md:px-8 lg:px-12">
        {/* Heading */}
        <div className="flex items-end justify-between mb-4 border-b border-brand-gold/20 pb-2">
          <h2
            className="font-display text-section text-white"
          >
            SYSTEMS I BUILD
          </h2>
          <span className="font-mono text-xs text-brand-gold/40 hidden md:block">
            04 CATEGORIES
          </span>
        </div>

        <AppleCardsCarouselDemo />


      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 w-full section-divider" />
    </section>
  );
}
