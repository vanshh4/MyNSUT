export const PROFILE_VISIBILITY = {
  PUBLIC: "PUBLIC",
  PLATFORM_ONLY: "PLATFORM_ONLY",
  PRIVATE: "PRIVATE",
} as const;

export type ProfileVisibility = typeof PROFILE_VISIBILITY[keyof typeof PROFILE_VISIBILITY];
