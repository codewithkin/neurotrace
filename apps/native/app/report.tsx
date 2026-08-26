import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { Switch } from "heroui-native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import { BadgeChip } from "@/components/ui/atoms";
import { AccentIcon, GhostButton, OutlineButton, PrimaryButton } from "@/components/ui/buttons";
import { FadeSlideIn } from "@/components/ui/motion";
import { ASRS_SYMPTOM_KEYS } from "@/lib/asrs/questions";
import {
  ASRSResponse,
  RESPONSE_SCALE,
  getFlaggedResponses,
} from "@/lib/asrs/scoring";
import { savePdfToFiles } from "@/lib/pdf/save-pdf";
import { buildReportHtml } from "@/lib/pdf/report-template";
import { MONO_FONT, NT_COLORS, useNTColors } from "@/lib/theme";
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

/**
 * The preview sheet is the printed page, so it stays on white paper in both
 * themes and uses the light palette's ink — the same rule the web result
 * page follows in reverse (D-009).
 */
const PAPER = NT_COLORS.light;

/*
 * Doctor's report, from designs "Light/Dark 11 Doctor report".
 *
 * Rendered natively rather than through the WebView the first pass used:
 * it themes correctly, appears instantly, and the HTML template stays the
 * single source for the actual PDF.
 */
export default function Report() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const nt = useNTColors();

  const result = getLatestResult();
  const unlocked = result ? isReportUnlocked(result.id) : false;
  const [generating, setGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [reminderOn, setReminderOn] = useState(getReminderEnabled());

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

  useEffect(() => {
    if (!result || !unlocked) {
      router.replace("/results");
      return;
    }
    generatePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) return null;

  const flagged = getFlaggedResponses(result.responses);
  const inattentionPct = Math.round(
    (result.inattentionRaw / Math.max(1, result.inattentionMax)) * 100,
  );
  const hyperactivityPct = Math.round(
    (result.hyperactivityRaw / Math.max(1, result.hyperactivityMax)) * 100,
  );
  const completedOn = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(result.completedAt));

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
    <Container isScrollable={false}>
      <View className="flex-row items-center justify-between px-4 pb-3.5 pt-[26px]">
        <Text className="text-foreground text-xl font-semibold tracking-[-0.02em]">
          {t("report.title")}
        </Text>
        <BadgeChip
          size="sm"
          tone="green"
          icon="checkmark-circle"
          label={generating ? t("report.generating") : t("report.ready")}
        />
      </View>

      {/* The printed page. Always white, in both themes. */}
      <View
        className="mx-4 flex-1 overflow-hidden rounded-[14px] border border-border"
        style={{ backgroundColor: PAPER.bg }}
      >
        <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 18 }}>
          <Text
            className="text-base font-bold tracking-[-0.01em]"
            style={{ color: PAPER.fg }}
          >
            {t("report.doc_title")}
          </Text>
          <Text
            className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: PAPER.muted, fontFamily: MONO_FONT }}
          >
            {t("report.doc_caption", { date: completedOn })}
          </Text>

          <View
            style={{ height: 2, backgroundColor: PAPER.pri, marginTop: 12, marginBottom: 14 }}
          />

          <View className="flex-row gap-2">
            <PaperStat label={t("results.stat_part_a")} value={`${result.partAScore} / 6`} />
            <PaperStat label={t("results.stat_inatt")} value={`${inattentionPct}%`} />
            <PaperStat label={t("results.stat_hyper")} value={`${hyperactivityPct}%`} />
          </View>

          {flagged.length > 0 && (
            <>
              <Text
                className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: PAPER.muted }}
              >
                {t("report.flagged_responses")}
              </Text>
              <View className="mt-2 gap-1.5">
                {flagged.map((response) => (
                  <FlaggedRow key={response.questionId} response={response} />
                ))}
              </View>
            </>
          )}

          <Text
            className="mt-3.5 text-[10px]"
            style={{ color: PAPER.muted, lineHeight: 15 }}
          >
            {t("report.citation")}
          </Text>
        </ScrollView>
      </View>

      <View className="px-4 pt-4" style={{ paddingBottom: Math.max(0, 20 - insets.bottom) }}>
        <FadeSlideIn>
          <View className="flex-row gap-2.5">
            <View className="flex-1">
              <OutlineButton
                label={t("report.save_cta")}
                disabled={!pdfUri}
                icon={<Ionicons name="folder-outline" size={19} color={nt.pri} />}
                onPress={handleSave}
              />
            </View>
            <View className="flex-1">
              <PrimaryButton
                label={t("report.share_cta")}
                disabled={!pdfUri}
                icon={<AccentIcon name="share-outline" size={19} />}
                iconPosition="leading"
                onPress={handleShare}
              />
            </View>
          </View>
        </FadeSlideIn>

        <View
          className="mt-2.5 flex-row items-center gap-3 rounded-[14px] border border-border"
          style={{ paddingVertical: 13, paddingHorizontal: 14 }}
        >
          <Ionicons name="notifications-outline" size={20} color={nt.pri} />
          <Text className="text-foreground flex-1 text-[13px] font-semibold">
            {t("report.reminder_toggle")}
          </Text>
          <Switch isSelected={reminderOn} onSelectedChange={toggleReminder} />
        </View>

        <GhostButton label={t("report.back_cta")} onPress={() => router.back()} />
      </View>
    </Container>
  );
}

function PaperStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      className="flex-1 rounded-[10px]"
      style={{ borderWidth: 1, borderColor: PAPER.border, padding: 9 }}
    >
      <Text
        className="text-[8px] font-bold uppercase tracking-[0.1em]"
        style={{ color: PAPER.muted }}
      >
        {label}
      </Text>
      <Text className="mt-[3px] text-[17px] font-bold" style={{ color: PAPER.fg }}>
        {value}
      </Text>
    </View>
  );
}

function FlaggedRow({ response }: { response: ASRSResponse }) {
  const { t } = useTranslation();
  const symptomKey = ASRS_SYMPTOM_KEYS[response.questionId];
  const frequencyKey = RESPONSE_SCALE[response.value].key;

  return (
    <View
      className="flex-row gap-2 rounded-lg"
      style={{ backgroundColor: PAPER.dangerBg, paddingVertical: 9, paddingHorizontal: 10 }}
    >
      <Text
        className="text-[10px] font-bold"
        style={{ color: PAPER.dangerFg, fontFamily: MONO_FONT }}
      >
        Q{response.questionId}
      </Text>
      <Text className="flex-1 text-[11px]" style={{ color: PAPER.fg, lineHeight: 15.4 }}>
        {t(`pdf.symptoms.${symptomKey}`)}
        {" — "}
        <Text className="font-bold">{t(`scale.${frequencyKey}`)}</Text>
      </Text>
    </View>
  );
}
