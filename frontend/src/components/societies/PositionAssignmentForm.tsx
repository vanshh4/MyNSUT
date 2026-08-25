import { useState, useEffect } from "react";
import { societiesApi } from "../../lib/api/societies";
import { societyMembershipsApi } from "../../lib/api/societyMemberships";
import { toast } from "react-hot-toast";

interface PositionAssignmentFormProps {
  societyId: string;
}

export function PositionAssignmentForm({ societyId }: PositionAssignmentFormProps) {
  const [positions, setPositions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  
  // Create POR State
  const [title, setTitle] = useState("");
  const [parentPositionId, setParentPositionId] = useState("");
  const [canAssignPOR, setCanAssignPOR] = useState(false);
  const [canManageMembers, setCanManageMembers] = useState(false);
  const [canPostAnnouncements, setCanPostAnnouncements] = useState(false);

  // Assign POR State
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");

  useEffect(() => {
    fetchData();
  }, [societyId]);

  const fetchData = async () => {
    try {
      const [posRes, memRes] = await Promise.all([
        societiesApi.getPositions(societyId),
        societyMembershipsApi.getMembers(societyId)
      ]);
      setPositions((posRes as any).data || []);
      setMembers((memRes as any).data || []);
    } catch (err: any) {
      toast.error("Failed to load positions/members");
    }
  };

  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await societiesApi.createPosition(societyId, {
        title,
        parentPositionId: parentPositionId || null,
        canAssignPOR,
        canManageMembers,
        canPostAnnouncements
      });
      toast.success("Position created successfully");
      setTitle("");
      setParentPositionId("");
      setCanAssignPOR(false);
      setCanManageMembers(false);
      setCanPostAnnouncements(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create position");
    }
  };

  const handleAssignPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedPositionId) return;
    try {
      await societiesApi.assignPosition(societyId, {
        userId: selectedUserId,
        positionId: selectedPositionId
      });
      toast.success("Position assigned successfully");
      setSelectedUserId("");
      setSelectedPositionId("");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign position");
    }
  };

  return (
    <div className="space-y-8">
      {/* Assign POR */}
      <div className="rounded-xl border border-border-main bg-white p-6 shadow-sm">
        <h3 className="font-headline text-lg font-semibold text-text-main mb-4">Assign Position</h3>
        <form onSubmit={handleAssignPosition} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-text-main">Member</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full rounded-md border-border-main focus:border-primary-main focus:ring-primary-main sm:text-sm"
              required
            >
              <option value="">Select a member...</option>
              {members.map(m => (
                <option key={m.user.id} value={m.user.id}>{m.user.fullName} ({m.user.email})</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-text-main">Position</label>
            <select
              value={selectedPositionId}
              onChange={(e) => setSelectedPositionId(e.target.value)}
              className="w-full rounded-md border-border-main focus:border-primary-main focus:ring-primary-main sm:text-sm"
              required
            >
              <option value="">Select a position...</option>
              {positions.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary-main px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
          >
            Assign
          </button>
        </form>
      </div>

      {/* Create POR */}
      <div className="rounded-xl border border-border-main bg-white p-6 shadow-sm">
        <h3 className="font-headline text-lg font-semibold text-text-main mb-4">Create New Position</h3>
        <form onSubmit={handleCreatePosition} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">Position Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Executive Member"
                className="w-full rounded-md border-border-main focus:border-primary-main focus:ring-primary-main sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">Parent Position (Optional)</label>
              <select
                value={parentPositionId}
                onChange={(e) => setParentPositionId(e.target.value)}
                className="w-full rounded-md border-border-main focus:border-primary-main focus:ring-primary-main sm:text-sm"
              >
                <option value="">None (Top Level)</option>
                {positions.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-main">Permissions</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={canAssignPOR} onChange={(e) => setCanAssignPOR(e.target.checked)} className="rounded border-border-main text-primary-main focus:ring-primary-main" />
                <span className="text-sm text-text-main">Can Assign PORs</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={canManageMembers} onChange={(e) => setCanManageMembers(e.target.checked)} className="rounded border-border-main text-primary-main focus:ring-primary-main" />
                <span className="text-sm text-text-main">Can Manage Members</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={canPostAnnouncements} onChange={(e) => setCanPostAnnouncements(e.target.checked)} className="rounded border-border-main text-primary-main focus:ring-primary-main" />
                <span className="text-sm text-text-main">Can Post Announcements</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-surface-sunken px-4 py-2 text-sm font-semibold text-text-main shadow-sm ring-1 ring-inset ring-border-main hover:bg-surface-hover"
          >
            Create Position
          </button>
        </form>
      </div>
    </div>
  );
}
