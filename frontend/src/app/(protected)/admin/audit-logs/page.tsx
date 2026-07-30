"use client";

import { useState, useEffect } from "react";
import { listAuditLogs } from "@/lib/api/auditLogs";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await listAuditLogs({ limit: 100 });
        setLogs(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Audit Logs"
        description="Immutable record of sensitive administrative actions."
      />

      <MotionCard className="p-0 overflow-hidden mt-6 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Timestamp</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Actor</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Action</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Target User</th>
                  <th className="px-6 py-4 font-medium">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.actorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-blue-400">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.targetUserName || "-"}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
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
