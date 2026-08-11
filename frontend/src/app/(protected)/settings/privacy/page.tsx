"use client";

import { useEffect, useState } from "react";
import { getPrivacySettings } from "@/lib/api/privacy";
import type { StudentPrivacySettings } from "@mynsut/shared/types/privacy";
import { PrivacySettingsForm } from "@/components/settings/PrivacySettingsForm";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState<StudentPrivacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPrivacySettings();
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto pb-12 w-full">
      <PageHeader
        eyebrow="Settings"
        title="Privacy Preferences"
        description="Manage who can see your profile and academic information on MyNSUT."
        actions={
          <Link href="/profile/me">
            <GlassButton variant="secondary" className="rounded-full">Back to Profile</GlassButton>
          </Link>
        }
      />
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">{error}</div>
      ) : settings ? (
        <PrivacySettingsForm settings={settings} />
      ) : null}
    </div>
  );
}
