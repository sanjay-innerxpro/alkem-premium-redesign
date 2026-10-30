import type Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApi, type Item } from "../lib/api";
import { useLoadedSite } from "../lib/site";
import { colors } from "../lib/theme";
import {
  BrandBar,
  EmptyState,
  Eyebrow,
  ItemCard,
  LoadError,
  Loading,
  OfflineNotice,
  T,
} from "./ui";

// A tab listing one collection (news, careers) under its website section heading.
export function ListScreen({
  collection,
  section,
  emptyIcon,
  emptyTitle,
  emptyText,
  header,
  filter,
}: {
  collection: Item["collection"];
  section: "news" | "careers" | "products";
  emptyIcon: keyof typeof Ionicons.glyphMap;
  emptyTitle: string;
  emptyText?: string;
  // Extra controls under the heading; given every loaded item (before filtering).
  header?: (all: Item[]) => React.ReactNode;
  filter?: (items: Item[]) => Item[];
}) {
  const { s, lang } = useLoadedSite();
  const insets = useSafeAreaInsets();
  const { data, offline, failed, refreshing, refresh } = useApi<Item[]>(
    `/${collection}?lang=${lang}`,
  );
  const items = data && filter ? filter(data) : data;
  const sec = s.sections[section];
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 14,
        paddingHorizontal: 20,
        paddingBottom: 32,
        gap: 12,
      }}
      data={items ?? []}
      keyExtractor={(x) => x.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ marginBottom: 8 }}>
          <BrandBar />
          <View style={{ marginTop: 28, marginBottom: 12 }}>
            <Eyebrow>{sec.eyebrow}</Eyebrow>
            <T
              weight="extrabold"
              style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.6 }}
            >
              {sec.title}
            </T>
            {sec.description ? (
              <T
                style={{
                  color: colors.muted,
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 23,
                }}
              >
                {sec.description}
              </T>
            ) : null}
          </View>
          <OfflineNotice show={offline} />
          {header?.(data ?? [])}
        </View>
      }
      renderItem={({ item }) => <ItemCard item={item} />}
      ListEmptyComponent={
        !data ? (
          failed ? (
            <LoadError onRetry={refresh} />
          ) : (
            <Loading />
          )
        ) : (
          <EmptyState icon={emptyIcon} title={emptyTitle} text={emptyText} />
        )
      }
    />
  );
}
