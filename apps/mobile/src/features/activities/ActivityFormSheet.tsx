import { useEffect, useMemo, useState } from "react";

import { ACTIVITY_KINDS, type ActivityItem, type ActivityKind } from "@/features/activities/activityModel";
import { useActivityActions, type ActivityInput } from "@/features/activities/useActivityActions";
import { DEFAULT_TIME } from "@/shared/constants/times";
import { priorityOptions, statusOptions, venueOptions } from "@/shared/constants/activityOptions";
import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityMeetingVenue,
  ClientActivityPriority,
  ClientActivityRaisedBy,
  ClientActivityStatus,
  ClientActivityTask,
} from "@/shared/types/activities";
import { serializeDateValue } from "@/shared/utils/dateValue";
import { ChipGroup } from "@/ui/ChipGroup";
import { DateField } from "@/ui/DateField";
import { FormSheet } from "@/ui/FormSheet";
import { Input } from "@/ui/Input";
import { SelectField } from "@/ui/SelectField";
import { TimeField } from "@/ui/TimeField";

type ActivityFormSheetProps = {
  open: boolean;
  onClose: () => void;
  kind: ActivityKind;
  item?: ActivityItem | null;
  raisedBy: ClientActivityRaisedBy;
  /** Projects to choose from when adding. */
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
};

function initialState(kind: ActivityKind, item: ActivityItem | null | undefined, defaultProjectId: string) {
  const today = serializeDateValue(new Date());
  const task = item?.kind === "task" ? (item.raw as ClientActivityTask) : null;
  const meeting = item?.kind === "meeting" ? (item.raw as ClientActivityMeeting) : null;
  const call = item?.kind === "call" ? (item.raw as ClientActivityCall) : null;
  return {
    projectId: item?.projectId ?? defaultProjectId,
    title: item?.title ?? "",
    description: (item?.raw.description ?? "") as string,
    status: (item?.status ?? "pending") as ClientActivityStatus,
    priority: (task?.priority ?? "medium") as ClientActivityPriority,
    venue: (meeting?.venue ?? "online") as ClientActivityMeetingVenue,
    date: task?.eta_date ?? meeting?.from_date ?? call?.start_date ?? today,
    time: task?.eta_time ?? meeting?.from_time ?? call?.start_time ?? DEFAULT_TIME,
    toDate: meeting?.to_date ?? today,
    toTime: meeting?.to_time ?? "11:00 AM",
    duration: String(call?.duration_minutes ?? 30),
    kind,
  };
}

export function ActivityFormSheet({ open, onClose, kind, item, raisedBy, projects, defaultProjectId }: ActivityFormSheetProps) {
  const { create, update } = useActivityActions();
  const initial = useMemo(() => initialState(kind, item, defaultProjectId ?? projects[0]?.id ?? ""), [kind, item, defaultProjectId, projects]);
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const label = ACTIVITY_KINDS.find((entry) => entry.value === kind)?.label ?? "Activity";
  const duration = Number.parseInt(form.duration, 10);
  const validDuration = kind !== "call" || (Number.isFinite(duration) && duration > 0);
  const canSubmit = Boolean(form.title.trim() && form.projectId && form.date && form.time && validDuration);

  function buildInput(): ActivityInput {
    const common = { title: form.title.trim(), description: form.description.trim() || null, status: form.status };
    const raised = item ? {} : { raisedBy };
    if (kind === "task") return { kind, values: { ...common, ...raised, priority: form.priority, etaDate: form.date, etaTime: form.time } };
    if (kind === "meeting") return { kind, values: { ...common, ...raised, fromDate: form.date, fromTime: form.time, toDate: form.toDate, toTime: form.toTime, venue: form.venue } };
    return { kind, values: { ...common, ...raised, startDate: form.date, startTime: form.time, durationMinutes: duration } };
  }

  async function submit() {
    if (item) await update.mutateAsync({ id: item.id, input: buildInput() });
    else await create.mutateAsync({ projectId: form.projectId, input: buildInput() });
  }

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title={item ? `Edit ${label.toLowerCase()}` : raisedBy === "client" ? `Raise a ${label.toLowerCase()}` : `New ${label.toLowerCase()}`}
      submitLabel={item ? "Save" : raisedBy === "client" ? `Raise ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
      onSubmit={submit}
      dirty={JSON.stringify(form) !== JSON.stringify(initial)}
      canSubmit={canSubmit}
    >
      {!item && projects.length > 1 ? (
        <SelectField label="Project" value={form.projectId} options={projects.map((project) => ({ value: project.id, label: project.name }))} onChange={(projectId) => setForm({ ...form, projectId })} />
      ) : null}
      <Input label="Title" value={form.title} onChangeText={(title) => setForm({ ...form, title })} placeholder={`${label} title`} autoFocus={!item} />
      <Input label="Description" value={form.description} onChangeText={(description) => setForm({ ...form, description })} multiline placeholder="Add details (optional)" />
      <ChipGroup label="Status" options={statusOptions} value={form.status} onChange={(status) => setForm({ ...form, status })} />
      {kind === "task" ? <ChipGroup label="Priority" options={priorityOptions} value={form.priority} onChange={(priority) => setForm({ ...form, priority })} /> : null}
      {kind === "meeting" ? <ChipGroup label="Venue" options={venueOptions} value={form.venue} onChange={(venue) => setForm({ ...form, venue })} /> : null}
      <DateField label={kind === "task" ? "ETA date" : kind === "meeting" ? "From date" : "Start date"} value={form.date} onChange={(date) => setForm({ ...form, date: date ?? form.date })} />
      <TimeField label={kind === "task" ? "ETA time" : kind === "meeting" ? "From time" : "Start time"} value={form.time} onChange={(time) => setForm({ ...form, time: time ?? form.time })} />
      {kind === "meeting" ? (
        <>
          <DateField label="To date" value={form.toDate} onChange={(toDate) => setForm({ ...form, toDate: toDate ?? form.toDate })} />
          <TimeField label="To time" value={form.toTime} onChange={(toTime) => setForm({ ...form, toTime: toTime ?? form.toTime })} />
        </>
      ) : null}
      {kind === "call" ? (
        <Input label="Duration (minutes)" value={form.duration} onChangeText={(value) => setForm({ ...form, duration: value.replace(/\D/g, "") })} keyboardType="number-pad" error={validDuration ? null : "Enter the minutes."} />
      ) : null}
    </FormSheet>
  );
}
