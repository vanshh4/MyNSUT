"use client";

import { useEffect, useState } from "react";
import { Loader2, Megaphone, CheckSquare, Users, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { CreateAnnouncementDialog } from "@/components/class/CreateAnnouncementDialog";
import { CreateTaskDialog } from "@/components/class/CreateTaskDialog";
import { getClassDetails, getClassAnnouncements, getClassTasks, getClassMembers } from "@/lib/api/classes";
import type { ClassDetailsResponse, ClassAnnouncementResponse, ClassTaskResponse, ClassMember } from "@mynsut/shared/types/class";

type Tab = "announcements" | "tasks" | "members";

export default function ClassWorkspacePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("announcements");
  
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const [classDetails, setClassDetails] = useState<ClassDetailsResponse | null>(null);
  const [announcements, setAnnouncements] = useState<ClassAnnouncementResponse[]>([]);
  const [tasks, setTasks] = useState<ClassTaskResponse[]>([]);
  const [members, setMembers] = useState<ClassMember[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const classId = user?.student?.classId;

  useEffect(() => {
    if (authLoading) return;
    if (!classId) {
      setError("No class assigned to your profile.");
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        // We guarantee classId is non-null due to the check above
        const targetClassId = classId as string;
        const [detailsRes, announcementsRes, tasksRes, membersRes] = await Promise.all([
          getClassDetails(targetClassId),
          getClassAnnouncements(targetClassId),
          getClassTasks(targetClassId),
          getClassMembers(targetClassId)
        ]);
        setClassDetails(detailsRes);
        setAnnouncements(announcementsRes);
        setTasks(tasksRes);
        setMembers(membersRes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [classId, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-center">
        <p className="text-red-500 mb-4">{error || "Class details not found."}</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <PageHeader
        eyebrow="Class Workspace"
        title={classDetails.name}
        description={`${classDetails.branchCode} - Section ${classDetails.section} · Class of ${classDetails.admissionYear + 4}`}
      />

      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 gap-4">
        <div className="flex gap-4">
          <GlassButton
            variant={activeTab === "announcements" ? "primary" : "secondary"}
            onClick={() => setActiveTab("announcements")}
            className="rounded-full flex items-center gap-2 whitespace-nowrap"
          >
            <Megaphone className="w-4 h-4" /> Announcements
          </GlassButton>
          <GlassButton
            variant={activeTab === "tasks" ? "primary" : "secondary"}
            onClick={() => setActiveTab("tasks")}
            className="rounded-full flex items-center gap-2 whitespace-nowrap"
          >
            <CheckSquare className="w-4 h-4" /> Tasks
          </GlassButton>
          <GlassButton
            variant={activeTab === "members" ? "primary" : "secondary"}
            onClick={() => setActiveTab("members")}
            className="rounded-full flex items-center gap-2 whitespace-nowrap"
          >
            <Users className="w-4 h-4" /> Members
          </GlassButton>
        </div>
        
        {classDetails.isCr && activeTab === "announcements" && (
          <GlassButton 
            variant="primary" 
            className="rounded-full flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsAnnouncementDialogOpen(true)}
          >
            <Plus className="w-4 h-4" /> Create Announcement
          </GlassButton>
        )}
        
        {classDetails.isCr && activeTab === "tasks" && (
          <GlassButton 
            variant="primary" 
            className="rounded-full flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsTaskDialogOpen(true)}
          >
            <Plus className="w-4 h-4" /> Create Task
          </GlassButton>
        )}
      </div>

      <div className="space-y-6">
        {activeTab === "announcements" && (
          <div className="flex flex-col gap-4">
            {announcements.length === 0 ? (
              <GlassCard className="p-8 text-center text-text-muted">
                No announcements yet.
              </GlassCard>
            ) : (
              announcements.map((a) => (
                <GlassCard key={a.id} className="p-6">
                  <h3 className="text-xl font-bold font-headline mb-2">{a.title}</h3>
                  <p className="text-sm text-text-muted mb-4">
                    By {a.author.fullName} on {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                  <p className="whitespace-pre-wrap font-body text-text-main">{a.content}</p>
                  {a.attachments && a.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-glass-border">
                      <h4 className="text-sm font-semibold mb-2">Attachments:</h4>
                      <ul className="list-disc list-inside">
                        {a.attachments.map((att: any, idx: number) => (
                          <li key={idx}>
                            <a href={att.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                              {att.displayName || att.title || att.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="flex flex-col gap-4">
            {tasks.length === 0 ? (
              <GlassCard className="p-8 text-center text-text-muted">
                No tasks assigned yet.
              </GlassCard>
            ) : (
              tasks.map((t) => (
                <GlassCard key={t.id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold font-headline">{t.title}</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wide">
                      {t.taskType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mb-4">
                    By {t.author.fullName} 
                    {t.dueDate && ` · Due: ${new Date(t.dueDate).toLocaleDateString()}`}
                  </p>
                  {t.description && (
                    <p className="whitespace-pre-wrap font-body text-text-main mb-4">{t.description}</p>
                  )}
                  {t.url && (
                    <a href={t.url} target="_blank" rel="noreferrer" className="text-primary hover:underline block w-max">
                      {t.url}
                    </a>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        )}

        {activeTab === "members" && (
          <GlassCard className="p-6 overflow-hidden">
            <h3 className="text-xl font-bold font-headline mb-4">Class Members ({members.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="py-3 px-4 font-semibold text-text-muted">Roll No</th>
                    <th className="py-3 px-4 font-semibold text-text-muted">Name</th>
                    <th className="py-3 px-4 font-semibold text-text-muted">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-b border-glass-border/50 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">{m.rollNumber}</td>
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        {m.profileImageUrl && (
                           // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.profileImageUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                        )}
                        {m.fullName}
                      </td>
                      <td className="py-3 px-4 text-text-muted">{m.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>

      {classDetails.isCr && classId && (
        <>
          <CreateAnnouncementDialog
            isOpen={isAnnouncementDialogOpen}
            onClose={() => setIsAnnouncementDialogOpen(false)}
            classId={classId as string}
            onSuccess={() => {
              getClassAnnouncements(classId as string).then(setAnnouncements);
            }}
          />
          <CreateTaskDialog
            isOpen={isTaskDialogOpen}
            onClose={() => setIsTaskDialogOpen(false)}
            classId={classId as string}
            onSuccess={() => {
              getClassTasks(classId as string).then(setTasks);
            }}
          />
        </>
      )}
    </div>
  );
}
