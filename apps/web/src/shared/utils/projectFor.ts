export const MYSELF_PROJECT_FOR_VALUE = "myself";

export function projectForToSelectValue(projectFor: string | null): string {
  return projectFor ?? MYSELF_PROJECT_FOR_VALUE;
}

export function selectValueToProjectFor(value: string): string | null {
  return value === MYSELF_PROJECT_FOR_VALUE ? null : value;
}
