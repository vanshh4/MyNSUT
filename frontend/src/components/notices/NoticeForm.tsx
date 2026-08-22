"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NOTICE_CATEGORY, NOTICE_STATUS, Notice } from "@mynsut/shared";
import { noticesApi } from "@/lib/api/notices";
import { useRouter } from "next/navigation";

const noticeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  category: z.nativeEnum(NOTICE_CATEGORY, { required_error: "Category is required" }),
  sourceAuthority: z.string().min(2, "Source Authority must be at least 2 characters").max(255),
  officialUrl: z.string().url("Must be a valid URL"),
  publishedAt: z.string().datetime("Must be a valid ISO datetime"),
  expiresAt: z.string().datetime("Must be a valid ISO datetime").optional().or(z.literal("")),
  status: z.nativeEnum(NOTICE_STATUS).default(NOTICE_STATUS.ACTIVE),
});

type NoticeFormValues = z.infer<typeof noticeFormSchema>;

interface NoticeFormProps {
  initialData?: Notice;
  onSuccess?: () => void;
}

export function NoticeForm({ initialData, onSuccess }: NoticeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          category: initialData.category,
          sourceAuthority: initialData.sourceAuthority,
          officialUrl: initialData.officialUrl,
          publishedAt: initialData.publishedAt,
          expiresAt: initialData.expiresAt || "",
          status: initialData.status,
        }
      : {
          title: "",
          category: undefined,
          sourceAuthority: "",
          officialUrl: "",
          publishedAt: new Date().toISOString(),
          expiresAt: "",
          status: NOTICE_STATUS.ACTIVE,
        },
  });

  const onSubmit = async (values: NoticeFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...values,
        expiresAt: values.expiresAt || undefined,
      };

      if (initialData) {
        await noticesApi.updateNotice(initialData.id, payload);
      } else {
        await noticesApi.createNotice(payload as any);
      }
      
      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/notices");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the notice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900">Title</label>
        <input
          {...form.register("title")}
          className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900">Category</label>
        <select
          {...form.register("category")}
          className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="">Select a category</option>
          {Object.values(NOTICE_CATEGORY).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {form.formState.errors.category && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900">Source Authority</label>
        <input
          {...form.register("sourceAuthority")}
          className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="e.g. Dean Academics"
        />
        {form.formState.errors.sourceAuthority && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.sourceAuthority.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900">Official URL</label>
        <input
          {...form.register("officialUrl")}
          type="url"
          className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="https://nsut.ac.in/..."
        />
        {form.formState.errors.officialUrl && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.officialUrl.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium leading-6 text-slate-900">Published At (ISO)</label>
          <input
            {...form.register("publishedAt")}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {form.formState.errors.publishedAt && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.publishedAt.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium leading-6 text-slate-900">Expires At (ISO, Optional)</label>
          <input
            {...form.register("expiresAt")}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          {form.formState.errors.expiresAt && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.expiresAt.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <select
          {...form.register("status")}
          className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          {Object.values(NOTICE_STATUS).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        {form.formState.errors.status && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Notice"}
        </button>
      </div>
    </form>
  );
}
