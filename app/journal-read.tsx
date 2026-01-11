/**
 * Journal Read Screen Route
 * Full-screen view for reading journal entries
 */

import { JournalReadScreen } from "@/components/journal";
import { Journal } from "@/types/journal";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function JournalReadPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse journal data from params
  let journal: Journal;
  try {
    journal = JSON.parse(params.journalData as string);
  } catch (error) {
    console.error("Failed to parse journal data:", error);
    // Fallback or redirect back
    router.back();
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return <JournalReadScreen journal={journal} onBack={handleBack} />;
}
