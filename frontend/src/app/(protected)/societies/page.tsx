"use client";

import { Search, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const list = ["IEEE NSUT", "Enactus NSUT", "DebSoc NSUT", "The Alliance", "Ashwamedh", "Canvas"];

export default function Page() {
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Campus communities"
        title="Societies & clubs"
        description="Find the communities that make campus feel like yours."
      />
      
      <div className="relative mb-10 max-w-xl group">
        <Search className="absolute top-1/2 left-4 w-5 h-5 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
        <input 
          className="w-full bg-glass-surface dark:bg-[#1a2b4b]/30 border border-glass-border rounded-full h-14 pl-12 pr-4 font-body text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" 
          placeholder="Search societies..." 
        />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {list.map((x, i) => (
          <motion.div
            key={x}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer h-full"
          >
            <GlassCard className="p-8 h-full flex flex-col shadow-sm transition-shadow hover:shadow-md" hoverEffect={false}>
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-6 ${
                  i % 3 === 0 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : 
                  i % 3 === 1 ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : 
                  "bg-rose-100 dark:bg-[#93000a]/20 text-rose-600 dark:text-[#ffb4ab]"
                }`}
              >
                <UsersRound className="w-7 h-7" />
              </div>
              <h2 className="font-headline text-2xl font-bold text-text-main">{x}</h2>
              <p className="mt-2 font-body text-sm text-text-muted flex-grow">
                Explore members, events, positions and society updates.
              </p>
              <GlassButton variant={i < 2 ? "secondary" : "primary"} className="mt-8 w-full rounded-full">
                {i < 2 ? "View society" : "Request to join"}
              </GlassButton>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
