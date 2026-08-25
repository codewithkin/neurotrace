import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — NeuroTrace",
  description:
    "How NeuroTrace handles your data. Short version: your assessment answers, scores and daily logs stay on your device.",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="25 August 2026">
      <Section title="The short version">
        <p>
          NeuroTrace has no accounts, no sign-up and no server storing your
          content. Your assessment answers, scores, daily check-ins and settings
          stay in local storage on your own device. We can&apos;t read them, we
          don&apos;t back them up, and we never sell them. If you uninstall the
          app, they&apos;re gone.
        </p>
        <p>
          The rest of this page explains the limited exceptions — the anonymous
          technical services the app uses to stay healthy and up to date.
        </p>
      </Section>

      <Section title="Who this policy is from">
        <p>
          NeuroTrace is built and owned by Kin Leon Zinzombe, who is responsible
          for this policy and for how the app handles data.
        </p>
      </Section>

      <Section title="What stays on your device">
        <p>
          The following is written to your device&apos;s own local storage and
          never transmitted to us or anyone else:
        </p>
        <List
          items={[
            "Your answers to the 18-question ASRS v1.1 self-screening",
            "Your calculated scores and screening history",
            "The optional name you choose to print on your PDF report",
            "Your daily check-ins: focus level, brain fog, executive friction, mood and medication flag",
            "App preferences such as language, answer pace and reminder settings",
            "The PDF reports you generate (stored only when you save or share them)",
          ]}
        />
        <p>
          There is no account to sign into and no sync. Nothing in this list
          leaves the device, which also means it does not move with you if you
          switch phones.
        </p>
      </Section>

      <Section title="What leaves your device">
        <p>
          Very little, and none of it identifies you:
        </p>

        <p className="text-foreground">Expo Updates (over-the-air updates)</p>
        <p>
          The app can download bug fixes without a full store update. To check
          whether an update applies to your device, it sends your app version
          and platform to Expo&apos;s servers.
        </p>

        <p className="text-foreground">Crash and performance diagnostics</p>
        <p>
          We use Expo&apos;s built-in diagnostics to understand basic app health
          — how many people open the app, which app version they&apos;re on, and
          whether it&apos;s crashing. This data is anonymous and aggregated. It
          includes technical details like device model, operating system version
          and app version. It does not include your name, email, assessment
          answers, scores or daily logs.
        </p>

        <p className="text-foreground">Sharing and printing</p>
        <p>
          A PDF report only leaves your device when you explicitly share it
          (for example via WhatsApp or email), print it, or save it to your
          device&apos;s files. The app does not transmit it on its own.
        </p>
      </Section>

      <Section title="What we never do">
        <List
          items={[
            "We don't require an account, email address or phone number",
            "We don't sell or rent personal information to anyone",
            "We don't track you across other apps or websites",
            "We don't upload your assessment answers, scores or daily logs anywhere",
            "We don't access your contacts, camera, photos, microphone or location",
          ]}
        />
      </Section>

      <Section title="Permissions the app requests">
        <p>
          <span className="text-foreground">Notifications.</span> Used for one
          thing: an optional, locally scheduled reminder suggesting a monthly
          re-assessment. The notification is created on your device — there is
          no push server — and declining the permission doesn&apos;t limit any
          other feature.
        </p>
      </Section>

      <Section title="Deleting your data">
        <p>
          Because everything lives on your device, you are always in full
          control. Settings includes a &quot;Clear All Data&quot; action that
          permanently removes every assessment, score, log and preference, or
          you can simply uninstall the app. There is no server-side copy for us
          to delete and no account to close.
        </p>
      </Section>

      <Section title="Children">
        <p>
          NeuroTrace is intended for adults and is not directed at children
          under 13. We do not knowingly collect personal information from
          anyone — including children — because the app collects no personal
          information at all.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we ever start handling data differently, we&apos;ll update this
          page and change the effective date at the top. Material changes will
          also be noted in the app or its store listing.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-primary underline">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
