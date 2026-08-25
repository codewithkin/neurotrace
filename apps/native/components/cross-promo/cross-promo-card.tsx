import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

/**
 * Internal ecosystem funnel: routes overwhelmed users into the
 * single-purpose companion app ("Brown Noise for Focus").
 */
export function CrossPromoCard({ className = "" }: { className?: string }) {
  const { t } = useTranslation();

  async function openCompanion() {
    const url =
      process.env.EXPO_PUBLIC_COMPANION_APP_URL ?? "https://brownnoise.app";
    try {
      const Linking = await import("react-native").then((m) => m.Linking);
      await Linking.openURL(url);
    } catch {
      // Companion app not installed / no handler — fail silently.
    }
  }

  return (
    <Pressable onPress={openCompanion} className={`w-full ${className}`}>
      <View className="flex-row items-center gap-3 rounded-2xl border border-muted bg-secondary px-4 py-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-amber-600/20">
          <Ionicons name="headset" size={20} color="#d97706" />
        </View>
        <View className="flex-1">
          <Text className="text-muted text-xs">{t("cross_promo.banner")}</Text>
          <Text className="text-foreground mt-0.5 text-sm font-semibold">
            {t("cross_promo.cta")} →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
