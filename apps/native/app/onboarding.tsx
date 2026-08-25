import { Container } from "@/components/container";
import { Button } from "heroui-native";
import { Text } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();
  return (
    <Container className="px-4">
      <Text className="text-foreground text-2xl font-semibold">Onboarding</Text>
      <Button onPress={() => router.replace("/(tabs)")}>Continue</Button>
    </Container>
  );
}
