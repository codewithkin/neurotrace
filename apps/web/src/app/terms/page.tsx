import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — NeuroTrace",
  description:
    "The terms that apply to your use of the NeuroTrace app: educational purpose, no medical advice, no warranty.",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="25 August 2026">
      <Section title="Accepting these terms">
        <p>
          By downloading or using NeuroTrace you agree to these terms. If you
          don&apos;t agree, please don&apos;t use the app. NeuroTrace is
          provided by Kin Leon Zinzombe (&quot;we&quot;, &quot;us&quot;).
        </p>
      </Section>

      <Section title="What NeuroTrace is">
        <p>
          NeuroTrace is an educational self-assessment and symptom-tracking
          utility for adults. It implements a digital version of the World
          Health Organization&apos;s Adult ADHD Self-Report Scale (ASRS v1.1),
          organises your answers into a summary report, and lets you log daily
          focus-related notes.
        </p>
      </Section>

      <Section title="What NeuroTrace is not">
        <List
          items={[
            "It is not a medical diagnostic test and does not diagnose any condition",
            "It is not a clinical evaluation, therapy or treatment of any kind",
            "It is not a substitute for professional medical advice, diagnosis or care",
            "It is not a medical device and is not registered or approved as one anywhere",
          ]}
        />
        <p>
          Screening scores are informational only. Only a qualified healthcare
          professional can evaluate whether your experiences are consistent
          with ADHD or anything else.
        </p>
      </Section>

      <Section title="No emergency service">
        <p>
          The app cannot help in a crisis and must never be used in place of
          emergency care. If you are in crisis or may be a danger to yourself
          or others, contact your local emergency number or a crisis hotline
          immediately.
        </p>
      </Section>

      <Section title="Your data">
        <p>
          All content you create in the app — assessment answers, scores,
          reports, daily logs and preferences — is stored locally on your
          device under your control. You are responsible for keeping backups if
          the data matters to you; uninstalling the app deletes it permanently.
          Our Privacy Policy explains this in full.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>
          You agree to use the app only for its intended, lawful purpose: your
          own personal, non-clinical self-reflection. You agree not to misuse
          the app, attempt to disrupt its operation, or present its output as a
          clinical or diagnostic result about yourself or anyone else.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          The NeuroTrace name, design and code are owned by us and protected by
          copyright. The ASRS v1.1 screening instrument is reproduced per the
          World Health Organization&apos;s terms; WHO is not affiliated with,
          and does not endorse, this app.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The app is provided &quot;as is&quot; and &quot;as available&quot;,
          without warranties of any kind, express or implied, including
          merchantability, fitness for a particular purpose and
          non-infringement. We do not warrant that the app will be
          uninterrupted, error-free, or that results shown are accurate or
          complete.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, we are not liable for any
          indirect, incidental, special, consequential or punitive damages, or
          any loss of data, profits or wellbeing arising from your use of — or
          inability to use — the app, even if advised of the possibility of
          such damages. Some jurisdictions do not allow certain limitations, so
          parts of this section may not apply to you.
        </p>
      </Section>

      <Section title="Changes to the app and these terms">
        <p>
          We may update the app and these terms over time. When terms change we
          will update this page and the effective date at the top. Continued
          use after changes take effect means you accept the updated terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-primary underline">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
