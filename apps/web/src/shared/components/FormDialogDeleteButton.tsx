import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

type FormDialogDeleteButtonProps = {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
};

/** Destructive footer action for edit dialogs (left of Cancel / Save). */
export function FormDialogDeleteButton({ disabled, onClick, label = "Delete" }: FormDialogDeleteButtonProps) {
  return (
    <Button type="button" variant="destructive" size="lg" disabled={disabled} onClick={onClick}>
      <Trash2 aria-hidden="true" />
      {label}
    </Button>
  );
}
