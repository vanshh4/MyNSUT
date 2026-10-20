"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2 } from "lucide-react";

export default function AdminResourcesPage() {
  const [successKey, setSuccessKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setSuccessKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="w-full pb-12 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Admin Portal"
        title="Add Resource"
        description="Publish academic resources to the student resource directory."
      />

      {showSuccess && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-5 py-4 text-sm font-medium text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Resource successfully published and is now visible to students!
        </div>
      )}

      <GlassCard className="mt-8 p-8 rounded-[24px]" hoverEffect={false}>
        <div className="mb-8 border-b border-glass-border pb-6">
          <h2 className="font-headline text-xl font-semibold text-text-main">Create New Resource</h2>
          <p className="mt-1 text-sm text-text-muted">
            Resources are immediately visible to all students once published.
          </p>
        </div>

        <ResourceForm key={successKey} onSuccess={handleSuccess} />
      </GlassCard>
    </div>
  );
}
