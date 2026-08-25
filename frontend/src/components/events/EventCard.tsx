import Link from "next/link";
import { Event, EVENT_STATUS } from "@mynsut/shared";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isUpcoming = new Date(event.startDate) > new Date();
  
  return (
    <Link href={`/events/${event.id}`} className="block h-full group">
      <GlassCard className="p-0 h-full flex flex-col shadow-sm transition-shadow hover:shadow-md overflow-hidden relative" hoverEffect={false}>
        {event.coverImageUrl ? (
           <div className="h-32 w-full overflow-hidden">
             <img src={event.coverImageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="cover" />
           </div>
        ) : (
           <div className="h-32 w-full bg-gradient-to-br from-primary/10 to-primary/5" />
        )}

        <div className="px-6 pb-6 pt-4 flex flex-col flex-grow relative">
          <div className="flex justify-between items-start gap-2">
            <h2 className="font-headline text-xl font-bold text-text-main line-clamp-2">{event.title}</h2>
            {event.status === EVENT_STATUS.PUBLISHED && isUpcoming && (
              <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Upcoming
              </span>
            )}
            {event.status === EVENT_STATUS.CANCELLED && (
              <span className="shrink-0 inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Cancelled
              </span>
            )}
          </div>

          <p className="mt-2 font-body text-sm text-text-muted flex-grow line-clamp-3">
            {event.description || "Join us for this exciting event!"}
          </p>
          
          <div className="mt-4 flex flex-col gap-2 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0 text-primary" />
              <span className="truncate">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 shrink-0 text-primary" />
              <span className="truncate">
                {event._count?.registrations ?? 0} / {event.maxCapacity} Registered
              </span>
            </div>
          </div>

          <GlassButton variant="secondary" className="mt-6 w-full rounded-full gap-2">
            View event <ExternalLink className="w-4 h-4" />
          </GlassButton>
        </div>
      </GlassCard>
    </Link>
  );
}
