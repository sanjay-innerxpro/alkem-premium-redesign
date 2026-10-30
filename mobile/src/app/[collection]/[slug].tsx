import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Eyebrow,
  LoadError,
  Loading,
  OfflineNotice,
  Paragraphs,
  T,
} from "../../components/ui";
import { absolute, useApi, type Item } from "../../lib/api";
import { useLoadedSite } from "../../lib/site";
import { colors, gradients, radius, shadow } from "../../lib/theme";

// One product, therapy area, offering, page, news story or role.
export default function Detail() {
  const { collection, slug } = useLocalSearchParams<{
    collection: string;
    slug: string;
  }>();
  const { t, lang, rtl } = useLoadedSite();
  const insets = useSafeAreaInsets();
  const {
    data: item,
    offline,
    failed,
    refreshing,
    refresh,
  } = useApi<Item>(`/${collection}/${slug}?lang=${lang}`);
  const row = rtl ? "row-reverse" : "row";

  const back = (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={10}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.12)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons
        name={rtl ? "arrow-forward" : "arrow-back"}
        size={22}
        color={colors.white}
      />
    </Pressable>
  );

  if (!item)
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            backgroundColor: colors.navy,
            paddingTop: insets.top + 10,
            padding: 16,
          }}
        >
          {back}
        </View>
        {failed ? <LoadError onRetry={refresh} /> : <Loading />}
      </View>
    );

  const facts =
    item.collection === "products"
      ? [
          [t.composition, item.composition],
          [t.dosage_form, item.dosageForm],
          [t.pack_size, item.packSize],
          [t.therapy_area, item.category],
        ]
      : item.collection === "careers"
        ? [
            ["", item.location],
            ["", item.employmentType],
          ]
        : [];
  const cta: { title: string; text: string; label: string; href: Href } =
    item.collection === "products"
      ? {
          title: t.enquire_product,
          text: t.enquire_text,
          label: t.contact_us,
          href: {
            pathname: "/contact",
            params: { subject: t.product_enquiry + item.title },
          },
        }
      : item.collection === "careers"
        ? {
            title: t.interested_role,
            text: t.role_text,
            label: t.contact_us,
            href: {
              pathname: "/contact",
              params: {
                subject: t.career_enquiry + item.title,
                jobId: item.id,
              },
            },
          }
        : {
            title: t.have_question,
            text: t.question_text,
            label: t.talk_team,
            href: "/contact",
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
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 28,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View style={{ flexDirection: row }}>{back}</View>
        <View
          style={{
            flexDirection: row,
            alignItems: "center",
            gap: 16,
            marginTop: 22,
          }}
        >
          {item.imageUrl ? (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={absolute(item.imageUrl)}
                style={{ width: 48, height: 48 }}
                contentFit="contain"
              />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            {item.category ? <Eyebrow dark>{item.category}</Eyebrow> : null}
          </View>
        </View>
        <T
          weight="extrabold"
          style={{
            color: colors.white,
            fontSize: 30,
            lineHeight: 37,
            letterSpacing: -0.6,
            marginTop: 8,
          }}
        >
          {item.title}
        </T>
        {item.summary ? (
          <T
            style={{
              color: colors.mist,
              marginTop: 10,
              fontSize: 16,
              lineHeight: 25,
            }}
          >
            {item.summary}
          </T>
        ) : null}
      </LinearGradient>

      <View style={{ padding: 20, gap: 22 }}>
        <OfflineNotice show={offline} />
        {facts.some(([, v]) => v) && (
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.line,
              ...shadow,
            }}
          >
            {facts
              .filter(([, v]) => v)
              .map(([label, value], i) => (
                <View
                  key={i}
                  style={{
                    padding: 16,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.line,
                    gap: 2,
                  }}
                >
                  {label ? (
                    <T
                      weight="semibold"
                      style={{
                        fontSize: 12,
                        color: colors.muted,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      {label}
                    </T>
                  ) : null}
                  <T weight="bold" style={{ fontSize: 16 }}>
                    {value}
                  </T>
                </View>
              ))}
          </View>
        )}
        {item.body ? <Paragraphs text={item.body} /> : null}
        <LinearGradient
          colors={gradients.deep}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 26, padding: 22, gap: 8 }}
        >
          <T weight="extrabold" style={{ color: colors.white, fontSize: 20 }}>
            {cta.title}
          </T>
          <T style={{ color: "#cfe9ee", fontSize: 14, lineHeight: 21 }}>
            {cta.text}
          </T>
          <Button
            label={cta.label}
            href={cta.href}
            variant="light"
            style={{ marginTop: 10 }}
          />
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
