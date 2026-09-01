"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { listClasses } from "@/lib/api/classes";
import { Loader2, Search, Users, ArrowRight } from "lucide-react";

export default function AdminClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await listClasses();
        setClasses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.branchCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      <PageHeader
        eyebrow="Admin"
        title="Class Management"
        description="Manage branches, sections, and assign Class Representatives."
      />

      <GlassCard className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4 border border-glass-border bg-glass-surface rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search classes by name or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-text-main font-body placeholder:text-text-muted"
          />
        </div>

        {isLoading ? (
          <div className="flex py-12 justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12 text-text-muted font-body">
            No classes found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <GlassCard key={cls.id} className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-text-main">{cls.name}</h3>
                  <p className="text-sm text-text-muted font-body">Class of {cls.admissionYear + 4}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-text-muted font-label bg-black/5 dark:bg-white/5 py-1 px-3 rounded-full w-max">
                  <Users className="w-4 h-4" />
                  <span>{cls.branchCode} - Section {cls.section}</span>
                </div>

                <div className="mt-2 flex justify-end">
                  <GlassButton
                    variant="secondary"
                    onClick={() => router.push(`/admin/classes/${cls.id}`)}
                    className="rounded-full text-xs py-1.5 px-4 flex items-center gap-2"
                  >
                    Manage
                    <ArrowRight className="w-3 h-3" />
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
