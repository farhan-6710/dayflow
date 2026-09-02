import React from "react";
import Button from "@components/atoms/Button";

interface DeleteReminderButtonProps {
  onDelete: () => void;
  loading?: boolean;
}

export default function DeleteReminderButton({
  onDelete,
  loading = false,
}: DeleteReminderButtonProps) {
  return (
    <Button
      onPress={onDelete}
      title="Delete Reminder"
      variant="danger"
      size="medium"
      icon="trash-outline"
      iconPosition="left"
      loading={loading}
      disabled={loading}
      fullWidth
      className="mb-12"
    />
  );
}
