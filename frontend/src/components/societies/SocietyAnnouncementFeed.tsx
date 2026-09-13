import { useState, useEffect } from "react";
import { societiesApi } from "../../lib/api/societies";
import { noticesApi } from "../../lib/api/notices";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

interface SocietyAnnouncementFeedProps {
  societyId: string;
  canPost: boolean;
  publicOnly?: boolean;
}

export function SocietyAnnouncementFeed({ societyId, canPost, publicOnly }: SocietyAnnouncementFeedProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [societyId]);

  const fetchAnnouncements = async () => {
    try {
      const res = await societiesApi.getAnnouncements(societyId);
      // Backend automatically filters private announcements if user is not a member.
      setAnnouncements((res as any).data || []);
    } catch (err: any) {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await societiesApi.createAnnouncement(societyId, {
        title,
        content,
        attachmentUrl: attachmentUrl || null,
        isPublic
      });
      toast.success("Announcement posted successfully");
      setTitle("");
      setContent("");
      setAttachmentUrl("");
      setIsPublic(false);
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to post announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await noticesApi.deleteNotice(id);
        toast.success("Announcement deleted successfully");
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      } catch (err: any) {
        toast.error("Failed to delete announcement");
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading announcements...</div>;

  return (
    <div className="space-y-6">
      {canPost && (
        <div className="rounded-xl border border-glass-border bg-glass-surface p-6 shadow-sm">
          <h3 className="font-headline text-lg font-semibold text-text-main mb-4">Post Announcement</h3>
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement Title"
                className="w-full rounded-md border-glass-border bg-surface-sunken text-text-main focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement..."
                rows={3}
                className="w-full rounded-md border-glass-border bg-surface-sunken text-text-main focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="Optional Attachment URL (e.g., Google Drive link)"
                className="w-full rounded-md border-glass-border bg-surface-sunken text-text-main focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-glass-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text-main">
                  Make Public (Visible on Society Profile to non-members)
                </span>
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-xl bg-glass-surface shadow-sm ring-1 ring-glass-border">
            <div className="border-b border-glass-border px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-headline text-lg font-bold text-text-main">{a.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {a.isPublic && (
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Public
                      </span>
                    )}
                    <span className="text-sm text-text-muted">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {canPost && (
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-2 -mr-2 -mt-2 rounded-lg hover:bg-red-500/10"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <p className="text-sm text-text-muted">By {a.author?.fullName}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="whitespace-pre-wrap text-text-main">{a.content}</p>
              {a.attachmentUrl && (
                <div className="mt-4">
                  <a
                    href={a.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:opacity-80"
                  >
                    View Attachment &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="rounded-xl border border-dashed border-glass-border p-8 text-center text-text-muted">
            No announcements found.
          </div>
        )}
      </div>
    </div>
  );
}
