import { GlassCard } from "@/components/ui/GlassCard";
import type { PublicProfileProjection, OwnProfileProjection } from "@mynsut/shared/types/profile";
import { GraduationCap } from "lucide-react";

export function AcademicSummaryCard({ profile }: { profile: PublicProfileProjection | OwnProfileProjection }) {
  const isPrivate = profile.academicSummary === undefined;

  return (
    <GlassCard hoverEffect className="h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <GraduationCap className="size-5 text-primary" /> Academics
      </h2>
      
      {isPrivate ? (
        <div className="h-32 flex items-center justify-center border-2 border-dashed border-glass-border rounded-xl">
          <p className="text-text-muted italic">Hidden by privacy settings.</p>
        </div>
      ) : profile.academicSummary ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-glass-border text-center">
            <p className="text-text-muted text-sm mb-1">Current CGPA</p>
            <p className="text-2xl font-bold text-primary">
              {profile.academicSummary.currentCgpa ? profile.academicSummary.currentCgpa.toFixed(2) : "N/A"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-glass-border text-center">
            <p className="text-text-muted text-sm mb-1">Credits Earned</p>
            <p className="text-2xl font-bold text-primary">
              {profile.academicSummary.totalCreditsEarned}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center border-2 border-dashed border-glass-border rounded-xl">
          <p className="text-text-muted italic">Academic data unavailable.</p>
        </div>
      )}
    </GlassCard>
  );
}
