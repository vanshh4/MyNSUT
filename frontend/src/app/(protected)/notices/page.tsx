"use client";

import { ExternalLink, Search } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";

const rows = [
  "End-semester examination schedule",
  "University holiday notification",
  "Course registration window",
];

export default function Page() {
  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Official updates"
        title="Notices & circulars"
        description="Admin-selected updates in one clear, reliable feed."
      />
      
      <div className="relative mb-10 max-w-xl group">
        <Search className="absolute top-1/2 left-4 w-5 h-5 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
        <input 
          className="w-full bg-glass-surface dark:bg-[#1a2b4b]/30 border border-glass-border rounded-full h-14 pl-12 pr-4 font-body text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" 
          placeholder="Search notices..." 
        />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-4"
      >
        {rows.map((r, i) => (
          <motion.div
            key={r}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard 
              className="flex items-center justify-between p-6 cursor-pointer group hover:bg-white/40 dark:hover:bg-white/5 transition-colors" 
              hoverEffect={false}
              whileHover={{ x: 10 }}
            >
              <div>
                <span className={`inline-block rounded-full px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider mb-3 ${
                  i === 1 
                    ? "bg-rose-100 text-rose-700 dark:bg-[#93000a]/20 dark:text-[#ffb4ab]" 
                    : "bg-blue-100 text-blue-700 dark:bg-[#e2e2e2]/20 dark:text-[#ffffff]"
                }`}>
                  {i === 1 ? "Holiday" : "Academic"}
                </span>
                <h2 className="font-body text-lg font-medium text-text-main">{r}</h2>
                <p className="mt-1 font-body text-sm text-text-muted">Published recently</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent group-hover:bg-primary/5 dark:group-hover:bg-white/10 transition-colors">
                <ExternalLink className="w-5 h-5 text-text-muted group-hover:text-primary dark:group-hover:text-white transition-colors" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
