import { useRouter } from "expo-router";
import { Mail, Pause, Pencil, Phone, Play, SlidersHorizontal, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Linking, RefreshControl, View } from "react-native";

import { ClientFormSheet } from "@/features/clients/ClientFormSheet";
import { useClientActions, useClients } from "@/features/clients/useClients";
import { useRefresh } from "@/lib/query";
import type { Client } from "@/shared/types/types";
import { getInitials } from "@/shared/utils/authUserDisplay";
import { useTheme } from "@/theme/ThemeProvider";
import { Avatar } from "@/ui/Avatar";
import { ChipGroup } from "@/ui/ChipGroup";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { Fab } from "@/ui/Fab";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { Screen, TabHeader } from "@/ui/Screen";
import { SearchInput } from "@/ui/SearchInput";
import { Sheet } from "@/ui/Sheet";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

type StatusFilter = "active" | "inactive" | "all";
type PortalFilter = "all" | "linked" | "not_linked";
type SortKey = "name" | "newest";

export default function ClientsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const query = useClients();
  const refresh = useRefresh(query);
  const { setActive, confirmDelete } = useClientActions();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [portal, setPortal] = useState<PortalFilter>("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [form, setForm] = useState<{ open: boolean; client: Client | null }>({ open: false, client: null });

  const clients = useMemo(() => query.data ?? [], [query.data]);
  const counts = { active: clients.filter((client) => client.is_active).length, inactive: clients.filter((client) => !client.is_active).length, all: clients.length };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients
      .filter((client) => {
        if (status === "active" && !client.is_active) return false;
        if (status === "inactive" && client.is_active) return false;
        if (portal === "linked" && !client.auth_user_id) return false;
        if (portal === "not_linked" && client.auth_user_id) return false;
        return !term || [client.company_name, client.client_name, client.email, client.mobile_number].some((value) => value?.toLowerCase().includes(term));
      })
      .sort((a, b) => (sort === "name" ? a.company_name.localeCompare(b.company_name) : b.created_at.localeCompare(a.created_at)));
  }, [clients, search, status, portal, sort]);

  function renderItem({ item: client }: { item: Client }) {
    return (
      <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <SwipeRow
          title={client.company_name}
          accessibilityLabel={`${client.company_name}${client.client_name ? `, ${client.client_name}` : ""}`}
          onPress={() => router.push(`/client-detail/${client.id}`)}
          actions={[
            { label: "Edit", icon: Pencil, onPress: () => setForm({ open: true, client }) },
            client.is_active
              ? { label: "Deactivate", icon: Pause, onPress: () => setActive.mutate({ client, isActive: false }) }
              : { label: "Activate", icon: Play, onPress: () => setActive.mutate({ client, isActive: true }) },
            { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(client) },
          ]}
        >
          <View className="flex-row items-center gap-3 p-3">
            <Avatar initials={getInitials(client.company_name)} />
            <View className="flex-1">
              <Text variant="subheading" numberOfLines={1}>
                {client.company_name}
              </Text>
              <Text variant="caption" tone="muted" numberOfLines={1}>
                {[client.client_name, client.auth_user_id ? "Portal access" : null, client.is_active ? null : "Inactive"].filter(Boolean).join(" · ") || "No contact name"}
              </Text>
            </View>
            {client.mobile_number ? <IconButton icon={Phone} label={`Call ${client.company_name}`} onPress={() => void Linking.openURL(`tel:${client.mobile_number}`)} /> : null}
            {client.email ? <IconButton icon={Mail} label={`Email ${client.company_name}`} onPress={() => void Linking.openURL(`mailto:${client.email}`)} /> : null}
          </View>
        </SwipeRow>
      </View>
    );
  }

  return (
    <Screen>
      <TabHeader title="Clients" subtitle={query.data ? `${counts.active} active of ${counts.all}` : undefined} />
      <FlatList
        data={query.data ? visible : []}
        keyExtractor={(client) => client.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96, gap: 10 }}
        ListHeaderComponent={
          <View className="gap-3 pb-1">
            <View className="flex-row items-center gap-1">
              <View className="flex-1">
                <SearchInput value={search} onChangeText={setSearch} placeholder="Search clients" />
              </View>
              <IconButton icon={SlidersHorizontal} label="Filter and sort clients" badge={portal === "all" ? 0 : 1} onPress={() => setFiltersOpen(true)} />
            </View>
            <ChipGroup
              scroll
              options={[
                { value: "active", label: `Active ${counts.active}` },
                { value: "inactive", label: `Inactive ${counts.inactive}` },
                { value: "all", label: `All ${counts.all}` },
              ]}
              value={status}
              onChange={setStatus}
            />
          </View>
        }
        ListEmptyComponent={
          query.isError && !query.data ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : !query.data ? (
            <ListSkeleton />
          ) : clients.length === 0 ? (
            <EmptyState art="clients" title="No clients yet" description="Add one to share projects and activities." actionLabel="Add client" onAction={() => setForm({ open: true, client: null })} />
          ) : (
            <EmptyState art="search" title="No matches" description="Try a different search or filter." />
          )
        }
      />
      <Fab label="New client" onPress={() => setForm({ open: true, client: null })} />
      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filter and sort">
        <ChipGroup
          label="Portal access"
          options={[
            { value: "all", label: "Any" },
            { value: "linked", label: "Has access" },
            { value: "not_linked", label: "No access" },
          ]}
          value={portal}
          onChange={setPortal}
        />
        <ChipGroup
          label="Sort by"
          options={[
            { value: "name", label: "A to Z" },
            { value: "newest", label: "Newest" },
          ]}
          value={sort}
          onChange={setSort}
        />
      </Sheet>
      <ClientFormSheet open={form.open} client={form.client} onClose={() => setForm((current) => ({ ...current, open: false }))} />
    </Screen>
  );
}
