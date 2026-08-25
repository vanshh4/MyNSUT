"use client";

import { useState, useEffect } from "react";
import { eventsApi } from "@/lib/api/events";
import { EventRegistrationState } from "@mynsut/shared";
import { GlassButton } from "@/components/ui/GlassButton";
import { toast } from "react-hot-toast";
import { Check, Clock, Bookmark, X } from "lucide-react";

interface EventRegistrationButtonProps {
  eventId: string;
  isUpcoming: boolean;
  onStateChange?: () => void;
}

export function EventRegistrationButton({ eventId, isUpcoming, onStateChange }: EventRegistrationButtonProps) {
  const [state, setState] = useState<EventRegistrationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchState();
  }, [eventId]);

  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getRegistrationState(eventId);
      setState((res as any).data);
    } catch (error) {
      console.error("Failed to fetch registration state:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "INTERESTED" | "REGISTER" | "CANCEL") => {
    try {
      setActionLoading(true);
      const res = await eventsApi.handleRegistrationAction(eventId, action);
      const status = (res as any).data.status;
      
      if (status === "REGISTERED") {
        toast.success("Successfully registered for the event!");
      } else if (status === "WAITLISTED") {
        toast.success("Added to the waitlist.");
      } else if (status === "CANCELLED") {
        toast.success("Registration cancelled.");
      } else if (status === "INTERESTED") {
        toast.success("Marked as interested!");
      }

      await fetchState();
      if (onStateChange) onStateChange();
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <GlassButton variant="secondary" disabled className="w-full sm:w-auto animate-pulse h-10 w-32" />;
  }

  if (!state) return null;

  if (!isUpcoming) {
    return (
      <GlassButton variant="secondary" disabled className="w-full sm:w-auto">
        Event has passed
      </GlassButton>
    );
  }

  if (state.isRegistered) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <GlassButton variant="secondary" className="w-full sm:w-auto bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default hover:bg-emerald-100/50">
          <Check className="w-4 h-4 mr-2" /> Registered
        </GlassButton>
        <GlassButton variant="ghost" className="w-full sm:w-auto text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleAction("CANCEL")} disabled={actionLoading}>
          {actionLoading ? "Cancelling..." : "Cancel Registration"}
        </GlassButton>
      </div>
    );
  }

  if (state.isWaitlisted) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <GlassButton variant="secondary" className="w-full sm:w-auto bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 cursor-default hover:bg-amber-100/50">
          <Clock className="w-4 h-4 mr-2" /> Waitlisted (Pos: {state.waitlistPosition})
        </GlassButton>
        <GlassButton variant="ghost" className="w-full sm:w-auto text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleAction("CANCEL")} disabled={actionLoading}>
          {actionLoading ? "Cancelling..." : "Leave Waitlist"}
        </GlassButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <GlassButton variant="primary" className="w-full sm:w-auto" onClick={() => handleAction("REGISTER")} disabled={actionLoading}>
        {actionLoading ? "Processing..." : "Register Now"}
      </GlassButton>
      
      {!state.isInterested ? (
        <GlassButton variant="secondary" className="w-full sm:w-auto" onClick={() => handleAction("INTERESTED")} disabled={actionLoading}>
          <Bookmark className="w-4 h-4 mr-2" /> Interested
        </GlassButton>
      ) : (
        <GlassButton variant="ghost" className="w-full sm:w-auto" onClick={() => handleAction("CANCEL")} disabled={actionLoading}>
          <X className="w-4 h-4 mr-2" /> Remove Interest
        </GlassButton>
      )}
    </div>
  );
}
