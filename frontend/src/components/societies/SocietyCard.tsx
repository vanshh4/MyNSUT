import Link from "next/link";
import { Society } from "@mynsut/shared";
import { UsersRound, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

interface SocietyCardProps {
  society: Society;
  index: number;
}

export function SocietyCard({ society, index }: SocietyCardProps) {
  const isEmerald = index % 3 === 0;
  const isPurple = index % 3 === 1;

  const bgClass = isEmerald 
    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
    : isPurple 
    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    : "bg-rose-100 dark:bg-[#93000a]/20 text-rose-600 dark:text-[#ffb4ab]";

  return (
    <Link href={`/societies/${society.id}`} className="block h-full group">
      <GlassCard className="p-0 h-full flex flex-col shadow-sm transition-shadow hover:shadow-md overflow-hidden relative" hoverEffect={false}>
        {society.coverImageUrl ? (
           <div className="h-28 w-full overflow-hidden">
             <img src={society.coverImageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="cover" />
           </div>
        ) : (
           <div className="h-24 w-full bg-gradient-to-br from-primary/10 to-transparent" />
        )}

        <div className="px-6 pb-6 pt-4 flex flex-col flex-grow relative">
          {society.logoUrl ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-background absolute -top-8 left-6 bg-white">
              <img src={society.logoUrl} alt={society.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl absolute -top-7 left-6 shadow-md border-2 border-white dark:border-background ${bgClass}`}>
              <UsersRound className="w-7 h-7" />
            </div>
          )}

          <div className="mt-8 flex justify-between items-start gap-2">
            <h2 className="font-headline text-xl font-bold text-text-main line-clamp-1">{society.name}</h2>
            <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
              {society.category}
            </span>
          </div>

          <p className="mt-2 font-body text-sm text-text-muted flex-grow line-clamp-3">
            {society.description || "Explore members, events, positions and society updates."}
          </p>

          <GlassButton variant="secondary" className="mt-6 w-full rounded-full gap-2">
            View society <ExternalLink className="w-4 h-4" />
          </GlassButton>
        </div>
      </GlassCard>
    </Link>
  );
}
