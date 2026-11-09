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
      return <FileQuestion className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
    case "NOTE":
      return <FileText className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />;
    case "BOOK":
      return <Book className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
    case "REFERENCE":
      return <GraduationCap className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    default:
      return <FileText className="h-5 w-5 text-text-muted" />;
  }
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <motion.div
      variants={animations.fadeInUp}
      className="group relative flex flex-col rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-white/10 border border-glass-border">
          {getResourceIcon(resource.resourceType)}
        </div>
        <div>
          <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-text-main border border-glass-border mb-1">
            {resource.resourceType}
          </span>
          <h3 className="text-base font-semibold leading-6 text-text-main line-clamp-1">
            {resource.title}
          </h3>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <p className="text-sm font-medium text-text-main">
            {resource.subjectCode} - {resource.subjectName}
          </p>
          {resource.description && (
            <p className="mt-2 text-sm text-text-muted line-clamp-2">
              {resource.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-text-muted">
          {resource.semester && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-text-main">Semester:</span>
              {resource.semester}
            </div>
          )}
          {resource.academicYear && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-text-main">Year:</span>
              {resource.academicYear}
            </div>
          )}
          {resource.department && (
            <div className="flex items-center gap-1.5 col-span-2">
              <span className="font-medium text-text-main">Dept:</span>
              {resource.department}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-glass-border pt-4">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Calendar className="h-3.5 w-3.5" />
          Added {new Date(resource.createdAt).toLocaleDateString()}
        </div>
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary dark:text-primary-container hover:bg-primary/20 dark:hover:bg-white/20 transition-colors"
        >
          Open Resource
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
