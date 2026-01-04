import HabitScreen from "@/components/habit/HabitListScreen";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function HabitTab() {
  const router = useRouter();
  const params = useLocalSearchParams<{ goalId?: string; mode?: string }>();

  return (
    <HabitScreen
      onBack={() => router.back()}
      onNavigateToProgress={() => router.push("/habit-progress")}
      goalId={params.goalId}
      mode={params.mode}
    />
  );
}
