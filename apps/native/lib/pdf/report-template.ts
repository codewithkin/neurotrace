import { ASRS_QUESTIONS, ASRS_SYMPTOM_KEYS } from "@/lib/asrs/questions";
import { RESPONSE_SCALE } from "@/lib/asrs/scoring";
import { StoredAssessmentResult } from "@/lib/storage/app-storage";
import i18n from "@/lib/i18n";
import { isRTL } from "@/lib/i18n/languages";

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function t(key: string, opts?: Record<string, unknown>): string {
  return i18n.t(key, opts);
}

/**
 * Builds the doctor-ready HTML summary rendered to PDF by expo-print.
 * Fully locale-aware (including RTL) and self-contained inline CSS.
 */
export function buildReportHtml(result: StoredAssessmentResult): string {
  const dir = isRTL(i18n.language) ? "rtl" : "ltr";

  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(result.completedAt));

  const partARows = result.isPartAPositive
    ? t("pdf.part_a_positive", { score: result.partAScore })
    : t("pdf.part_a_positive", { score: result.partAScore });

  function pct(value: number, max: number): number {
    return max > 0 ? Math.round((value / max) * 100) : 0;
  }

  const inattentionPct = pct(result.inattentionRaw, result.inattentionMax);
  const hyperactivityPct = pct(result.hyperactivityRaw, result.hyperactivityMax);

  const matrixRows = ASRS_QUESTIONS.map((q) => {
    const resp = result.responses.find((r) => r.questionId === q.id);
    const value = resp?.value ?? 0;
    const scaleOption = RESPONSE_SCALE.find((o) => o.value === value);
    const symptom = t(`pdf.symptoms.${ASRS_SYMPTOM_KEYS[q.id]}`);
    const frequency = t(`scale.${scaleOption?.key ?? "never"}`);
    const flagged =
      (q.id <= 3 && value >= 2) || (q.id >= 4 && q.id <= 6 && value >= 3);
    return `
      <tr>
        <td class="num">${q.id}</td>
        <td>${esc(symptom)}</td>
        <td class="center ${flagged ? "flagged" : ""}">${esc(frequency)}</td>
      </tr>`;
  }).join("");

  const scaleLegend = RESPONSE_SCALE.map(
    (o) => `${o.value} = ${esc(t(`scale.${o.key}`))}`,
  ).join(" | ");

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${i18n.language}">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1f2937; font-size: 12px; line-height: 1.55; padding: 32px 36px;
  }
  h1 { font-size: 20px; letter-spacing: -0.3px; }
  .subtitle { color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  header { border-bottom: 2px solid #7c3aed; padding-bottom: 14px; margin-bottom: 20px; }
  .meta { display: flex; justify-content: space-between; margin-top: 10px; font-size: 11px; color: #374151; }
  section { margin-bottom: 22px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #6d28d9; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #f5f3ff; text-align: start; padding: 7px 9px; border-bottom: 1.5px solid #ddd6fe; }
  td { padding: 6px 9px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  td.num { width: 26px; color: #6b7280; }
  td.center { text-align: center; white-space: nowrap; }
  td.flagged { color: #b91c1c; font-weight: 700; }
  .summary-grid { display: flex; gap: 12px; }
  .card { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; }
  .card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: #6b7280; }
  .card .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
  .bar { height: 8px; border-radius: 999px; background: #ede9fe; margin-top: 8px; overflow: hidden; }
  .bar > div { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #a78bfa, #7c3aed); }
  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: ${result.isPartAPositive ? "#fef3c7; color: #92400e" : "#d1fae5; color: #065f46"};
    margin-top: 8px;
  }
  footer {
    border-top: 1px solid #e5e7eb; margin-top: 26px; padding-top: 12px;
    font-size: 10px; color: #6b7280; text-align: start;
  }
</style>
</head>
<body>
  <header>
    <div class="subtitle">${esc(t("app_name"))}</div>
    <h1>${esc(t("pdf.document_title"))}</h1>
    <div class="meta">
      <span><strong>${esc(t("pdf.date"))}:</strong> ${esc(dateLabel)}</span>
      <span>${esc(t("pdf.generated_by"))}</span>
    </div>
  </header>

  <section>
    <h2>${esc(t("results.title"))}</h2>
    <span class="badge">${esc(t(result.classificationKey))}</span>

    <div class="summary-grid" style="margin-top: 14px;">
      <div class="card">
        <div class="label">${esc(t("results.part_a_label"))}</div>
        <div class="value">${result.partAScore} / 6</div>
      </div>
      <div class="card">
        <div class="label">${esc(t("results.inattention_label"))}</div>
        <div class="value">${result.inattentionRaw} / ${result.inattentionMax}</div>
        <div class="bar"><div style="width: ${inattentionPct}%"></div></div>
      </div>
      <div class="card">
        <div class="label">${esc(t("results.hyperactivity_label"))}</div>
        <div class="value">${result.hyperactivityRaw} / ${result.hyperactivityMax}</div>
        <div class="bar"><div style="width: ${hyperactivityPct}%"></div></div>
      </div>
    </div>
  </section>

  <section>
    <h2>${esc(t("pdf.part_a_summary"))}</h2>
    <p style="font-size: 11.5px;">${esc(partARows)}</p>
  </section>

  <section>
    <h2>${esc(t("pdf.response_matrix"))}</h2>
    <p style="font-size: 10px; color: #6b7280; margin-bottom: 8px;">${scaleLegend}</p>
    <table>
      <thead>
        <tr>
          <th class="num">${esc(t("pdf.question"))}</th>
          <th>${esc(t("pdf.symptom"))}</th>
          <th style="text-align:center;">${esc(t("pdf.response"))}</th>
        </tr>
      </thead>
      <tbody>${matrixRows}</tbody>
    </table>
  </section>

  <footer>
    <p><strong>${esc(t("pdf.instrument"))}</strong></p>
    <p style="margin-top: 6px;">${esc(t("pdf.footer_citation"))}</p>
  </footer>
</body>
</html>`;
}
