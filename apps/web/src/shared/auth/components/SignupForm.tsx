import { AuthFormAlert } from "@/shared/auth/components/AuthFormAlert";
import { AuthOAuthSignIn } from "@/shared/auth/components/AuthOAuthSignIn";
import { useSignupForm } from "@/shared/auth/hooks/useSignupForm";
import type { SignupFormProps } from "@/shared/auth/types/components";
import { PasswordField } from "@/shared/components/PasswordField";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { MIN_PASSWORD_LENGTH } from "@/shared/constants/auth";

export function SignupForm({ homePath }: SignupFormProps) {
  const form = useSignupForm(homePath);

  return (
    <div className="space-y-4">
      <form onSubmit={(event) => void form.handleSubmit(event)} className="space-y-4">
        <TextField
          id="signup-name"
          label="Name"
          autoComplete="name"
          value={form.name}
          onChange={form.setName}
          disabled={form.isSubmitting}
          required
        />
        <TextField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={form.setEmail}
          disabled={form.isSubmitting}
          required
        />
        <PasswordField
          id="signup-password"
          label="Password"
          autoComplete="new-password"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          value={form.password}
          onChange={form.setPassword}
          disabled={form.isSubmitting}
        />
        {form.success ? <AuthFormAlert message={form.success} variant="success" /> : null}
        {form.error ? <AuthFormAlert message={form.error} variant="error" /> : null}
        <SubmitButton loading={form.isSubmitting} className="w-full">
          Create account
        </SubmitButton>
      </form>

      <AuthOAuthSignIn
        disabled={form.isSubmitting}
        redirectPath={homePath}
        onError={form.setError}
        onBeforeSignIn={() => form.setError(null)}
      />
    </div>
  );
}
