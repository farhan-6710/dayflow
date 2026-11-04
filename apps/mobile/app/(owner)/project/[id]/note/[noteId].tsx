import { useLocalSearchParams, useRouter } from "expo-router";
import { CopyPlus, EllipsisVertical, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, TextInput, View } from "react-native";

import { FormError } from "@/features/auth/FormError";
import { ReferenceLinks } from "@/features/projects/ReferenceLinks";
import { useNote, useNoteActions } from "@/features/projects/useNotes";
import { errorMessage } from "@/lib/query";
import { useUnsavedGuard } from "@/lib/useUnsavedGuard";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS, type NoteCategory } from "@/shared/constants/noteCategories";
import { useTheme } from "@/theme/ThemeProvider";
import { ActionSheet } from "@/ui/ActionSheet";
import { Button } from "@/ui/Button";
import { ChipGroup } from "@/ui/ChipGroup";
import { EmptyState } from "@/ui/EmptyState";
import { IconButton } from "@/ui/IconButton";
import { BackHeader, Screen } from "@/ui/Screen";
import { Skeleton } from "@/ui/Skeleton";
import { ErrorState } from "@/ui/ErrorState";

type CategoryChoice = NoteCategory | "none";

const OPTIONS: { value: CategoryChoice; label: string }[] = [
  { value: "none", label: "None" },
  ...NOTE_CATEGORIES.map((category) => ({ value: category, label: NOTE_CATEGORY_LABELS[category] })),
];

export default function NoteEditorScreen() {
  const { id, noteId } = useLocalSearchParams<{ id: string; noteId: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const isNew = noteId === "new";
  const query = useNote(isNew ? null : noteId);
  const { create, update, duplicate, confirmDelete } = useNoteActions(id);
  const note = query.data ?? null;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<CategoryChoice>("none");
  const [saved, setSaved] = useState({ title: "", body: "", category: "none" as CategoryChoice });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!note) return;
    const next = { title: note.title, body: note.body ?? "", category: (note.category ?? "none") as CategoryChoice };
    setTitle(next.title);
    setBody(next.body);
    setCategory(next.category);
    setSaved(next);
  }, [note]);

  const dirty = title !== saved.title || body !== saved.body || category !== saved.category;
  useUnsavedGuard(dirty && !saving);

  async function save() {
    setSaving(true);
    setError(null);
    const values = { title: title.trim(), body: body.trim() ? body : null, category: category === "none" ? null : category };
    try {
      if (note) {
        await update.mutateAsync({ id: note.id, updates: values });
        setSaved({ title: values.title, body: values.body ?? "", category });
      } else {
        const created = await create.mutateAsync({ project_id: id, ...values });
        setSaved({ title: values.title, body: values.body ?? "", category });
        router.replace(`/project/${id}/note/${created.id}`);
      }
    } catch (cause) {
      setError(errorMessage(cause, "Couldn't save the note. Check your connection and try again."));
    } finally {
      setSaving(false);
    }
  }

  const missing = !isNew && query.isSuccess && !note;

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <BackHeader
          title={isNew ? "New note" : "Note"}
          right={
            <View className="flex-row items-center gap-1 pr-1">
              {note ? <IconButton icon={EllipsisVertical} label="Note actions" onPress={() => setMenuOpen(true)} /> : null}
              {missing ? null : <Button label="Save" size="sm" loading={saving} disabled={!title.trim() || !dirty} onPress={() => void save()} />}
            </View>
          }
        />
        {query.isError && !isNew ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : missing ? (
          <EmptyState art="notes" title="Note not found" description="It may have been deleted." actionLabel="Back" onAction={() => router.back()} />
        ) : !isNew && !note ? (
          <View className="gap-4 p-5">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-9 w-full rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </View>
        ) : (
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
            <FormError message={error} />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              accessibilityLabel="Note title"
              placeholderTextColor={colors["muted-foreground"]}
              selectionColor={colors["chart-1"]}
              multiline
              autoFocus={isNew}
              className="font-heading text-2xl text-foreground"
            />
            <ChipGroup scroll options={OPTIONS} value={category} onChange={setCategory} />
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Start writing..."
              accessibilityLabel="Note body"
              placeholderTextColor={colors["muted-foreground"]}
              selectionColor={colors["chart-1"]}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 240 }}
              className="font-serif text-[15px] leading-6 text-foreground"
            />
            {note ? <ReferenceLinks owner={{ kind: "note", id: note.id }} /> : null}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      {note ? (
        <ActionSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          title={note.title}
          actions={[
            { label: "Duplicate note", icon: CopyPlus, onPress: () => duplicate.mutate(note) },
            {
              label: "Delete note",
              icon: Trash2,
              destructive: true,
              onPress: () => {
                void confirmDelete(note).then((deleted) => {
                  if (deleted) {
                    setSaved({ title, body, category });
                    router.back();
                  }
                });
              },
            },
          ]}
        />
      ) : null}
    </Screen>
  );
}
