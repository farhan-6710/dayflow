import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { useAuth } from "@/shared/hooks/useAuth";
import { showToast } from "@/shared/utils/showToast";

const CALLBACK_PARAMS = ["email-change", "code", "type"];

/** After a Supabase email-change link lands here: re-fetch the user, clean the URL, explain the status. */
export function useEmailChangeCallback() {
  const { refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasCallback = CALLBACK_PARAMS.some((param) => searchParams.has(param));

  useEffect(() => {
    if (!hasCallback) {
      return;
    }

    let cancelled = false;
    void refreshUser().then((user) => {
      if (cancelled) {
        return;
      }
      setSearchParams(
        (current) => {
          CALLBACK_PARAMS.forEach((param) => current.delete(param));
          return current;
        },
        { replace: true },
      );
      if (!user) {
        showToast("error", "Couldn't verify the email change. Try signing in again.");
      } else if (user.new_email) {
        showToast("success", `Almost done: also confirm the link sent to ${user.email}.`);
      } else {
        showToast("success", `Your email is now ${user.email}.`);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hasCallback, refreshUser, setSearchParams]);
}
