export const SECTIONS = ["1", "2", "3"] as const;
export type SectionCode = (typeof SECTIONS)[number];

export function isSectionCode(value: string): value is SectionCode {
  return SECTIONS.includes(value as SectionCode);
}
