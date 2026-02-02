"use client";
import { useScroll, motion, useSpring } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 90%"],
    });

    // Smooth out the scroll progress for the drawing line
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Generate a dynamic, organic wavy path
    const generateWavyPath = (totalHeight: number) => {
        const width = 60; // Wider container for the curve
        const center = width / 2;
        const amplitude = 12; // More dramatic wave
        const waveLength = 240; // Longer, more elegant curves

        // Slightly reduced steps to stop exactly at content end
        let d = `M ${center} 15`;
        const steps = Math.ceil(totalHeight / waveLength);

        for (let i = 0; i < steps; i++) {
            const startY = i * waveLength;
            // Complex Cubic Bezier for smoother flow
            d += ` C ${center + amplitude * 1.5} ${startY + waveLength * 0.25}, 
                   ${center - amplitude * 1.5} ${startY + waveLength * 0.75}, 
                   ${center} ${startY + waveLength}`;
        }
        return { d, center };
    };

    const { d: pathD } = generateWavyPath(height || 2000);

    return (
        <div className="w-full bg-transparent font-sans md:px-10 overflow-hidden" ref={containerRef}>
            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-7xl mb-6 text-white max-w-4xl font-display uppercase tracking-tighter">
                        The <span className="text-brand-gold">Journey</span>
                    </h2>
                    <p className="text-white/50 text-base md:text-xl max-w-lg font-light leading-relaxed">
                        Tracing the signal through the noise. A history of building, breaking, and evolving.
                    </p>
                </motion.div>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-10">

                {/* === THE NEURO-THREAD (Main SVG) === */}
                <div className="absolute left-[10px] md:left-[50px] top-0 overflow-visible w-[60px] h-full z-0">
                    <svg
                        viewBox={`0 0 60 ${height}`}
                        width="60"
                        height={height}
                        className="block overflow-visible"
                    >
                        <defs>
                            <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#DC2626" stopOpacity="1" />
                                <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                                <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
                            </linearGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Base Track (Dark pulsing vein) */}
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="4"
                        />

                        {/* The "Guide" Line (Thin white) */}
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="#ffffff"
                            strokeOpacity="0.1"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />

                        {/* === THE SIGNAL (Active Drawing Line) === */}
                        {/* Layer 1: The Glow */}
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="url(#pulse-gradient)"
                            strokeWidth="8"
                            strokeOpacity="0.3"
                            filter="url(#glow)"
                            style={{ pathLength: smoothProgress }}
                            strokeLinecap="round"
                        />
                        {/* Layer 2: The Core */}
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="url(#pulse-gradient)"
                            strokeWidth="3"
                            style={{ pathLength: smoothProgress }}
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {data.map((item, index) => (
                    <div
                        key={index}
                        className={`flex justify-start relative z-10 ${index === 0 ? 'pt-0' : 'pt-10 md:pt-24'}`}
                    >
                        {/* === LEFT COLUMN: MARKER & YEAR === */}
                        <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start w-[80px] md:w-[150px] shrink-0">


                            {/* Correctly positioned Marker Wrapper matching SVG column */}
                            <div className="absolute left-[24px] md:left-[64px] top-0 flex items-center justify-center w-8 h-8">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-4 h-4 rounded-full bg-black border-2 border-brand-red shadow-[0_0_20px_rgba(220,38,38,0.8)] relative"
                                >
                                    {/* Inner Pulse */}
                                    <div className="absolute inset-0 rounded-full bg-brand-red animate-ping opacity-75"></div>
                                </motion.div>

                                {/* Horizontal Connector Beam */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="absolute left-4 top-1/2 h-[2px] w-[40px] md:w-[80px] origin-left bg-gradient-to-r from-brand-red via-brand-red to-transparent rounded-full"
                                />
                            </div>
                        </div>

                        {/* === RIGHT COLUMN: CONTENT === */}
                        <div className="relative pl-8 md:pl-20 pr-4 w-full">
                            {/* Massive Background Watermark Year */}
                            <h3 className="absolute -top-12 -left-4 md:-left-10 text-[6rem] md:text-[8rem] font-bold text-white/[0.1] select-none font-display z-0 leading-none">
                                {item.title}
                            </h3>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                    {/* Visible Title */}
                                    <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white font-display tracking-wide">
                                        {item.title}
                                    </h3>

                                    {/* Desktop Title shown alongside content */}
                                    <h3 className="hidden md:block text-4xl mb-6 text-left font-bold text-white font-display tracking-wide">
                                        {item.title}
                                    </h3>

                                    {item.content}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
