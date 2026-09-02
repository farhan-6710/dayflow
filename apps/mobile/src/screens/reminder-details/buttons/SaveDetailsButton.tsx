import React from "react";
import Button from "@components/atoms/Button";

interface SaveDetailsButtonProps {
  onSave: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function SaveDetailsButton({
  onSave,
  disabled = false,
  loading = false,
}: SaveDetailsButtonProps) {
  return (
    <Button
      onPress={onSave}
      title="Save Details"
      variant="success"
      size="medium"
      icon="save-outline"
      iconPosition="left"
      disabled={disabled}
      loading={loading}
      fullWidth
      className="mb-4"
    />
  );
}
