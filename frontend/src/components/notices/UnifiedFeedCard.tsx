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
    case 'OFFICIAL': return "bg-red-50 text-red-700 ring-red-600/10";
    case 'SOCIETY': return "bg-purple-50 text-purple-700 ring-purple-600/10";
    case 'CLASS': return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
    case 'EVENT': return "bg-orange-50 text-orange-700 ring-orange-600/10";
    default: return "bg-slate-50 text-slate-700 ring-slate-600/10";
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
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
      <div>
        <div className="flex items-center gap-x-3 text-sm">
          <time dateTime={item.publishedAt} className="flex items-center gap-1 text-slate-500">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </time>
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getBadgeStyle(item.type)}`}>
            {getIcon(item.type)}
            {item.type}
          </span>
        </div>
        <div className="group mt-4">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 group-hover:text-blue-600">
            <Link href={getHref(item)}>
              <span className="absolute inset-0" />
              {item.title}
            </Link>
          </h3>
          {item.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
              {item.excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center gap-x-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{item.sourceName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
