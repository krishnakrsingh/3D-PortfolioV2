"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function AppleCardsCarouselDemo() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full">
            <Carousel items={cards} />
        </div>
    );
}



const data = [
    {
        category: "SYSTEM 01",
        title: "Autonomous Agents",
        src: "/assets/autonomous_agents.png",
        content: (
            <div className="bg-neutral-900/50 border border-white/10 p-4 md:p-14 rounded-3xl mb-4 backdrop-blur-md">
                <p className="text-neutral-400 text-base md:text-2xl font-mono max-w-3xl mx-auto">
                    <span className="font-bold text-white font-display">
                        LLM systems that think and act independently.
                    </span>{" "}
                    Building agents that can reason, plan, and execute complex tasks without human intervention.
                </p>
                <img
                    src="/assets/autonomous_agents.png"
                    alt="Autonomous Agents"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl border border-white/10"
                />
            </div>
        ),
    },
    {
        category: "SYSTEM 02",
        title: "Cyber Offense",
        src: "/assets/cyber_offense.png",
        content: (
            <div className="bg-neutral-900/50 border border-white/10 p-4 md:p-14 rounded-3xl mb-4 backdrop-blur-md">
                <p className="text-neutral-400 text-base md:text-2xl font-mono max-w-3xl mx-auto">
                    <span className="font-bold text-white font-display">
                        Pentesting tools, exploits, hardened defenses.
                    </span>{" "}
                    Advanced red-teaming capability and automated vulnerability research.
                </p>
                <img
                    src="/assets/cyber_offense.png"
                    alt="Cyber Offense"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl border border-white/10"
                />
            </div>
        ),
    },
    {
        category: "SYSTEM 03",
        title: "Human × Machine Hardware",
        src: "/assets/human_machine.png",
        content: (
            <div className="bg-neutral-900/50 border border-white/10 p-4 md:p-14 rounded-3xl mb-4 backdrop-blur-md">
                <p className="text-neutral-400 text-base md:text-2xl font-mono max-w-3xl mx-auto">
                    <span className="font-bold text-white font-display">
                        Bionics, sensors, embedded intelligence.
                    </span>{" "}
                    Bridging the gap between biological intent and mechanical action.
                </p>
                <img
                    src="/assets/human_machine.png"
                    alt="Human Machine Hardware"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl border border-white/10"
                />
            </div>
        ),
    },
    {
        category: "SYSTEM 04",
        title: "Rapid Prototyping",
        src: "/assets/rapid_labs.jpg",
        content: (
            <div className="bg-neutral-900/50 border border-white/10 p-4 md:p-14 rounded-3xl mb-4 backdrop-blur-md">
                <p className="text-neutral-400 text-base md:text-2xl font-mono max-w-3xl mx-auto">
                    <span className="font-bold text-white font-display">
                        Ideas shipped before others start planning.
                    </span>{" "}
                    A systematic approach to going from zero to one in record time.
                </p>
                <img
                    src="/assets/rapid_labs.jpg"
                    alt="Rapid Product Labs"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl border border-white/10"
                />
            </div>
        ),
    },
    {
        category: "SYSTEM 05",
        title: "Full-Stack Infrastructure",
        src: "/assets/fullstack.png",
        content: (
            <div className="bg-neutral-900/50 border border-white/10 p-4 md:p-14 rounded-3xl mb-4 backdrop-blur-md">
                <p className="text-neutral-400 text-base md:text-2xl font-mono max-w-3xl mx-auto">
                    <span className="font-bold text-white font-display">
                        Scalable apps, APIs, real-time systems.
                    </span>{" "}
                    Robust distributed systems built for high availability and performance.
                </p>
                <img
                    src="/assets/fullstack.png"
                    alt="Full-Stack Infrastructure"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl border border-white/10"
                />
            </div>
        ),
    },

];
