"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { animations } from "@/lib/utils/animations";

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
          <motion.button
            key={type.value}
            onClick={() => router.push(`?${createQueryString("type", type.value)}`)}
            whileTap={animations.tapScale}
            transition={animations.tapScale.transition}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                : "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50"
            }`}
          >
            {type.label}
          </motion.button>
        );
      })}
    </div>
  );
}
