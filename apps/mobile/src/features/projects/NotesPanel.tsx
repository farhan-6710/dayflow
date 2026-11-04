import { format } from "date-fns";
import { useRouter } from "expo-router";
import { CopyPlus, FileText, Pencil, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { View } from "react-native";

import { useNoteActions, useProjectNotes } from "@/features/projects/useNotes";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS, type NoteCategory } from "@/shared/constants/noteCategories";
import type { Note } from "@/shared/types/types";
import { moveId, reorderItems } from "@/shared/utils/reorderItems";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { ChipGroup } from "@/ui/ChipGroup";
import { EmptyState } from "@/ui/EmptyState";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { MoveButtons } from "@/ui/MoveButtons";
import { QueryState } from "@/ui/QueryState";
import { SearchInput } from "@/ui/SearchInput";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

type CategoryFilter = NoteCategory | "all";

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...NOTE_CATEGORIES.map((category) => ({ value: category, label: NOTE_CATEGORY_LABELS[category] })),
];

export function NotesPanel({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { colors } = useTheme();
  const query = useProjectNotes(projectId);
  const { duplicate, confirmDelete, saveOrder } = useNoteActions(projectId);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [reordering, setReordering] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (query.data ?? []).filter((note) => {
      if (category !== "all" && note.category !== category) return false;
      return !term || note.title.toLowerCase().includes(term) || (note.body ?? "").toLowerCase().includes(term);
    });
  }, [query.data, search, category]);

  function open(note: Note) {
    router.push(`/project/${projectId}/note/${note.id}`);
  }

  function move(note: Note, direction: -1 | 1) {
    const next = moveId(visible.map((item) => item.id), note.id, direction);
    if (next) saveOrder(reorderItems(query.data ?? [], next).orderedIds);
  }

  return (
    <View className="gap-3">
      <SearchInput value={search} onChangeText={setSearch} placeholder="Search notes" />
      <ChipGroup scroll options={FILTERS} value={category} onChange={setCategory} />
      {visible.length > 1 ? (
        <View className="items-end">
          <Button label={reordering ? "Done" : "Reorder"} size="sm" variant="ghost" onPress={() => setReordering(!reordering)} />
        </View>
      ) : null}
      <QueryState query={query} skeleton={<ListSkeleton rows={4} />}>
        {(notes) =>
          notes.length === 0 ? (
            <EmptyState art="notes" title="No notes yet" description="Capture meetings, research and decisions." actionLabel="New note" onAction={() => router.push(`/project/${projectId}/note/new`)} />
          ) : visible.length === 0 ? (
            <EmptyState art="search" title="No matches" description="Try a different search or category." />
          ) : (
            <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {visible.map((note, index) => {
                const content = (
                  <View className="min-h-16 flex-row items-center gap-3 px-3.5 py-3">
                    <FileText size={18} color={colors["muted-foreground"]} />
                    <View className="flex-1">
                      <Text numberOfLines={1}>{note.title || "Untitled note"}</Text>
                      <Text variant="caption" tone="muted" numberOfLines={1}>
                        {[note.category ? NOTE_CATEGORY_LABELS[note.category] : null, format(new Date(note.updated_at), "MMM d, yyyy")].filter(Boolean).join(" · ")}
                      </Text>
                    </View>
                    {reordering ? <MoveButtons name={note.title} onMove={(direction) => move(note, direction)} /> : null}
                  </View>
                );
                return (
                  <View key={note.id} className={index > 0 ? "border-t border-border" : undefined}>
                    {reordering ? (
                      content
                    ) : (
                      <SwipeRow
                        title={note.title}
                        accessibilityLabel={note.title || "Untitled note"}
                        onPress={() => open(note)}
                        actions={[
                          { label: "Open", icon: Pencil, onPress: () => open(note) },
                          { label: "Copy", icon: CopyPlus, onPress: () => duplicate.mutate(note) },
                          { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(note) },
                        ]}
                      >
                        {content}
                      </SwipeRow>
                    )}
                  </View>
                );
              })}
            </View>
          )
        }
      </QueryState>
    </View>
  );
}
