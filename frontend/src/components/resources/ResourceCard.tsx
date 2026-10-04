import { motion } from "framer-motion";
import { animations } from "@/lib/utils/animations";
import type { Resource } from "@mynsut/shared";
import { 
  FileText, 
  Book, 
  ExternalLink,
  Calendar,
  FileQuestion,
  GraduationCap
} from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case "PYQ":
      return <FileQuestion className="h-5 w-5 text-indigo-500" />;
    case "NOTE":
      return <FileText className="h-5 w-5 text-emerald-500" />;
    case "BOOK":
      return <Book className="h-5 w-5 text-amber-500" />;
    case "REFERENCE":
      return <GraduationCap className="h-5 w-5 text-blue-500" />;
    default:
      return <FileText className="h-5 w-5 text-slate-500" />;
  }
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <motion.div
      variants={animations.item}
      className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          {getResourceIcon(resource.resourceType)}
        </div>
        <div>
          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 mb-1">
            {resource.resourceType}
          </span>
          <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-white line-clamp-1">
            {resource.title}
          </h3>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {resource.subjectCode} - {resource.subjectName}
          </p>
          {resource.description && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {resource.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
          {resource.semester && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">Semester:</span>
              {resource.semester}
            </div>
          )}
          {resource.academicYear && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">Year:</span>
              {resource.academicYear}
            </div>
          )}
          {resource.department && (
            <div className="flex items-center gap-1.5 col-span-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Dept:</span>
              {resource.department}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          Added {new Date(resource.createdAt).toLocaleDateString()}
        </div>
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          Open Resource
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
