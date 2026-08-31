export const tasksDirectoryConfig = {
  gridClass:
    "grid-cols-[minmax(0,1fr)_6.75rem_7.75rem_11.5rem_3.25rem]",
  columns: [
    { label: "TASK" },
    { label: "PRIORITY" },
    { label: "STATUS" },
    { label: "DUE" },
    { label: "ACTIONS", align: "right" as const },
  ],
} as const;
