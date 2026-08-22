"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NoticeFilters } from "@/components/notices/NoticeFilters";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { PageHeader } from "@/components/common/PageHeader";
import { noticesApi } from "@/lib/api/notices";
import type { NoticeCategory, NoticeStatus, PaginatedNoticeResponse } from "@mynsut/shared";

function NoticesList() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaginatedNoticeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    noticesApi.getNotices({
      category: (searchParams.get("category") as NoticeCategory) || undefined,
      status: (searchParams.get("status") as NoticeStatus) || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  return (
    <>
      <div className="mt-8 mb-6">
        <NoticeFilters />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-300 bg-white">
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No notices found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </>
  );
}

export default function NoticesPage() {
  return (
    <div className="w-full pb-12">
      <PageHeader
        eyebrow="Official Notices"
        title="Notice Directory"
        description="A directory of official circulars and notices from NSUT authorities."
      />
      <Suspense fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }>
        <NoticesList />
      </Suspense>
    </div>
  );
}
