import { Redirect } from "expo-router";

import { getOnboardingCompleted } from "@/lib/storage/app-storage";

export default function Index() {
  if (!getOnboardingCompleted()) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
