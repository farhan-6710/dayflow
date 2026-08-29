import { useMemo } from "react";

import { ClosedActivitiesSection } from "@/features/client-activities/components/ClosedActivitiesSection";
import { OpenActivitiesSection } from "@/features/client-activities/components/OpenActivitiesSection";
import { useClientActivitiesQuery } from "@/features/client-activities/hooks/useClientActivitiesQuery";
import { useClientActivityActions } from "@/features/client-activities/hooks/useClientActivityActions";
import type { ClientActivitiesBlockProps } from "@/features/client-activities/types/components";
import { isClientActivityOpen } from "@/features/client-activities/utils/activityFormUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ErrorBanner } from "@/shared/components/ErrorBanner";

export function ClientActivitiesBlock({
  canEdit = true,
  ...scopeProps
}: ClientActivitiesBlockProps) {
  const { user } = useAuth();
  const projectId =
    scopeProps.scope === "project" ? scopeProps.projectId : undefined;
  const clientId =
    scopeProps.scope === "client" ? scopeProps.clientId : undefined;

  const queryScope = useMemo(() => {
    if (scopeProps.scope === "project" && projectId) {
      return { scope: "project" as const, projectId };
    }
    if (scopeProps.scope === "client" && clientId && user) {
      return {
        scope: "client" as const,
        clientId,
        userId: user.id,
      };
    }
    return null;
  }, [scopeProps.scope, projectId, clientId, user?.id]);

  const {
    tasks,
    meetings,
    calls,
    clientProjects,
    loading,
    error,
    setError,
    reload,
  } = useClientActivitiesQuery(queryScope);

  const actions = useClientActivityActions({ reload, setError });

  const openTasks = useMemo(
    () => tasks.filter((task) => isClientActivityOpen(task.status)),
    [tasks],
  );
  const closedTasks = useMemo(
    () => tasks.filter((task) => !isClientActivityOpen(task.status)),
    [tasks],
  );
  const openMeetings = useMemo(
    () => meetings.filter((meeting) => isClientActivityOpen(meeting.status)),
    [meetings],
  );
  const closedMeetings = useMemo(
    () => meetings.filter((meeting) => !isClientActivityOpen(meeting.status)),
    [meetings],
  );
  const openCalls = useMemo(
    () => calls.filter((call) => isClientActivityOpen(call.status)),
    [calls],
  );
  const closedCalls = useMemo(
    () => calls.filter((call) => !isClientActivityOpen(call.status)),
    [calls],
  );

  const isClientScope = scopeProps.scope === "client";
  const sectionProps = {
    canEdit: canEdit && !loading,
    isSaving: actions.isSaving,
    showProjectName: isClientScope,
    fixedProjectId: projectId,
    projectOptions: isClientScope ? clientProjects : undefined,
    requireProjectSelection: isClientScope,
    onSaveTask: actions.saveTask,
    onDeleteTask: actions.removeTask,
    onSaveMeeting: actions.saveMeeting,
    onDeleteMeeting: actions.removeMeeting,
    onSaveCall: actions.saveCall,
    onDeleteCall: actions.removeCall,
  };

  if (loading && tasks.length === 0 && meetings.length === 0 && calls.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground shadow-sm">
        Loading activities...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <ErrorBanner message={error} /> : null}
      <OpenActivitiesSection
        {...sectionProps}
        tasks={openTasks}
        meetings={openMeetings}
        calls={openCalls}
      />
      <ClosedActivitiesSection
        {...sectionProps}
        tasks={closedTasks}
        meetings={closedMeetings}
        calls={closedCalls}
      />
    </div>
  );
}
