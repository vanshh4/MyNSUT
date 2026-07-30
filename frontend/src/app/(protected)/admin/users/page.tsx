"use client";

import { useState, useEffect } from "react";
import { searchUsers } from "@/lib/api/adminUsers";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import Link from "next/link";
import { Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await searchUsers({ q: search, limit: 20 });
        setUsers(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Search users and manage role assignments."
      />

      <div className="mb-6 relative mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        <input 
          type="text" 
          placeholder="Search by name, email, or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <MotionCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Roll Number</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Roles</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.fullName}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">{user.student?.umsRollNumber || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.rolesCount} active</td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Manage Roles
                      </Link>
                    </td>
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
