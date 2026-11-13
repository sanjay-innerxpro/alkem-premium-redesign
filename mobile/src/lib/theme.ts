// Colours and type from the website (src/app/globals.css).
export const colors = {
  navy: "#0b0d36",
  deep: "#13164a",
  ink: "#1b2a3a",
  ink2: "#3d4b5c",
  muted: "#637083",
  line: "#e8e5de",
  surface: "#f6f4ef",
  background: "#fcfbf8",
  white: "#ffffff",
  teal: "#38a9d0",
  tealDark: "#2b2c73",
  mint: "#7fd3f0",
  mist: "#9fb3c4",
};
export const gradients = {
  brand: ["#38A9D0", "#3A6DB3", "#2B2C73"] as const,
  deep: ["#2b2c73", "#3a4c9c"] as const,
  light: ["#8fd2ee", "#a9d6f0"] as const,
  hero: ["#0b0d36", "#161b5e"] as const,
};
export const radius = { card: 22, pill: 999 };
export const shadow = {
  shadowColor: "#1b2a3a",
  shadowOpacity: 0.1,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 3,
};

// Plus Jakarta Sans has Latin glyphs only; Hindi and Urdu use the system fonts.
const jakarta = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
};
export type Weight = keyof typeof jakarta;
const numeric: Record<Weight, "400" | "500" | "600" | "700" | "800"> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};
export const fontFor = (latin: boolean, weight: Weight) =>
  latin ? { fontFamily: jakarta[weight] } : { fontWeight: numeric[weight] };
export const serif = "InstrumentSerif_400Regular_Italic";
