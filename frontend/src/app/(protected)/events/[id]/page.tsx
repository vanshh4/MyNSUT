"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { EventResponse as Event, EVENT_STATUS } from "@mynsut/shared";
import { PageHeader } from "@/components/common/PageHeader";
import { EventRegistrationButton } from "@/components/events/EventRegistrationButton";
import { Calendar, MapPin, Users, ArrowLeft, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getEventById(id);
      const fetchedEvent = (res as any).data as Event;
      setEvent(fetchedEvent);
      
      // Basic check for management capabilities (could be refined with roles)
      if (user?.roles?.includes('SUPER_ADMIN')) {
        setCanManage(true);
      }
      
    } catch (error) {
      console.error("Failed to load event", error);
      router.push("/events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading event details...</div>;
  }

  if (!event) return null;

  const isUpcoming = new Date(event.startDate) > new Date();
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <Link href="/events" className="inline-flex items-center text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
      </Link>
      
      {event.coverImageUrl && (
        <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg border border-glass-border">
          <img src={event.coverImageUrl} className="w-full h-full object-cover" alt="Event Cover" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-grow space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/societies/${event.societyId}`} className="text-primary font-semibold hover:underline flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {event.society?.name || "Society"}
              </Link>
              {event.status === EVENT_STATUS.PUBLISHED && isUpcoming && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Upcoming
                </span>
              )}
            </div>
            
            <h1 className="font-headline text-3xl md:text-5xl font-bold text-text-main leading-tight">
              {event.title}
            </h1>
          </div>
          
          <GlassCard className="p-6">
            <h3 className="font-headline font-semibold text-lg text-text-main mb-3">About Event</h3>
            <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
              {event.description || "No description provided."}
            </p>
          </GlassCard>
        </div>
        
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <GlassCard className="p-6 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Date & Time</p>
                <p className="font-semibold text-text-main">
                  {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-sm text-text-muted">
                  {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Location</p>
                <p className="font-semibold text-text-main">
                  {event.location || "TBA"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Registration</p>
                <p className="font-semibold text-text-main">
                  {event._count?.registrations ?? 0} / {event.maxCapacity} seats filled
                </p>
              </div>
            </div>
          </GlassCard>

          <EventRegistrationButton 
            eventId={event.id} 
            isUpcoming={isUpcoming} 
            onStateChange={fetchEvent} 
          />
          
          {canManage && (
            <div className="pt-4 flex justify-end">
              <a 
                href={eventsApi.exportRegistrationsUrl(event.id)} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-primary hover:underline font-semibold"
              >
                Export Registrations (CSV)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
