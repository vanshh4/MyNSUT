import { useState, useEffect } from "react";
import { societyMembershipsApi } from "../../lib/api/societyMemberships";
import { toast } from "react-hot-toast";
import { UserCircle, Trash2 } from "lucide-react";

interface MemberDirectoryProps {
  societyId: string;
  canManage: boolean;
}

export function MemberDirectory({ societyId, canManage }: MemberDirectoryProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [societyId]);

  const fetchMembers = async () => {
    try {
      const res = await societyMembershipsApi.getMembers(societyId);
      setMembers((res as any).data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await societyMembershipsApi.addMember(societyId, { email });
      toast.success("Member added successfully");
      setEmail("");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await societyMembershipsApi.removeMember(societyId, userId);
      toast.success("Member removed");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading members...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold text-text-main">Member Directory</h2>
        <span className="rounded-full bg-surface-sunken px-3 py-1 text-sm font-medium text-text-muted">
          {members.length} Members
        </span>
      </div>

      {canManage && (
        <form onSubmit={handleAddMember} className="flex flex-col gap-3 rounded-xl border border-glass-border bg-glass-surface p-4 shadow-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Student Email Address"
            className="flex-1 rounded-md border-glass-border bg-surface-sunken text-text-main focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add Member
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl bg-glass-surface shadow-sm ring-1 ring-glass-border">
        <ul className="divide-y divide-border-main">
          {members.map((membership) => (
            <li key={membership.id} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 hover:bg-surface-hover transition-colors">
              <div className="flex items-center gap-4">
                {membership.user.profileImageUrl ? (
                  <img src={membership.user.profileImageUrl} alt={membership.user.fullName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <UserCircle className="h-10 w-10 text-text-muted" />
                )}
                <div>
                  <p className="font-medium text-text-main">{membership.user.fullName}</p>
                  <p className="text-sm text-text-muted">{membership.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  {membership.positions?.map((p: any) => (
                    <span key={p.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {p.position.title}
                    </span>
                  ))}
                </div>
                {canManage && (
                  <button 
                    onClick={() => handleRemoveMember(membership.user.id)}
                    className="p-2 text-danger-main hover:bg-danger-light rounded-lg transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </li>
          ))}
          {members.length === 0 && (
            <li className="p-8 text-center text-text-muted">No members found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
