"use client";

import { useState } from "react";
import { GlassButton } from "@/components/ui/GlassButton";
import { RESOURCE_TYPES, RESOURCE_STATUS } from "@mynsut/shared";
import { resourcesApi } from "@/lib/api/resources";
import type { CreateResourcePayload } from "@mynsut/shared";

interface ResourceFormProps {
  onSuccess?: () => void;
}

const RESOURCE_TYPE_OPTIONS = [
  { value: RESOURCE_TYPES.PYQ, label: "Previous Year Question (PYQ)" },
  { value: RESOURCE_TYPES.NOTE, label: "Notes" },
  { value: RESOURCE_TYPES.BOOK, label: "Book" },
  { value: RESOURCE_TYPES.REFERENCE, label: "Reference Material" },
  { value: RESOURCE_TYPES.OTHER, label: "Other" },
];

export function ResourceForm({ onSuccess }: ResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subjectName.trim() || !subjectCode.trim() || !fileUrl.trim()) {
      setError("Subject name, subject code, and Google Drive link are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateResourcePayload = {
        subjectName: subjectName.trim(),
        subjectCode: subjectCode.trim().toUpperCase(),
        fileUrl: fileUrl.trim(),
        title: title.trim() || subjectName.trim(), // auto-fill from subjectName if empty
        description: description.trim() || null,
        resourceType: (resourceType || RESOURCE_TYPES.OTHER) as any,
        semester: semester ? Number(semester) : null,
        academicYear: academicYear ? Number(academicYear) : null,
        department: department.trim() || null,
        examSession: null,
        source: null,
        status: RESOURCE_STATUS.PUBLISHED as any,
      };

      await resourcesApi.createResource(payload);

      // Reset form
      setSubjectName("");
      setSubjectCode("");
      setFileUrl("");
      setTitle("");
      setDescription("");
      setResourceType("");
      setSemester("");
      setAcademicYear("");
      setDepartment("");

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to create resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "block text-sm font-medium text-text-main mb-1.5";
  const inputClass =
    "block w-full rounded-xl border border-glass-border bg-white/50 dark:bg-slate-800/50 px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const selectClass =
    "block w-full rounded-xl border border-glass-border bg-white/50 dark:bg-slate-800/50 px-3.5 py-2.5 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          Optional Information
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
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <GlassButton
          type="submit"
          variant="primary"
          className="rounded-full px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing…" : "Publish Resource"}
        </GlassButton>
      </div>
    </form>
  );
}
