import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PublicProfileProjection, OwnProfileProjection } from "@mynsut/shared/types/profile";
import { ShieldCheck, Award } from "lucide-react";

export function ProfileHeader({ profile }: { profile: PublicProfileProjection | OwnProfileProjection }) {
  const name = "name" in profile ? profile.name : "Student";
  const rollNumber = "rollNumber" in profile ? profile.rollNumber : profile.student.rollNumber;
  const branch = "branch" in profile ? profile.branch : profile.student.branchCode;
  const admissionYear = "admissionYear" in profile ? profile.admissionYear : profile.student.admissionYear;
  const roles = profile.roles;

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
          {roles && (
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
              {roles.isClassCR && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Class Representative
                </div>
              )}
              {roles.societyPORs.map((por, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold tracking-wide">
                  <Award className="w-3.5 h-3.5" />
                  {por.positionName} @ {por.societyName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
