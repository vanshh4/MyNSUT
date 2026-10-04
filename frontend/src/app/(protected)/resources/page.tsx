"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { PageHeader } from "@/components/common/PageHeader";
import { resourcesApi } from "@/lib/api/resources";
import type { PaginatedResourceResponse, Resource } from "@mynsut/shared";
import { motion, AnimatePresence } from "framer-motion";

function ResourcesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PaginatedResourceResponse | null>(null);
  const [items, setItems] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const res = await resourcesApi.getResources({
        query: searchParams.get("query") || undefined,
        resourceType: searchParams.get("resourceType") as any || undefined,
        semester: searchParams.get("semester") ? Number(searchParams.get("semester")) : undefined,
        status: "PUBLISHED", // Only show published resources
        limit: 50,
      });
      setData(res);
      setItems(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [
    searchParams.get("query"),
    searchParams.get("resourceType"),
    searchParams.get("semester"),
  ]);

  return (
    <>
      <div className="mt-8 mb-8">
        <ResourceFilters />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 dark:text-red-400">
          <p>{error}</p>
        </div>
      ) : items.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <ResourceCard key={item.id} resource={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Search className="h-6 w-6 text-slate-500" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">No resources found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            We couldn't find any resources matching your current filters.
          </p>
          <button 
            onClick={() => router.push("/resources")}
            className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}

import { Search } from "lucide-react"; // adding missing import

export default function ResourcesPage() {
  return (
    <div className="w-full pb-12">
      <PageHeader
        eyebrow="Academic Resources"
        title="Resource Directory"
        description="A centralized directory of Previous Year Questions, notes, and study material."
      />
      <Suspense fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }>
        <ResourcesList />
      </Suspense>
    </div>
  );
}
