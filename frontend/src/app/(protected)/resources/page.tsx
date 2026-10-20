"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, ChevronDown, ChevronsDown } from "lucide-react";
import { SubjectGroup } from "@/components/resources/SubjectGroup";
import { PageHeader } from "@/components/common/PageHeader";
import { resourcesApi } from "@/lib/api/resources";
import type { Resource } from "@mynsut/shared";
import { motion, AnimatePresence } from "framer-motion";
import { springs } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/cn";

const PAGE_SIZE = 10;

/** Group flat resource list by subject (subjectCode + subjectName pair). */
function groupBySubject(resources: Resource[]): Array<{
  subjectCode: string;
  subjectName: string;
  resources: Resource[];
}> {
  const map = new Map<string, { subjectCode: string; subjectName: string; resources: Resource[] }>();
  for (const r of resources) {
    const key = r.subjectCode;
    if (!map.has(key)) {
      map.set(key, { subjectCode: r.subjectCode, subjectName: r.subjectName, resources: [] });
    }
    map.get(key)!.resources.push(r);
  }
  return Array.from(map.values());
}

function ResourcesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allSubjects, setAllSubjects] = useState<
    Array<{ subjectCode: string; subjectName: string; resources: Resource[] }>
  >([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [totalSubjects, setTotalSubjects] = useState(0);

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [draftQuery, setDraftQuery] = useState(searchParams.get("query") || "");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuery = searchParams.get("query") || "";

  const fetchAllResources = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      // Fetch all published resources matching the query so we can group client-side
      const res = await resourcesApi.getResources({
        page: 1,
        limit: 500, // generous ceiling — grouping is done client-side
        query: q || undefined,
        status: "PUBLISHED",
      });
      const grouped = groupBySubject([...res.data]);
      setAllSubjects(grouped);
      setTotalSubjects(grouped.length);
      setVisibleCount(PAGE_SIZE);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load resources.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch when URL query changes
  useEffect(() => {
    const q = searchParams.get("query") || "";
    setQuery(q);
    setDraftQuery(q);
    fetchAllResources(q);
  }, [currentQuery, fetchAllResources]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (draftQuery.trim()) {
      params.set("query", draftQuery.trim());
    } else {
      params.delete("query");
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setDraftQuery("");
    router.push("/resources");
  };

  const visibleSubjects = allSubjects.slice(0, visibleCount);
  const remaining = totalSubjects - visibleCount;
  const hasMore = remaining > 0;

  const loadMore = () => setVisibleCount(prev => prev + PAGE_SIZE);
  const loadAll = () => setVisibleCount(totalSubjects);

  return (
    <>
      {/* Search bar */}
      <div className="mt-8 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={draftQuery}
              onChange={e => setDraftQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by subject name or code…"
              className="block w-full rounded-2xl border border-glass-border bg-white dark:bg-slate-900 py-3 pl-11 pr-4 text-sm text-text-main placeholder:text-text-muted shadow-sm ring-0 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
          >
            Search
          </button>
          {query && (
            <button
              onClick={handleClear}
              className="rounded-2xl border border-glass-border bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {query && (
          <p className="mt-3 text-sm text-text-muted">
            Showing results for{" "}
            <span className="font-medium text-text-main">"{query}"</span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-sm text-red-700 dark:text-red-400 text-center">
          {error}
        </div>
      ) : allSubjects.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-text-main">No subjects found</h3>
          <p className="mt-1 text-sm text-text-muted">
            {query
              ? `No resources match "${query}". Try a different subject name or code.`
              : "No resources have been published yet."}
          </p>
          {query && (
            <button
              onClick={handleClear}
              className="mt-4 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">
            Showing <span className="font-medium text-text-main">{visibleSubjects.length}</span> of{" "}
            <span className="font-medium text-text-main">{totalSubjects}</span> subjects
          </p>

          <motion.div
            layout
            className="flex flex-col gap-3"
          >
            <AnimatePresence mode="popLayout">
              {visibleSubjects.map(group => (
                <motion.div
                  key={group.subjectCode}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={springs.default}
                >
                  <SubjectGroup
                    subjectCode={group.subjectCode}
                    subjectName={group.subjectName}
                    resources={group.resources}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load more / Load all controls */}
          {hasMore && (
            <motion.div
              layout
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                onClick={loadMore}
                className="flex items-center gap-2 rounded-full border border-glass-border bg-white dark:bg-slate-900 px-6 py-2.5 text-sm font-semibold text-text-main hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ChevronDown className="h-4 w-4" />
                Load {Math.min(PAGE_SIZE, remaining)} more subjects
              </button>
              <button
                onClick={loadAll}
                className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 dark:bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary dark:text-blue-300 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
              >
                <ChevronsDown className="h-4 w-4" />
                Show all {totalSubjects} subjects
              </button>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}

export default function ResourcesPage() {
  return (
    <div className="w-full pb-12">
      <PageHeader
        eyebrow="Academic Resources"
        title="Resource Directory"
        description="A centralized directory of Previous Year Questions, notes, books, and study material — organized by subject."
      />
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <ResourcesList />
      </Suspense>
    </div>
  );
}
