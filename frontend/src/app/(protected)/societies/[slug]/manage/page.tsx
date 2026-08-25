"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { societyMembershipsApi } from "@/lib/api/societyMemberships";
import { PositionAssignmentForm } from "@/components/societies/PositionAssignmentForm";
import { MemberDirectory } from "@/components/societies/MemberDirectory";
import { useAuth } from "@/hooks/useAuth";

export default function SocietyManageConsole() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [societyId, setSocietyId] = useState<string>("");
  const [canManageMembers, setCanManageMembers] = useState(false);
  const [canAssignPOR, setCanAssignPOR] = useState(false);
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
        router.replace(`/societies/${id}`);
        return;
      }

      const hasManage = memberRecord.positions?.some((p: any) => p.position.canManageMembers);
      const hasAssign = memberRecord.positions?.some((p: any) => p.position.canAssignPOR);
      
      if (!hasManage && !hasAssign) {
        router.replace(`/societies/${id}`);
        return;
      }
      
      setCanManageMembers(hasManage);
      setCanAssignPOR(hasAssign);
    } catch (err) {
      router.replace(`/societies/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Verifying access...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div>
        <h1 className="font-headline text-3xl font-bold text-text-main">Management Console</h1>
        <p className="mt-2 text-text-muted">Manage roles, members, and society settings.</p>
      </div>
      
      {canAssignPOR && (
        <section>
          <h2 className="font-headline text-2xl font-bold text-text-main mb-6">Position Management</h2>
          <PositionAssignmentForm societyId={societyId} />
        </section>
      )}

      {canManageMembers && (
        <section>
          <h2 className="font-headline text-2xl font-bold text-text-main mb-6">Member Management</h2>
          <MemberDirectory societyId={societyId} canManage={canManageMembers} />
        </section>
      )}
    </div>
  );
}
