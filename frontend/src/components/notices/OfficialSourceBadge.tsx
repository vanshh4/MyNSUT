import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfficialSourceBadgeProps {
  className?: string;
  sourceAuthority: string;
}

export function OfficialSourceBadge({ className, sourceAuthority }: OfficialSourceBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10", className)}>
      <ShieldCheck className="h-3.5 w-3.5" />
      Official Source: {sourceAuthority}
    </div>
  );
}
