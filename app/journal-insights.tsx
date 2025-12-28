import { JournalInsightsScreen } from "@/components/journal";
import { useRouter } from "expo-router";

export default function JournalInsightsTab() {
  const router = useRouter();

  return (
    <JournalInsightsScreen
      onBack={() => router.back()}
      onCreateJournal={() => router.push("/journal")}
    />
  );
}
