import { JournalListScreen } from "@/components/journal";
import { useRouter } from "expo-router";
import { Journal } from "@/types/journal";

export default function JournalTab() {
  const router = useRouter();

  const handleJournalPress = (journal: Journal) => {
    router.push({
      pathname: "/journal-read",
      params: {
        journalId: journal.id,
        journalData: JSON.stringify(journal),
      },
    });
  };

  return (
    <JournalListScreen
      onBack={() => router.back()}
      onNavigateToInsights={() => router.push("/journal-insights")}
      onJournalPress={handleJournalPress}
    />
  );
}
