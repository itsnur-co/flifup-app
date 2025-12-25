import HabitProgressScreen from "@/components/habit/HabitProgressScreen";
import { useRouter } from "expo-router";

export default function HabitProgressTab() {
  const router = useRouter();

  return (
    <HabitProgressScreen
      onBack={() => router.back()}
      onCreateHabit={() => router.back()}
    />
  );
}
