"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const events = [
  { d: "15 Jul", t: "Designing Better Products", s: "IEEE NSUT", status: "12 seats left" },
  { d: "19 Jul", t: "The Annual Debate Open", s: "DebSoc NSUT", status: "Open" },
  { d: "22 Jul", t: "Social Impact Workshop", s: "Enactus NSUT", status: "Waitlist" },
];

export default function Page() {
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="What's happening"
        title="Events & fests"
        description="Discover, register and keep track of your next campus experience."
      />
      
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {events.map((e, i) => (
          <motion.div
            key={e.t}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
          >
            <GlassCard className="overflow-hidden p-3 shadow-sm transition-shadow hover:shadow-md" hoverEffect={false}>
              <div
                className={`rounded-[20px] p-6 flex flex-col items-center justify-center min-h-[140px] ${
                  i === 0 ? "bg-blue-600 text-white" : 
                  i === 1 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : 
                  "bg-rose-100 dark:bg-[#93000a]/20 text-rose-700 dark:text-[#ffb4ab]"
                }`}
              >
                <CalendarDays className="w-8 h-8 mb-4" />
                <p className="font-label text-xs font-bold tracking-widest uppercase">{e.d}</p>
              </div>
              
              <div className="p-5">
                <p className="font-label text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{e.s}</p>
                <h2 className="font-headline mt-2 text-xl font-bold text-text-main line-clamp-1">{e.t}</h2>
                
                <div className="mt-4 flex flex-wrap gap-4 font-body text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    Campus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {e.status}
                  </span>
                </div>
                
                <GlassButton className="mt-6 w-full rounded-full" variant={i === 2 ? "secondary" : "primary"}>
                  {i === 2 ? "Join waitlist" : "View event"}
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
