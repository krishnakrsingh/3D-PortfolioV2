import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github, ShieldCheck, Code2 } from 'lucide-react';
import OptimizedBlackHole from '@/components/ui/optimized-black-hole';

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
      username: "mail@krishx.me",
      external: false,
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" fill="currentColor" />,
      href: "https://www.linkedin.com/in/krishnakrsingh/",
      username: "@krishnakrsingh",
      external: true,
    },
    {
      title: "Github",
      icon: <Github className="w-6 h-6" fill="currentColor" />,
      href: "https://github.com/krishnakrsingh/",
      username: "@krishnakrsingh",
      external: true,
    },
    {
      title: "TryHackMe",
      icon: <ShieldCheck className="w-6 h-6" />,
      href: "https://tryhackme.com/p/krishnakrsingh",
      username: "@krishnakrsingh",
      external: true,
    },
    {
      title: "LeetCode",
      icon: <Code2 className="w-6 h-6" />,
      href: "https://leetcode.com/u/krishnakrsinghh/",
      username: "@krishnakrsinghh",
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      itemScope
      itemType="https://schema.org/ContactPage"
      ref={sectionRef}
      className="relative w-full bg-transparent flex flex-col justify-between overflow-hidden min-h-screen"
    >
      {/* Full-Width Immersive Black Hole Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden">
        <OptimizedBlackHole />
      </div>

      <div className="relative z-10 flex-1 w-full px-4 md:px-8 lg:px-12 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 pointer-events-none">

        {/* Left: Content & Buttons */}
        <div ref={contentRef} className="w-full lg:w-1/2 flex flex-col gap-10 pointer-events-auto">
          <div>
            <h2 id="contact-heading" className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter leading-[0.9] mb-6">
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
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "me noopener noreferrer" : undefined}
                aria-label={`${link.title}: ${link.username}`}
                className="group flex-1 min-w-[140px] h-14 relative bg-black/80 backdrop-blur-md border border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 px-6"
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

        {/* Right side spacer for desktop layout */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-[70vh] pointer-events-none" />

      </div>

      <footer className="w-full px-4 md:px-8 lg:px-12 py-3 border-t border-white/5 relative z-20 bg-transparent pointer-events-auto">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm md:text-base font-medium text-white/80">Krishna KR Singh</span>
            <span className="text-white/30 text-xs font-mono">2026</span>
          </div>

          <span className="font-mono text-xs text-white/30 tracking-wider">INDIA</span>
        </div>
      </footer>
    </section>
  );
}
