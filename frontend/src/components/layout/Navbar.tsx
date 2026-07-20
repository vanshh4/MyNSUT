"use client";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { MotionButton } from "@/components/ui/MotionButton";
const KEY = "mynsut-theme",
  EVENT = "theme-change";
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function snapshot() {
  return localStorage.getItem(KEY) === "dark";
}
function server() {
  return false;
}
export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const dark = useSyncExternalStore(subscribe, snapshot, server);
  const [q, setQ] = useState("");
  function toggle() {
    const n = dark ? "light" : "dark";
    localStorage.setItem(KEY, n);
    document.documentElement.classList.toggle("dark", n === "dark");
    window.dispatchEvent(new Event(EVENT));
  }
  return (
    <header className="glass sticky top-3 z-30 mx-3 flex min-h-16 items-center gap-3 rounded-full px-3 sm:px-5 lg:ml-0">
      <button
        onClick={onMenuClick}
        className="grid size-10 place-items-center rounded-full lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <form
        className="relative ml-auto hidden w-[min(38vw,32rem)] md:block"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) location.href = `/search?q=${encodeURIComponent(q.trim())}`;
        }}
      >
        <Search className="absolute top-1/2 left-112 size-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pill-input pl-11"
          placeholder="Search events, societies or students"
        />
      </form>
      <MotionButton
        variant="ghost"
        className="size-11 px-0"
        onClick={toggle}
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </MotionButton>
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="grid size-11 place-items-center rounded-full bg-[#172033] text-xs font-bold text-white"
      >
        VB
      </motion.div>
    </header>
  );
}
import { motion } from "framer-motion";
