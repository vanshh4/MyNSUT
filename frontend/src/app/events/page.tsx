"use client";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { MotionButton } from "@/components/ui/MotionButton";
const events = [
  { d: "15 Jul", t: "Designing Better Products", s: "IEEE NSUT", status: "12 seats left" },
  { d: "19 Jul", t: "The Annual Debate Open", s: "DebSoc NSUT", status: "Open" },
  { d: "22 Jul", t: "Social Impact Workshop", s: "Enactus NSUT", status: "Waitlist" },
];
export default function Page() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="What’s happening"
        title="Events & fests"
        description="Discover, register and keep track of your next campus experience."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {events.map((e, i) => (
          <motion.div
            key={e.t}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring" }}
          >
            <MotionCard className="overflow-hidden p-3">
              <div
                className={`rounded-[25px] p-5 ${i === 0 ? "bg-[#4968f2] text-white" : i === 1 ? "bg-motion-mint text-emerald-900" : "bg-motion-rose text-rose-900"}`}
              >
                <CalendarDays />
                <p className="mt-8 text-xs font-black tracking-[.15em] uppercase">{e.d}</p>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-[#4968f2]">{e.s}</p>
                <h2 className="display-font mt-2 text-xl font-bold">{e.t}</h2>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                  <span className="flex gap-1">
                    <MapPin className="size-4" />
                    Campus
                  </span>
                  <span className="flex gap-1">
                    <Users className="size-4" />
                    {e.status}
                  </span>
                </div>
                <MotionButton className="mt-5 w-full" variant={i === 2 ? "soft" : "primary"}>
                  {i === 2 ? "Join waitlist" : "View event"}
                </MotionButton>
              </div>
            </MotionCard>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
