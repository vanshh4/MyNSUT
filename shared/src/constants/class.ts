export const CLASS_TASK_TYPE = {
  FILL_FORM: "FILL_FORM",
  READ_DOCUMENT: "READ_DOCUMENT",
  SUBMIT_ASSIGNMENT: "SUBMIT_ASSIGNMENT",
  OTHER: "OTHER",
} as const;

export type ClassTaskType = typeof CLASS_TASK_TYPE[keyof typeof CLASS_TASK_TYPE];

export const isClassTaskType = (val: string): val is ClassTaskType => {
  return Object.values(CLASS_TASK_TYPE).includes(val as ClassTaskType);
};
