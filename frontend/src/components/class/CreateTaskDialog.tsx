"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CalendarIcon } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { createTask } from "@/lib/api/classes";
import type { ClassTaskPayload } from "@mynsut/shared/types/class";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().max(2000).optional(),
  taskType: z.enum(["FILL_FORM", "READ_DOCUMENT", "SUBMIT_ASSIGNMENT", "OTHER"]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  onSuccess: () => void;
}

export function CreateTaskDialog({ isOpen, onClose, classId, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      taskType: "OTHER",
      url: "",
      dueDate: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setError(null);
    try {
      const payload: ClassTaskPayload = {
        title: data.title,
        taskType: data.taskType,
        description: data.description || undefined,
        url: data.url || undefined,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      await createTask(classId, payload);
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[32px] bg-glass-surface border border-glass-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-glass-border/50">
              <h2 className="text-2xl font-bold font-headline">Create Task</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-grow custom-scrollbar">
              <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="E.g., Fill Internship Preference Form"
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-muted mb-2 font-label">Task Type</label>
                    <select
                      {...register("taskType")}
                      className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                    >
                      <option value="FILL_FORM">Fill Form</option>
                      <option value="READ_DOCUMENT">Read Document</option>
                      <option value="SUBMIT_ASSIGNMENT">Submit Assignment</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.taskType && <p className="mt-1 text-xs text-red-500">{errors.taskType.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-muted mb-2 font-label flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> Due Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      {...register("dueDate")}
                      className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    />
                    {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2 font-label">URL (Optional)</label>
                  <input
                    {...register("url")}
                    className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="https://forms.gle/..."
                  />
                  {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2 font-label">Description (Optional)</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full bg-black/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Provide additional instructions..."
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-glass-border/50 flex justify-end gap-3 bg-glass-surface/50">
              <GlassButton type="button" variant="secondary" className="rounded-full px-6" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </GlassButton>
              <GlassButton 
                type="submit" 
                form="create-task-form" 
                variant="primary" 
                className="rounded-full px-8 flex items-center justify-center min-w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Assign Task"}
              </GlassButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
