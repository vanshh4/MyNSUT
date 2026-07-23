"use client";
import { Search, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { MotionButton } from "@/components/ui/MotionButton";
const list = ["IEEE NSUT", "Enactus NSUT", "DebSoc NSUT", "The Alliance", "Ashwamedh", "Canvas"];
export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Campus communities"
        title="Societies & clubs"
        description="Find the communities that make campus feel like yours."
      />
      <div className="relative mb-6 max-w-xl">
        <Search className="absolute top-1/2 left-135 size-4 -translate-y-1/2 text-slate-400" />
        <input className="pill-input pl-11" placeholder="Search societies" />
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {list.map((x, i) => (
          <motion.div
            key={x}
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          >
            <MotionCard className="p-6">
              <span
                className={`grid size-14 place-items-center rounded-full ${i % 3 === 0 ? "bg-motion-mint text-emerald-600" : i % 3 === 1 ? "bg-motion-lilac text-violet-600" : "bg-motion-rose text-rose-600"}`}
              >
                <UsersRound />
              </span>
              <h2 className="display-font mt-5 text-xl font-bold">{x}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Explore members, events, positions and society updates.
              </p>
              <MotionButton variant="soft" className="mt-5">
                {i < 2 ? "View society" : "Request to join"}
              </MotionButton>
            </MotionCard>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
