"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Users, UserCog, ScrollText, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

const modules = [
  { i: Users, t: "Users", x: "Search users and manage scoped role assignments.", href: "/admin/users" },
  { i: UserCog, t: "Roles", x: "View all platform roles, scopes, and active counts.", href: "/admin/roles" },
  { i: ScrollText, t: "Audit Logs", x: "Search immutable audit logs for administrative actions.", href: "/admin/audit-logs", disabled: true },
  { i: Building2, t: "Societies", x: "Create and manage societies and their leadership.", href: "/admin/societies" },
];

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Administration"
        description="Clear controls for sensitive, audited platform operations."
        actions={
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/50 dark:bg-white/10 rounded-full border border-blue-200 dark:border-white/20 text-blue-900 dark:text-white font-label text-sm font-medium">
            <ShieldCheck className="w-[18px] h-[18px]" />
            Authorized
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {modules.map(({ i: Icon, t, x, href, disabled }, n) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: n * 0.07, type: "spring" }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full flex flex-col cursor-pointer"
          >
            <GlassCard className="p-8 flex flex-col gap-6 h-full shadow-sm hover:shadow-md transition-shadow" hoverEffect={false}>
              <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white shrink-0">
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-headline text-2xl font-bold text-text-main mb-2">{t}</h3>
                <p className="font-body text-base text-text-muted whitespace-pre-line">{x}</p>
              </div>
              <Link 
                href={href}
                className={`mt-auto flex items-center gap-2 font-label text-sm font-semibold text-primary dark:text-gray-300 hover:text-primary-container dark:hover:text-white transition-colors ${disabled ? 'opacity-0 pointer-events-none' : ''}`}
                tabIndex={disabled ? -1 : 0}
              >
                Open module
                <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
