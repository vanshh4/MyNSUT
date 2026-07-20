import Link from "next/link";

interface AppLogoProps {
  compact?: boolean;
  className?: string;
}

function MaterialSchoolIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3 1 9l4 2.18v4L12 19l7-3.82v-4L21 10.09V17h2V9L12 3Zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9ZM17 13.99l-5 2.73-5-2.73v-1.72L12 15l5-2.73v1.72Z" />
    </svg>
  );
}

export function AppLogo({ compact = false, className = "" }: AppLogoProps) {
  const rootClassName = ["inline-flex items-center gap-3", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href="/" className={rootClassName} aria-label="MyNSUT home">
      <span
        className="grid size-12 shrink-0 place-items-center rounded-[18px] bg-[#4968f2] text-white shadow-[0_12px_30px_rgba(73,104,242,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
        aria-hidden="true"
      >
        <MaterialSchoolIcon />
      </span>

      {!compact && (
        <span className="leading-none">
          <span className="display-font block text-xl font-extrabold tracking-[-0.05em] text-slate-950 dark:text-white">
            My<span className="text-[#4968f2] dark:text-[#91a2ff]">NSUT</span>
          </span>

          <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[0.19em] text-slate-500 dark:text-slate-400">
            Student platform
          </span>
        </span>
      )}
    </Link>
  );
}
