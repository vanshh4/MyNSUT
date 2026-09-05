"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { EventCard } from "@/components/events/EventCard";
import { eventsApi } from "@/lib/api/events";
import { EventResponse as Event, EVENT_STATUS } from "@mynsut/shared";

export default function EventsDiscoveryPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch only published events that have not passed
      const res = await eventsApi.getEvents({ status: EVENT_STATUS.PUBLISHED, upcoming: true });
      setEvents((res as any).data || []);
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
    (e.society && e.society.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="What's happening"
        title="Events & fests"
        description="Discover, register and keep track of your next campus experience."
      />
      
      <div className="relative mb-10 max-w-xl group">
        <Search className="absolute top-1/2 left-4 w-5 h-5 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
        <input 
          className="w-full bg-glass-surface dark:bg-[#1a2b4b]/30 border border-glass-border rounded-full h-14 pl-12 pr-4 font-body text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" 
          placeholder="Search events by title, description or society..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-text-muted">Loading events...</div>
        </div>
      ) : (

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredEvents.map((event, i) => (
          <motion.div
            key={event.id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <EventCard event={event} />
          </motion.div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted">
            No events found matching your search.
          </div>
        )}
      </motion.div>
      )}
    </div>
  );
}
