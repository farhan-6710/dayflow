import {
  MYSELF_PROJECT_FOR_LABEL,
  MYSELF_PROJECT_FOR_VALUE,
} from "@/features/projects/constants/projectFor";

export function projectForToSelectValue(projectFor: string | null): string {
  return projectFor ?? MYSELF_PROJECT_FOR_VALUE;
}

export function selectValueToProjectFor(value: string): string | null {
  return value === MYSELF_PROJECT_FOR_VALUE ? null : value;
}

export function resolveProjectForLabel(
  projectFor: string | null,
  clientName: string | null | undefined,
): string {
  if (!projectFor) {
    return MYSELF_PROJECT_FOR_LABEL;
  }

  return clientName?.trim() || MYSELF_PROJECT_FOR_LABEL;
}
