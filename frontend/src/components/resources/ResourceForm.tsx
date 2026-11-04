"use client";

import { useState, useEffect } from "react";
import { GlassButton } from "@/components/ui/GlassButton";
import { RESOURCE_TYPES, RESOURCE_STATUS } from "@mynsut/shared";
import { resourcesApi } from "@/lib/api/resources";
import type { Resource, CreateResourcePayload, UpdateResourcePayload } from "@mynsut/shared";
import { toast } from "react-hot-toast";
import { CheckCircle2, Trash2 } from "lucide-react";

interface ResourceFormProps {
  initialData?: Resource | null;
  onSuccess?: (resource?: Resource) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
}

const RESOURCE_TYPE_OPTIONS = [
  { value: RESOURCE_TYPES.PYQ, label: "Previous Year Question (PYQ)" },
  { value: RESOURCE_TYPES.NOTE, label: "Notes" },
  { value: RESOURCE_TYPES.BOOK, label: "Book" },
  { value: RESOURCE_TYPES.REFERENCE, label: "Reference Material" },
  { value: RESOURCE_TYPES.OTHER, label: "Other" },
];

const RESOURCE_STATUS_OPTIONS = [
  { value: RESOURCE_STATUS.PUBLISHED, label: "Published (Visible to all students)" },
  { value: RESOURCE_STATUS.DRAFT, label: "Draft (Hidden from students)" },
  { value: RESOURCE_STATUS.ARCHIVED, label: "Archived (Hidden from directory)" },
];

export function ResourceForm({ initialData, onSuccess, onCancel, onDelete }: ResourceFormProps) {
  const isEdit = Boolean(initialData?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Required fields
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  // Optional fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // the "note"
  const [resourceType, setResourceType] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [status, setStatus] = useState<string>(RESOURCE_STATUS.PUBLISHED);

  useEffect(() => {
    if (initialData) {
      setSubjectName(initialData.subjectName || "");
      setSubjectCode(initialData.subjectCode || "");
      setFileUrl(initialData.fileUrl || "");
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setResourceType(initialData.resourceType || "");
      setSemester(initialData.semester ? String(initialData.semester) : "");
      setAcademicYear(initialData.academicYear ? String(initialData.academicYear) : "");
      setDepartment(initialData.department || "");
      setStatus(initialData.status || RESOURCE_STATUS.PUBLISHED);
      setError(null);
      setSuccessMessage(null);
    } else {
      setSubjectName("");
      setSubjectCode("");
      setFileUrl("");
      setTitle("");
      setDescription("");
      setResourceType("");
      setSemester("");
      setAcademicYear("");
      setDepartment("");
      setStatus(RESOURCE_STATUS.PUBLISHED);
      setError(null);
      setSuccessMessage(null);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!subjectName.trim() || !subjectCode.trim() || !fileUrl.trim()) {
      setError("Subject name, subject code, and Google Drive link are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        const payload: UpdateResourcePayload = {
          subjectName: subjectName.trim(),
          subjectCode: subjectCode.trim().toUpperCase(),
          fileUrl: fileUrl.trim(),
          title: title.trim() || subjectName.trim(),
          description: description.trim() || null,
          resourceType: (resourceType || RESOURCE_TYPES.OTHER) as any,
          semester: semester ? Number(semester) : null,
          academicYear: academicYear ? Number(academicYear) : null,
          department: department.trim() || null,
          status: (status || RESOURCE_STATUS.PUBLISHED) as any,
        };

        const updated = await resourcesApi.updateResource(initialData.id, payload);
        const msg = "Resource successfully updated and changes are live!";
        setSuccessMessage(msg);
        toast.success(msg);
        onSuccess?.(updated);
      } else {
        const payload: CreateResourcePayload = {
          subjectName: subjectName.trim(),
          subjectCode: subjectCode.trim().toUpperCase(),
          fileUrl: fileUrl.trim(),
          title: title.trim() || subjectName.trim(),
          description: description.trim() || null,
          resourceType: (resourceType || RESOURCE_TYPES.OTHER) as any,
          semester: semester ? Number(semester) : null,
          academicYear: academicYear ? Number(academicYear) : null,
          department: department.trim() || null,
          examSession: null,
          source: null,
          status: (status || RESOURCE_STATUS.PUBLISHED) as any,
        };

        const created = await resourcesApi.createResource(payload);

        // Reset form on create
        setSubjectName("");
        setSubjectCode("");
        setFileUrl("");
        setTitle("");
        setDescription("");
        setResourceType("");
        setSemester("");
        setAcademicYear("");
        setDepartment("");
        setStatus(RESOURCE_STATUS.PUBLISHED);

        const msg = "Resource successfully published and is now live in the directory!";
        setSuccessMessage(msg);
        toast.success(msg);
        onSuccess?.(created);
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isEdit ? "update" : "create"} resource. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${initialData.title || initialData.subjectName}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await resourcesApi.deleteResource(initialData.id);
      toast.success("Resource deleted successfully");
      onDelete(initialData.id);
    } catch (err: any) {
      setError(err.message || "Failed to delete resource. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const labelClass = "block text-sm font-medium text-text-main mb-1.5";
  const inputClass =
    "block w-full rounded-xl border border-glass-border bg-white/50 dark:bg-slate-800/50 px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const selectClass =
    "block w-full rounded-xl border border-glass-border bg-white/50 dark:bg-slate-800/50 px-3.5 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3.5 text-sm font-medium text-green-700 dark:text-green-400 animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Required fields section */}
      <div>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Required Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              placeholder="e.g. Data Structures and Algorithms"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Subject Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subjectCode}
              onChange={e => setSubjectCode(e.target.value.toUpperCase())}
              placeholder="e.g. CS301"
              className={inputClass}
              required
            />
            <p className="mt-1.5 text-xs text-text-muted">Auto-formatted to uppercase.</p>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              Google Drive Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className={inputClass}
              required
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Paste the shareable Google Drive link. Make sure sharing is set to "Anyone with the link".
            </p>
          </div>
        </div>
      </div>

      {/* Optional fields section */}
      <div>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Optional Information & Categorization
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`Defaults to subject name (${subjectName || "…"}) if left empty`}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Use this to describe the specific file (e.g. "2023 End-Term PYQ"). Defaults to subject name.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Note</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Any helpful notes for students (e.g. which unit this covers, exam session, etc.)"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Resource Type</label>
            <select
              value={resourceType}
              onChange={e => setResourceType(e.target.value)}
              className={selectClass}
            >
              <option value="">Select type…</option>
              {RESOURCE_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Semester</label>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className={selectClass}
            >
              <option value="">Any semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Academic Year</label>
            <input
              type="number"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              placeholder="e.g. 2024"
              min={2000}
              max={2100}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              className={inputClass}
            />
          </div>

          {/* Publication Status (available in both or edit mode) */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Publication Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className={selectClass}
            >
              {RESOURCE_STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-text-muted">
              Published resources are instantly discoverable by students in the directory.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onDelete && isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? "Deleting…" : "Delete Resource"}
            </button>
          )}
          {onCancel && (
            <GlassButton
              type="button"
              variant="secondary"
              className="rounded-full px-6 text-xs"
              onClick={onCancel}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </GlassButton>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {successMessage && (
            <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5 hidden sm:flex">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {isEdit ? "Changes saved!" : "Published successfully!"}
            </p>
          )}
          <GlassButton
            type="submit"
            variant="primary"
            className="rounded-full px-8 text-on-primary"
            disabled={isSubmitting || isDeleting}
          >
            {isSubmitting
              ? isEdit
                ? "Saving changes…"
                : "Publishing…"
              : isEdit
              ? "Save Changes"
              : "Publish Resource"}
          </GlassButton>
        </div>
      </div>
    </form>
  );
}
