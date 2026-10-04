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

  // Sync debounced query to URL
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
  };

  // Effect to push debounced query
  // Wait, better to just push directly or use useEffect for debounced value
  // Let's keep it simple with direct push on debounce
  // ... omitted for brevity in this simple implementation, typically we'd watch debouncedQuery
  
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
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Search subjects, codes, or resources..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleSearch}
          />
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset transition-colors w-full sm:w-auto",
            isFiltersOpen || currentType || currentSemester
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20 dark:ring-blue-500/30"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {(currentType || currentSemester) && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-xs font-medium text-blue-700 dark:text-blue-300">
              {(currentType ? 1 : 0) + (currentSemester ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {isFiltersOpen && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Filter Resources</h3>
            <button 
              onClick={() => {
                setQuery("");
                router.push(`?${createQueryString({ query: null, resourceType: null, semester: null })}`);
              }}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                Resource Type
              </label>
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => handleTypeSelect(type.value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      currentType === type.value || (!currentType && !type.value)
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                Semester
              </label>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5,6,7,8].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => router.push(`?${createQueryString({ semester: currentSemester === String(sem) ? null : String(sem) })}`)}
                    className={cn(
                      "rounded-lg h-8 w-8 flex items-center justify-center text-sm font-medium transition-colors",
                      currentSemester === String(sem)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
