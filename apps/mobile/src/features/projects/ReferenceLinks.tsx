import { ExternalLink, Link2, Pencil, Plus, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { useReferenceLinks, type LinkOwner } from "@/features/projects/useReferenceLinks";
import { openLink } from "@/lib/openLink";
import type { ReferenceLink } from "@/shared/types/types";
import { safeExternalHref } from "@/shared/utils/safeExternalHref";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { FormSheet } from "@/ui/FormSheet";
import { Input } from "@/ui/Input";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { SectionHeader } from "@/ui/SectionHeader";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

export function ReferenceLinks({ owner, heading = true }: { owner: LinkOwner; heading?: boolean }) {
  const { colors } = useTheme();
  const { query, create, update, confirmDelete } = useReferenceLinks(owner);
  const [form, setForm] = useState<{ open: boolean; link: ReferenceLink | null }>({ open: false, link: null });
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (form.open) {
      setUrl(form.link?.url ?? "");
      setLabel(form.link?.label ?? "");
    }
  }, [form]);

  const validUrl = Boolean(url.trim() && safeExternalHref(url));

  async function submit() {
    const input = { url: url.trim(), label: label.trim() || null };
    if (form.link) await update.mutateAsync({ id: form.link.id, input });
    else await create.mutateAsync(input);
  }

  return (
    <View className="gap-2">
      {heading ? <SectionHeader title="Reference links" /> : null}
      <QueryState query={query} skeleton={<ListSkeleton rows={2} />}>
        {(links) =>
          links.length === 0 ? (
            <View className="rounded-2xl border border-border bg-card">
              <EmptyState art="links" title="No links yet" description="Keep docs, tickets and articles here." actionLabel="Add link" onAction={() => setForm({ open: true, link: null })} />
            </View>
          ) : (
            <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {links.map((link, index) => (
                <View key={link.id} className={index > 0 ? "border-t border-border" : undefined}>
                  <SwipeRow
                    title={link.label || link.url}
                    accessibilityLabel={`Open ${link.label || link.url}`}
                    onPress={() => void openLink(link.url)}
                    actions={[
                      { label: "Edit", icon: Pencil, onPress: () => setForm({ open: true, link }) },
                      { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(link) },
                    ]}
                  >
                    <View className="min-h-14 flex-row items-center gap-3 px-3.5 py-2.5">
                      <Link2 size={18} color={colors["muted-foreground"]} />
                      <View className="flex-1">
                        <Text numberOfLines={1}>{link.label || link.url}</Text>
                        {link.label ? (
                          <Text variant="caption" tone="muted" numberOfLines={1}>
                            {link.url}
                          </Text>
                        ) : null}
                      </View>
                      <ExternalLink size={16} color={colors["muted-foreground"]} />
                    </View>
                  </SwipeRow>
                </View>
              ))}
              <View className="border-t border-border p-2">
                <Button label="Add link" variant="ghost" size="sm" icon={Plus} onPress={() => setForm({ open: true, link: null })} />
              </View>
            </View>
          )
        }
      </QueryState>
      <FormSheet
        open={form.open}
        onClose={() => setForm((current) => ({ ...current, open: false }))}
        title={form.link ? "Edit link" : "New link"}
        submitLabel={form.link ? "Save link" : "Add link"}
        onSubmit={submit}
        dirty={url !== (form.link?.url ?? "") || label !== (form.link?.label ?? "")}
        canSubmit={validUrl}
      >
        <Input label="URL" value={url} onChangeText={setUrl} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="https://" autoFocus={!form.link} error={url.trim() && !validUrl ? "Enter a web or email link." : null} />
        <Input label="Label" value={label} onChangeText={setLabel} placeholder="What is this? (optional)" />
      </FormSheet>
    </View>
  );
}
