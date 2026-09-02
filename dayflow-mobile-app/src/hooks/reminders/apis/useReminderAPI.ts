import { useQuery, useMutation } from "@tanstack/react-query";
import { reminderAPI } from "@services";
import { Reminder } from "@types";

/**
 * React Query hooks for reminder operations
 * Wraps core API functions with React Query for caching, loading states, etc.
 */

export const useGetReminders = (config?: any) => {
  return useQuery({
    queryKey: ["reminders"],
    queryFn: reminderAPI.getAll,
    ...config,
  });
};

export const useAddReminder = (config?: any) => {
  return useMutation({
    mutationFn: (payload: Omit<Reminder, "id" | "createdAt" | "updatedAt">) =>
      reminderAPI.add(payload),
    ...config,
  });
};

export const useUpdateReminder = (config?: any) => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Reminder> }) =>
      reminderAPI.update(id, payload),
    ...config,
  });
};

export const useDeleteReminder = (config?: any) => {
  return useMutation({
    mutationFn: (reminderId: string) => reminderAPI.delete(reminderId),
    ...config,
  });
};
