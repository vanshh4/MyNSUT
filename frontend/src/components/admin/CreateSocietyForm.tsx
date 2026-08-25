"use client";

import { useState } from "react";
import { societiesApi } from "@/lib/api/societies";
import { SOCIETY_CATEGORIES, NOTICE_CATEGORY } from "@mynsut/shared";
import { GlassButton } from "@/components/ui/GlassButton";
import { toast } from "react-hot-toast";
import { UserPlus, ShieldCheck } from "lucide-react";

export function CreateSocietyForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: SOCIETY_CATEGORIES[0],
    logoUrl: "",
    coverImageUrl: "",
    presidentUserId: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Society
      const socRes = await societiesApi.createSociety({
        name: formData.name,
        description: formData.description || null,
        category: formData.category as any,
        logoUrl: formData.logoUrl || null,
        coverImageUrl: formData.coverImageUrl || null,
      });
      const societyId = (socRes as any).data.id;

      // 2. Create Top-Level POR (President)
      const posRes = await societiesApi.createPosition(societyId, {
        title: "President",
        canAssignPOR: true,
        canManageMembers: true,
        canPostAnnouncements: true,
      });
      const positionId = (posRes as any).data.id;

      // 3. Assign President to User
      if (formData.presidentUserId) {
        await societiesApi.assignPosition(societyId, {
          userId: formData.presidentUserId,
          positionId: positionId,
        });
        toast.success("Society created and President assigned!");
      } else {
        toast.success("Society created successfully! (No leader assigned)");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create society");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Society Name</label>
          <input
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. IEEE NSUT"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Category</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {SOCIETY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text-main">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
            placeholder="About the society..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Logo URL (Optional)</label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">Cover Image URL (Optional)</label>
          <input
            type="url"
            value={formData.coverImageUrl}
            onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      
      <div className="pt-6 border-t border-glass-border">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="font-headline font-semibold text-lg text-text-main">Initial Leadership</h3>
        </div>
        <p className="text-sm text-text-muted mb-4">Assign the top-level "President" role to a student. They will have full permissions to manage the society and assign further roles.</p>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-text-main">President Roll Number</label>
          <input
            required
            value={formData.presidentUserId}
            onChange={e => setFormData({ ...formData, presidentUserId: e.target.value })}
            className="w-full rounded-md border border-glass-border bg-glass-surface px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. 2023UIN3324"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <GlassButton variant="primary" type="submit" className="rounded-full" disabled={loading}>
          {loading ? "Creating..." : "Create Society & Assign President"}
        </GlassButton>
      </div>
    </form>
  );
}
