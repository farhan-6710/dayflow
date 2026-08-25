import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchNotesByProject, deleteNote, type Note } from "@/services/notesService";
import { fetchProjectById, type Project } from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

export function useProjectDetail() {
  const { user } = useAuth();
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!projectId || !user) return;
    try {
      setLoading(true);
      const proj = await fetchProjectById(projectId);
      if (!proj || proj.user_id !== user.id) {
        showToast("error", "Project not found");
        navigate("/projects-management");
        return;
      }
      setProject(proj);
      setNotes(await fetchNotesByProject(projectId));
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId, user, navigate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleDeleteNote = useCallback(async (note: Note) => {
    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((entry) => entry.id !== note.id));
      showToast("success", "Note deleted");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete note");
      throw e;
    }
  }, []);

  return {
    project,
    notes,
    loading,
    handleDeleteNote,
  };
}
