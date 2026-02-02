import { useRef } from 'react';
import ExpandableCardDemo from '@/components/ui/expandable-card-demo-standard';

// const projects = [
//   {
//     id: 1,
//     title: 'Security Lab',
//     description: 'Personal attack/defense lab for exploit simulation and traffic analysis.',
//     index: '01',
//     tags: ['Cybersecurity', 'Lab'],
//   },
//   {
//     id: 2,
//     title: 'Interview SaaS',
//     description: 'Scalable full-stack system with auth, dashboards, and content engine.',
//     index: '02',
//     tags: ['SaaS', 'Full-Stack'],
//   },
//   {
//     id: 3,
//     title: 'IoT Node',
//     description: 'ESP32-based sensor device for real-time environmental data collection.',
//     index: '03',
//     tags: ['IoT', 'Hardware'],
//   },
//   {
//     id: 4,
//     title: 'Wearable AR',
//     description: 'Micro-display smart glasses prototypes exploring lightweight AR.',
//     index: '04',
//     tags: ['AR', 'Wearables'],
//   },
//   {
//     id: 5,
//     title: 'AI Automation',
//     description: 'Agents and scripts reducing repetitive engineering tasks.',
//     index: '05',
//     tags: ['AI', 'Automation'],
//   },
// ];

export function SelectedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 bg-transparent"
    >
      <div className="px-4 md:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-8 border-b border-brand-gold/20 pb-4">
          <h2
            className="font-display text-section text-white"
          >
            SELECTED WORK
          </h2>
          <span className="font-mono text-xs text-brand-gold/40 hidden md:block">
            PROJECTS
          </span>
        </div>

        <ExpandableCardDemo />
      </div>

      <div className="absolute bottom-0 left-0 w-full section-divider" />
    </section>
  );
}
