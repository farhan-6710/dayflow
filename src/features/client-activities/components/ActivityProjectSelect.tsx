import { useMemo } from "react";

import type { Project } from "@/services/projectsService";
import { OptionDropdown } from "@/shared/components/OptionDropdown";

type ActivityProjectSelectProps = {
  value: string;
  onChange: (projectId: string) => void;
  projects: Project[];
  disabled?: boolean;
};

export function ActivityProjectSelect({
  value,
  onChange,
  projects,
  disabled = false,
}: ActivityProjectSelectProps) {
  const options = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id,
        label: project.name,
      })),
    [projects],
  );

  return (
    <OptionDropdown
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled || projects.length === 0}
      placeholder={projects.length === 0 ? "No client projects" : "Select project"}
    />
  );
}
