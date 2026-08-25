export const SOCIETY_CATEGORIES = [
  "TECH",
  "CULTURAL",
  "LITERARY",
  "SPORTS",
  "MANAGEMENT",
  "SOCIAL",
  "ACADEMIC",
  "OTHER"
] as const;

export type SocietyCategoryType = typeof SOCIETY_CATEGORIES[number];
