import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { ListScreen } from "../../components/list-screen";
import { T } from "../../components/ui";
import type { Item } from "../../lib/api";
import { useLoadedSite } from "../../lib/site";
import { colors, radius } from "../../lib/theme";

// Searchable catalogue with therapy-area filters, like the website's product browser.
export default function Products() {
  const { t, rtl } = useLoadedSite();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>();
  const filter = (items: Item[]) => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (x) =>
        (!area || (x.categoryKey ?? x.category) === area) &&
        (!q ||
          [x.title, x.composition, x.category, x.summary, x.dosageForm]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
  };

  const chip = (key: string | undefined, label: string) => {
    const active = area === key;
    return (
      <Pressable
        key={label}
        onPress={() => setArea(key)}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: radius.pill,
          backgroundColor: active ? colors.navy : colors.white,
          borderWidth: 1,
          borderColor: active ? colors.navy : colors.line,
        }}
      >
        <T
          weight="semibold"
          style={{ fontSize: 13, color: active ? colors.white : colors.ink2 }}
        >
          {label}
        </T>
      </Pressable>
    );
  };

  return (
    <ListScreen
      collection="products"
      section="products"
      emptyIcon="search-outline"
      emptyTitle={t.no_products}
      emptyText={t.no_products_text}
      filter={filter}
      header={(all) => {
        // Therapy areas present in the catalogue: [untranslated key, translated label].
        const areas = [
          ...new Map(all.map((x) => [x.categoryKey ?? x.category, x.category])),
        ];
        return (
          <View style={{ gap: 12, marginBottom: 4 }}>
            <View
              style={{
                flexDirection: rtl ? "row-reverse" : "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: colors.white,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: colors.line,
                paddingHorizontal: 16,
              }}
            >
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t.pb_placeholder}
                placeholderTextColor={colors.muted}
                accessibilityLabel={t.search_products}
                returnKeyType="search"
                style={{
                  flex: 1,
                  height: 50,
                  color: colors.ink,
                  fontSize: 15,
                  textAlign: rtl ? "right" : "left",
                }}
              />
              {query ? (
                <Pressable
                  onPress={() => setQuery("")}
                  accessibilityLabel={t.clear_search}
                  hitSlop={10}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.muted}
                  />
                </Pressable>
              ) : null}
            </View>
            {areas.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                  flexDirection: rtl ? "row-reverse" : "row",
                }}
              >
                {chip(undefined, t.all_areas)}
                {areas.map(([key, label]) => chip(key, label))}
              </ScrollView>
            )}
          </View>
        );
      }}
    />
  );
}
