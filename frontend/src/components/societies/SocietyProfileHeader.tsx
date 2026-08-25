import { Society } from "@mynsut/shared";
import Link from "next/link";
import { Settings, Lock } from "lucide-react";

interface SocietyProfileHeaderProps {
  society: Society;
  isMember?: boolean;
  canManage?: boolean;
}

export function SocietyProfileHeader({ society, isMember, canManage }: SocietyProfileHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-glass-surface border border-glass-border shadow-sm">
      <div className="relative h-48 w-full bg-surface-sunken">
        {society.coverImageUrl ? (
          <img src={society.coverImageUrl} alt={`${society.name} cover`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100" />
        )}
      </div>
      
      <div className="relative px-8 pb-8 pt-16">
        <div className="absolute -top-16 left-8 h-32 w-32 overflow-hidden rounded-xl border-4 border-background bg-surface shadow-sm">
          {society.logoUrl ? (
            <img src={society.logoUrl} alt={society.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
              {society.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-headline text-3xl font-bold text-text-main">{society.name}</h1>
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                {society.category}
              </span>
            </div>
            <p className="text-text-muted max-w-2xl">{society.description || "No description provided."}</p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            {isMember ? (
              <Link 
                href={`/societies/${society.id}/space`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm hover:opacity-90"
              >
                <Lock className="h-4 w-4" />
                Member Space
              </Link>
            ) : null}

            {canManage && (
              <Link 
                href={`/societies/${society.id}/manage`}
                className="inline-flex items-center gap-2 rounded-lg bg-surface-sunken px-4 py-2 text-sm font-semibold text-text-main shadow-sm ring-1 ring-inset ring-border-main hover:bg-surface-hover"
              >
                <Settings className="h-4 w-4" />
                Manage
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
