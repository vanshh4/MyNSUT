import Link from "next/link";
import { ArrowRight, CalendarDays, Megaphone, UsersRound } from "lucide-react";
import { AppLogo } from "@/components/common/AppLogo";
export default function Page() {
  return (
    <main className="motion-page min-h-screen px-5 py-7 sm:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <AppLogo />
        <Link
          href="/auth/signin"
          className="rounded-full bg-[#4968f2] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(73,104,242,.25)]"
        >
          Sign in
        </Link>
      </header>
      <section className="mx-auto grid max-w-7xl items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="eyebrow">Made for everyday campus life</p>
          <h1 className="display-font mt-5 text-5xl leading-[.98] font-black tracking-[-.06em] sm:text-7xl">
            Your campus,<span className="block text-[#4968f2]">moving with you.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            A friendly, verified space for the updates, people and opportunities that shape your
            NSUT journey.
          </p>
          <Link
            href="/auth/signin"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#172033] px-6 py-4 text-sm font-bold text-white"
          >
            Get started <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [Megaphone, "Clear updates", "Notice what matters."],
            [CalendarDays, "Better events", "Discover and register."],
            [UsersRound, "Campus circles", "Find your community."],
          ].map(([Icon, t, x], i) => (
            <div key={t as string} className={`soft-card p-6 ${i === 2 ? "sm:col-span-2" : ""}`}>
              <span className="grid size-14 place-items-center rounded-full bg-motion-ice text-[#4968f2]">
                <Icon />
              </span>
              <h2 className="display-font mt-5 text-xl font-bold">{t as string}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{x as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
