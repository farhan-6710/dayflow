import { Input } from "@/shared/ui/input";
import type { ClientDialogBasicFieldsProps } from "@/features/clients-management/types/components";

export function ClientDialogBasicFields({
  values,
  onFieldChange,
  disabled = false,
}: ClientDialogBasicFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Client name *
        <Input
          value={values.clientName}
          onChange={(event) => onFieldChange("clientName", event.target.value)}
          placeholder="e.g. Bloom Skincare"
          className="mt-1.5"
          required
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Email
        <Input
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          placeholder="e.g. contact@brand.com"
          className="mt-1.5"
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Primary contact person
        <Input
          value={values.primaryContactName}
          onChange={(event) => onFieldChange("primaryContactName", event.target.value)}
          placeholder="e.g. Jane Doe"
          className="mt-1.5"
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Primary mobile number
        <Input
          value={values.mobileNumber}
          onChange={(event) => onFieldChange("mobileNumber", event.target.value)}
          placeholder="e.g. +1 555-0199"
          className="mt-1.5"
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Secondary contact person
        <span className="ml-1 font-normal text-muted-foreground/80">(optional)</span>
        <Input
          value={values.secondaryContactName}
          onChange={(event) => onFieldChange("secondaryContactName", event.target.value)}
          placeholder="e.g. John Smith"
          className="mt-1.5"
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Secondary mobile number
        <span className="ml-1 font-normal text-muted-foreground/80">(optional)</span>
        <Input
          value={values.secondaryMobileNumber}
          onChange={(event) => onFieldChange("secondaryMobileNumber", event.target.value)}
          placeholder="e.g. +1 555-0188"
          className="mt-1.5"
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Website name / URL
        <Input
          value={values.websiteName}
          onChange={(event) => onFieldChange("websiteName", event.target.value)}
          placeholder="e.g. bloomskincare.com"
          className="mt-1.5"
          disabled={disabled}
        />
      </label>
    </div>
  );
}
