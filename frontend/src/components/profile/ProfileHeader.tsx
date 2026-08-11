import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PublicProfileProjection, OwnProfileProjection } from "@mynsut/shared/types/profile";

export function ProfileHeader({ profile }: { profile: PublicProfileProjection | OwnProfileProjection }) {
  const name = "name" in profile ? profile.name : "Student";
  const rollNumber = "rollNumber" in profile ? profile.rollNumber : profile.student.rollNumber;
  const branch = "branch" in profile ? profile.branch : profile.student.branchCode;
  const admissionYear = "admissionYear" in profile ? profile.admissionYear : profile.student.admissionYear;
  return (
    <GlassCard className="mb-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-3xl font-bold text-primary"
        >
          {name.charAt(0)}
        </motion.div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-text-main">{name}</h1>
          <p className="text-text-muted mt-1">
            {rollNumber} • {branch} • Class of {admissionYear + 4}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
