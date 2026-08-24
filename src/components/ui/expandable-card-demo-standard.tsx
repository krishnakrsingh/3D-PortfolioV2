"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
        null
    );
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-50"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid place-items-center z-[100] p-4 sm:p-6 pointer-events-none">
                        <div className="w-[94%] sm:w-full max-w-[520px] max-h-[88vh] sm:max-h-[90vh] relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto">
                            <motion.div
                                layoutId={`card-${active.title}-${id}`}
                                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute inset-0 bg-neutral-900 rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl"
                            />

                            <div className="relative z-10 flex flex-col w-full h-full max-h-[88vh] sm:max-h-[90vh] overflow-hidden">
                                <motion.button
                                    key={`button-${active.title}-${id}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.8,
                                        transition: { duration: 0.1 },
                                    }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="flex absolute top-3 right-3 sm:top-4 sm:right-4 items-center justify-center bg-black/80 hover:bg-black border border-white/20 rounded-full h-8 w-8 sm:h-9 sm:w-9 z-50 text-white transition-transform hover:scale-110 active:scale-95 shadow-lg"
                                    onClick={() => setActive(null)}
                                >
                                    <CloseIcon />
                                </motion.button>

                                <div className="relative shrink-0 overflow-hidden h-48 sm:h-64 md:h-72 w-full">
                                    <motion.img
                                        layoutId={`image-${active.title}-${id}`}
                                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                        width={400}
                                        height={300}
                                        src={active.src}
                                        alt={active.title}
                                        className="w-full h-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60 pointer-events-none" />
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                    transition={{ duration: 0.22, delay: 0.08 }}
                                    className="flex flex-col flex-1 overflow-hidden"
                                >
                                    <div className="flex justify-between items-start p-4 sm:p-6 border-b border-white/10 gap-4 shrink-0">
                                        <div>
                                            <h3 className="font-display font-bold text-white text-xl sm:text-2xl tracking-wide">
                                                {active.title}
                                            </h3>
                                            <p className="text-white/70 text-xs sm:text-sm mt-1">
                                                {active.description}
                                            </p>
                                        </div>

                                        <a
                                            href={active.ctaLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${active.ctaText}: ${active.title}`}
                                            className="px-4 py-2.5 text-xs sm:text-sm rounded-full font-bold bg-brand-gold hover:bg-white text-black transition-all duration-300 shrink-0 shadow-lg inline-flex items-center gap-1"
                                        >
                                            <span>{active.ctaText}</span>
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </a>
                                    </div>
                                    <div className="p-4 sm:p-6 relative overflow-y-auto max-h-[35vh] sm:max-h-[40vh] [scrollbar-width:none] [-ms-overflow-style:none]">
                                        <div className="text-white/75 text-xs sm:text-sm md:text-base pb-4 flex flex-col gap-3">
                                            {typeof active.content === "function"
                                                ? active.content()
                                                : active.content}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </AnimatePresence>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:flex md:flex-col md:gap-3 w-full" itemScope itemType="https://schema.org/ItemList">
                <link itemProp="url" href="https://www.krishnakr.com/#work" />
                <meta itemProp="numberOfItems" content={String(cards.length)} />
                {cards.map((card, idx) => (
                    <article
                        key={`card-${card.title}-${id}`}
                        itemScope
                        itemType="https://schema.org/SoftwareApplication"
                        itemProp="itemListElement"
                        onClick={() => setActive(card)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setActive(card);
                            }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open ${card.title} project details`}
                        className={`group relative rounded-2xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-xl hover:border-brand-gold/40 hover:shadow-brand-gold/5 ${
                            idx === 4 ? "col-span-2 sm:flex-row sm:items-center sm:gap-4" : "col-span-1"
                        } md:p-4 md:flex-row md:justify-between md:items-center md:bg-transparent md:hover:bg-neutral-900/50 md:border-transparent md:hover:border-white/10 md:shadow-none md:hover:shadow-none`}
                    >
                        <meta itemProp="name" content={card.title} />
                        <meta itemProp="description" content={card.description} />
                        <meta itemProp="author" content="Krishna Kr Singh" />
                        <link itemProp="url" href={card.ctaLink} />

                        <motion.div
                            layoutId={`card-${card.title}-${id}`}
                            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 bg-neutral-900/80 rounded-2xl border border-white/10 md:bg-transparent md:border-transparent pointer-events-none"
                        />

                        <div className={`relative z-10 flex flex-col gap-3 ${idx === 4 ? "sm:flex-row sm:items-center sm:gap-4" : ""} md:flex-row md:items-center md:gap-5 w-full md:w-auto min-w-0`}>
                            <div
                                className={`relative overflow-hidden rounded-xl border border-white/10 shrink-0 ${
                                    idx === 4
                                        ? "w-full sm:w-32 h-36 sm:h-20 md:h-14 md:w-14"
                                        : "w-full aspect-[4/3] md:aspect-auto md:h-14 md:w-14"
                                }`}
                            >
                                <motion.img
                                    layoutId={`image-${card.title}-${id}`}
                                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                    width={200}
                                    height={200}
                                    src={card.src}
                                    alt={card.title}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden pointer-events-none" />
                                <div className="absolute top-2 right-2 md:hidden bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-brand-gold px-2 py-0.5 rounded-full shadow-md z-10 pointer-events-none">
                                    0{idx + 1}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 md:gap-0.5 flex-1 min-w-0">
                                <h3 className="font-display sm:font-bold text-white text-sm sm:text-base md:text-base group-hover:text-brand-gold md:group-hover:text-white transition-colors duration-200 line-clamp-1">
                                    {card.title}
                                </h3>
                                <p className="text-white/60 text-[11px] sm:text-xs md:text-sm group-hover:text-white/80 transition-colors duration-200 line-clamp-2 md:line-clamp-1 font-mono md:font-sans leading-relaxed md:leading-normal">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                        <div className="relative z-10 mt-3 pt-2.5 border-t border-white/10 md:border-t-0 md:mt-0 md:pt-0 flex items-center justify-between w-full md:w-auto shrink-0">
                            <span className="text-[10px] font-mono text-brand-gold/70 uppercase tracking-wider md:hidden">
                                {idx === 0 ? "Hardware" : idx === 1 ? "Cybersec" : idx === 2 ? "SaaS AI" : idx === 3 ? "XR Edge" : "Framework"}
                            </span>
                            <a
                                href={card.ctaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm rounded-lg md:rounded-full font-bold bg-white/10 hover:bg-white md:bg-white md:hover:bg-brand-gold text-white hover:text-black md:text-black transition-all duration-200 inline-flex items-center gap-1 shadow-sm shrink-0"
                            >
                                <span>{card.ctaText}</span>
                                <svg className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

const cards = [
    {
        description: "EMG-Controlled Bionic Arm",
        title: "XBionics",
        src: "/assets/human_machine.png",
        ctaText: "View Project",
        ctaLink: "https://github.com/krishnakrsingh/",
        content: () => {
            return (
                <div>
                    <p className="font-bold text-xl mb-2">Neural-signal driven prosthetic</p>
                    <p className="mb-4">
                        Translating muscle impulses into precise mechanical motion. A bridge between human intent and machine action.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1 text-white/50">
                        <li>Embedded control systems</li>
                        <li>Real-time signal processing</li>
                        <li>Custom hardware PCB design</li>
                    </ul>
                    <div className="flex items-center gap-2 mt-4 text-brand-gold">
                        <span className="font-mono text-sm">Human intent → machine action</span>
                    </div>
                </div>
            );
        },
    },
    {
        description: "Portable Pentesting Device",
        title: "BlackESP",
        src: "/assets/blackesp_device.png",
        ctaText: "View Project",
        ctaLink: "https://github.com/krishnakrsingh/",
        content: () => {
            return (
                <div>
                    <p className="font-bold text-xl mb-2">Offensive Security Toolkit</p>
                    <p className="mb-4">
                        ESP32-based offensive security toolkit for wireless reconnaissance and exploit testing. Pocket-sized red team gear.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1 text-white/50">
                        <li>Wi-Fi packet injection</li>
                        <li>Network mapping & scanning</li>
                        <li>Field operations ready</li>
                    </ul>
                    <div className="flex items-center gap-2 mt-4 text-brand-gold">
                        <span className="font-mono text-sm">Pocket-sized red team gear</span>
                    </div>
                </div>
            );
        },
    },
    {
        description: "Voice based Interview Prep Agent",
        title: "FinalRound",
        src: "/assets/finalround.png",
        ctaText: "View Project",
        ctaLink: "https://github.com/krishnakrsingh/",
        content: () => {
            return (
                <div>
                    <p className="font-bold text-xl mb-2">AI Simulation System</p>
                    <p className="mb-4">
                        AI system that simulates interviews, adapts to weaknesses, and trains users in real time.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1 text-white/50">
                        <li>LLM-driven conversations</li>
                        <li>Dynamic memory graph</li>
                        <li>Adaptive prompting engine</li>
                    </ul>
                    <div className="flex items-center gap-2 mt-4 text-brand-gold">
                        <span className="font-mono text-sm">Personalized coaching without humans</span>
                    </div>
                </div>
            );
        },
    },
    {
        description: "Experimental XR Glasses",
        title: "XR-01",
        src: "/assets/coming_soon.png",
        ctaText: "View Project",
        ctaLink: "https://github.com/krishnakrsingh/",
        content: () => {
            return (
                <div>
                    <p className="font-bold text-xl mb-2">Edge Intelligence Wearable</p>
                    <p className="mb-4">
                        Lightweight smart glasses for contextual overlays and edge intelligence.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1 text-white/50">
                        <li>Computer vision integration</li>
                        <li>On-device edge compute</li>
                        <li>Multi-sensor fusion</li>
                        <li>Experimental prototypes only</li>
                    </ul>
                    <div className="flex items-center gap-2 mt-4 text-brand-gold">
                        <span className="font-mono text-sm">Real-world augmented awareness</span>
                    </div>
                </div>
            );
        },
    },
    {
        description: "48-Hour Launch Framework",
        title: "Rapid Prototyping",
        src: "/assets/rapid_labs.jpg",
        ctaText: "View Project",
        ctaLink: "https://github.com/krishnakrsingh/",
        content: () => {
            return (
                <div>
                    <p className="font-bold text-xl mb-2">Production Velocity Engine</p>
                    <p className="mb-4">
                        My internal stack for shipping products insanely fast. A repeatable framework for rapid deployment.
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-1 text-white/50">
                        <li>Next.js optimized templates</li>
                        <li>Pre-built API connectors</li>
                        <li>AI tool integration</li>
                    </ul>
                    <div className="flex items-center gap-2 mt-4 text-brand-gold">
                        <span className="font-mono text-sm">From idea to live in a weekend</span>
                    </div>
                </div>
            );
        },
    },
];
