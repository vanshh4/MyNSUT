"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { resourcesApi } from "@/lib/api/resources";
import type { Resource } from "@mynsut/shared";
import { RESOURCE_TYPES, RESOURCE_STATUS } from "@mynsut/shared";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Loader2,
  FileQuestion,
  FileText,
  Book,
  GraduationCap,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PYQ: {
    label: "PYQ",
    icon: <FileQuestion className="h-3 w-3" />,
    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-indigo-200 dark:ring-indigo-700/40",
  },
  NOTE: {
    label: "Note",
    icon: <FileText className="h-3 w-3" />,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-700/40",
  },
  BOOK: {
    label: "Book",
    icon: <Book className="h-3 w-3" />,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-700/40",
  },
  REFERENCE: {
    label: "Reference",
    icon: <GraduationCap className="h-3 w-3" />,
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-700/40",
  },
  OTHER: {
    label: "Other",
    icon: <FileText className="h-3 w-3" />,
    color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700",
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PUBLISHED: {
    label: "Published",
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-green-200 dark:ring-green-800",
  },
  DRAFT: {
    label: "Draft",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-800",
  },
  ARCHIVED: {
    label: "Archived",
    color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-700",
  },
};

function EditResourceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("id");

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(preselectedId);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      // Fetch up to 1000 resources for admin selection
      const res = await resourcesApi.getResources({ limit: 1000, page: 1 });
      const list = Array.isArray(res) ? res : res.data || [];
      setResources(list);

      // If preselected id in URL, activate it
      if (preselectedId && list.some(r => r.id === preselectedId)) {
        setSelectedId(preselectedId);
      }
    } catch (err) {
      console.error("Failed to fetch resources for editing:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [preselectedId]);

  const selectedResource = useMemo(
    () => resources.find(r => r.id === selectedId) || null,
    [resources, selectedId]
  );

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        resource.subjectName.toLowerCase().includes(q) ||
        resource.subjectCode.toLowerCase().includes(q) ||
        resource.title.toLowerCase().includes(q) ||
        (resource.description && resource.description.toLowerCase().includes(q));

      const matchesType = typeFilter === "ALL" || resource.resourceType === typeFilter;
      const matchesStatus = statusFilter === "ALL" || resource.status === statusFilter;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, typeFilter, statusFilter]);

  const handleSelectResource = (resource: Resource) => {
    setSelectedId(resource.id);
    setSuccessBanner(null);
    router.replace(`/admin/resources/edit?id=${resource.id}`, { scroll: false });

    // Smooth scroll down to edit section on mobile
    setTimeout(() => {
      const editSection = document.getElementById("edit-form-section");
      if (editSection) {
        editSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleClearSelection = () => {
    setSelectedId(null);
    setSuccessBanner(null);
    router.replace(`/admin/resources/edit`, { scroll: false });
  };

  const handleSuccess = (updatedResource?: Resource) => {
    if (updatedResource) {
      setResources(prev =>
        prev.map(r => (r.id === updatedResource.id ? updatedResource : r))
      );
    } else {
      fetchResources();
    }

    const title = updatedResource?.title || selectedResource?.title || "Resource";
    setSuccessBanner(`"${title}" was updated successfully.`);

    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const handleDelete = (deletedId: string) => {
    setResources(prev => prev.filter(r => r.id !== deletedId));
    setSelectedId(null);
    router.replace("/admin/resources/edit", { scroll: false });
    setSuccessBanner("Resource deleted successfully.");
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="w-full pb-16 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Navigation header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources Hub
        </Link>
        <Link
          href="/admin/resources/new"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-on-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Resource
        </Link>
      </div>

      <PageHeader
        eyebrow="Admin Portal / Resources"
        title="Edit Resource"
        description="Choose an existing resource from the directory and update its subject, links, or notes."
      />

      {successBanner && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-5 py-4 text-sm font-medium text-green-700 dark:text-green-400 animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
          {successBanner}
        </div>
      )}

      {/* STEP 1: CHOOSE RESOURCE */}
      <GlassCard className="p-6 md:p-8 rounded-[24px]" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-glass-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold">
                1
              </span>
              <h2 className="font-headline text-lg font-semibold text-text-main">
                Select a Resource to Edit
              </h2>
            </div>
            <p className="mt-1 text-xs text-text-muted ml-8">
              Search by subject code, subject name, or title to pick a resource.
            </p>
          </div>

          <button
            onClick={fetchResources}
            disabled={isLoading}
            className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-main transition-colors px-3 py-1.5 rounded-xl border border-glass-border bg-white/40 dark:bg-slate-800/40"
          >
            <RotateCcw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            Refresh list
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3.5 mb-5">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-text-muted" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by subject name, code (e.g. CS301), or title…"
              className="block w-full rounded-xl border border-glass-border bg-glass-surface backdrop-blur-xl py-2.5 pl-10 pr-9 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-main"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-text-muted mr-1">Type:</span>
            {["ALL", ...Object.values(RESOURCE_TYPES)].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg font-medium transition-colors border",
                  typeFilter === t
                    ? "bg-primary text-on-primary border-primary"
                    : "border-glass-border bg-black/5 dark:bg-white/5 text-text-muted hover:text-text-main"
                )}
              >
                {t === "ALL" ? "All Types" : t}
              </button>
            ))}

            <div className="h-3 w-px bg-glass-border mx-1 hidden sm:block" />

            <span className="text-xs font-medium text-text-muted mr-1">Status:</span>
            {["ALL", ...Object.values(RESOURCE_STATUS)].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg font-medium transition-colors border",
                  statusFilter === s
                    ? "bg-primary text-on-primary border-primary"
                    : "border-glass-border bg-black/5 dark:bg-white/5 text-text-muted hover:text-text-main"
                )}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Resources list container */}
        <div className="border border-glass-border rounded-xl bg-glass-surface backdrop-blur-xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-muted">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Loading published resources…</span>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-medium text-text-main">No resources match your search.</p>
              <p className="text-xs text-text-muted mt-1">
                {searchQuery || typeFilter !== "ALL" || statusFilter !== "ALL"
                  ? "Try adjusting your search query or filters."
                  : "No resources exist yet. Add your first resource using the button above."}
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-glass-border">
              {filteredResources.map(resource => {
                const isSelected = resource.id === selectedId;
                const typeConf = TYPE_CONFIG[resource.resourceType] || TYPE_CONFIG.OTHER;
                const statusConf = STATUS_CONFIG[resource.status] || STATUS_CONFIG.PUBLISHED;

                return (
                  <div
                    key={resource.id}
                    onClick={() => handleSelectResource(resource)}
                    className={cn(
                      "p-3.5 sm:px-4 flex items-center justify-between gap-4 cursor-pointer transition-colors",
                      isSelected
                        ? "bg-primary/10 dark:bg-white/10 ring-1 ring-inset ring-primary/40"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-text-main">
                          {resource.subjectCode}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                            typeConf.color
                          )}
                        >
                          {typeConf.icon}
                          {typeConf.label}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full ring-1 ring-inset",
                            statusConf.color
                          )}
                        >
                          {statusConf.label}
                        </span>
                        {resource.semester && (
                          <span className="text-[11px] text-text-muted">
                            Sem {resource.semester}
                          </span>
                        )}
                        {resource.academicYear && (
                          <span className="text-[11px] text-text-muted">
                            · {resource.academicYear}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-text-main truncate">
                        {resource.title}
                      </p>
                      <p className="text-xs text-text-muted truncate mt-0.5">
                        {resource.subjectName}
                        {resource.description ? ` — ${resource.description}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        title="Open Google Drive link in new tab"
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors",
                          isSelected
                            ? "bg-primary text-on-primary"
                            : "border border-glass-border bg-glass-surface text-text-main hover:bg-primary hover:text-on-primary"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
          <span>
            Showing {filteredResources.length} of {resources.length} resources
          </span>
          {selectedResource && (
            <button
              onClick={handleClearSelection}
              className="text-primary dark:text-blue-300 hover:underline font-medium"
            >
              Deselect current resource
            </button>
          )}
        </div>
      </GlassCard>

      {/* STEP 2: EDIT SELECTED RESOURCE FORM */}
      <div id="edit-form-section">
        {selectedResource ? (
          <GlassCard className="p-6 md:p-8 rounded-[24px]" hoverEffect={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-glass-border pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold">
                    2
                  </span>
                  <h2 className="font-headline text-xl font-semibold text-text-main">
                    Edit Resource Details
                  </h2>
                </div>
                <p className="mt-1 text-sm text-text-muted ml-8">
                  Modifying:{" "}
                  <span className="font-semibold text-text-main">
                    [{selectedResource.subjectCode}] {selectedResource.title}
                  </span>
                </p>
              </div>

              <GlassButton
                type="button"
                variant="secondary"
                className="rounded-full text-xs self-start sm:self-center"
                onClick={handleClearSelection}
              >
                Choose Another Resource
              </GlassButton>
            </div>

            <ResourceForm
              initialData={selectedResource}
              onSuccess={handleSuccess}
              onCancel={handleClearSelection}
              onDelete={handleDelete}
            />
          </GlassCard>
        ) : (
          <GlassCard className="p-8 rounded-[24px] text-center border-dashed" hoverEffect={false}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white mb-3">
              <Edit3 className="h-6 w-6" />
            </div>
            <h3 className="font-headline text-base font-semibold text-text-main">
              No Resource Selected
            </h3>
            <p className="mt-1 text-sm text-text-muted max-w-md mx-auto">
              Select any resource from the list above to view and update its subject name, code,
              Google Drive URL, notes, or publication status.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default function AdminEditResourcePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditResourceContent />
    </Suspense>
  );
}

