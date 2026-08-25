import type { EventStatus, RegistrationStatus } from '../constants/events.js';

export interface EventResponse {
  id: string;
  societyId: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
  maxCapacity: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  
  society?: {
    name: string;
    logoUrl: string | null;
  };
  
  _count?: {
    registrations: number;
    waitlistEntries: number;
    interests: number;
  };
}

export interface EventRegistrationState {
  isRegistered: boolean;
  isWaitlisted: boolean;
  isInterested: boolean;
  waitlistPosition?: number;
}
