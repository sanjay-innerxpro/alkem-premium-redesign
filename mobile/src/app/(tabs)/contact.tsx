import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Accent, BrandBar, Button, Eyebrow, T } from "../../components/ui";
import { sendEnquiry } from "../../lib/api";
import { useLoadedSite } from "../../lib/site";
import { colors, shadow } from "../../lib/theme";

const socialIcons = {
  linkedin: "logo-linkedin",
  instagram: "logo-instagram",
  facebook: "logo-facebook",
  x: "logo-twitter",
  youtube: "logo-youtube",
} as const;

export default function Contact() {
  const { s, t, rtl } = useLoadedSite();
  const insets = useSafeAreaInsets();
  // A product or role screen can open this tab with the subject (and role) filled in.
  const params = useLocalSearchParams<{ subject?: string; jobId?: string }>();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [jobId, setJobId] = useState<string>();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    if (params.subject) setForm((f) => ({ ...f, subject: params.subject! }));
    setJobId(params.jobId || undefined);
    setState("idle");
  }, [params.subject, params.jobId]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const submit = async () => {
    setError("");
    setState("sending");
    try {
      const problem = await sendEnquiry({ ...form, jobId });
      if (problem) {
        setError(problem);
        setState("idle");
      } else {
        setState("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setError(t.f_failed);
      setState("idle");
    }
  };

  const contacts = [
    s.contactEmail && {
      icon: "mail-outline",
      label: t.email_us,
      value: s.contactEmail,
      url: `mailto:${s.contactEmail}`,
    },
    s.contactPhone && {
      icon: "call-outline",
      label: t.call_us,
      value: s.contactPhone,
      url: `tel:${s.contactPhone.replace(/[^\d+]/g, "")}`,
    },
    s.contactAddress && {
      icon: "location-outline",
      label: t.visit_us,
      value: s.contactAddress,
      url: `geo:0,0?q=${encodeURIComponent(s.contactAddress)}`,
    },
  ].filter(Boolean) as {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    url: string;
  }[];
  const socials = Object.entries(s.social).filter(([, url]) => url) as [
    keyof typeof socialIcons,
    string,
  ][];
  const row = rtl ? "row-reverse" : "row";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <BrandBar />
        <View style={{ marginTop: 28, marginBottom: 20 }}>
          <Eyebrow>{t.get_in_touch}</Eyebrow>
          <T
            weight="extrabold"
            style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.6 }}
          >
            {t.start_a}
          </T>
          <Accent
            style={{ fontSize: 32, lineHeight: 40, color: colors.tealDark }}
          >
            {t.conversation}
          </Accent>
          <T
            style={{
              color: colors.muted,
              marginTop: 8,
              fontSize: 15,
              lineHeight: 23,
            }}
          >
            {t.contact_lead}
          </T>
        </View>

        <View style={{ gap: 10 }}>
          {contacts.map((c) => (
            <Pressable
              key={c.label}
              onPress={() => Linking.openURL(c.url).catch(() => {})}
              accessibilityRole="link"
              style={({ pressed }) => ({
                flexDirection: row,
                alignItems: "center",
                gap: 14,
                backgroundColor: colors.white,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: colors.line,
                padding: 14,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={c.icon} size={20} color={colors.tealDark} />
              </View>
              <View style={{ flex: 1 }}>
                <T style={{ fontSize: 12, color: colors.muted }}>{c.label}</T>
                <T weight="bold" style={{ fontSize: 15 }}>
                  {c.value}
                </T>
              </View>
            </Pressable>
          ))}
        </View>

        {socials.length > 0 && (
          <View
            style={{
              flexDirection: row,
              alignItems: "center",
              gap: 10,
              marginTop: 18,
            }}
          >
            <T weight="semibold" style={{ color: colors.muted, fontSize: 13 }}>
              {t.follow_us}
            </T>
            {socials.map(([key, url]) => (
              <Pressable
                key={key}
                onPress={() => Linking.openURL(url).catch(() => {})}
                accessibilityLabel={key}
                accessibilityRole="link"
                hitSlop={6}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: colors.navy,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={socialIcons[key]}
                    size={17}
                    color={colors.white}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View
          style={{
            marginTop: 28,
            backgroundColor: colors.white,
            borderRadius: 26,
            borderWidth: 1,
            borderColor: colors.line,
            padding: 20,
            ...shadow,
          }}
        >
          {state === "sent" ? (
            <View
              style={{ alignItems: "center", gap: 10, paddingVertical: 24 }}
            >
              <Ionicons name="checkmark-circle" size={48} color={colors.teal} />
              <T weight="extrabold" style={{ fontSize: 20 }}>
                {t.f_sent}
              </T>
              <T style={{ textAlign: "center", color: colors.muted }}>
                {t.f_success}
              </T>
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              <View>
                <T weight="extrabold" style={{ fontSize: 20 }}>
                  {t.write_to_us}
                </T>
                <T style={{ color: colors.muted, fontSize: 14 }}>
                  {t.form_respond}
                </T>
              </View>
              <Field
                label={t.f_name}
                placeholder={t.f_name_ph}
                value={form.name}
                onChange={set("name")}
                autoComplete="name"
              />
              <Field
                label={t.f_email}
                placeholder="name@example.com"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                keyboard="email-address"
              />
              <Field
                label={t.f_subject}
                placeholder={t.f_subject_ph}
                value={form.subject}
                onChange={set("subject")}
              />
              <Field
                label={jobId ? t.f_experience : t.f_message}
                placeholder={jobId ? t.f_experience_ph : t.f_message_ph}
                value={form.message}
                onChange={set("message")}
                multiline
              />
              <T style={{ fontSize: 12, lineHeight: 18, color: colors.muted }}>
                {t.f_note}
              </T>
              {error ? (
                <T weight="semibold" style={{ color: "#b42318", fontSize: 14 }}>
                  {error}
                </T>
              ) : null}
              <Button
                label={state === "sending" ? t.f_sending : t.f_send}
                onPress={submit}
                disabled={state === "sending"}
                icon={rtl ? "arrow-back" : "arrow-forward"}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  multiline,
  autoComplete,
  keyboard,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  autoComplete?: "name" | "email";
  keyboard?: "email-address";
}) {
  const { rtl } = useLoadedSite();
  return (
    <View style={{ gap: 6 }}>
      <T weight="semibold" style={{ fontSize: 14 }}>
        {label}
      </T>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        autoComplete={autoComplete}
        keyboardType={keyboard}
        autoCapitalize={keyboard ? "none" : "sentences"}
        accessibilityLabel={label}
        style={{
          minHeight: multiline ? 120 : 50,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.line,
          backgroundColor: colors.background,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
          fontSize: 15,
          color: colors.ink,
          textAlignVertical: multiline ? "top" : "center",
          textAlign: rtl ? "right" : "left",
        }}
      />
    </View>
  );
}
