import { Container } from "@/components/container";
import { Button } from "heroui-native";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function AssessTab() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Container className="px-4">
      <View className="py-6 mb-5 gap-2">
        <Text className="text-3xl font-semibold text-foreground tracking-tight">
          {t("assessment.part_a_header")}
        </Text>
        <Text className="text-muted text-sm">{t("onboarding.value.subtitle")}</Text>
      </View>
      <Button onPress={() => router.push("/assessment/part-a")}>
        {t("common.start")}
      </Button>
    </Container>
  );
}
