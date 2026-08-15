export const NOTICE_CATEGORY = {
  ACADEMIC: 'ACADEMIC',
  EXAMINATION: 'EXAMINATION',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  FEES: 'FEES',
  EVENTS: 'EVENTS',
  GENERAL: 'GENERAL',
} as const;

export const NOTICE_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type NoticeCategory = typeof NOTICE_CATEGORY[keyof typeof NOTICE_CATEGORY];
export type NoticeStatus = typeof NOTICE_STATUS[keyof typeof NOTICE_STATUS];

export const isNoticeCategory = (value: unknown): value is NoticeCategory => {
  return typeof value === 'string' && Object.values(NOTICE_CATEGORY).includes(value as NoticeCategory);
};

export const isNoticeStatus = (value: unknown): value is NoticeStatus => {
  return typeof value === 'string' && Object.values(NOTICE_STATUS).includes(value as NoticeStatus);
};
