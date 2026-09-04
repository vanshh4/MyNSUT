"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NoticeFilters } from "@/components/notices/NoticeFilters";
import { UnifiedFeedCard } from "@/components/notices/UnifiedFeedCard";
import { PageHeader } from "@/components/common/PageHeader";
import { noticesApi } from "@/lib/api/notices";
import type { PaginatedUnifiedFeedResponse, UnifiedFeedType, UnifiedFeedItem } from "@mynsut/shared";

function NoticesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PaginatedUnifiedFeedResponse | null>(null);
  const [items, setItems] = useState<UnifiedFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setItems([]); // Reset items on filter change
    
    noticesApi.getUnifiedFeed({
      type: (searchParams.get("type") as UnifiedFeedType) || undefined,
      limit: 20
    })
      .then((res) => {
        setData(res);
        setItems(res.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [searchParams.get("type")]);

  const loadMore = async () => {
    if (!data?.hasMore || !data.nextCursor) return;
    setIsLoadingMore(true);
    try {
      const res = await noticesApi.getUnifiedFeed({
        type: (searchParams.get("type") as UnifiedFeedType) || undefined,
        limit: 20,
        cursor: data.nextCursor
      });
      setData(res);
      setItems((prev) => [...prev, ...res.items]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <UnifiedFeedCard key={item.id} item={item} />
            ))}
          </div>
          {data?.hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-300 bg-white">
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No notices found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
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
