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

export default function SocietyProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [society, setSociety] = useState<Society | null>(null);
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
