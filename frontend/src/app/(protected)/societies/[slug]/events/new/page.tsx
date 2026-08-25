"use client";

import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { PageHeader } from "@/components/common/PageHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export default function CreateEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Link href={`/societies/${slug}`} className="inline-flex items-center text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Society
      </Link>
      
      <PageHeader
        title="Create New Event"
        description="Publish an event for your society. It will be immediately visible on the campus events feed."
      />
      
      <GlassCard className="p-6 md:p-8">
        <EventForm 
          societyId={slug} 
          onSuccess={(eventId) => {
            router.push(`/events/${eventId}`);
          }} 
          onCancel={() => {
            router.push(`/societies/${slug}`);
          }}
        />
      </GlassCard>
    </div>
  );
}
