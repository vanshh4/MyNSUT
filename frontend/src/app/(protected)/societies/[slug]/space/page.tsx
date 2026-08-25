"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { societiesApi } from "@/lib/api/societies";
import { societyMembershipsApi } from "@/lib/api/societyMemberships";
import { SocietyAnnouncementFeed } from "@/components/societies/SocietyAnnouncementFeed";
import { MemberDirectory } from "@/components/societies/MemberDirectory";
import { useAuth } from "@/hooks/useAuth";

export default function SocietyMemberSpace() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [societyId, setSocietyId] = useState<string>("");
  const [canPost, setCanPost] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const id = Array.isArray(slug) ? slug[0] : slug;
      setSocietyId(id);
      checkAccess(id);
    }
  }, [slug]);

  const checkAccess = async (id: string) => {
    if (!user) return;
    try {
      const memRes = await societyMembershipsApi.getMembers(id);
      const members = (memRes as any).data || [];
      const memberRecord = members.find((m: any) => m.userId === user.id);
      
      if (!memberRecord) {
        // Not a member
        router.replace(`/societies/${id}`);
        return;
      }

      const hasManage = memberRecord.positions?.some((p: any) => p.position.canManageMembers);
      const hasPost = memberRecord.positions?.some((p: any) => p.position.canPostAnnouncements);
      
      setCanManage(hasManage);
      setCanPost(hasPost);
    } catch (err) {
      router.replace(`/societies/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Verifying access...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div>
        <h1 className="font-headline text-3xl font-bold text-text-main">Member Space</h1>
        <p className="mt-2 text-text-muted">Internal announcements and member directory.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-headline text-2xl font-bold text-text-main mb-6">Announcements Feed</h2>
            <SocietyAnnouncementFeed 
              societyId={societyId} 
              canPost={canPost} 
              publicOnly={false} 
            />
          </div>
        </div>
        
        <div>
          <MemberDirectory societyId={societyId} canManage={canManage} />
        </div>
      </div>
    </div>
  );
}
