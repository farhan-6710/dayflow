import {
  MYSELF_PROJECT_FOR_LABEL,
  MYSELF_PROJECT_FOR_VALUE,
} from "@/features/projects/constants/projectFor";
import type { ProjectForSelectProps } from "@/features/projects/types/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function ProjectForSelect({
  value,
  onChange,
  clients,
  disabled,
}: ProjectForSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select who this project is for" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={MYSELF_PROJECT_FOR_VALUE}>
          {MYSELF_PROJECT_FOR_LABEL}
        </SelectItem>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.client_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
