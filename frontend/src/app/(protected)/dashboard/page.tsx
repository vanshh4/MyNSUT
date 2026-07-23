"use client";
import { CalendarDays, Megaphone, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { MotionButton } from "@/components/ui/MotionButton";
const stats = [
  { title: "New notices", value: "7", icon: Megaphone, tone: "bg-motion-rose text-rose-600" },
  {
    title: "Upcoming events",
    value: "3",
    icon: CalendarDays,
    tone: "bg-motion-ice text-[#4968f2]",
  },
];
export default function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Monday · 13 July"
        title="Good afternoon, Vansh"
        description="A calmer view of everything happening across your class and campus."
      />
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {stats.map(({ title, value, icon: Icon, tone }) => (
          <motion.div
            key={title}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ type: "spring", stiffness: 150, damping: 19 }}
          >
            <MotionCard className="flex items-center justify-between p-6">
              <div>
                <p className="display-font text-4xl font-black">{value}</p>
                <p className="mt-2 text-sm font-bold">{title}</p>
              </div>
              <span className={`grid size-14 place-items-center rounded-full ${tone}`}>
                <Icon />
              </span>
            </MotionCard>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <MotionCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Your class</p>
              <h2 className="display-font mt-2 text-2xl font-bold">Recent announcements</h2>
            </div>
            <MotionButton variant="soft">
              View all <ArrowUpRight className="size-4" />
            </MotionButton>
          </div>
          <div className="mt-6 space-y-3">
            {["Submit DBMS assignment", "Updated lab schedule", "Internal assessment dates"].map(
              (x, i) => (
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  key={x}
                  className="flex items-center justify-between rounded-[22px] bg-white/60 p-4 dark:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-bold">{x}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {i === 0 ? "Due tomorrow" : "Posted recently"}
                    </p>
                  </div>
                  <span className="size-2 rounded-full bg-[#4968f2]" />
                </motion.div>
              )
            )}
          </div>
        </MotionCard>
        <MotionCard className="overflow-hidden bg-[#4968f2] p-6 text-white">
          <p className="text-xs font-extrabold tracking-[.16em] text-blue-100 uppercase">
            Next event
          </p>
          <h2 className="display-font mt-3 text-3xl font-black">Designing Better Products</h2>
          <div className="mt-7 space-y-3 text-sm text-blue-100">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              15 July · 3:00 PM
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              Mini Auditorium
            </p>
          </div>
          <MotionButton variant="ghost" className="mt-7 bg-white text-[#334cc5]">
            View event
          </MotionButton>
        </MotionCard>
      </div>
    </>
  );
}
