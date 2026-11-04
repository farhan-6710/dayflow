import { Redirect } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { ErrorState } from "@/ui/ErrorState";

/** Sends each person to the right place: sign-in, the client portal, or the workspace. */
export default function Index() {
  const { user, loading, portal, client, clientLoading, clientError, recheckClient } = useAuth();

  if (loading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;
  if (portal === "workspace") return <Redirect href="/today" />;
  if (clientLoading) return <CenteredSpinner />;
  if (clientError) return <ErrorState onRetry={recheckClient} />;
  return <Redirect href={client ? "/client/home" : "/not-a-client"} />;
}
