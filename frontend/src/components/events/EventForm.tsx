"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { eventsApi } from "@/lib/api/events";
import { GlassButton } from "@/components/ui/GlassButton";
import { toast } from "react-hot-toast";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  description: z.string().optional(),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().max(255).optional(),
  maxCapacity: z.coerce.number().int().positive("Capacity must be positive"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  societyId: string;
  onSuccess: (eventId: string) => void;
  onCancel: () => void;
}

export function EventForm({ societyId, onSuccess, onCancel }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      coverImageUrl: "",
      startDate: "",
      endDate: "",
      location: "",
      maxCapacity: 100,
    }
  });

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
      const res = await eventsApi.createEvent({
        ...data,
        societyId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        coverImageUrl: data.coverImageUrl || undefined,
        description: data.description || undefined,
        location: data.location || undefined,
      });
      toast.success("Event created successfully!");
      onSuccess((res as any).data.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text-main">Event Title *</label>
          <input
            {...register("title")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Annual Tech Symposium"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text-main">Description</label>
          <textarea
            {...register("description")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
            placeholder="About the event..."
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Start Date & Time *</label>
          <input
            type="datetime-local"
            {...register("startDate")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">End Date & Time *</label>
          <input
            type="datetime-local"
            {...register("endDate")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Location</label>
          <input
            {...register("location")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Main Auditorium"
          />
          {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Max Capacity *</label>
          <input
            type="number"
            {...register("maxCapacity")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.maxCapacity && <p className="text-sm text-red-500 mt-1">{errors.maxCapacity.message}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text-main">Cover Image URL (Optional)</label>
          <input
            type="url"
            {...register("coverImageUrl")}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImageUrl && <p className="text-sm text-red-500 mt-1">{errors.coverImageUrl.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
        <GlassButton variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </GlassButton>
        <GlassButton variant="primary" type="submit" className="rounded-full" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </GlassButton>
      </div>
    </form>
  );
}
