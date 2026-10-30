import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useLoadedSite } from "../../lib/site";
import { colors, fontFor } from "../../lib/theme";

type Icon = keyof typeof Ionicons.glyphMap;
const tab = (icon: Icon, active: Icon) => ({
  tabBarIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons
      name={focused ? active : icon}
      size={23}
      color={color as string}
    />
  ),
});

export default function TabsLayout() {
  const { t, latin } = useLoadedSite();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tealDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: { fontSize: 11, ...fontFor(latin, "semibold") },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t.home, ...tab("home-outline", "home") }}
      />
      <Tabs.Screen
        name="products"
        options={{ title: t.lbl_products, ...tab("medkit-outline", "medkit") }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: t.app_news_tab,
          ...tab("newspaper-outline", "newspaper"),
        }}
      />
      <Tabs.Screen
        name="careers"
        options={{
          title: t.lbl_careers,
          ...tab("briefcase-outline", "briefcase"),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: t.lbl_contact,
          ...tab("chatbubbles-outline", "chatbubbles"),
        }}
      />
    </Tabs>
  );
}
