import { useClientForm } from "@/features/workspace/clients-management/hooks/useClientForm";
import type { ClientDialogProps } from "@/features/workspace/clients-management/types/components";
import { FormDialogDeleteButton } from "@/shared/components/FormDialogDeleteButton";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Switch } from "@/shared/ui/switch";

export function ClientDialog(props: ClientDialogProps) {
  const { open, client, onDelete } = props;
  const form = useClientForm(props);
  const { values, setField, saving } = form;

  return (
    <Dialog open={open} onOpenChange={form.handleOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{client ? "Edit client" : "New client"}</DialogTitle>
          <DialogDescription>
            The email is also how this client signs in to the client portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="client-company"
              label="Company or brand"
              value={values.companyName}
              onChange={(value) => setField("companyName", value)}
              disabled={saving}
              required
            />
            <TextField
              id="client-name"
              label="Contact name"
              value={values.clientName}
              onChange={(value) => setField("clientName", value)}
              disabled={saving}
            />
            <TextField
              id="client-email"
              label="Email"
              type="email"
              value={values.email}
              onChange={(value) => setField("email", value)}
              disabled={saving}
            />
            <TextField
              id="client-mobile"
              label="Mobile"
              type="tel"
              value={values.mobileNumber}
              onChange={(value) => setField("mobileNumber", value)}
              disabled={saving}
            />
            <TextField
              id="client-secondary-name"
              label="Secondary contact"
              value={values.secondaryContactName}
              onChange={(value) => setField("secondaryContactName", value)}
              disabled={saving}
            />
            <TextField
              id="client-secondary-number"
              label="Secondary number"
              type="tel"
              value={values.secondaryContactNumber}
              onChange={(value) => setField("secondaryContactNumber", value)}
              disabled={saving}
            />
          </div>
          <TextField
            id="client-website"
            label="Website"
            inputMode="url"
            placeholder="https://"
            value={values.websiteUrl}
            onChange={(value) => setField("websiteUrl", value)}
            disabled={saving}
          />
          {client ? (
            <div className="flex min-h-10 items-center justify-between gap-4">
              <label htmlFor="client-active" className="text-sm">
                Active client
              </label>
              <Switch
                id="client-active"
            className="relative after:absolute after:-inset-3"
                checked={values.isActive}
                disabled={saving}
                onCheckedChange={(checked) => setField("isActive", checked)}
              />
            </div>
          ) : null}
          <DialogFooter className={client && onDelete ? "flex-row justify-between sm:justify-between" : undefined}>
            {client && onDelete ? <FormDialogDeleteButton disabled={saving} onClick={() => onDelete(client)} /> : null}
            <div className="flex flex-row flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" size="lg" disabled={saving} onClick={() => form.handleOpenChange(false)}>
                Cancel
              </Button>
              <SubmitButton loading={saving} disabled={!values.companyName.trim()}>
                {client ? "Save changes" : "Add client"}
              </SubmitButton>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
