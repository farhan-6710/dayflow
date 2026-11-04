import { Check } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { useClients } from "@/features/clients/useClients";
import { useProjectActions } from "@/features/projects/useProjects";
import { DEFAULT_PROJECT_COLOR, PROJECT_COLOR_PRESETS } from "@/shared/constants/projectColors";
import type { Project } from "@/shared/types/types";
import { FormSheet } from "@/ui/FormSheet";
import { Input } from "@/ui/Input";
import { SelectField } from "@/ui/SelectField";
import { SwitchRow } from "@/ui/SwitchRow";
import { Text } from "@/ui/Text";

const MYSELF = "myself";

type ProjectFormSheetProps = {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
  /** Prefills "Project for" when adding from a client's page. */
  defaultClientId?: string;
};

export function ProjectFormSheet({ open, onClose, project, defaultClientId }: ProjectFormSheetProps) {
  const clients = useClients();
  const { create, update } = useProjectActions();
  const initial = useMemo(
    () => ({
      name: project?.name ?? "",
      color: project?.color_hex ?? DEFAULT_PROJECT_COLOR,
      projectFor: project ? (project.project_for ?? MYSELF) : (defaultClientId ?? MYSELF),
      active: project?.is_active ?? true,
    }),
    [project, defaultClientId],
  );
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const options = [
    { value: MYSELF, label: "Myself (personal)" },
    ...(clients.data ?? []).map((client) => ({ value: client.id, label: client.company_name })),
  ];
  const colors: readonly string[] = PROJECT_COLOR_PRESETS;
  const swatches = colors.includes(form.color) ? colors : [form.color, ...colors];

  async function submit() {
    const projectFor = form.projectFor === MYSELF ? null : form.projectFor;
    if (project) {
      await update.mutateAsync({ id: project.id, updates: { name: form.name.trim(), color_hex: form.color, project_for: projectFor, is_active: form.active } });
    } else {
      await create.mutateAsync({ name: form.name.trim(), color_hex: form.color, project_for: projectFor });
    }
  }

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title={project ? "Edit project" : "New project"}
      submitLabel={project ? "Save project" : "Add project"}
      onSubmit={submit}
      dirty={JSON.stringify(form) !== JSON.stringify(initial)}
      canSubmit={Boolean(form.name.trim())}
    >
      <Input label="Name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} placeholder="Project name" autoFocus={!project} />
      <View className="gap-1.5">
        <Text variant="label">Colour</Text>
        <View className="flex-row flex-wrap gap-2.5">
          {swatches.map((color) => (
            <Pressable
              key={color}
              accessibilityRole="radio"
              accessibilityLabel={`Colour ${color}`}
              accessibilityState={{ selected: color === form.color }}
              onPress={() => setForm({ ...form, color })}
              style={{ backgroundColor: color }}
              className="size-10 items-center justify-center rounded-full"
            >
              {color === form.color ? <Check size={18} color="#ffffff" /> : null}
            </Pressable>
          ))}
        </View>
      </View>
      <SelectField label="Project for" value={form.projectFor} options={options} onChange={(projectFor) => setForm({ ...form, projectFor })} />
      {project ? <SwitchRow label="Active" description="Inactive projects stay in your list under Inactive." value={form.active} onChange={(active) => setForm({ ...form, active })} /> : null}
    </FormSheet>
  );
}
