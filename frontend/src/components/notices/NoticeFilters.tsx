"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const FEED_TYPES = [
  { value: "", label: "All" },
  { value: "OFFICIAL", label: "Official" },
  { value: "SOCIETY", label: "Societies" },
  { value: "CLASS", label: "Classes" },
  { value: "EVENT", label: "Events" }
];

export function NoticeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("cursor"); // reset pagination on filter change
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {FEED_TYPES.map((type) => {
        const isActive = currentType === type.value;
        return (
          <button
            key={type.value}
            onClick={() => router.push(`?${createQueryString("type", type.value)}`)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-1 ring-inset ring-slate-200"
            }`}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
}
