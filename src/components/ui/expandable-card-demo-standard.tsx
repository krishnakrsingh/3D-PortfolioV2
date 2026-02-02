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
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0  grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
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
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-black/50 hover:bg-black rounded-full h-6 w-6 z-50 text-white"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-neutral-900 sm:rounded-3xl overflow-hidden border border-white/10"
                        >
                            <motion.div layoutId={`image-${active.title}-${id}`}>
                                <img
                                    width={200}
                                    height={200}
                                    src={active.src}
                                    alt={active.title}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div className="">
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className="font-bold text-white"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-white/70"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layoutId={`button-${active.title}-${id}`}
                                        href={active.ctaLink}
                                        target="_blank"
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                    >
                                        {active.ctaText}
                                    </motion.a>
                                </div>
                                <div className="pt-4 relative px-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-white/60 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                    >
                                        {typeof active.content === "function"
                                            ? active.content()
                                            : active.content}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <div className="w-full gap-4">
                {cards.map((card) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={`card-${card.title}-${id}`}
                        onClick={() => setActive(card)}
                        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer group"
                    >
                        <div className="flex gap-4 flex-col md:flex-row ">
                            <motion.div layoutId={`image-${card.title}-${id}`}>
                                <img
                                    width={100}
                                    height={100}
                                    src={card.src}
                                    alt={card.title}
                                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                                />
                            </motion.div>
                            <div className="">
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-medium text-white group-hover:text-neutral-900 transition-colors duration-200 text-center md:text-left"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.description}-${id}`}
                                    className="text-white/60 group-hover:text-neutral-700 transition-colors duration-200 text-center md:text-left"
                                >
                                    {card.description}
                                </motion.p>
                            </div>
                        </div>
                        <motion.a
                            layoutId={`button-${card.title}-${id}`}
                            href={card.ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0 inline-block"
                        >
                            {card.ctaText}
                        </motion.a>
                    </motion.div>
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
        ctaLink: "https://github.com/krishnakrsingh",
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
        ctaLink: "https://github.com/krishnakrsingh",
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
        ctaLink: "https://github.com/krishnakrsingh",
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
        ctaLink: "https://github.com/krishnakrsingh",
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
        ctaLink: "https://github.com/krishnakrsingh",
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
