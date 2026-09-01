"use client";

import { useEffect, useState } from "react";
import { Award, ShieldCheck, BookOpen, Building2, GraduationCap, UsersRound, Loader2, Globe, Link as LinkIcon, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { getPeerProfile } from "@/lib/api/profiles";
import type { PublicProfileProjection } from "@mynsut/shared/types/profile";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PeerProfilePage() {
  const params = useParams();
  const rollNumber = params.rollNumber as string;
  
  const [profile, setProfile] = useState<PublicProfileProjection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPeerProfile(rollNumber);
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (rollNumber) load();
  }, [rollNumber]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-center">
        <p className="text-red-500 mb-4">{error || "Profile not found."}</p>
        <Link href="/search">
          <GlassButton variant="secondary" className="rounded-full">Back to Search</GlassButton>
        </Link>
      </div>
    );
  }

  const isPrivate = (val: string | null | undefined) => val === undefined;
  
  return (
    <div className="w-full pb-12">
      <PageHeader
        eyebrow="Student profile"
        title={profile.name}
        description={`${profile.rollNumber} · ${profile.branch} · Class of ${profile.admissionYear + 4}`}
      />
      
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <GlassCard className="p-8 text-center flex flex-col items-center h-fit" hoverEffect={false}>
          <motion.div
            whileHover={{ rotate: 3, scale: 1.04 }}
            className="grid w-28 h-28 place-items-center rounded-[28px] bg-primary dark:bg-primary-container text-4xl font-headline font-bold text-on-primary dark:text-on-primary-container shadow-lg mb-6"
          >
            {profile.name.charAt(0)}
          </motion.div>
          <h2 className="font-headline text-3xl font-bold text-text-main">{profile.name}</h2>
          <p className="mt-2 font-body text-base text-text-muted">{profile.branch} · {profile.admissionYear + 4}</p>
          
          {profile.roles && (
            <div className="mt-4 flex flex-col gap-2 w-full px-2">
              {profile.roles.isClassCR && (
                <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Class Representative
                </div>
              )}
              {profile.roles.societyPORs.map((por, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold tracking-wide text-center">
                  <Award className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{por.positionName} @ {por.societyName}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 w-full text-left">
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 flex flex-col">
              <Building2 className="w-5 h-5 text-primary dark:text-primary-container mb-3" />
              <p className="font-label text-sm font-semibold text-text-main">{profile.branch}</p>
            </div>
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 flex flex-col">
              <GraduationCap className="w-5 h-5 text-primary dark:text-primary-container mb-3" />
              <p className="font-label text-sm font-semibold text-text-main">{profile.admissionYear}</p>
            </div>
          </div>
        </GlassCard>
        
        <div className="space-y-6">
          <GlassCard className="p-8" hoverEffect={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-text-main flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> About
              </h2>
            </div>
            {isPrivate(profile.bio) ? (
              <p className="text-text-muted italic">This field is hidden by the student's privacy settings.</p>
            ) : profile.bio ? (
              <p className="text-text-main whitespace-pre-wrap font-body leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-text-muted italic">No bio provided.</p>
            )}
            
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-text-muted" />
                {isPrivate(profile.githubUrl) ? (
                  <span className="text-text-muted italic">Hidden by privacy settings</span>
                ) : profile.githubUrl ? (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-body">
                    {profile.githubUrl}
                  </a>
                ) : (
                  <span className="text-text-muted italic">Not provided</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-text-muted" />
                {isPrivate(profile.linkedinUrl) ? (
                  <span className="text-text-muted italic">Hidden by privacy settings</span>
                ) : profile.linkedinUrl ? (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-body">
                    {profile.linkedinUrl}
                  </a>
                ) : (
                  <span className="text-text-muted italic">Not provided</span>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8" hoverEffect={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-text-main">Academic overview</h2>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary dark:text-primary-container" />
              </div>
            </div>
            
            {profile.academicSummary === undefined ? (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-glass-border rounded-xl bg-glass-surface">
                <p className="text-text-muted italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                  Hidden by privacy settings.
                </p>
              </div>
            ) : profile.academicSummary ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 dark:bg-white/5 border border-glass-border p-5 flex flex-col items-center justify-center text-center">
                  <p className="font-headline text-3xl font-bold text-primary dark:text-[#ffffff] mb-1">
                    {profile.academicSummary.currentCgpa ? profile.academicSummary.currentCgpa.toFixed(2) : "N/A"}
                  </p>
                  <p className="font-label text-[11px] font-semibold text-text-muted uppercase tracking-wider">Current CGPA</p>
                </div>
                <div className="rounded-2xl bg-blue-50 dark:bg-white/5 border border-glass-border p-5 flex flex-col items-center justify-center text-center">
                  <p className="font-headline text-3xl font-bold text-primary dark:text-[#ffffff] mb-1">
                    {profile.academicSummary.totalCreditsEarned}
                  </p>
                  <p className="font-label text-[11px] font-semibold text-text-muted uppercase tracking-wider">Credits</p>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-glass-border rounded-xl">
                <p className="text-text-muted italic">Academic data unavailable.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
