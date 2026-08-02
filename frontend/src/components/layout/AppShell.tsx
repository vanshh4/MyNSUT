"use client";
import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-main">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="flex-1 lg:ml-[352px] h-screen overflow-y-auto px-4 md:px-[64px] py-8 md:py-12 relative">
        <Navbar onMenuClick={() => setOpen(true)} />
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
