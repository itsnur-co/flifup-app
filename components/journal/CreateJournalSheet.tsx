/**
 * Create Journal Sheet Component
 * Bottom sheet for creating/editing journal entries
 * Matches Habit and Task bottom sheet design
 */

import {
  ArrowDropdownIcon,
  PrivateIcon,
  Reaction1Icon,
  Reaction2Icon,
  Reaction3Icon,
  Reaction4Icon,
  Reaction5Icon,
} from "@/components/icons/JournalIcons";
import {
  AlignLeftIcon,
  DotIcon,
  PriceTagLineIcon,
} from "@/components/icons/TaskIcons";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import {
  DEFAULT_JOURNAL_FORM,
  Journal,
  JournalCategory,
  JournalFormState,
  MOOD_OPTIONS,
  MoodType,
  VISIBILITY_OPTIONS,
} from "@/types/journal";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateJournalSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: JournalFormState) => void;
  categories: JournalCategory[];
  journal?: Journal | null;
  onOpenCategorySheet?: () => void;
}

// Helper function to get reaction icon component
const getReactionIcon = (emoji: string) => {
  const iconMap = {
    reaction1: Reaction1Icon,
    reaction2: Reaction2Icon,
    reaction3: Reaction3Icon,
    reaction4: Reaction4Icon,
    reaction5: Reaction5Icon,
  };
  return iconMap[emoji as keyof typeof iconMap];
};

export const CreateJournalSheet: React.FC<CreateJournalSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  categories,
  journal,
  onOpenCategorySheet,
}) => {
  const insets = useSafeAreaInsets();
  const [formState, setFormState] =
    useState<JournalFormState>(DEFAULT_JOURNAL_FORM);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  // Reset form when modal opens/closes or journal changes
  useEffect(() => {
    if (visible) {
      if (journal) {
        // Edit mode - populate form with journal data
        setFormState({
          title: journal.title,
          description: journal.description || "",
          categoryId: journal.categoryId || null,
          mood: journal.mood || null,
          visibility: journal.visibility,
        });
      } else {
        // Create mode - reset form
        setFormState(DEFAULT_JOURNAL_FORM);
      }
    }
  }, [visible, journal]);

  const handleSubmit = () => {
    if (!formState.title.trim()) return;
    onSubmit(formState);
    setFormState(DEFAULT_JOURNAL_FORM);
    onClose();
  };

  const handleClose = () => {
    setFormState(DEFAULT_JOURNAL_FORM);
    onClose();
  };

  const handleMoodSelect = (mood: MoodType) => {
    setFormState((prev) => ({
      ...prev,
      mood: prev.mood === mood ? null : mood,
    }));
  };

  const selectedCategory = categories.find(
    (c) => c.id === formState.categoryId
  );
  const selectedVisibility = VISIBILITY_OPTIONS.find(
    (v) => v.value === formState.visibility
  );

  const isEditing = !!journal;
  const canSubmit = formState.title.trim().length > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      snapPoints={[0.95, 1]}
      initialSnapIndex={1}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit Journal" : "Create Journal"}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.createButton,
                !canSubmit && styles.createButtonDisabled,
              ]}
            >
              {isEditing ? "Save" : "Create"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <TouchableOpacity style={styles.inputRow} activeOpacity={1}>
            <DotIcon size={24} color={Colors.primary} />
            <TextInput
              style={styles.titleInput}
              placeholder="Add Title"
              placeholderTextColor="#6B7280"
              value={formState.title}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, title: text }))
              }
            />
          </TouchableOpacity>

          {/* Description Input */}
          <TouchableOpacity style={styles.inputRow} activeOpacity={1}>
            <AlignLeftIcon size={24} color={Colors.primary} />
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              placeholderTextColor="#6B7280"
              value={formState.description}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, description: text }))
              }
              multiline
            />
          </TouchableOpacity>

          {/* Category Selector */}
          <TouchableOpacity
            style={styles.inputRow}
            onPress={onOpenCategorySheet}
            activeOpacity={0.7}
          >
            <PriceTagLineIcon size={22} color={Colors.primary} />
            <Text
              style={[
                styles.formLabel,
                selectedCategory && styles.formLabelSelected,
              ]}
            >
              {selectedCategory?.name || "Add category"}
            </Text>
          </TouchableOpacity>

          {/* Visibility Selector */}
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
            activeOpacity={0.7}
          >
            <PrivateIcon size={22} />
            <Text style={styles.formLabel}>
              {selectedVisibility?.label || "Only me"}
            </Text>
            <ArrowDropdownIcon size={26} />
          </TouchableOpacity>

          {/* Visibility Dropdown */}
          {showVisibilityDropdown && (
            <View style={styles.dropdownContainer}>
              {VISIBILITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    formState.visibility === option.value &&
                      styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setFormState((prev) => ({
                      ...prev,
                      visibility: option.value,
                    }));
                    setShowVisibilityDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Mood Section */}
          <View style={styles.moodSection}>
            <Text style={styles.moodLabel}>Add your feelings</Text>
            <View style={styles.moodContainer}>
              {MOOD_OPTIONS.map((option) => {
                const ReactionIcon = getReactionIcon(option.emoji);
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.moodButton,
                      formState.mood === option.value &&
                        styles.moodButtonSelected,
                    ]}
                    onPress={() => handleMoodSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    {ReactionIcon && <ReactionIcon size={48} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  createButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  createButtonDisabled: {
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    padding: 0,
    minHeight: 24,
  },
  formLabel: {
    flex: 1,
    fontSize: 15,
    color: "#8E8E93",
  },
  formLabelSelected: {
    color: "#FFFFFF",
  },
  dropdownContainer: {
    marginLeft: 56,
    marginRight: 20,
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemSelected: {
    backgroundColor: "#3A3A3C",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  moodSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
  },
  moodButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  moodButtonSelected: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default CreateJournalSheet;
