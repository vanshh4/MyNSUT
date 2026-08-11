"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { updateOwnProfile } from "@/lib/api/profiles";
import { GlassInput } from "@/components/ui/GlassInput";
import { MotionButton } from "@/components/ui/MotionButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { OwnProfileProjection } from "@mynsut/shared/types/profile";

const editProfileSchema = z.object({
  bio: z.string().max(500, "Bio cannot exceed 500 characters").nullable().optional(),
  githubUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export function EditProfileForm({
  profile,
  onSuccess,
}: {
  profile: OwnProfileProjection;
  onSuccess: (updated: OwnProfileProjection) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: profile.bio || "",
      githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
    },
  });

  async function onSubmit(data: EditProfileFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      // Normalize empty strings to null for backend
      const payload = {
        bio: data.bio === "" ? null : data.bio,
        githubUrl: data.githubUrl === "" ? null : data.githubUrl,
        linkedinUrl: data.linkedinUrl === "" ? null : data.linkedinUrl,
      };
      const updated = await updateOwnProfile(payload);
      onSuccess(updated);
    } catch (err: any) {
      setError(err.message || "An error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm border border-red-500/20">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-semibold tracking-wider text-text-muted uppercase font-label mb-1.5 block">
            Bio
          </label>
          <textarea
            {...register("bio")}
            className="flex min-h-[100px] w-full rounded-lg border border-glass-border bg-glass-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md shadow-sm"
            placeholder="Tell us about yourself..."
          />
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <GlassInput
            label="GitHub URL"
            type="url"
            placeholder="https://github.com/username"
            {...register("githubUrl")}
          />
          {errors.githubUrl && <p className="text-red-500 text-xs mt-1">{errors.githubUrl.message}</p>}
        </div>

        <div>
          <GlassInput
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/username"
            {...register("linkedinUrl")}
          />
          {errors.linkedinUrl && <p className="text-red-500 text-xs mt-1">{errors.linkedinUrl.message}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <MotionButton type="submit" disabled={!isDirty || isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </MotionButton>
        </div>
      </form>
    </GlassCard>
  );
}
