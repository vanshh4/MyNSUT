import { apiClient, apiUrl } from "./client";
import { apiEndpoints } from "./endpoints";
import type { 
  EventResponse as Event, 
  EventFilterParams, 
  EventRegistrationState,
  EVENT_STATUS,
  PaginatedResponse,
} from "@mynsut/shared";

export interface CreateEventPayload {
  societyId: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxCapacity: number;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  status?: typeof EVENT_STATUS[keyof typeof EVENT_STATUS];
}

export const eventsApi = {
  getEvents: (filters?: EventFilterParams) => {
    const query = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient<PaginatedResponse<Event>>(apiEndpoints.events.list + query, { method: "GET" });
  },

  getEventById: (id: string) => {
    return apiClient<Event>(apiEndpoints.events.detail(id), { method: "GET" });
  },

  createEvent: (payload: CreateEventPayload) => {
    return apiClient<Event>(apiEndpoints.events.create, { method: "POST", body: JSON.stringify(payload) });
  },

  updateEvent: (id: string, payload: UpdateEventPayload) => {
    return apiClient<Event>(apiEndpoints.events.update(id), { method: "PATCH", body: JSON.stringify(payload) });
  },

  getRegistrationState: (eventId: string) => {
    return apiClient<EventRegistrationState>(apiEndpoints.events.registrations.state(eventId), { method: "GET" });
  },

  handleRegistrationAction: (eventId: string, action: "INTERESTED" | "REGISTER" | "CANCEL") => {
    return apiClient<{ status: string }>(apiEndpoints.events.registrations.action(eventId), { 
      method: "POST", 
      body: JSON.stringify({ action }) 
    });
  },

  exportRegistrationsUrl: (eventId: string) => {
    // Return the same-origin URL for downloading the CSV directly through the Next.js proxy rewrite
    return apiUrl(apiEndpoints.events.registrations.export(eventId));
  }
};
