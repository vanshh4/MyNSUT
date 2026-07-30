"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserDetail } from "@/lib/api/adminUsers";
import { getUserAssignments, revokeRole } from "@/lib/api/adminRoles";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { ArrowLeft, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { UserRolesSummary } from "@mynsut/shared/types/rbac";

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<UserRolesSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, assignRes] = await Promise.all([
        getUserDetail(userId as string),
        getUserAssignments(userId as string),
      ]);
      setUser(userRes.data?.data || userRes.data);
      setAssignments(assignRes.data?.data || assignRes.data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRevoke = async (assignmentId: string, scope: string) => {
    if (!confirm("Are you sure you want to revoke this role?")) return;
    try {
      await revokeRole(assignmentId, { scope: scope as any });
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error("Failed to revoke role", error);
      alert(`Failed to revoke role: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/users" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>

      <PageHeader
        eyebrow="Admin / User Details"
        title={user?.fullName || "Loading..."}
        description={user?.email || "Manage this user's platform roles and permissions."}
      />

      <div className="grid gap-6 mt-6 md:grid-cols-3">
        <MotionCard className="md:col-span-1 p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 mb-4 overflow-hidden">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {user?.fullName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
            <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
            
            <div className="w-full text-left bg-white/5 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-white">{user?.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Roll No</span>
                <span className="text-white">{user?.student?.umsRollNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Branch</span>
                <span className="text-white">{user?.student?.branchCode || "N/A"}</span>
              </div>
            </div>
          </div>
        </MotionCard>

        <div className="md:col-span-2 space-y-6">
          <MotionCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-blue-400" />
                  Role Assignments
                </h3>
                <p className="text-sm text-gray-400">Active roles and permissions.</p>
              </div>
              <button 
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-50"
                onClick={() => alert("Assignment form dialog to be implemented in a future iteration.")}
              >
                Assign Role
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-4">Loading assignments...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Global Roles</h4>
                  {assignments?.global && assignments.global.length > 0 ? (
                    <div className="space-y-3">
                      {assignments.global.map(assignment => (
                        <div key={assignment.id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
                          <div>
                            <div className="font-bold text-white">{assignment.roleCode}</div>
                            <div className="text-xs text-gray-400">Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</div>
                          </div>
                          <button 
                            onClick={() => handleRevoke(assignment.id, assignment.scope)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Revoke Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No global roles assigned.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Class Roles</h4>
                  {assignments?.class && assignments.class.length > 0 ? (
                    <div className="space-y-3">
                      {assignments.class.map(assignment => (
                        <div key={assignment.id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
                          <div>
                            <div className="font-bold text-white">{assignment.roleCode}</div>
                            <div className="text-xs text-gray-400">Class ID: {assignment.scopeId}</div>
                          </div>
                          <button 
                            onClick={() => handleRevoke(assignment.id, assignment.scope)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Revoke Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No class roles assigned.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Society Roles</h4>
                  {assignments?.society && assignments.society.length > 0 ? (
                    <div className="space-y-3">
                      {assignments.society.map(assignment => (
                        <div key={assignment.id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
                          <div>
                            <div className="font-bold text-white">{assignment.roleCode}</div>
                            <div className="text-xs text-gray-400">Society ID: {assignment.scopeId}</div>
                          </div>
                          <button 
                            onClick={() => handleRevoke(assignment.id, assignment.scope)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Revoke Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No society roles assigned.</p>
                  )}
                </div>
              </div>
            )}
          </MotionCard>
        </div>
      </div>
    </>
  );
}
