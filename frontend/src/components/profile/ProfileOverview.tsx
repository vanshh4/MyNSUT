import { GlassCard } from "@/components/ui/GlassCard";
import type { PublicProfileProjection, OwnProfileProjection } from "@mynsut/shared/types/profile";
import { Globe, Link as LinkIcon, FileText } from "lucide-react";

export function ProfileOverview({ profile }: { profile: PublicProfileProjection | OwnProfileProjection }) {
  const isPrivate = (val: string | null | undefined) => val === undefined;
  
  return (
    <div className="space-y-6">
      <GlassCard hoverEffect>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="size-5 text-primary" /> About
        </h2>
        {isPrivate(profile.bio) ? (
          <p className="text-text-muted italic">This field is hidden by the student&apos;s privacy settings.</p>
        ) : profile.bio ? (
          <p className="text-text-main whitespace-pre-wrap">{profile.bio}</p>
        ) : (
          <p className="text-text-muted italic">No bio provided.</p>
        )}
      </GlassCard>

      <GlassCard hoverEffect>
        <h2 className="text-xl font-bold mb-4">Social Links</h2>
        <div className="flex flex-col gap-3">
          {isPrivate(profile.githubUrl) ? (
            <p className="text-text-muted italic">Hidden by privacy settings.</p>
          ) : (
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-text-muted" />
              {profile.githubUrl ? (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                  {profile.githubUrl}
                </a>
              ) : (
                <span className="text-text-muted">Not provided</span>
              )}
            </div>
          )}
          
          {!isPrivate(profile.githubUrl) && (
            <div className="flex items-center gap-3">
              <LinkIcon className="size-5 text-text-muted" />
              {profile.linkedinUrl ? (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                  {profile.linkedinUrl}
                </a>
              ) : (
                <span className="text-text-muted">Not provided</span>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
