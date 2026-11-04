"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { resourcesApi } from "@/lib/api/resources";
import type { Resource } from "@mynsut/shared";
import {
  ArrowLeft,
  PlusCircle,
  FileEdit,
  ArrowRight,
  BookOpen,
  Search,
  ExternalLink,
  Edit3,
  Loader2,
  FileQuestion,
  FileText,
  Book,
  GraduationCap,
  Sparkles,
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

export default function AdminResourcesHubPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await resourcesApi.getResources({ limit: 50, page: 1 });
        const list = Array.isArray(res) ? res : res.data || [];
        setResources(list);
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredResources = resources.filter(r => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      r.subjectName.toLowerCase().includes(q) ||
      r.subjectCode.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full pb-16 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Top back navigation */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Administration
        </Link>
      </div>

      <PageHeader
        eyebrow="Admin Portal"
        title="Resource Management"
        description="Choose whether you want to add a new academic resource or edit an already published one."
      />

      {/* Main Options: Add New vs Edit Published */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OPTION 1: ADD NEW RESOURCE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -4 }}
          className="h-full flex flex-col"
        >
          <GlassCard className="p-7 sm:p-8 flex flex-col h-full rounded-[24px] border border-glass-border hover:shadow-lg transition-all" hoverEffect={false}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white shrink-0">
                <PlusCircle className="w-7 h-7" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-800">
                <Sparkles className="w-3 h-3" />
                New Entry
              </span>
            </div>

            <h3 className="font-headline text-2xl font-bold text-text-main mb-2">
              Add New Resource
            </h3>
            <p className="font-body text-sm text-text-muted mb-6 leading-relaxed">
              Upload and publish Previous Year Question Papers (PYQs), student notes, reference books,
              and academic links directly to the directory.
            </p>

            <ul className="space-y-2.5 text-xs text-text-muted mb-8 font-medium">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Input subject name, code, & Google Drive URL
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Categorize by semester, year, and resource type
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Instantly accessible to all NSUT students
              </li>
            </ul>

            <Link href="/admin/resources/new" className="mt-auto">
              <GlassButton
                variant="primary"
                className="w-full justify-between rounded-xl py-3 px-5 text-on-primary font-semibold text-sm group"
              >
                <span>Add a Resource</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </GlassButton>
            </Link>
          </GlassCard>
        </motion.div>

        {/* OPTION 2: EDIT PUBLISHED RESOURCE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          whileHover={{ y: -4 }}
          className="h-full flex flex-col"
        >
          <GlassCard className="p-7 sm:p-8 flex flex-col h-full rounded-[24px] border border-glass-border hover:shadow-lg transition-all" hoverEffect={false}>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white shrink-0">
                <FileEdit className="w-7 h-7" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-800">
                <Edit3 className="w-3 h-3" />
                Modify
              </span>
            </div>

            <h3 className="font-headline text-2xl font-bold text-text-main mb-2">
              Edit Published Resource
            </h3>
            <p className="font-body text-sm text-text-muted mb-6 leading-relaxed">
              Choose from existing resources to update Drive URLs, correct subject codes, edit notes,
              or toggle visibility (Published, Draft, or Archived).
            </p>

            <ul className="space-y-2.5 text-xs text-text-muted mb-8 font-medium">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Search and pick any published resource
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Update Drive links, note descriptions, and titles
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Change status between Published, Draft, and Archived
              </li>
            </ul>

            <Link href="/admin/resources/edit" className="mt-auto">
              <GlassButton
                variant="secondary"
                className="w-full justify-between rounded-xl py-3 px-5 font-semibold text-sm group"
              >
                <span>Choose & Edit Resource</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </GlassButton>
            </Link>
          </GlassCard>
        </motion.div>
      </div>

      {/* Directory Quick Overview */}
      <GlassCard className="p-6 md:p-8 rounded-[24px]" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-glass-border">
          <div>
            <h3 className="font-headline text-lg font-semibold text-text-main">
              Recent Directory Resources
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Select any item to quickly jump into the editor, or use the dedicated chooser page.
            </p>
          </div>

          <Link
            href="/admin/resources/edit"
            className="text-xs font-semibold text-primary dark:text-blue-300 hover:underline inline-flex items-center gap-1"
          >
            Open full resource editor
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick search input */}
        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Quick search recent resources by subject or title…"
            className="block w-full rounded-xl border border-glass-border bg-white dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted">
            {search ? "No matching resources found." : "No resources uploaded yet."}
          </div>
        ) : (
          <div className="divide-y divide-glass-border border border-glass-border rounded-xl bg-white/40 dark:bg-slate-900/40 overflow-hidden">
            {filteredResources.slice(0, 6).map(resource => {
              const typeConf = TYPE_CONFIG[resource.resourceType] || TYPE_CONFIG.OTHER;
              return (
                <div
                  key={resource.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {resource.subjectCode}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                          typeConf.color
                        )}
                      >
                        {typeConf.icon}
                        {typeConf.label}
                      </span>
                      {resource.semester && (
                        <span className="text-[10px] text-text-muted">
                          Sem {resource.semester}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-text-main truncate">
                      {resource.title}
                    </p>
                    <p className="text-[11px] text-text-muted truncate">
                      {resource.subjectName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Google Drive URL"
                      className="p-1.5 text-text-muted hover:text-text-main rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      href={`/admin/resources/edit?id=${resource.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-glass-border bg-white/70 dark:bg-slate-800 text-text-main hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
