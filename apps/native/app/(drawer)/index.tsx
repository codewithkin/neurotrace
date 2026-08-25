import { Button, Separator, Surface } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";

export default function Home() {
  return (
    <Container className="px-4 pb-4">
      <View className="py-6 mb-5">
        <Text className="text-3xl font-semibold text-foreground tracking-tight">
          NeuroTrace
        </Text>
        <Text className="text-muted text-sm mt-1">ADHD Symptom Log</Text>
      </View>

      <Surface variant="secondary" className="p-4 rounded-xl">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground font-medium">Assessment</Text>
        </View>
        <Separator className="mb-3" />
        <Button className="w-full">Start ASRS v1.1 Screener</Button>
      </Surface>
    </Container>
  );
}
