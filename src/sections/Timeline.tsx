import { Timeline } from "@/components/ui/timeline";

const TIMELINE_TEXT_CLASSES = "text-white text-lg md:text-xl font-normal tracking-wide leading-relaxed";

const timelineEntries = [
  { title: "2019", description: "Started exploring computers, Linux, and software fundamentals." },
  { title: "2021", description: "Entered cybersecurity & ethical hacking, practiced scripting." },
  { title: "2024", description: "Graduated from St. Paul's School & Began B.Tech Cyber Security at K.R. Mangalam University." },
  { title: "2025", description: "Building AI agents, IoT devices, AR systems, and hardware prototypes." },
  { title: "2026", description: "Launching xbionics." },
];

export function TimelineSection() {
  const data = timelineEntries.map((entry) => ({
    title: entry.title,
    content: (
      <div>
        <p className={TIMELINE_TEXT_CLASSES}>{entry.description}</p>
      </div>
    ),
  }));

  return (
    <div className="relative w-full bg-transparent">
      <Timeline data={data} />
      <div className="absolute bottom-0 left-0 w-full section-divider" />
    </div>
  );
}
