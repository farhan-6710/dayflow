import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { useTodoActions, useTodos } from "@/features/today/useTodos";
import { cn } from "@/lib/cn";
import { haptics } from "@/lib/haptics";
import type { Todo } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { FormSheet } from "@/ui/FormSheet";
import { IconButton } from "@/ui/IconButton";
import { Input } from "@/ui/Input";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { SectionHeader } from "@/ui/SectionHeader";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

function TodoForm({ open, todo, onClose }: { open: boolean; todo: Todo | null; onClose: () => void }) {
  const { create, update } = useTodoActions();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(todo?.title ?? "");
      setDescription(todo?.description ?? "");
    }
  }, [open, todo]);

  const dirty = title !== (todo?.title ?? "") || description !== (todo?.description ?? "");

  async function submit() {
    const values = { title: title.trim(), description: description.trim() || null };
    if (todo) await update.mutateAsync({ id: todo.id, updates: values });
    else await create.mutateAsync(values);
  }

  return (
    <FormSheet open={open} onClose={onClose} title={todo ? "Edit todo" : "New todo"} submitLabel={todo ? "Save todo" : "Add todo"} onSubmit={submit} dirty={dirty} canSubmit={Boolean(title.trim())}>
      <Input label="Title" value={title} onChangeText={setTitle} placeholder="What's on your list?" autoFocus={!todo} />
      <Input label="Description" value={description} onChangeText={setDescription} multiline placeholder="Add details (optional)" />
    </FormSheet>
  );
}

export function TodoCard() {
  const { colors } = useTheme();
  const query = useTodos();
  const { toggle, confirmDelete, saveOrder } = useTodoActions();
  const [form, setForm] = useState<{ open: boolean; todo: Todo | null }>({ open: false, todo: null });
  const [reordering, setReordering] = useState(false);
  const todos = query.data ?? [];

  function move(todo: Todo, direction: -1 | 1) {
    const ids = todos.map((item) => item.id);
    const from = ids.indexOf(todo.id);
    const to = from + direction;
    const moved = ids[to];
    if (to < 0 || moved === undefined) return;
    ids[to] = todo.id;
    ids[from] = moved;
    saveOrder(ids);
  }

  return (
    <View className="gap-2">
      <SectionHeader title="Todo list" actionLabel={todos.length > 1 ? (reordering ? "Done" : "Reorder") : undefined} onAction={() => setReordering(!reordering)} />
      {!query.data && query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : !query.data ? (
        <ListSkeleton rows={3} />
      ) : todos.length === 0 ? (
        <View className="rounded-2xl border border-border bg-card">
          <EmptyState art="todos" title="Your list is clear" description="Jot down quick things that don't need a date." actionLabel="Add todo" onAction={() => setForm({ open: true, todo: null })} />
        </View>
      ) : (
        <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {todos.map((todo, index) => {
            const done = todo.status === "completed";
            const content = (
              <View className="min-h-14 flex-row items-center gap-3 px-3 py-2.5">
                {reordering ? null : (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: done }}
                    accessibilityLabel={`Mark ${todo.title} ${done ? "as not done" : "as done"}`}
                    hitSlop={8}
                    onPress={() => {
                      haptics.tap();
                      toggle(todo);
                    }}
                    className={cn("size-6 items-center justify-center rounded-md border-2", done ? "border-success bg-success" : "border-muted-foreground")}
                  >
                    {done ? <Check size={14} color={colors["success-foreground"]} /> : null}
                  </Pressable>
                )}
                <View className="flex-1">
                  <Text numberOfLines={1} tone={done ? "muted" : "default"} className={done ? "line-through" : undefined}>
                    {todo.title}
                  </Text>
                  {todo.description ? (
                    <Text variant="caption" tone="muted" numberOfLines={1}>
                      {todo.description}
                    </Text>
                  ) : null}
                </View>
                {reordering ? (
                  <View className="flex-row">
                    <IconButton icon={ArrowUp} label={`Move ${todo.title} up`} onPress={() => move(todo, -1)} />
                    <IconButton icon={ArrowDown} label={`Move ${todo.title} down`} onPress={() => move(todo, 1)} />
                  </View>
                ) : null}
              </View>
            );
            return (
              <View key={todo.id} className={index > 0 ? "border-t border-border" : undefined}>
                {reordering ? (
                  content
                ) : (
                  <SwipeRow
                    title={todo.title}
                    accessibilityLabel={todo.title}
                    onPress={() => setForm({ open: true, todo })}
                    actions={[
                      { label: "Edit", icon: Pencil, onPress: () => setForm({ open: true, todo }) },
                      { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(todo) },
                    ]}
                  >
                    {content}
                  </SwipeRow>
                )}
              </View>
            );
          })}
          <View className="border-t border-border p-2">
            <Button label="Add todo" variant="ghost" size="sm" icon={Plus} onPress={() => setForm({ open: true, todo: null })} />
          </View>
        </View>
      )}
      <TodoForm open={form.open} todo={form.todo} onClose={() => setForm((current) => ({ ...current, open: false }))} />
    </View>
  );
}
