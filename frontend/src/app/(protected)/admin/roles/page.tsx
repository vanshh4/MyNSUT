"use client";

import { useState, useEffect } from "react";
import { listRoles } from "@/lib/api/adminRoles";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await listRoles();
        setRoles(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Platform Roles"
        description="View all platform roles, scopes, and active counts."
      />

      <MotionCard className="p-0 overflow-hidden mt-6">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading roles...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Scope</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Active Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {roles.map((role) => (
                  <tr key={role.code} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{role.code}</td>
                    <td className="px-6 py-4 text-white font-medium">{role.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-violet-500/10 text-violet-400">
                        {role.scope}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-400" title={role.description || ""}>
                      {role.description || "-"}
                    </td>
                    <td className="px-6 py-4">{role.activeAssignmentsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MotionCard>
    </>
  );
}
