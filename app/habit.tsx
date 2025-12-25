import HabitScreen from "@/components/habit/HabitListScreen";
import { useRouter } from "expo-router";

export default function HabitTab() {
  const router = useRouter();

  return (
    <HabitScreen
      onBack={() => router.back()}
      onNavigateToProgress={() => router.push("/habit-progress")}
    />
  );
}
