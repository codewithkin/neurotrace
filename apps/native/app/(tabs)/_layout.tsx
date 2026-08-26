import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNTColors } from "@/lib/theme";

/*
 * Tab bar from the design's shared footer (e.g. "Light 12 Daily check-in"):
 * a 1px top rule, 12px above the icons and 32px below the labels, 23px
 * icons and 10px/600 labels, active in violet and inactive in muted.
 */
const TABS = [
  { name: "index", labelKey: "tabs.checkin", icon: "home", outline: "home-outline" },
  { name: "assess", labelKey: "tabs.assess", icon: "list", outline: "list-outline" },
  { name: "history", labelKey: "tabs.history", icon: "stats-chart", outline: "stats-chart-outline" },
  { name: "settings", labelKey: "tabs.settings", icon: "settings", outline: "settings-outline" },
] as const;

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const nt = useNTColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: nt.pri,
        tabBarInactiveTintColor: nt.muted,
        tabBarStyle: {
          backgroundColor: nt.bg,
          borderTopColor: nt.border,
          borderTopWidth: 1,
          paddingTop: 12,
          height: 12 + 23 + 4 + 14 + Math.max(insets.bottom, 32),
        },
        tabBarItemStyle: { gap: 4 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.labelKey),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? tab.icon : tab.outline} size={23} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
