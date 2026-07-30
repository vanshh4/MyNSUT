"use client";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { ShieldCheck, Users, UserPlus, ScrollText, Building2, Megaphone } from "lucide-react";
import Link from "next/link";
const modules = [
  { i: Users, t: "Users", x: "Search users and manage scoped role assignments.", href: "/admin/users" },
  { i: UserPlus, t: "Roles", x: "View all platform roles, scopes, and active counts.", href: "/admin/roles" },
  { i: ScrollText, t: "Audit Logs", x: "Search immutable audit logs for administrative actions.", href: "/admin/audit-logs" },
  { i: Building2, t: "Classes & societies", x: "Manage academic groups and campus communities. (Coming Soon)", href: "#" },
  { i: Megaphone, t: "Notice selection", x: "Publish selected metadata and source links. (Coming Soon)", href: "#" },
];
export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Super Admin"
        title="Administration"
        description="Clear controls for sensitive, audited platform operations."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full bg-motion-mint px-4 py-2 text-xs font-black text-emerald-700">
            <ShieldCheck className="size-4" />
            Authorized
          </span>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {modules.map(({ i: Icon, t, x, href }, n) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: n * 0.07, type: "spring" }}
            className="h-full"
          >
            <MotionCard className="p-6 flex flex-col h-full">
              <span className="grid size-14 place-items-center rounded-full bg-motion-lilac text-violet-600 shrink-0">
                <Icon />
              </span>
              <h2 className="display-font mt-5 text-xl font-bold">{t}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)] flex-1">{x}</p>
              <div className="mt-5">
                <Link 
                  href={href}
                  className="inline-block rounded-full bg-white/60 px-4 py-2 text-sm font-bold text-[#4968f2] dark:bg-white/5"
                >
                  Open module →
                </Link>
              </div>
            </MotionCard>
          </motion.div>
        ))}
      </div>
    </>
  );
}
