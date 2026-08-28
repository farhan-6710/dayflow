export type ProjectReferenceLink = {
  id: string;
  project_id: string;
  user_id: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateProjectReferenceLinkInput = {
  url: string;
  label?: string | null;
};
