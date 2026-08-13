"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { createAnnouncement } from "@/lib/api/classes";
import type { ClassAnnouncementPayload, UrlAttachment } from "@mynsut/shared/types/class";

const attachmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  url: z.string().url("Must be a valid URL"),
  displayName: z.string().max(100).optional(),
});

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000),
  attachments: z.array(attachmentSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  onSuccess: () => void;
}

export function CreateAnnouncementDialog({ isOpen, onClose, classId, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      attachments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  });

  async function onSubmit(data: FormValues) {
    setError(null);
    try {
      await createAnnouncement(classId, data as ClassAnnouncementPayload);
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create announcement.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] bg-glass-surface border border-glass-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-glass-border/50">
              <h2 className="text-2xl font-bold font-headline">Create Announcement</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-grow custom-scrollbar">
              <form id="create-announcement-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2 font-label">Title</label>
                  <input
                    {...register("title")}
                    className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="E.g., Mid-semester exam schedule"
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2 font-label">Content</label>
                  <textarea
                    {...register("content")}
                    rows={5}
                    className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Write your announcement here..."
                  />
                  {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-text-muted font-label">Attachments (Optional)</label>
                    <GlassButton
                      type="button"
                      variant="secondary"
                      className="px-3 py-1.5 text-xs rounded-full flex items-center gap-1"
                      onClick={() => append({ title: "", url: "", displayName: "" })}
                    >
                      <Plus className="w-3 h-3" /> Add Link
                    </GlassButton>
                  </div>
                  
                  {fields.map((field, index) => (
                    <GlassCard key={field.id} className="p-4" hoverEffect={false}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-sm font-semibold">Link #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500/70 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            {...register(`attachments.${index}.title`)}
                            className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Title (e.g., Exam Schedule PDF)"
                          />
                          {errors.attachments?.[index]?.title && (
                            <p className="mt-1 text-xs text-red-500">{errors.attachments[index].title.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            {...register(`attachments.${index}.url`)}
                            className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="URL (https://...)"
                          />
                          {errors.attachments?.[index]?.url && (
                            <p className="mt-1 text-xs text-red-500">{errors.attachments[index].url.message}</p>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-glass-border/50 flex justify-end gap-3 bg-glass-surface/50">
              <GlassButton type="button" variant="secondary" className="rounded-full px-6" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </GlassButton>
              <GlassButton 
                type="submit" 
                form="create-announcement-form" 
                variant="primary" 
                className="rounded-full px-8 flex items-center justify-center min-w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish"}
              </GlassButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
