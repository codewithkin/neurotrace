import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function HistoryTab() {
  const { t } = useTranslation();
  return (
    <Container className="px-4">
      <View className="py-6 mb-5">
        <Text className="text-3xl font-semibold text-foreground tracking-tight">
          {t("history.title")}
        </Text>
      </View>
    </Container>
  );
}
