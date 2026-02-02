import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Hero({ isLoading }: { isLoading?: boolean }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize audio and attempt autoplay
    useEffect(() => {
        const audio = new Audio("/assets/music.mp3");
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        // Attempt autoplay
        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                // Autoplay blocked - will start on first user interaction
                console.log("Autoplay blocked, waiting for user interaction");

                // Add one-time click listener to start audio
                const startAudioOnInteraction = async () => {
                    try {
                        await audio.play();
                        setIsPlaying(true);
                    } catch (e) {
                        console.log("Audio play failed:", e);
                    }
                    document.removeEventListener('click', startAudioOnInteraction);
                };
                document.addEventListener('click', startAudioOnInteraction);
            }
        };

        // Start playing after loading screen
        if (!isLoading) {
            playAudio();
        }

        return () => {
            audio.pause();
            audio.src = "";
        };
    }, [isLoading]);

    // Toggle play/pause when vinyl is clicked
    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
        }
    };

    return (
        <section className="relative h-dvh w-full bg-transparent text-white p-4 md:p-6 flex flex-col justify-between overflow-hidden">

            {/* Background Noise/Grid (Optional) */}


            {/* Header / Nav */}
            <div className="relative z-10 flex justify-between items-end w-full shrink-0 mb-4 md:mb-8">
                {/* Logo */}
                <div className="border-2 border-brand-gold w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    <span className="font-pixel text-xl md:text-2xl font-bold text-brand-gold">K</span>
                </div>

                {/* Talk CTA */}
                <a
                    href="#contact"
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-300 text-xs font-bold tracking-[0.2em] font-mono group"
                >
                    TALK
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
            </div>

            {/* Main Content Wrapper - Centers content vertically */}
            <div className="flex-1 flex flex-col justify-center w-full max-w-[1800px] mx-auto z-10 pb-0">

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full mb-2">

                    {/* Left Column: Name & Intro & What I Do */}
                    <div className="md:col-span-3 flex flex-col gap-4 md:gap-8">
                        <div>
                            <h1 className="font-pixel text-4xl md:text-4xl lg:text-5xl mb-2 md:mb-4 leading-tight tracking-wide">
                                KRISHNA<br />SINGH
                            </h1>
                            <div className="relative pl-6 border-l border-white/30 block mt-2">
                                <ArrowUpRight className="absolute -left-3 top-0 w-6 h-6 bg-black text-white p-1" />
                                <p className="text-xs text-gray-400 mt-2 font-mono leading-relaxed max-w-[200px]">
                                    Building intelligent agents<br />
                                    & real-world systems.
                                </p>
                            </div>
                        </div>

                        {/* What I Do - Moved here */}
                        <div className="block">
                            <h3 className="font-mono text-brand-gold text-xs mb-2 uppercase tracking-widest">What I do</h3>
                            <p className="text-sm font-mono text-gray-300 leading-relaxed">
                                Software. Hardware. AI.
                            </p>
                        </div>
                    </div>

                    {/* Center Column: Design & Eng Only */}
                    <div className="md:col-span-6 flex flex-col h-full">
                        <h2 className="font-pixel text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide">
                            Design &<br />Engineering
                        </h2>
                    </div>

                    {/* Right Column: CAPABILITIES & Vinyl Record */}
                    <div className="md:col-span-3 md:text-left flex flex-col justify-between h-full md:pl-[30px] gap-8 md:gap-0 mt-4 md:mt-0">
                        <div>
                            <h3 className="font-mono text-brand-gold text-xs mb-4 uppercase tracking-widest">CAPABILITIES</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-1.5 text-xs md:text-sm font-mono text-gray-300">
                                <li className="hover:text-white cursor-pointer transition-colors">AI Systems</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Cyber Security</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Embedded Hardware</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Full-Stack Engineering</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Automation</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Research & Prototyping</li>
                            </ul>
                        </div>

                        {/* Vinyl Record (Rotating) - Click to toggle music */}
                        <div className="flex justify-end items-end mt-auto hover:scale-110 transition-transform duration-300 md:-mb-4 md:-mr-4 md:translate-x-[-80px] md:translate-y-[50px]">
                            <div
                                id="hero-vinyl"
                                onClick={toggleAudio}
                                role="button"
                                aria-label={isPlaying ? "Pause music" : "Play music"}
                                className={`relative w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] cursor-pointer transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            >
                                {/* Static Shadow - Performance Optimization */}
                                <div className="absolute inset-0 rounded-full shadow-2xl shadow-black/80 pointer-events-none" />

                                {/* Rotating Inner Disc */}
                                <div
                                    className={`relative w-full h-full rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden ${isPlaying && !isLoading ? 'animate-spin' : ''}`}
                                    style={{ animationDuration: '4s' }}
                                >
                                    {/* Grooves - Optimized opacity & Gradient */}
                                    <div className="absolute inset-0 rounded-full opacity-20"
                                        style={{
                                            background: 'radial-gradient(circle, transparent 30%, #222 31%, transparent 32%, #222 34%, transparent 35%, #222 37%, transparent 38%, #222 41%, transparent 42%, #222 45%, transparent 46%, #222 50%, transparent 51%)'
                                        }}
                                    />

                                    {/* Glass Reflection */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                                    {/* Label */}
                                    <div className="relative w-10 h-10 lg:w-16 lg:h-16 bg-[#e0aa3e] rounded-full border-4 border-black flex items-center justify-center shadow-inner z-10 group/vinyl-label transition-all duration-300">
                                        <div className="absolute inset-0 rounded-full border border-black/20 opacity-50" />

                                        {/* Hover Backdrop - Dark overlay for better icon visibility */}
                                        <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover/vinyl-label:opacity-100 transition-all duration-300 z-20" />

                                        {/* Play/Pause Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-300">
                                            {isPlaying ? (
                                                <div className="w-6 h-6 lg:w-8 lg:h-8 text-white opacity-0 group-hover/vinyl-label:opacity-100 transition-all duration-300 transform group-hover/vinyl-label:scale-110">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-lg">
                                                        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-7 h-7 lg:w-10 lg:h-10 text-black group-hover/vinyl-label:text-white transition-colors duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-lg animate-pulse pl-0.5">
                                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manifesto Text */}
                <div className="relative z-10 w-full -mt-16 md:-mt-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-pixel text-[41px] md:text-[53px] lg:text-[65px] uppercase tracking-tighter text-white/90"
                    >
                        OUTWORK . OUTBUILD . OUTLAST
                    </motion.h2>
                </div>
            </div>

            {/* Footer / Bottom Bar */}
            <footer className="relative z-10 flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-4 mt-4 md:mt-0 text-[10px] md:text-xs font-mono text-gray-400 shrink-0">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <p>Open to building together...</p>
                    <a
                        href="#contact"
                        className="text-brand-red hover:text-white transition-colors duration-300 font-bold flex items-center gap-1 group"
                    >
                        lets talk
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>


                <span className="md:ml-4 self-center inline-block text-[8px] md:text-xs text-gray-500 mt-2 md:mt-0">AI • Security • Hardware • Systems Engineering</span>
            </footer>

            {/* Hero Bottom Divider */}
            <div className="absolute bottom-0 left-0 w-full section-divider z-20" />
        </section>
    );
}   