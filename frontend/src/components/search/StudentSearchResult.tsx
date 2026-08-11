import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PublicProfileProjection } from "@mynsut/shared/types/profile";
import { ChevronRight, GraduationCap } from "lucide-react";

export function StudentSearchResult({ student }: { student: PublicProfileProjection }) {
  return (
    <Link href={`/profile/${student.rollNumber}`}>
      <motion.div whileHover={{ y: -2 }} className="h-full">
        <GlassCard hoverEffect className="h-full flex items-center justify-between p-4 group cursor-pointer transition-colors hover:border-primary/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">
                {student.name}
              </h3>
              <p className="text-sm text-text-muted mt-0.5 flex items-center gap-2">
                <span>{student.rollNumber}</span>
                <span className="w-1 h-1 rounded-full bg-glass-border"></span>
                <span>{student.branch}</span>
                <span className="w-1 h-1 rounded-full bg-glass-border"></span>
                <span>Class of {student.admissionYear + 4}</span>
              </p>
            </div>
          </div>
          <div className="shrink-0 text-text-muted group-hover:text-primary transition-colors">
            <ChevronRight className="size-5" />
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}
