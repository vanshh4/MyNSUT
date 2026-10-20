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
    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-indigo-200 dark:ring-indigo-700/40",
  },
  NOTE: {
    label: "Note",
    icon: <FileText className="h-3.5 w-3.5" />,
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-700/40",
  },
  BOOK: {
    label: "Book",
    icon: <Book className="h-3.5 w-3.5" />,
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-700/40",
  },
  REFERENCE: {
    label: "Reference",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-700/40",
  },
  OTHER: {
    label: "Resource",
    icon: <FileText className="h-3.5 w-3.5" />,
    color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700",
  },
};

export function SubjectGroup({ subjectCode, subjectName, resources }: SubjectGroupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const resourceCount = resources.length;
  const typesSummary = [...new Set(resources.map(r => r.resourceType))];

  return (
    <motion.div
      layout
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5 font-mono tracking-wide uppercase">
              {subjectCode}
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
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
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
            {resourceCount} {resourceCount === 1 ? "file" : "files"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
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
            <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {resources.map(resource => {
                const config = RESOURCE_TYPE_CONFIG[resource.resourceType] || RESOURCE_TYPE_CONFIG.OTHER;
                return (
                  <div
                    key={resource.id}
                    className="flex items-start sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
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
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            Sem {resource.semester}
                          </span>
                        )}
                        {resource.academicYear && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            · {resource.academicYear}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {resource.title}
                      </p>
                      {resource.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary dark:text-blue-300 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
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
