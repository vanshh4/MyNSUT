"use client";

import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

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
function getThemeSnapshot() {
  return localStorage.getItem(THEME_KEY) === "dark";
}
function getServerThemeSnapshot() {
  return false;
}

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
    <header className="bg-glass-surface dark:bg-primary-container/30 rounded-full h-16 backdrop-blur-xl border border-glass-border flex items-center justify-between px-4 md:px-6 w-full max-w-[1280px] mx-auto mb-12 shadow-sm sticky top-4 z-30">
      <button
        type="button"
        onClick={onMenuClick}
        className="mr-2 grid size-10 shrink-0 place-items-center rounded-full lg:hidden text-text-muted hover:bg-black/5 dark:hover:bg-white/5"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      <form className="flex-1 flex items-center relative focus-within:ring-2 focus-within:ring-primary/20 transition-all rounded-full h-full group" role="search" onSubmit={handleSearch}>
        <Search className="size-5 text-text-muted absolute left-4 group-focus-within:text-primary transition-colors" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 font-body text-sm md:text-base text-text-main placeholder:text-text-muted outline-none [&::-webkit-search-cancel-button]:hidden"
          placeholder="Search events, societies or students"
          aria-label="Search events, societies or students"
        />
      </form>

      <div className="flex items-center gap-1 md:gap-2 pl-4 border-l border-glass-border ml-2 md:ml-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-text-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          aria-label="Log out"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </header>
  );
}
