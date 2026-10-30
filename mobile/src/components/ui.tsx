import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, type Href } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { absolute, type Item } from "../lib/api";
import { useLoadedSite, useSite } from "../lib/site";
import {
  colors,
  fontFor,
  gradients,
  radius,
  serif,
  shadow,
  type Weight,
} from "../lib/theme";

// Text in the right font and direction for the current language.
export function T({
  weight = "regular",
  style,
  ...props
}: TextProps & { weight?: Weight }) {
  const { latin, rtl } = useSite();
  return (
    <Text
      {...props}
      style={[
        { color: colors.ink, fontSize: 16, lineHeight: 24 },
        fontFor(latin, weight),
        rtl && { writingDirection: "rtl", textAlign: "right" },
        style,
      ]}
    />
  );
}

// Serif italic accent, as on the website's headlines (Latin only).
export function Accent({ style, ...props }: TextProps) {
  const { latin } = useSite();
  return (
    <T
      {...props}
      weight="bold"
      style={[latin && { fontFamily: serif, fontWeight: "400" }, style]}
    />
  );
}

export const initialOf = (name: string) =>
  (Array.from(name.trim())[0] ?? "").toUpperCase();

// The website logo: brand initial on the brand gradient, with the signature dot.
export function Mark({ name, size = 40 }: { name: string; size?: number }) {
  const u = size / 40;
  return (
    <LinearGradient
      colors={gradients.brand}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: 12 * u,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: colors.white,
          fontFamily: "PlusJakartaSans_700Bold",
          fontSize: 23 * u,
          lineHeight: 28 * u,
          marginLeft: -2 * u,
          marginTop: 2 * u,
        }}
      >
        {initialOf(name)}
      </Text>
      <View
        style={{
          position: "absolute",
          left: 28.4 * u,
          top: 6.4 * u,
          width: 5.2 * u,
          height: 5.2 * u,
          borderRadius: 3 * u,
          backgroundColor: colors.white,
        }}
      />
    </LinearGradient>
  );
}

export function Button({
  label,
  onPress,
  href,
  variant = "primary",
  icon,
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  href?: Href;
  variant?: "primary" | "light" | "outline";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { rtl } = useSite();
  const color =
    variant === "outline"
      ? colors.white
      : variant === "light"
        ? colors.navy
        : colors.white;
  const inner = (
    <View
      style={{
        flexDirection: rtl ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <T weight="bold" style={{ color, fontSize: 16 }}>
        {label}
      </T>
      {icon && <Ionicons name={icon} size={18} color={color} />}
    </View>
  );
  const box: ViewStyle = {
    minHeight: 54,
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    justifyContent: "center",
    overflow: "hidden",
    opacity: disabled ? 0.6 : 1,
  };
  const body = (pressed: boolean) =>
    variant === "outline" ? (
      <View
        style={[
          box,
          {
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.35)",
            opacity: pressed ? 0.7 : box.opacity,
          },
        ]}
      >
        {inner}
      </View>
    ) : (
      <LinearGradient
        colors={variant === "light" ? gradients.light : gradients.deep}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[box, pressed && { opacity: 0.85 }]}
      >
        {inner}
      </LinearGradient>
    );
  const pressable = (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
  return href ? (
    <Link href={href} asChild>
      {pressable}
    </Link>
  ) : (
    pressable
  );
}

export function Eyebrow({
  children,
  dark,
}: {
  children: string;
  dark?: boolean;
}) {
  const { rtl } = useSite();
  return (
    <View
      style={{
        flexDirection: rtl ? "row-reverse" : "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: colors.teal,
        }}
      />
      <T
        weight="bold"
        style={{
          fontSize: 12,
          letterSpacing: 1.4,
          color: dark ? colors.mint : colors.tealDark,
          textTransform: "uppercase",
        }}
      >
        {children}
      </T>
    </View>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: { label: string; href: Href };
}) {
  const { rtl } = useSite();
  return (
    <View style={{ marginBottom: 16 }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <View
        style={{
          flexDirection: rtl ? "row-reverse" : "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <T
          weight="extrabold"
          style={{ fontSize: 24, lineHeight: 30, flex: 1, letterSpacing: -0.4 }}
        >
          {title}
        </T>
        {action && (
          <Link href={action.href}>
            <T weight="bold" style={{ color: colors.tealDark, fontSize: 14 }}>
              {action.label} {rtl ? "←" : "→"}
            </T>
          </Link>
        )}
      </View>
    </View>
  );
}

// A content card: products show composition and form, others their summary.
export function ItemCard({
  item,
  style,
}: {
  item: Item;
  style?: StyleProp<ViewStyle>;
}) {
  const { rtl } = useSite();
  const meta =
    item.collection === "products"
      ? [item.dosageForm, item.packSize].filter(Boolean).join(" · ")
      : item.collection === "careers"
        ? [item.location, item.employmentType].filter(Boolean).join(" · ")
        : "";
  return (
    // Navigates on press rather than via <Link asChild>, which drops a style function.
    <Pressable
      onPress={() => router.push(`/${item.collection}/${item.slug}`)}
      accessibilityRole="link"
      style={({ pressed }) => [card, pressed && { opacity: 0.85 }, style]}
    >
      <View
        style={{
          flexDirection: rtl ? "row-reverse" : "row",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        {item.imageUrl ? (
          <View style={thumb}>
            <Image
              source={absolute(item.imageUrl)}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
            />
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 4 }}>
          {item.category ? (
            <T
              weight="bold"
              style={{
                fontSize: 12,
                color: colors.tealDark,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {item.category}
            </T>
          ) : null}
          <T weight="bold" style={{ fontSize: 17, lineHeight: 23 }}>
            {item.title}
          </T>
          {item.collection === "products" && item.composition ? (
            <T
              style={{ fontSize: 14, lineHeight: 20, color: colors.ink2 }}
              numberOfLines={2}
            >
              {item.composition}
            </T>
          ) : item.summary ? (
            <T
              style={{ fontSize: 14, lineHeight: 21, color: colors.muted }}
              numberOfLines={3}
            >
              {item.summary}
            </T>
          ) : null}
          {meta ? (
            <T
              weight="semibold"
              style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}
            >
              {meta}
            </T>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
const card: ViewStyle = {
  backgroundColor: colors.white,
  borderRadius: radius.card,
  borderWidth: 1,
  borderColor: colors.line,
  padding: 16,
  ...shadow,
};
const thumb: ViewStyle = {
  width: 56,
  height: 56,
  borderRadius: 16,
  backgroundColor: colors.surface,
  alignItems: "center",
  justifyContent: "center",
};

export function EmptyState({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text?: string;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 48,
        paddingHorizontal: 24,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={28} color={colors.tealDark} />
      </View>
      <T weight="bold" style={{ fontSize: 18, textAlign: "center" }}>
        {title}
      </T>
      {text ? (
        <T style={{ color: colors.muted, textAlign: "center" }}>{text}</T>
      ) : null}
    </View>
  );
}

export function Loading() {
  return (
    <View style={{ paddingVertical: 64, alignItems: "center" }}>
      <ActivityIndicator color={colors.tealDark} size="large" />
    </View>
  );
}

// Shown when content could not be fetched and nothing was saved earlier.
export function LoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useLoadedSite();
  return (
    <View
      style={{
        paddingVertical: 48,
        paddingHorizontal: 24,
        alignItems: "center",
        gap: 16,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={36} color={colors.muted} />
      <T style={{ textAlign: "center", color: colors.muted }}>
        {t.app_unavailable}
      </T>
      <Pressable onPress={onRetry} accessibilityRole="button">
        <T weight="bold" style={{ color: colors.tealDark }}>
          {t.app_retry}
        </T>
      </Pressable>
    </View>
  );
}

export function OfflineNotice({ show }: { show: boolean }) {
  const { t } = useLoadedSite();
  if (!show) return null;
  return (
    <View
      style={{
        backgroundColor: "#e0f7fa",
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <T style={{ fontSize: 13, color: "#0f5f73", textAlign: "center" }}>
        {t.app_offline}
      </T>
    </View>
  );
}

// Brand bar with the language switcher, used at the top of each tab.
export function BrandBar({ dark }: { dark?: boolean }) {
  const { s, site, lang, setLang, rtl } = useLoadedSite();
  const ink = dark ? colors.white : colors.ink;
  return (
    <View
      style={{
        flexDirection: rtl ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View
        style={{
          flexDirection: rtl ? "row-reverse" : "row",
          alignItems: "center",
          gap: 10,
          flexShrink: 1,
        }}
      >
        <Mark name={s.brand} size={38} />
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{
              color: ink,
              fontFamily: "PlusJakartaSans_800ExtraBold",
              fontSize: 18,
              lineHeight: 22,
            }}
            numberOfLines={1}
          >
            {s.brand}
          </Text>
          <T
            weight="bold"
            style={{
              color: dark ? colors.mist : colors.muted,
              fontSize: 10,
              lineHeight: 14,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
            numberOfLines={1}
          >
            {s.tagline}
          </T>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: dark ? "rgba(255,255,255,0.18)" : colors.line,
          padding: 3,
        }}
      >
        {site.languages.map((l) => {
          const active = l.code === lang;
          return (
            <Pressable
              key={l.code}
              onPress={() => setLang(l.code)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={l.label}
              style={{
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: radius.pill,
                backgroundColor: active
                  ? dark
                    ? "rgba(255,255,255,0.16)"
                    : colors.surface
                  : "transparent",
              }}
            >
              <Text
                style={{
                  color: ink,
                  fontSize: 12,
                  fontWeight: active ? "700" : "500",
                }}
              >
                {l.short}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Splits stored plain text into paragraphs, as the website does.
export function Paragraphs({
  text,
  style,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <View style={{ gap: 14 }}>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <T
            key={i}
            style={[
              { fontSize: 16, lineHeight: 26, color: colors.ink2 },
              style,
            ]}
          >
            {p}
          </T>
        ))}
    </View>
  );
}
