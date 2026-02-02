"use client";

import { EncryptedText } from "@/components/ui/encrypted-text";

export function Philosophy() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-transparent min-h-[40vh] flex flex-col justify-center">
      <div className="px-4 md:px-8 lg:px-12 w-full max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between mb-8 border-b border-brand-gold/20 pb-2">
          <h2 className="font-display text-section text-white">
            PHILOSOPHY
          </h2>
          <span className="font-mono text-xs text-brand-gold/40 hidden md:block">
            MANIFESTO
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 md:gap-8 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight uppercase">
          <div className="overflow-hidden">
            <EncryptedText
              text="Average never interested me"
              encryptedClassName="text-brand-gold/20"
              revealedClassName="text-brand-gold"
              revealDelayMs={50}
              className="block"
            />
          </div>
          <div className="overflow-hidden">
            <EncryptedText
              text="I just build better."
              encryptedClassName="text-brand-red/20"
              revealedClassName="text-brand-red"
              revealDelayMs={60}
              flipDelayMs={30}
              className="block"
            />
          </div>
        </div>

        {/* Decorative element */}
        <div className="mt-20 flex items-center gap-4">
          <div className="w-16 h-px bg-white/20" />
          <span className="font-mono text-xs text-white/40">Krishna / 2026</span>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 w-full section-divider" />
    </section>
  );
}
