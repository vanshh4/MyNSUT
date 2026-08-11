"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { updatePrivacySettings } from "@/lib/api/privacy";
import { MotionButton } from "@/components/ui/MotionButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { StudentPrivacySettings } from "@mynsut/shared/types/privacy";
import { PROFILE_VISIBILITY } from "@mynsut/shared/constants/profileVisibility";

const visibilitySchema = z.nativeEnum(PROFILE_VISIBILITY);

const privacySettingsSchema = z.object({
  bioVisibility: visibilitySchema,
  socialLinksVisibility: visibilitySchema,
  academicSummaryVisibility: visibilitySchema,
  semesterResultsVisibility: visibilitySchema,
});

type PrivacyFormValues = z.infer<typeof privacySettingsSchema>;

export function PrivacySettingsForm({
  settings,
}: {
  settings: StudentPrivacySettings;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      bioVisibility: settings.bioVisibility,
      socialLinksVisibility: settings.socialLinksVisibility,
      academicSummaryVisibility: settings.academicSummaryVisibility,
      semesterResultsVisibility: settings.semesterResultsVisibility,
    },
  });

  async function onSubmit(data: PrivacyFormValues) {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const updated = await updatePrivacySettings(data);
      reset(updated); // reset isDirty
      setMessage({ type: "success", text: "Privacy settings updated successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update privacy settings." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectClass = "flex h-11 w-full rounded-lg border border-glass-border bg-glass-surface px-3 py-2 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md shadow-sm appearance-none";

  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-2">Privacy Settings</h2>
      <p className="text-text-muted text-sm mb-6">Control who can see your profile information.</p>
      
      {message && (
        <div className={`mb-6 p-3 rounded-lg border text-sm ${
          message.type === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border pb-4">
          <div>
            <label className="font-semibold text-text-main">Bio Visibility</label>
            <p className="text-xs text-text-muted">Who can see your bio on your profile.</p>
          </div>
          <div className="w-full sm:w-48">
            <select {...register("bioVisibility")} className={selectClass}>
              <option value="PUBLIC">Public</option>
              <option value="PLATFORM_ONLY">Platform Only</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border pb-4">
          <div>
            <label className="font-semibold text-text-main">Social Links</label>
            <p className="text-xs text-text-muted">Who can see your GitHub and LinkedIn.</p>
          </div>
          <div className="w-full sm:w-48">
            <select {...register("socialLinksVisibility")} className={selectClass}>
              <option value="PUBLIC">Public</option>
              <option value="PLATFORM_ONLY">Platform Only</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border pb-4">
          <div>
            <label className="font-semibold text-text-main">Academic Summary</label>
            <p className="text-xs text-text-muted">Who can see your CGPA and total credits.</p>
          </div>
          <div className="w-full sm:w-48">
            <select {...register("academicSummaryVisibility")} className={selectClass}>
              <option value="PUBLIC">Public</option>
              <option value="PLATFORM_ONLY">Platform Only</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <label className="font-semibold text-text-main">Semester Results</label>
            <p className="text-xs text-text-muted">Who can see your subject grades.</p>
          </div>
          <div className="w-full sm:w-48">
            <select {...register("semesterResultsVisibility")} className={selectClass}>
              <option value="PUBLIC">Public</option>
              <option value="PLATFORM_ONLY">Platform Only</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <MotionButton type="submit" disabled={!isDirty || isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving..." : "Save Privacy Settings"}
          </MotionButton>
        </div>
      </form>
    </GlassCard>
  );
}
