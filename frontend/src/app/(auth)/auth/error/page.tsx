"use client";

import {
  AUTH_ERROR_CODES,
  isAuthErrorCode,
  type AuthErrorCode,
} from "@mynsut/shared/constants/auth";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { MotionButton } from "@/components/ui/MotionButton";
import { routes } from "@/config/routes";
import { beginGoogleSignIn } from "@/lib/api/auth";

const messages: Record<AuthErrorCode, { title: string; description: string }> = {
  [AUTH_ERROR_CODES.INVALID_EMAIL_DOMAIN]: {
    title: "Use your NSUT account",
    description: "Only verified @nsut.ac.in Google accounts can access MyNSUT.",
  },
  [AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: {
    title: "Email verification required",
    description: "Google has not verified this email address yet.",
  },
  [AUTH_ERROR_CODES.INVALID_OAUTH_STATE]: {
    title: "Sign-in request expired",
    description: "The secure sign-in request expired or could not be verified. Please try again.",
  },
  [AUTH_ERROR_CODES.GOOGLE_SUBJECT_CONFLICT]: {
    title: "Account link conflict",
    description: "This Google identity is already linked to another MyNSUT account.",
  },
  [AUTH_ERROR_CODES.ACCOUNT_SUSPENDED]: {
    title: "Account suspended",
    description: "This account is suspended. Contact a platform administrator for assistance.",
  },
  [AUTH_ERROR_CODES.ACCOUNT_DELETED]: {
    title: "Account unavailable",
    description: "This account is no longer available.",
  },
  [AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED]: {
    title: "Sign-in required",
    description: "Please sign in again to continue.",
  },
  [AUTH_ERROR_CODES.INVALID_SESSION]: {
    title: "Session unavailable",
    description: "Your session is no longer valid. Please sign in again.",
  },
  [AUTH_ERROR_CODES.SESSION_EXPIRED]: {
    title: "Session expired",
    description: "Your session expired. Please sign in again.",
  },
  [AUTH_ERROR_CODES.ONBOARDING_REQUIRED]: {
    title: "Onboarding required",
    description: "Complete student onboarding before accessing this page.",
  },
  [AUTH_ERROR_CODES.ONBOARDING_ALREADY_COMPLETED]: {
    title: "Onboarding already complete",
    description: "Your MyNSUT student profile has already been activated.",
  },
  [AUTH_ERROR_CODES.INSUFFICIENT_ROLE]: {
    title: "Access unavailable",
    description: "Your account does not have the required role.",
  },
  [AUTH_ERROR_CODES.INSUFFICIENT_PERMISSION]: {
    title: "Action unavailable",
    description: "Your account does not have permission to perform this action.",
  },
  [AUTH_ERROR_CODES.INVALID_OAUTH_RESPONSE]: {
    title: "Invalid sign-in response",
    description: "Google returned an unexpected response. Please try again.",
  },
  [AUTH_ERROR_CODES.GOOGLE_AUTHENTICATION_FAILED]: {
    title: "Sign-in failed",
    description: "Google sign-in could not be completed. Please try again.",
  },
  [AUTH_ERROR_CODES.OAUTH_CONFIGURATION_ERROR]: {
    title: "Authentication unavailable",
    description: "The authentication service is not configured correctly.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const rawCode = searchParams.get("code");
  const code =
    rawCode && isAuthErrorCode(rawCode) ? rawCode : AUTH_ERROR_CODES.GOOGLE_AUTHENTICATION_FAILED;
  const content = messages[code];

  return (
    <main className="motion-page grid min-h-screen place-items-center px-5 py-10">
      <section className="glass w-full max-w-lg rounded-[38px] p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-motion-rose text-rose-600">
          <AlertTriangle className="size-7" />
        </span>
        <p className="eyebrow mt-7">Authentication</p>
        <h1 className="display-font mt-3 text-3xl font-black tracking-[-0.04em]">
          {content.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{content.description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <MotionButton onClick={beginGoogleSignIn}>
            <RotateCcw className="size-4" />
            Try again
          </MotionButton>
          <Link
            href={routes.home}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/55 px-5 text-sm font-bold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
          >
            <ArrowLeft className="size-4" />
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
