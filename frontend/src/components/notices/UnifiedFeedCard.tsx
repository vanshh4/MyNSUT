import { UnifiedFeedItem } from "@mynsut/shared";
import { Calendar, Megaphone, Users, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface UnifiedFeedCardProps {
  item: UnifiedFeedItem;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'OFFICIAL': return <Megaphone className="h-4 w-4" />;
    case 'SOCIETY': return <Users className="h-4 w-4" />;
    case 'CLASS': return <ShieldCheck className="h-4 w-4" />;
    case 'EVENT': return <Calendar className="h-4 w-4" />;
    default: return <Megaphone className="h-4 w-4" />;
  }
};

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'OFFICIAL': return "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-red-600/10 dark:ring-red-400/20";
    case 'SOCIETY': return "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-purple-600/10 dark:ring-purple-400/20";
    case 'CLASS': return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-600/10 dark:ring-emerald-400/20";
    case 'EVENT': return "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 ring-orange-600/10 dark:ring-orange-400/20";
    default: return "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 ring-slate-600/10 dark:ring-slate-400/20";
  }
};

const getHref = (item: UnifiedFeedItem) => {
  switch (item.type) {
    case 'OFFICIAL': return `/notices/${item.metaId}`;
    case 'SOCIETY': return `/societies/${item.metaId}`;
    case 'CLASS': return `/class`; // the user's single class workspace
    case 'EVENT': return `/events/${item.id}`;
    default: return '#';
  }
};

export function UnifiedFeedCard({ item }: UnifiedFeedCardProps) {
  const formattedDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-900/50">
      <div>
        <div className="flex items-center gap-x-3 text-sm">
          <time dateTime={item.publishedAt} className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </time>
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getBadgeStyle(item.type)}`}>
            {getIcon(item.type)}
            {item.type}
          </span>
        </div>
        <div className="group mt-4">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <Link href={getHref(item)}>
              <span className="absolute inset-0" />
              {item.title}
            </Link>
          </h3>
          {item.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center gap-x-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.sourceName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
