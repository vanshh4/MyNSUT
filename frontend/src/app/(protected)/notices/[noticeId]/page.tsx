"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { noticesApi } from "@/lib/api/notices";
import type { Notice } from "@mynsut/shared";
import { PageHeader } from "@/components/common/PageHeader";
import { OfficialSourceBadge } from "@/components/notices/OfficialSourceBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = params?.noticeId as string | undefined;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!noticeId) return;
    noticesApi.getNoticeById(noticeId)
      .then(setNotice)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [noticeId]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error || "Notice not found."}</p>
        <Link href="/notices" className="mt-4 inline-block text-blue-600 hover:underline">
          &larr; Back to Notices
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 max-w-4xl mx-auto">
      <Link href="/notices" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Notices
      </Link>
      
      <PageHeader
        eyebrow={notice.category}
        title={notice.title}
        description={`Published on ${new Date(notice.publishedAt).toLocaleDateString()}`}
      />

      <GlassCard className="mt-8 p-8">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <OfficialSourceBadge sourceAuthority={notice.sourceAuthority} />
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-800">
              Status: {notice.status}
            </span>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Official Document Access</h3>
            <p className="text-sm text-blue-600 mb-4">
              MyNSUT redirects you directly to the official source to guarantee the authenticity of the information.
            </p>
            <a
              href={notice.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Open Official Document <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="text-sm text-slate-500">
            <p>Added to MyNSUT on {new Date(notice.createdAt).toLocaleString()}</p>
            {notice.expiresAt && (
              <p>Valid until {new Date(notice.expiresAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
