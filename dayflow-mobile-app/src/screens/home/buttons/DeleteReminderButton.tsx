import React from "react";
import Button from "@components/atoms/Button";
import { useDeleteReminder } from "@hooks/reminders";

interface DeleteReminderButtonProps {
  reminderId: string;
  reminderName: string;
}

export default function DeleteReminderButton({
  reminderId,
  reminderName,
}: DeleteReminderButtonProps) {
  const { handleDelete, isLoading } = useDeleteReminder(reminderId);

  const onDelete = async () => {
    await handleDelete({ id: reminderId, name: reminderName });
  };

  return (
    <Button
      onPress={onDelete}
      title="Delete Reminder"
      variant="danger"
      size="large"
      icon="trash-outline"
      iconPosition="left"
      loading={isLoading}
      disabled={isLoading}
      fullWidth
      className="mb-12"
    />
  );
}
