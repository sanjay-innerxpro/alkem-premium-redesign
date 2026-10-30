// Colours and type from the website (src/app/globals.css).
export const colors = {
  navy: "#071526",
  deep: "#0f2335",
  ink: "#1b2a3a",
  ink2: "#3d4b5c",
  muted: "#637083",
  line: "#e8e5de",
  surface: "#f6f4ef",
  background: "#fcfbf8",
  white: "#ffffff",
  teal: "#14b8a6",
  tealDark: "#0f766e",
  mint: "#5eead4",
  mist: "#9fb3c4",
};
export const gradients = {
  brand: ["#22B3A0", "#1F9BB5", "#2F7FA3"] as const,
  deep: ["#0f766e", "#155e75"] as const,
  light: ["#7fe0d2", "#a9d6f0"] as const,
  hero: ["#071526", "#0d2a3d"] as const,
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
