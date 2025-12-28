import { JournalListScreen } from "@/components/journal";
import { useRouter } from "expo-router";

export default function JournalTab() {
  const router = useRouter();

  return (
    <JournalListScreen
      onBack={() => router.back()}
      onNavigateToInsights={() => router.push("/journal-insights")}
    />
  );
}
