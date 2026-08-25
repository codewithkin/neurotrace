import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { Button, Separator, Surface, Switch } from "heroui-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { applyLayoutDirection } from "@/lib/i18n/layout-direction";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import {
  purchaseRemoveAds,
  restorePurchases,
} from "@/lib/purchases/remove-ads";
import {
  clearAllData,
  getAdsRemoved,
  getLanguageCode,
  setAdsRemoved,
} from "@/lib/storage/app-storage";

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="text-muted mb-2 mt-5 text-xs font-semibold tracking-wide uppercase">
      {label}
    </Text>
  );
}

export default function SettingsTab() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [languageCode, setLanguageCodeState] = useState(getLanguageCode());
  const [adsRemoved, setAdsRemovedState] = useState(getAdsRemoved());

  function changeLanguage(code: string) {
    setLanguageCodeState(code);
    i18n.changeLanguage(code);
    applyLayoutDirection(code); // reloads the app if the RTL direction flips
  }

  async function handlePurchaseRemoveAds() {
    const result = await purchaseRemoveAds();
    if (result.success) {
      setAdsRemovedState(true);
    } else if (!result.cancelled) {
      // Purchase failed — offer restore as a fallback path.
      const restored = await restorePurchases();
      setAdsRemovedState(restored);
    }
  }

  function confirmClearData() {
    Alert.alert(t("settings.clear_data"), t("settings.clear_data_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.clear_data"),
        style: "destructive",
        onPress: () => {
          clearAllData();
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <Container className="px-4">
      <View className="py-6">
        <Text className="text-foreground text-2xl font-semibold tracking-tight">
          {t("settings.title")}
        </Text>
      </View>

      {/* Language */}
      <SectionLabel label={t("settings.language")} />
      <Surface variant="secondary" className="rounded-2xl p-4">
        <View className="flex-row flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              size="sm"
              variant={lang.code === languageCode ? "primary" : "secondary"}
              onPress={() => changeLanguage(lang.code)}
            >
              {lang.nativeName}
            </Button>
          ))}
        </View>
      </Surface>

      {/* Support */}
      <SectionLabel label={t("settings.about")} />
      <Surface variant="secondary" className="rounded-2xl p-4">
        <View className="flex-row items-center justify-between py-1">
          <Text className="text-foreground flex-1 pe-4 text-sm font-medium">
            {t("settings.remove_ads")}
          </Text>
          <Switch
            isSelected={adsRemoved}
            onSelectedChange={(v) => {
              if (v) {
                handlePurchaseRemoveAds();
              } else {
                setAdsRemovedState(false);
                setAdsRemoved(false);
              }
            }}
          />
        </View>
        <Separator className="my-3" />
        <Text className="text-muted text-xs leading-relaxed">
          {t("settings.remove_ads_desc")}
        </Text>
      </Surface>

      {/* Actions */}
      <SectionLabel label={t("assessment.part_a_header")} />
      <Button
        variant="secondary"
        className="w-full"
        onPress={() => router.push("/assessment/part-a")}
      >
        {t("settings.retake_assessment")}
      </Button>

      {/* Privacy */}
      <SectionLabel label={t("settings.privacy")} />
      <Surface variant="secondary" className="rounded-2xl p-4">
        <Text className="text-foreground/90 text-xs leading-relaxed">
          🔒 {t("settings.privacy_note")}
        </Text>
      </Surface>

      {/* Danger zone */}
      <SectionLabel label={t("settings.clear_data")} />
      <Button variant="secondary" className="text-danger" onPress={confirmClearData}>
        {t("settings.clear_data")}
      </Button>

      <Text className="text-muted py-8 text-center text-xs">
        NeuroTrace · v{Application.nativeApplicationVersion ?? "1.0.0"} (
        {Application.nativeBuildVersion ?? "1"})
      </Text>
    </Container>
  );
}
