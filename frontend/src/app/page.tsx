import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  GraduationCap, 
  Megaphone, 
  CalendarDays, 
  Users, 
  User, 
  BarChart2, 
  ListTodo 
} from "lucide-react";

const features = [
  { icon: Megaphone, title: "Announcements", desc: "Never miss important updates from your class." },
  { icon: CalendarDays, title: "Events & Fests", desc: "Discover, register and participate in events." },
  { icon: Users, title: "Societies & Clubs", desc: "Explore societies, join groups and grow together." },
  { icon: User, title: "Student Profile", desc: "Showcase your journey, achievements and more." },
  { icon: BarChart2, title: "Academic Insights", desc: "Track your SGPA, CGPA and compare progress." },
  { icon: ListTodo, title: "Tasks & Checklists", desc: "Stay organized with class tasks and deadlines." },
];

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col font-body antialiased selection:bg-primary-container selection:text-on-primary-container bg-background text-text-main transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative background gradient similar to bg-gradient-base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-surface-container-high dark:from-background dark:to-surface/10 pointer-events-none -z-10" />

      {/* Main Content Layout */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-[64px] w-full max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full items-center">
          
          {/* Left Section: Branding & Hero */}
          <div className="flex flex-col gap-12 relative z-10">
            
            {/* Brand Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center shadow-sm border border-glass-border">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="m-0 font-headline text-2xl font-semibold text-primary">MyNSUT</h1>
                <p className="m-0 font-label text-xs font-semibold text-text-muted">One Campus. Infinite Possibilities.</p>
              </div>
            </div>

            {/* Hero Copy */}
            <div className="space-y-4">
              <h2 className="m-0 font-headline text-5xl font-semibold leading-[1.125] text-primary-container lg:text-[64px] lg:leading-[72px]">
                Your Campus,<br />
                <span className="text-text-muted">moving with you.</span>
              </h2>
              <br />
              <p className="m-0 max-w-md font-body text-lg text-text-muted">
                MyNSUT is the official student platform for NSUTians to stay informed, connected and empowered. All in one place.
              </p>
              <button className="mt-4 px-6 py-3 bg-primary text-on-primary rounded-xl font-label text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
                Get Started
              </button>
            </div>

          </div>

          {/* Right Section: Feature Grid */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <GlassCard className="grid w-full grid-cols-1 md:grid-cols-2 gap-6 p-10 rounded-xl" hoverEffect={false}>
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="w-6 h-6 text-primary-container" />
                    </div>
                    <div>
                      <h3 className="m-0 mb-1 font-label text-xl font-semibold text-text-main">
                        {feature.title}
                      </h3>
                      <p className="m-0 font-label text-base font-normal text-text-muted">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </GlassCard>
          </div>
          
        </div>
      </div>

      {/* Footer Component */}
      <footer className="w-full py-2 flex justify-center items-center gap-[24px] bg-transparent">
        <div className="flex flex-col md:flex-row items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
          <p className="m-0 text-center font-label text-xs text-text-muted">
            © 2025 MyNSUT
          </p>
        </div>
      </footer>

    </main>
  );
}
