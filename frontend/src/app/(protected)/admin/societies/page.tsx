"use client";

import { useState, useEffect } from "react";
import { societiesApi } from "@/lib/api/societies";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Plus } from "lucide-react";
import { CreateSocietyForm } from "@/components/admin/CreateSocietyForm";
import { Society } from "@mynsut/shared";

export default function AdminSocietiesPage() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const res = await societiesApi.getSocieties();
      setSocieties((res as any).data || []);
    } catch (error) {
      console.error("Failed to fetch societies", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowCreate(false);
    setLoading(true);
    fetchSocieties();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the society "${name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await societiesApi.deleteSociety(id);
      fetchSocieties();
    } catch (error) {
      console.error("Failed to delete society", error);
      alert("Failed to delete society. Please try again.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Societies Management"
        description="Create and manage societies and assign top-level leadership."
        actions={
          <GlassButton 
            variant={showCreate ? "secondary" : "primary"} 
            className="rounded-full flex items-center gap-2"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? "Cancel" : <><Plus className="w-4 h-4" /> New Society</>}
          </GlassButton>
        }
      />

      {showCreate && (
        <MotionCard className="mt-6 p-6 md:p-8">
          <h2 className="font-headline text-2xl font-bold text-text-main mb-6">Create New Society</h2>
          <CreateSocietyForm onSuccess={handleSuccess} />
        </MotionCard>
      )}

      <MotionCard className="p-0 overflow-hidden mt-6">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading societies...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-body">
              <thead className="bg-glass-surface border-b border-glass-border text-text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Created At</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border text-text-main">
                {societies.map((society) => (
                  <tr key={society.id} className="hover:bg-glass-surface transition-colors">
                    <td className="px-6 py-4 font-medium">{society.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {society.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={society.description || ""}>
                      {society.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(society.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(society.id, society.name)}
                        className="text-xs text-rose-500 hover:text-rose-400 font-medium px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {societies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                      No societies found. Create one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </MotionCard>
    </>
  );
}
