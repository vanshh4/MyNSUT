"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { RESOURCE_TYPES } from "@mynsut/shared";
import { cn } from "@/lib/utils/cn";

export function ResourceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      if (Object.keys(updates).some(k => k !== 'page')) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
  };
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`?${createQueryString({ query: query || null })}`);
    }
  };

  const handleTypeSelect = (type: string | null) => {
    router.push(`?${createQueryString({ resourceType: type })}`);
  };

  const currentType = searchParams.get("resourceType");
  const currentSemester = searchParams.get("semester");

  const resourceTypes = [
    { value: null, label: "All" },
    { value: RESOURCE_TYPES.PYQ, label: "PYQs" },
    { value: RESOURCE_TYPES.NOTE, label: "Notes" },
    { value: RESOURCE_TYPES.BOOK, label: "Books" },
    { value: RESOURCE_TYPES.REFERENCE, label: "Reference" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-text-muted" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-glass-border py-2.5 pl-10 pr-3 text-text-main bg-glass-surface backdrop-blur-xl shadow-sm placeholder:text-text-muted focus:ring-2 focus:ring-primary/40 focus:outline-none sm:text-sm sm:leading-6"
            placeholder="Search subjects, codes, or resources..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleSearch}
          />
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm border border-glass-border backdrop-blur-xl transition-colors w-full sm:w-auto",
            isFiltersOpen || currentType || currentSemester
              ? "bg-primary/10 text-primary dark:text-primary-container"
              : "bg-glass-surface text-text-main hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {(currentType || currentSemester) && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-medium">
              {(currentType ? 1 : 0) + (currentSemester ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {isFiltersOpen && (
        <div className="rounded-xl border border-glass-border bg-glass-surface backdrop-blur-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-main">Filter Resources</h3>
            <button 
              onClick={() => {
                setQuery("");
                router.push(`?${createQueryString({ query: null, resourceType: null, semester: null })}`);
              }}
              className="text-xs font-medium text-primary dark:text-primary-container hover:underline"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-text-muted mb-2 block">
                Resource Type
              </label>
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => handleTypeSelect(type.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors border",
                      currentType === type.value || (!currentType && !type.value)
                        ? "bg-primary text-on-primary border-primary"
                        : "border-glass-border bg-black/5 dark:bg-white/5 text-text-muted hover:text-text-main"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted mb-2 block">
                Semester
              </label>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5,6,7,8].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => router.push(`?${createQueryString({ semester: currentSemester === String(sem) ? null : String(sem) })}`)}
                    className={cn(
                      "rounded-lg h-8 w-8 flex items-center justify-center text-sm font-medium transition-colors border",
                      currentSemester === String(sem)
                        ? "bg-primary text-on-primary border-primary"
                        : "border-glass-border bg-black/5 dark:bg-white/5 text-text-muted hover:text-text-main"
                    )}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
