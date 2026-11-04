import { useEffect, useState, type ReactNode } from "react";
import { View } from "react-native";

import { confirm } from "@/lib/confirm";
import { errorMessage } from "@/lib/query";
import { Button } from "@/ui/Button";
import { Sheet } from "@/ui/Sheet";
import { Text } from "@/ui/Text";

type FormSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  /** Runs the save. The sheet closes on success and shows the error inside on failure. */
  onSubmit: () => Promise<unknown>;
  /** Asks before throwing away edits. */
  dirty?: boolean;
  canSubmit?: boolean;
  children: ReactNode;
};

export function FormSheet({ open, onClose, title, submitLabel, onSubmit, dirty, canSubmit = true, children }: FormSheetProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  async function requestClose() {
    if (saving) return;
    if (dirty && !(await confirm({ title: "Discard changes?", message: "Your edits haven't been saved.", confirmLabel: "Discard" }))) {
      return;
    }
    onClose();
  }

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      await onSubmit();
      onClose();
    } catch (cause) {
      setError(errorMessage(cause, "Couldn't save. Check your connection and try again."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={() => void requestClose()}
      title={title}
      footer={<Button label={submitLabel} onPress={() => void submit()} loading={saving} disabled={!canSubmit} />}
    >
      {children}
      {error ? (
        <View accessibilityRole="alert" className="rounded-xl border border-destructive p-3">
          <Text variant="label">{error}</Text>
        </View>
      ) : null}
    </Sheet>
  );
}
