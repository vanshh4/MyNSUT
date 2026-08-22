"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { NoticeForm } from "@/components/notices/NoticeForm";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AdminNoticesPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="w-full pb-12 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Admin Portal"
        title="Manage Notices"
        description="Publish official circulars and notices to the platform directory."
      />

      <GlassCard className="mt-8 p-8">
        <div className="mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold leading-6 text-slate-900">Create New Notice</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ensure the official URL points to an nsut.ac.in domain.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <NoticeForm 
          onSuccess={() => {
            setSuccessMessage("Notice successfully published!");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setSuccessMessage(null), 5000);
          }} 
        />
      </GlassCard>
    </div>
  );
}
