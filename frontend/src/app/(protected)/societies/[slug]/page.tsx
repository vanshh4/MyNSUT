"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { societiesApi } from "@/lib/api/societies";
import { societyMembershipsApi } from "@/lib/api/societyMemberships";
import { Society } from "@mynsut/shared";
import { SocietyProfileHeader } from "@/components/societies/SocietyProfileHeader";
import { SocietyAnnouncementFeed } from "@/components/societies/SocietyAnnouncementFeed";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { EventCard } from "@/components/events/EventCard";
import { eventsApi } from "@/lib/api/events";
import { GlassButton } from "@/components/ui/GlassButton";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function SocietyProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [society, setSociety] = useState<Society | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const fetchData = async () => {
    try {
      const societyId = slug;
      const res = await societiesApi.getSocietyById(societyId);
      setSociety((res as any).data);

      const eventsRes = await eventsApi.getEvents({ societyId });
      setEvents((eventsRes as any).data || []);


      if (user) {
        // check if member by fetching members and finding user
        const memRes = await societyMembershipsApi.getMembers(societyId);
        const members = (memRes as any).data || [];
        const memberRecord = members.find((m: any) => m.userId === user.id);
        if (memberRecord) {
          setIsMember(true);
          const hasManage = memberRecord.positions?.some((p: any) => 
            p.position.canManageMembers || p.position.canAssignPOR
          );
          setCanManage(hasManage);
        }
      }
    } catch (error) {
      console.error("Failed to load society profile", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!society) return <div className="p-8 text-center">Society not found.</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <SocietyProfileHeader 
        society={society} 
        isMember={isMember} 
        canManage={canManage} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-headline text-2xl font-bold text-text-main mb-6">Public Announcements</h2>
            <SocietyAnnouncementFeed 
              societyId={society.id} 
              canPost={false} 
              publicOnly={true} 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-text-main">Events</h2>
              {canManage && (
                <Link href={`/societies/${society.id}/events/new`}>
                  <GlassButton variant="primary" className="rounded-full gap-2">
                    <Plus className="w-4 h-4" /> Create Event
                  </GlassButton>
                </Link>
              )}
            </div>
            
            {events.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                  <div key={event.id} className="h-full">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-glass-border bg-glass-surface p-8 text-center text-text-muted">
                No events have been created yet.
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-xl border border-border-main bg-white p-6 shadow-sm">
            <h3 className="font-headline text-lg font-semibold text-text-main mb-4">About</h3>
            <p className="text-text-muted text-sm whitespace-pre-wrap">
              {society.description || "No description provided for this society."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
