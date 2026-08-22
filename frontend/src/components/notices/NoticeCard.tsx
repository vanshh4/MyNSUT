import { Notice } from "@mynsut/shared";
import { ExternalLink, Calendar } from "lucide-react";
import { OfficialSourceBadge } from "./OfficialSourceBadge";
import Link from "next/link";

interface NoticeCardProps {
  notice: Notice;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const formattedDate = new Date(notice.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
      <div>
        <div className="flex items-center gap-x-3 text-sm">
          <time dateTime={notice.publishedAt} className="flex items-center gap-1 text-slate-500">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </time>
          <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
            {notice.category}
          </span>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 group-hover:text-blue-600">
            <Link href={`/notices/${notice.id}`}>
              <span className="absolute inset-0" />
              {notice.title}
            </Link>
          </h3>
          <div className="mt-4">
            <OfficialSourceBadge sourceAuthority={notice.sourceAuthority} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center border-t border-slate-100 pt-4">
        <a
          href={notice.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500"
        >
          View Official Document <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
