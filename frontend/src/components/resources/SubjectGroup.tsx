"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Book, FileQuestion, GraduationCap, ExternalLink, BookOpen } from "lucide-react";
import type { Resource } from "@mynsut/shared";
import { cn } from "@/lib/utils/cn";

interface SubjectGroupProps {
  subjectCode: string;
  subjectName: string;
  resources: Resource[];
}

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PYQ: {
    label: "Previous Year Question",
    icon: <FileQuestion className="h-3.5 w-3.5" />,
    color: "bg-indigo-100/60 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 ring-indigo-200 dark:ring-indigo-500/20",
  },
  NOTE: {
    label: "Note",
    icon: <FileText className="h-3.5 w-3.5" />,
    color: "bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-500/20",
  },
  BOOK: {
    label: "Book",
    icon: <Book className="h-3.5 w-3.5" />,
    color: "bg-amber-100/60 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-500/20",
  },
  REFERENCE: {
    label: "Reference",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    color: "bg-blue-100/60 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-200 dark:ring-blue-500/20",
  },
  OTHER: {
    label: "Resource",
    icon: <FileText className="h-3.5 w-3.5" />,
    color: "bg-black/5 dark:bg-white/5 text-text-muted ring-glass-border",
  },
};

export function SubjectGroup({ subjectCode, subjectName, resources }: SubjectGroupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const resourceCount = resources.length;
  const typesSummary = [...new Set(resources.map(r => r.resourceType))];

  return (
    <motion.div
      layout
      className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl shadow-sm overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-white/10 text-primary dark:text-primary-container">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-muted mb-0.5 font-mono tracking-wide uppercase">
              {subjectCode}
            </p>
            <h3 className="text-base font-semibold text-text-main truncate">
              {subjectName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {typesSummary.map(type => {
                const config = RESOURCE_TYPE_CONFIG[type] || RESOURCE_TYPE_CONFIG.OTHER;
                return (
                  <span
                    key={type}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      config.color
                    )}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-medium text-text-muted hidden sm:block">
            {resourceCount} {resourceCount === 1 ? "file" : "files"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-text-muted"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="border-t border-glass-border divide-y divide-glass-border">
              {resources.map(resource => {
                const config = RESOURCE_TYPE_CONFIG[resource.resourceType] || RESOURCE_TYPE_CONFIG.OTHER;
                return (
                  <div
                    key={resource.id}
                    className="flex items-start sm:items-center gap-4 px-5 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset shrink-0",
                            config.color
                          )}
                        >
                          {config.icon}
                          {resource.resourceType}
                        </span>
                        {resource.semester && (
                          <span className="text-xs text-text-muted">
                            Sem {resource.semester}
                          </span>
                        )}
                        {resource.academicYear && (
                          <span className="text-xs text-text-muted">
                            · {resource.academicYear}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-text-main truncate">
                        {resource.title}
                      </p>
                      {resource.description && (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary dark:text-primary-container hover:bg-primary/20 dark:hover:bg-white/20 transition-colors"
                    >
                      Open
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
