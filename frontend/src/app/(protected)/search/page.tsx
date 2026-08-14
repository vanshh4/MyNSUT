"use client";

import { useState } from "react";
import { searchStudents } from "@/lib/api/search";
import type { PublicProfileProjection } from "@mynsut/shared/types/profile";
import { PageHeader } from "@/components/common/PageHeader";
import { StudentSearchResult } from "@/components/search/StudentSearchResult";
import { GlassInput } from "@/components/ui/GlassInput";
import { MotionButton } from "@/components/ui/MotionButton";
import { Loader2, Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicProfileProjection[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 3) {
      setError("Please enter at least 3 characters to search.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchStudents(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Search failed.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <PageHeader
        eyebrow="Directory"
        title="Student Search"
        description="Find students by name, roll number, or branch."
      />

      <div className="mb-10">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <GlassInput
              placeholder="Search (e.g. '2023UIN3324', 'Vansh', 'ITNS')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 text-lg"
              autoFocus
            />
          </div>
          {/* Search button to the right of search bar is commented for better UI */}
          {/* <MotionButton type="submit" disabled={isLoading} className="h-14 px-8 text-lg flex items-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SearchIcon className="w-5 h-5" />}
            Search
          </MotionButton> */}
        </form>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : results ? (
        results.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No students found matching "{query}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((student) => (
              <StudentSearchResult key={student.studentId} student={student} />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
