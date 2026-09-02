import { useAuth } from "@providers/AuthProvider";

export const useUserDisplayData = () => {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Welcome";
  const email = user?.email || "Not signed in";

  const initials =
    (user?.user_metadata?.full_name || user?.email || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "?";

  return { user, displayName, email, initials };
};
