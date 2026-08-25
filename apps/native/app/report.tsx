import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { Button, Switch } from "heroui-native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { WebView } from "react-native-webview";

import { Container } from "@/components/container";
import { savePdfToFiles } from "@/lib/pdf/save-pdf";
import { buildReportHtml } from "@/lib/pdf/report-template";
import {
  cancelReassessmentReminder,
  scheduleReassessmentReminder,
} from "@/lib/notifications/reminders";
import {
  getLatestResult,
  getReminderEnabled,
  isReportUnlocked,
  setReminderEnabled,
} from "@/lib/storage/app-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Report() {
  const { t } = useTranslation();
  const router = useRouter();

  const result = getLatestResult();
  const unlocked = result ? isReportUnlocked(result.id) : false;
  const [generating, setGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [reminderOn, setReminderOn] = useState(getReminderEnabled());

  useEffect(() => {
    if (!result || !unlocked) {
      router.replace("/results");
      return;
    }
    generatePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePdf = useCallback(async () => {
    if (!result) return;
    setGenerating(true);
    try {
      const { uri } = await Print.printToFileAsync({
        html: buildReportHtml(result),
        base64: false,
      });
      setPdfUri(uri);
    } finally {
      setGenerating(false);
    }
  }, [result]);

  async function handleShare() {
    if (!pdfUri) return;
    await Sharing.shareAsync(pdfUri, {
      mimeType: "application/pdf",
      dialogTitle: t("report.title"),
      UTI: "com.adobe.pdf",
    });
  }

  async function handleSave() {
    if (!pdfUri) return;
    await savePdfToFiles(pdfUri, "neurotrace-report.pdf");
  }

  async function handlePrint() {
    if (!result) return;
    await Print.printAsync({ html: buildReportHtml(result) });
  }

  async function toggleReminder(value: boolean) {
    setReminderOn(value);
    setReminderEnabled(value);

    if (value) {
      const ok = await scheduleReassessmentReminder(
        t("report.title"),
        t("report.reminder_desc"),
      );
      if (!ok) {
        setReminderOn(false);
        setReminderEnabled(false);
      }
    } else {
      await cancelReassessmentReminder();
    }
  }

  return (
    <Container className="px-4 pt-12" isScrollable={false}>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-foreground text-2xl font-semibold tracking-tight">
          {t("report.title")}
        </Text>
        {generating ? (
          <Text className="text-muted text-xs">{t("report.generating")}</Text>
        ) : null}
      </View>

      {/* Document preview */}
      <View className="flex-1 overflow-hidden rounded-2xl border border-muted bg-white">
        <WebView
          source={{ html: buildReportHtml(result ?? emptyResult()) }}
          style={{ backgroundColor: "#ffffff" }}
        />
      </View>

      {/* Action bar */}
      <View className="gap-2.5 py-4">
        <View className="flex-row gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            isDisabled={!pdfUri}
            onPress={handleSave}
          >
            {t("report.save_cta")}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            isDisabled={!pdfUri}
            onPress={handleShare}
          >
            {t("report.share_cta")}
          </Button>
        </View>

        {/* Reminder opt-in */}
        <View className="flex-row items-center justify-between rounded-xl border border-muted px-4 py-3">
          <View className="flex-1 pe-4">
            <Text className="text-foreground text-sm font-medium">
              {t("report.reminder_toggle")}
            </Text>
            <Text className="text-muted mt-0.5 text-xs">
              {reminderOn ? t("report.reminder_scheduled") : t("report.reminder_desc")}
            </Text>
          </View>
          <Switch isSelected={reminderOn} onSelectedChange={toggleReminder} />
        </View>

        <Button variant="ghost" className="self-start px-2" onPress={() => router.back()}>
          ← {t("common.back")}
        </Button>
      </View>
    </Container>
  );
}

function emptyResult() {
  return {
    id: "",
    completedAt: new Date().toISOString(),
    partAScore: 0,
    isPartAPositive: false,
    inattentionRaw: 0,
    hyperactivityRaw: 0,
    inattentionMax: 36,
    hyperactivityMax: 36,
    classificationKey: "results.classification.low_consistency" as const,
    responses: [],
  };
}
