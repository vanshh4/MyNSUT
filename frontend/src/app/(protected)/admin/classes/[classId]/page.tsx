"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { getClassDetails, getClassMembers } from "@/lib/api/classes";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { Loader2, ArrowLeft, ShieldCheck, ShieldAlert, Check } from "lucide-react";
import type { ClassMember, ClassDetailsResponse } from "@mynsut/shared/types/class";

export default function AdminClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;

  const [classDetails, setClassDetails] = useState<ClassDetailsResponse | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We fetch roles per student. For simplicity, we assume we want to know who the CRs are.
  // We'll store a list of student IDs who are CRs. Since there's no bulk endpoint for this currently,
  // we could just fetch members and assume they don't have CR role by default unless we query the role.
  // Actually, we don't have an endpoint to list who the CRs are. We'd have to assign/revoke blind, 
  // or add it to the members payload. For now we will allow assigning unconditionally (which might fail if already CR).

  useEffect(() => {
    async function load() {
      try {
        const [details, mems] = await Promise.all([
          getClassDetails(classId),
          getClassMembers(classId)
        ]);
        setClassDetails(details);
        setMembers(mems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [classId]);

  const handleAssignCr = async (studentId: string) => {
    try {
      const response = await apiClient(apiEndpoints.classes.assignCr(classId), {
        method: "POST",
        body: JSON.stringify({ studentId })
      });
      if (!response.success) throw new Error(response.message);
      alert("Class Representative assigned successfully.");
    } catch (err: any) {
      alert("Error assigning CR: " + err.message);
    }
  };

  const handleRevokeCr = async (studentId: string) => {
    if (!confirm("Are you sure you want to revoke the CR role for this student?")) return;
    try {
      const response = await apiClient(apiEndpoints.classes.revokeCr(classId, studentId), {
        method: "DELETE"
      });
      if (!response.success) throw new Error(response.message);
      alert("Class Representative role revoked successfully.");
    } catch (err: any) {
      alert("Error revoking CR: " + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-center">
        <p className="text-red-500 mb-4">{error || "Class not found."}</p>
        <GlassButton onClick={() => router.back()}>Go Back</GlassButton>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      <button 
        onClick={() => router.push("/admin/classes")}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors w-max font-label text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Classes
      </button>

      <PageHeader
        eyebrow="Class Management"
        title={classDetails.name}
        description={`${classDetails.branchCode} - Section ${classDetails.section} · Class of ${classDetails.admissionYear + 4}`}
      />

      <GlassCard className="p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-headline text-text-main">Enrolled Students ({members.length})</h3>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left font-body whitespace-nowrap">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="py-3 px-4 font-semibold text-text-muted text-sm uppercase tracking-wider">Roll No</th>
                <th className="py-3 px-4 font-semibold text-text-muted text-sm uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 font-semibold text-text-muted text-sm uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 font-semibold text-text-muted text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-glass-border/50 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-text-main">{m.rollNumber}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {m.profileImageUrl ? (
                        <img src={m.profileImageUrl} alt={m.fullName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {m.fullName.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-text-main">{m.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-text-muted text-sm">{m.email}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <GlassButton
                        variant="secondary"
                        onClick={() => handleAssignCr(m.id)}
                        className="rounded-full text-xs py-1.5 px-3 flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:bg-green-500/10"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Assign CR
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        onClick={() => handleRevokeCr(m.id)}
                        className="rounded-full text-xs py-1.5 px-3 flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Revoke
                      </GlassButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
