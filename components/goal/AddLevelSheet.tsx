/**
 * Add Level Bottom Sheet Component
 * Multi-select sheet for selecting level types (Level 1-4)
 * Used in goal creation to pre-define available level types
 */

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Colors } from "@/constants/colors";
import { LEVEL_OPTIONS, type LevelOption } from "@/types/goal";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface AddLevelSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectLevels: (levels: string[]) => void;
  selectedLevels?: string[];
}

export function AddLevelSheet({
  visible,
  onClose,
  onSelectLevels,
  selectedLevels = [],
}: AddLevelSheetProps) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>(selectedLevels);
  const [customLevelName, setCustomLevelName] = useState("");

  const handleToggleLevel = (levelName: string) => {
    setSelected((prev) => {
      if (prev.includes(levelName)) {
        return prev.filter((l) => l !== levelName);
      } else {
        return [...prev, levelName];
      }
    });
  };

  const handleAdd = () => {
    onSelectLevels(selected);
    setCustomLevelName("");
    onClose();
  };

  const handleClose = () => {
    setCustomLevelName("");
    // Reset to initial selected levels on close without adding
    setSelected(selectedLevels);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      snapPoints={[0.6]}
      initialSnapIndex={0}
      backgroundColor="#1C1C1E"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Label</Text>
          <TouchableOpacity onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Custom Level Name Input (for future expansion) */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Level Name"
              placeholderTextColor="#6B7280"
              value={customLevelName}
              onChangeText={setCustomLevelName}
            />
          </View>

          {/* Choose Category Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Category</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{LEVEL_OPTIONS.length}</Text>
            </View>
          </View>

          {/* Level Options List */}
          <View style={styles.levelList}>
            {LEVEL_OPTIONS.map((level) => {
              const isSelected = selected.includes(level.name);
              return (
                <TouchableOpacity
                  key={level.id}
                  style={styles.levelItem}
                  onPress={() => handleToggleLevel(level.name)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Feather name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.levelLabel}>{level.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Count Footer */}
          {selected.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {selected.length} {selected.length === 1 ? "level" : "levels"}{" "}
                selected
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3C",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginRight: 8,
  },
  countBadge: {
    backgroundColor: "#3A3A3C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  levelList: {
    gap: 12,
  },
  levelItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#3A3A3C",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
});
