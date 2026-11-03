export const ACTIVE_STATUS_FILTERS = ["all", "active", "inactive"] as const;

export type ActiveStatusFilterId = (typeof ACTIVE_STATUS_FILTERS)[number];
