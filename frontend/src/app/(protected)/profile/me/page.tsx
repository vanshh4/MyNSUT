"use client";

import { useEffect, useState } from "react";
import { Award, ShieldCheck, BookOpen, Building2, GraduationCap, UsersRound, Loader2, Globe, Link as LinkIcon, FileText, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { getOwnProfile } from "@/lib/api/profiles";
import { getCurrentUser } from "@/lib/api/auth";
import type { OwnProfileProjection } from "@mynsut/shared/types/profile";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import Link from "next/link";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<OwnProfileProjection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userFullName, setUserFullName] = useState<string>("Student");

  useEffect(() => {
    async function load() {
      try {
        const [data, user] = await Promise.all([getOwnProfile(), getCurrentUser()]);
        setProfile(data);
        setUserFullName(user.fullName);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
        <Link href="/">
          <GlassButton variant="secondary" className="rounded-full">Go Home</GlassButton>
        </Link>
      </div>
    );
  }

  const metrics = [
    ["Current CGPA", profile.academicSummary?.currentCgpa ? profile.academicSummary.currentCgpa.toFixed(2) : "N/A"],
    ["Credits", profile.academicSummary?.totalCreditsEarned?.toString() || "0"],
  ];

  return (
    <div className="w-full pb-12">
      <PageHeader
        eyebrow="Student profile"
        title={userFullName}
        description={`${profile.student.rollNumber} · ${profile.student.branchCode} · Class of ${profile.student.admissionYear + 4}`}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/settings/privacy">
              <GlassButton variant="secondary" className="rounded-full font-label">Privacy Settings</GlassButton>
            </Link>
            <GlassButton 
              variant="primary" 
              className="rounded-full font-label flex items-center gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="w-4 h-4" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </GlassButton>
          </div>
        }
      />
      
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <GlassCard className="p-8 text-center flex flex-col items-center h-fit" hoverEffect={false}>
          <motion.div
            whileHover={{ rotate: 3, scale: 1.04 }}
            className="grid w-28 h-28 place-items-center rounded-[28px] bg-primary dark:bg-primary-container text-4xl font-headline font-bold text-on-primary dark:text-on-primary-container shadow-lg mb-6"
          >
            {userFullName.charAt(0)}
          </motion.div>
          <h2 className="font-headline text-3xl font-bold text-text-main">{userFullName}</h2>
          <p className="mt-2 font-body text-base text-text-muted">{profile.student.branchCode} · {profile.student.admissionYear + 4}</p>
          
          {profile.roles && (
            <div className="mt-6 flex flex-col gap-2 w-full px-10">
              {profile.roles.isClassCR && (
                <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wide">
                  <ShieldCheck className="w-10 h-5" />
                  Class Representative
                </div>
              )}
              {profile.roles.societyPORs.map((por, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-sm font-semibold tracking-wide text-center">
                  <Award className="w-10 h-5 flex-shrink-0" />
                  <span>{por.positionName} @ {por.societyName}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 w-full text-left">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 flex flex-col transition-colors hover:bg-black/10 dark:hover:bg-white/10">
              <Building2 className="w-5 h-5 text-primary dark:text-primary-container mb-3" />
              <p className="font-label text-sm font-semibold text-text-main">{profile.student.branchCode}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 flex flex-col transition-colors hover:bg-black/10 dark:hover:bg-white/10">
              <GraduationCap className="w-5 h-5 text-primary dark:text-primary-container mb-3" />
              <p className="font-label text-sm font-semibold text-text-main">{profile.student.admissionYear}</p>
            </motion.div>
          </div>
        </GlassCard>
        
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <EditProfileForm 
                  profile={profile} 
                  onSuccess={(updated) => {
                    setProfile(updated);
                    setIsEditing(false);
                  }} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <GlassCard className="p-8" hoverEffect={false}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline text-2xl font-bold text-text-main flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> About
                    </h2>
                  </div>
                  {profile.bio ? (
                    <p className="text-text-main whitespace-pre-wrap font-body leading-relaxed">{profile.bio}</p>
                  ) : (
                    <p className="text-text-muted italic">No bio provided. Click "Edit Profile" to add one.</p>
                  )}
                  
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-text-muted" />
                      {profile.githubUrl ? (
                        <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-body">
                          {profile.githubUrl}
                        </a>
                      ) : (
                        <span className="text-text-muted italic">No GitHub URL</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-text-muted" />
                      {profile.linkedinUrl ? (
                        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-body">
                          {profile.linkedinUrl}
                        </a>
                      ) : (
                        <span className="text-text-muted italic">No LinkedIn URL</span>
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
                  
                  {profile.academicSummary ? (
                    <div className="grid grid-cols-2 gap-4">
                      {metrics.map(([label, val]) => (
                        <motion.div key={label} whileHover={{ scale: 1.05, y: -2 }} className="rounded-2xl bg-blue-50 dark:bg-white/5 border border-glass-border p-5 flex flex-col items-center justify-center text-center">
                          <p className="font-headline text-3xl font-bold text-primary dark:text-[#ffffff] mb-1">{val}</p>
                          <p className="font-label text-[11px] font-semibold text-text-muted uppercase tracking-wider">{label}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-glass-border rounded-xl">
                      <p className="text-text-muted italic">Academic data unavailable.</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
