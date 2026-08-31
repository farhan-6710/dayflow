export type ProjectReferenceLinkFormValues = {
  url: string;
  label: string;
};

export const EMPTY_PROJECT_REFERENCE_LINK_FORM: ProjectReferenceLinkFormValues = {
  url: "",
  label: "",
};

export function projectReferenceLinkToFormValues(
  link: { url: string; label: string | null },
): ProjectReferenceLinkFormValues {
  return {
    url: link.url,
    label: link.label ?? "",
  };
}
