import { format } from "date-fns";

import { PROJECT_FOR_LABEL } from "@/features/admin/projects/constants/projectFor";
import type { Note } from "@/services/notesService";
import type { Project } from "@/services/projectsService";

export function getProjectNoteCountLabel(count: number): string {
  return count === 1 ? "1 note" : `${count} notes`;
}

export function getProjectLastActivityLabel(
  project: Project,
  notes: Note[],
): string {
  const timestamps = [project.updated_at, ...notes.map((note) => note.updated_at)]
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return "No activity yet";
  }

  return format(new Date(Math.max(...timestamps)), "MMM d, yyyy");
}

export function buildProjectDetailDescription(project: Project): string {
  return `Notes and reference for ${project.name}.`;
}

export function buildProjectDetailMeta(
  project: Project,
  notes: Note[],
): string {
  const parts = [
    getProjectNoteCountLabel(notes.length),
    `Last updated ${getProjectLastActivityLabel(project, notes)}`,
    `${PROJECT_FOR_LABEL}: ${project.project_for_label}`,
  ];

  if (project.is_archived) {
    parts.push("Archived");
  }

  return parts.join(" · ");
}

export function buildProjectNotesEmptyMessage(projectName: string): string {
  return `Capture specs, meeting notes, and reference material for ${projectName}. Add your first note to keep everything in one place.`;
}
