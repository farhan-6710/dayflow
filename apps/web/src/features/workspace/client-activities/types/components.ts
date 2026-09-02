import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityTask,
  CreateClientActivityCallInput,
  CreateClientActivityMeetingInput,
  CreateClientActivityTaskInput,
} from "@/features/workspace/client-activities/types/types";
import type { Project } from "@/services/projectsService";

export type ClientActivitiesSectionProps = {
  tasks: ClientActivityTask[];
  meetings: ClientActivityMeeting[];
  calls: ClientActivityCall[];
  canEdit: boolean;
  isSaving?: boolean;
  showProjectName?: boolean;
  showAddNew?: boolean;
  /** When set, only activities with this raised_by value can be edited. */
  editOnlyRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
  /** When viewing a single project, activities always belong to this project. */
  fixedProjectId?: string;
  projectOptions?: Project[];
  requireProjectSelection?: boolean;
  onSaveTask: (
    taskId: string | null,
    projectId: string,
    input: CreateClientActivityTaskInput,
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onSaveMeeting: (
    meetingId: string | null,
    projectId: string,
    input: CreateClientActivityMeetingInput,
  ) => Promise<void>;
  onDeleteMeeting: (meetingId: string) => Promise<void>;
  onSaveCall: (
    callId: string | null,
    projectId: string,
    input: CreateClientActivityCallInput,
  ) => Promise<void>;
  onDeleteCall: (callId: string) => Promise<void>;
};

export type ClientActivitiesBlockProps =
  | {
      scope: "project";
      projectId: string;
      canEdit?: boolean;
      activityRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
    }
  | {
      scope: "client";
      clientId: string;
      canEdit?: boolean;
      activityRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
      /** Use client-portal project fetch (RLS/RPC) instead of workspace-owned filter. */
      forClientPortal?: boolean;
      clientCompanyName?: string | null;
    };
