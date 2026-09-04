"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Megaphone, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { noticesApi } from "@/lib/api/notices";
import type { UnifiedFeedItem } from "@mynsut/shared";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [noticesCount, setNoticesCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [classAnnouncements, setClassAnnouncements] = useState<UnifiedFeedItem[]>([]);

  useEffect(() => {
    Promise.all([
      noticesApi.getUnifiedFeed({ limit: 50 }),
      noticesApi.getUnifiedFeed({ type: 'CLASS', limit: 3 })
    ]).then(([feedRes, classRes]) => {
      const notices = feedRes.items.filter(i => i.type !== 'EVENT');
      const events = feedRes.items.filter(i => i.type === 'EVENT');
      
      setNoticesCount(notices.length);
      setEventsCount(events.length);
      setClassAnnouncements(classRes.items);
    }).catch(console.error);
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || "Student";
  // e.g. "MONDAY · 13 JULY"
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase().replace(',', ' ·');
  const displayNoticesCount = noticesCount >= 50 ? "50+" : noticesCount.toString();
  const displayEventsCount = eventsCount >= 50 ? "50+" : eventsCount.toString();

  const stats = [
    { 
      title: "Recent notices", 
      value: displayNoticesCount, 
      icon: Megaphone, 
      bgColor: "bg-rose-100/50 dark:bg-[#93000a]/20", 
      textColor: "text-rose-600 dark:text-[#ffb4ab]" 
    },
    {
      title: "Upcoming events",
      value: displayEventsCount,
      icon: CalendarDays,
      bgColor: "bg-blue-100/50 dark:bg-[#e2e2e2]/20",
      textColor: "text-blue-600 dark:text-[#ffffff]"
    },
  ];

  return (
    <div className="w-full">
      {/* Greeting Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <p className="font-label text-xs text-primary uppercase tracking-wider mb-2 font-semibold">{currentDate}</p>
        <h1 className="font-headline text-5xl text-primary dark:text-primary-container font-bold mb-3 tracking-tight">
          Hey {firstName}
        </h1>
        <p className="font-body text-lg text-text-muted max-w-2xl">
          A calmer view of everything happening across your class and campus.
        </p>
      </motion.section>

      {/* Summary Cards */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        {stats.map(({ title, value, icon: Icon, bgColor, textColor }) => (
          <motion.div
            key={title}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
          >
            <GlassCard className="p-8 flex items-center justify-between rounded-[24px] group shadow-sm transition-shadow hover:shadow-md" hoverEffect={false}>
              <div>
                <h2 className="font-headline text-5xl text-primary dark:text-primary-container font-bold mb-1">{value}</h2>
                <p className="font-body text-base text-text-muted font-medium">{title}</p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${bgColor} ${textColor}`}>
                <Icon className="w-8 h-8" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.section>

      {/* Recent Announcements */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard className="p-8 rounded-[24px]" hoverEffect={false}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-label text-xs text-primary uppercase tracking-wider mb-2 font-semibold">YOUR CLASS</p>
              <h2 className="font-headline text-2xl text-primary dark:text-primary-container font-semibold">Recent announcements</h2>
            </div>
            <Link href="/notices?type=CLASS" className="flex items-center gap-2 px-6 py-3 bg-primary/5 hover:bg-primary/10 dark:bg-[#e3e2e2]/20 dark:hover:bg-[#e3e2e2]/40 text-primary dark:text-[#ffffff] rounded-full transition-colors font-label text-sm font-medium">
              View all
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-0 divide-y divide-glass-border">
            {classAnnouncements.length > 0 ? (
              classAnnouncements.map((announcement, i) => (
                <motion.div 
                  key={announcement.id} 
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="py-6 flex items-start gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors -mx-4 px-4 rounded-xl cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-body text-lg text-text-main font-medium mb-1">{announcement.title}</h3>
                    <p className="font-body text-base text-text-muted">{announcement.excerpt || announcement.sourceName}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-[#ffffff] mt-2"></div>
                </motion.div>
              ))
            ) : (
              <div className="py-6 text-text-muted font-body">No recent announcements in your class.</div>
            )}
          </div>
        </GlassCard>
      </motion.section>
    </div>
  );
}
