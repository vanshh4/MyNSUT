import type { Metadata } from "next";
import { Source_Serif_4, Comfortaa, Inter } from "next/font/google";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-headline", display: "swap" });
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-label", display: "swap" });

export const metadata: Metadata = {
  title: { default: "MyNSUT", template: "%s | MyNSUT" },
  description: "A connected digital campus for NSUT students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSerif.variable} ${comfortaa.variable} ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
