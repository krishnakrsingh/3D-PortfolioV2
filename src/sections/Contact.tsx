import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github } from 'lucide-react';
import GlobeDemo from '@/components/ui/globe-demo';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    {
      title: "Mail",
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:krishnakr2432007@gmail.com",
      username: "mail@krishx.me"
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" fill="currentColor" />,
      href: "https://linkedin.com/in/krishnakrsingh",
      username: "@krishnakrsingh"
    },
    {
      title: "Github",
      icon: <Github className="w-6 h-6" fill="currentColor" />,
      href: "https://github.com/krishnakrsingh",
      username: "@krishnakrsingh"
    }
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-transparent flex flex-col overflow-hidden"
    >
      <div className="flex-1 w-full px-4 md:px-8 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

        {/* Left: Content & Buttons */}
        <div ref={contentRef} className="w-full lg:w-1/2 flex flex-col gap-10 z-10">
          <div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter leading-[0.9] mb-6">
              LET'S START <br />
              <span className="text-brand-red">BUILDING.</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-light max-w-md">
              Available for new projects and collaborations.
              Let's create something that breaks the internet.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 w-full max-w-lg">
            {socialLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 min-w-[140px] h-14 relative bg-black border border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 px-6"
              >
                {/* Fill Effect */}
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-300">
                  <span className="group-hover:text-black text-white transition-colors duration-300">
                    {link.icon}
                  </span>
                  <span className="font-display font-medium text-sm tracking-wide uppercase text-white group-hover:text-black transition-colors duration-300">
                    {link.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Globe Interaction */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-[80vh] relative min-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none lg:pointer-events-auto">
            <GlobeDemo />
          </div>
          {/* Gradient Overlay to blend globe edges */}
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/80" />
        </div>

      </div>

      <footer className="w-full px-4 md:px-8 lg:px-12 py-8 border-t border-brand-gold/10 relative z-20 bg-black">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-bold text-white">Krishna</span>
            <span className="text-white/40 text-sm">2026</span>
          </div>

          <span className="font-mono text-xs text-white/40">INDIA</span>
        </div>
      </footer>
    </section>
  );
}
