"use client";

import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { MotionButton } from "@/components/ui/MotionButton";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

const THEME_KEY = "mynsut-theme";
const THEME_CHANGE_EVENT = "theme-change";
function subscribeToTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function getThemeSnapshot() { return localStorage.getItem(THEME_KEY) === "dark"; }
function getServerThemeSnapshot() { return false; }

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [query, setQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function toggleTheme() {
    const nextTheme = dark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) router.push(`${routes.search}?q=${encodeURIComponent(trimmedQuery)}`);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace(routes.signIn);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="glass sticky top-3 z-30 mx-3 flex min-h-18 max-w-full items-center gap-3 overflow-hidden rounded-full px-3 sm:px-5 lg:ml-0">
      <button type="button" onClick={onMenuClick} className="grid size-10 shrink-0 place-items-center rounded-full lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button>
      <form className="relative min-w-0 flex-1" role="search" onSubmit={handleSearch}>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="pill-input block w-full min-w-0 pl-5 pr-12" placeholder="Search events, societies or students" aria-label="Search events, societies or students" />
        <button type="submit" className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-blue-50 hover:text-[#4968f2] dark:hover:bg-white/10 dark:hover:text-[#91a2ff]" aria-label="Submit search"><Search className="size-4" /></button>
      </form>
      <MotionButton variant="ghost" className="size-11 shrink-0 px-0" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</MotionButton>
      <MotionButton variant="ghost" className="hidden size-11 shrink-0 px-0 sm:inline-flex" onClick={() => void handleLogout()} disabled={isLoggingOut} aria-label="Log out"><LogOut className="size-4" /></MotionButton>
    </header>
  );
}
