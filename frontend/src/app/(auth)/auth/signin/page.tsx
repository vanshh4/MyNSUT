"use client";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/common/AppLogo";
import { MotionButton } from "@/components/ui/MotionButton";
export default function Page() {
  return (
    <main className="motion-page min-h-screen overflow-hidden px-5 py-7 sm:px-8">
      <header className="mx-auto max-w-7xl">
        <AppLogo />
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1fr_30rem]">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-motion-mint px-4 py-2 text-xs font-black text-emerald-700">
            <Sparkles className="size-4" />
            One connected campus
          </span>
          <h1 className="display-font mt-7 max-w-3xl text-5xl leading-[.98] font-black tracking-[-.06em] sm:text-7xl">
            Campus life,<span className="block text-[#4968f2]">in motion.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Classes, notices, societies and events—beautifully organized around your student
            journey.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 130, damping: 18 }}
          className="glass rounded-[38px] p-7 sm:p-9"
        >
          <span className="grid size-14 place-items-center rounded-full bg-motion-lilac text-violet-600">
            <ShieldCheck />
          </span>
          <p className="eyebrow mt-7">Verified access</p>
          <h2 className="display-font mt-2 text-3xl font-black tracking-[-.04em]">
            Welcome to MyNSUT
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Continue with the Google account connected to your official NSUT email address.
          </p>
          <MotionButton
            className="mt-7 w-full"
            onClick={() => {
              location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1"}/auth/google`;
            }}
          >
            <span className="grid size-6 place-items-center rounded-full bg-white text-xs font-black text-[#4968f2]">
              G
            </span>
            Continue with Google
            <ArrowRight className="size-4" />
          </MotionButton>
          <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
            Only verified <strong>@nsut.ac.in</strong> accounts can continue.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
