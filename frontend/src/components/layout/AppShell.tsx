"use client";
import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="motion-page min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-[19.5rem]">
        <Navbar onMenuClick={() => setOpen(true)} />
        <main className="mx-auto max-w-[1450px] px-4 py-8 sm:px-7 lg:px-9">{children}</main>
      </div>
    </div>
  );
}
