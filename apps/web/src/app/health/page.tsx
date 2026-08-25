import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Health Statement — NeuroTrace",
  description:
    "NeuroTrace's health disclaimer and clinical sources: an educational self-screening based on the WHO Adult ADHD Self-Report Scale (ASRS v1.1).",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function HealthStatement() {
  return (
    <LegalPage title="Health Statement" effectiveDate="25 August 2026">
      <Section title="Purpose of this statement">
        <p>
          This page explains, in plain terms, the health-related nature of
          NeuroTrace, what its results mean and do not mean, and the clinical
          sources it is built on. It supplements our Privacy Policy and Terms
          of Service.
        </p>
      </Section>

      <Section title="Not a medical device; not a diagnosis">
        <p>
          NeuroTrace is an educational self-screening checklist and symptom
          log. It is <strong>not</strong>:
        </p>
        <List
          items={[
            "a medical device, and it is not registered, certified or approved as one by any regulator (including under EU MDR, US FDA or UK MDR frameworks)",
            "capable of diagnosing ADHD or any other condition",
            "a clinical evaluation, treatment, therapy or prescription",
            "a substitute for professional medical advice, diagnosis or care",
          ]}
        />
        <p>
          The app deliberately avoids diagnostic language. Its output is
          described as trait consistency — how your self-reported frequency of
          experiences compares with thresholds in a published screening
          instrument — never as a diagnosis.
        </p>
      </Section>

      <Section title="How to interpret your results">
        <p>
          A screening score can only suggest whether your experiences are
          consistent with traits worth discussing with a professional. Many
          conditions and everyday circumstances (stress, sleep deprivation,
          anxiety and more) can produce similar experiences. Only a qualified
          healthcare professional — such as a psychiatrist, psychologist or
          physician — can properly assess whether you have ADHD.
        </p>
        <p>
          If your results concern you, print the app&apos;s summary report and
          bring it to a licensed professional. That report is intended as a
          conversation aid for a clinical visit, not as evidence of any
          condition.
        </p>
      </Section>

      <Section title="Clinical source: WHO ASRS v1.1">
        <p>
          The screening questionnaire used in NeuroTrace is a faithful digital
          implementation of the World Health Organization Composite
          International Diagnostic Interview&apos;s{" "}
          <strong>
            Adult ADHD Self-Report Scale Symptom Checklist (ASRS v1.1)
          </strong>
          :
        </p>
        <List
          items={[
            <>
              Kessler RC, Adler L, Ames M, et al.{" "}
              <em>
                The World Health Organization Adult ADHD Self-Report Scale
                (ASRS): a short screening scale for use in the general
                population.
              </em>{" "}
              Psychological Medicine. 2005;35(2):245–256.
            </>,
            <>
              Adler LA, Kessler RC, Spencer T.{" "}
              <em>Adult ADHD Self-Report Scale-v1.1 (ASRS-v1.1) Symptom Checklist</em>{" "}
              — instructions and six-question screener, World Health
              Organization.
            </>,
          ]}
        />
        <p>
          Part A scoring follows the published threshold rule: items are
          counted as &quot;screening positive&quot; when answered at or above
          their designated frequency, with four or more of six shaded boxes
          indicating symptoms consistent with Adult ADHD and the need for
          further evaluation by a clinician. Subscale breakdowns group items
          into attention and activity/impulsivity domains for discussion
          purposes only.
        </p>
        <p>
          The World Health Organization is not affiliated with, and does not
          sponsor or endorse, NeuroTrace.
        </p>
      </Section>

      <Section title="Data handling in a health context">
        <p>
          Because the app deals with sensitive self-reflections about your own
          wellbeing, we designed it so that none of that content ever leaves
          your device: no accounts, no analytics on your answers, no cloud
          storage. See our Privacy Policy for the complete picture.
        </p>
      </Section>

      <Section title="No emergency use">
        <p>
          NeuroTrace must not be relied upon in emergencies. If you are in
          crisis, contact your local emergency number or an urgent care or
          crisis service immediately.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this statement or the sources we cite? Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-primary underline">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
