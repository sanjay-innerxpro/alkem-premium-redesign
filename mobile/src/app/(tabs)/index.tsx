import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Accent,
  BrandBar,
  Button,
  Eyebrow,
  ItemCard,
  OfflineNotice,
  Paragraphs,
  SectionHeading,
  T,
} from "../../components/ui";
import { useApi, type Item } from "../../lib/api";
import { useLoadedSite } from "../../lib/site";
import { colors, gradients, radius, shadow } from "../../lib/theme";

export default function Home() {
  const { s, t, lang, rtl, offline, refresh: refreshSite } = useLoadedSite();
  const insets = useSafeAreaInsets();
  const therapies = useApi<Item[]>(`/therapies?lang=${lang}`);
  const offerings = useApi<Item[]>(`/offerings?lang=${lang}`);
  const pages = useApi<Item[]>(`/pages?lang=${lang}`);
  const about = pages.data?.find((p) => p.slug === "about");
  const row = rtl ? "row-reverse" : "row";
  const refreshing =
    therapies.refreshing || offerings.refreshing || pages.refreshing;
  const refresh = () => {
    refreshSite();
    therapies.refresh();
    offerings.refresh();
    pages.refresh();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 20,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <BrandBar dark />
        <View style={{ marginTop: 36 }}>
          <Eyebrow dark>{s.heroEyebrow}</Eyebrow>
          <T
            weight="extrabold"
            style={{
              color: colors.white,
              fontSize: 38,
              lineHeight: 44,
              letterSpacing: -1,
            }}
          >
            {s.heroTitle}
          </T>
          <Accent style={{ color: colors.mint, fontSize: 38, lineHeight: 46 }}>
            {s.heroAccent}
          </Accent>
          <T
            style={{
              color: colors.mist,
              marginTop: 14,
              fontSize: 16,
              lineHeight: 25,
            }}
          >
            {s.heroDescription}
          </T>
        </View>
        <View style={{ gap: 12, marginTop: 24 }}>
          <Button
            label={s.heroCta}
            href="/pages/about"
            variant="primary"
            icon={rtl ? "arrow-back" : "arrow-forward"}
          />
          <Button
            label={t.explore_products}
            href="/products"
            variant="outline"
          />
        </View>
        {s.metrics.length > 0 && (
          <View
            style={{
              flexDirection: row,
              flexWrap: "wrap",
              gap: 10,
              marginTop: 26,
            }}
          >
            {s.metrics.map((m) => (
              <View
                key={m.label}
                style={{
                  flexBasis: "47%",
                  flexGrow: 1,
                  borderRadius: 18,
                  padding: 14,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <T
                  weight="extrabold"
                  style={{ color: colors.white, fontSize: 24, lineHeight: 30 }}
                >
                  {m.value}
                </T>
                <T style={{ color: colors.mist, fontSize: 13, lineHeight: 18 }}>
                  {m.label}
                </T>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>

      <View style={{ padding: 20, gap: 36 }}>
        <View style={{ marginTop: 4 }}>
          <OfflineNotice show={offline} />
          <Eyebrow>{t.our_purpose}</Eyebrow>
          <T weight="bold" style={{ fontSize: 22, lineHeight: 29 }}>
            {s.purpose}
          </T>
        </View>

        {!!therapies.data?.length && (
          <View>
            <SectionHeading
              eyebrow={s.sections.therapies.eyebrow}
              title={s.sections.therapies.title}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 8 }}
              style={{ marginHorizontal: -20, paddingHorizontal: 20 }}
            >
              {therapies.data.map((x) => (
                <Pressable
                  key={x.id}
                  onPress={() => router.push(`/therapies/${x.slug}`)}
                  accessibilityRole="link"
                  style={({ pressed }) => ({
                    width: 230,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <LinearGradient
                    colors={gradients.deep}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: radius.card,
                      padding: 18,
                      minHeight: 170,
                      justifyContent: "space-between",
                    }}
                  >
                    <Ionicons name="pulse" size={22} color={colors.mint} />
                    <View style={{ gap: 6 }}>
                      <T
                        weight="bold"
                        style={{ color: colors.white, fontSize: 18 }}
                      >
                        {x.title}
                      </T>
                      <T
                        style={{
                          color: "#cfe9ee",
                          fontSize: 13,
                          lineHeight: 19,
                        }}
                        numberOfLines={3}
                      >
                        {x.summary}
                      </T>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {!!offerings.data?.length && (
          <View>
            <SectionHeading
              eyebrow={s.sections.offerings.eyebrow}
              title={s.sections.offerings.title}
            />
            <View style={{ gap: 12 }}>
              {offerings.data.map((x) => (
                <ItemCard key={x.id} item={x} />
              ))}
            </View>
          </View>
        )}

        {about && (
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.card,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.line,
              ...shadow,
            }}
          >
            <Eyebrow>{s.sections.about.eyebrow}</Eyebrow>
            <T
              weight="extrabold"
              style={{ fontSize: 24, lineHeight: 30, marginBottom: 12 }}
            >
              {about.title}
            </T>
            <Paragraphs
              text={about.body.split(/\n\s*\n/)[0] ?? ""}
              style={{ fontSize: 15, lineHeight: 24 }}
            />
            <Link href="/pages/about" style={{ marginTop: 14 }}>
              <T weight="bold" style={{ color: colors.tealDark }}>
                {t.discover_story} {rtl ? "←" : "→"}
              </T>
            </Link>
          </View>
        )}

        <View style={{ gap: 12 }}>
          {(["p1", "p2", "p3"] as const).map((p, i) => (
            <View
              key={p}
              style={{ flexDirection: row, gap: 14, alignItems: "flex-start" }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={
                    (
                      [
                        "shield-checkmark-outline",
                        "people-outline",
                        "ribbon-outline",
                      ] as const
                    )[i]
                  }
                  size={22}
                  color={colors.tealDark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <T weight="bold">{t[`${p}_t`]}</T>
                <T
                  style={{ color: colors.muted, fontSize: 14, lineHeight: 21 }}
                >
                  {t[`${p}_d`]}
                </T>
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.line,
            paddingTop: 20,
            gap: 8,
            marginBottom: 12,
          }}
        >
          <T style={{ color: colors.muted, fontSize: 14, lineHeight: 21 }}>
            {s.footerText}
          </T>
          <T style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
            {t.disclaimer}
          </T>
          <T style={{ color: colors.muted, fontSize: 12 }}>
            © {new Date().getFullYear()} {s.brand} {s.tagline}
          </T>
        </View>
      </View>
    </ScrollView>
  );
}
