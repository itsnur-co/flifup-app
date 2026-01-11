/**
 * Rich Text Editor Component V2
 * Advanced text editor with selection-based formatting and list support
 */

import { Colors } from "@/constants/colors";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface TextFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
}

interface TextSegment {
  text: string;
  format: TextFormat;
}

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  minHeight?: number;
}

const COLOR_OPTIONS = [
  { label: "Default", value: "#FFFFFF" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F59E0B" },
  { label: "Yellow", value: "#EAB308" },
  { label: "Green", value: "#10B981" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Purple", value: Colors.primary },
  { label: "Pink", value: "#EC4899" },
];

type ListType = "none" | "bullet" | "numbered";

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChangeText,
  placeholder = "Write your thoughts, feelings, or experiences...",
  containerStyle,
  minHeight = 200,
}) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [currentFormat, setCurrentFormat] = useState<TextFormat>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    color: "#FFFFFF",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [listType, setListType] = useState<ListType>("none");
  const textInputRef = useRef<TextInput>(null);

  const handleSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    const { start, end } = e.nativeEvent.selection;
    setSelection({ start, end });
  };

  const applyFormatToSelection = (format: keyof Omit<TextFormat, "color">) => {
    const { start, end } = selection;

    // If no text is selected, just toggle the format state for future typing
    if (start === end) {
      setCurrentFormat((prev) => ({
        ...prev,
        [format]: !prev[format],
      }));
      return;
    }

    // Get the selected text
    const beforeSelection = value.substring(0, start);
    const selectedText = value.substring(start, end);
    const afterSelection = value.substring(end);

    // Apply formatting markers based on the format type
    let formattedText = selectedText;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
    }

    // Combine and update text
    const newText = beforeSelection + formattedText + afterSelection;
    onChangeText(newText);

    // Update selection to the end of formatted text
    const newCursorPos = start + formattedText.length;
    setTimeout(() => {
      setSelection({ start: newCursorPos, end: newCursorPos });
    }, 10);
  };

  const selectColor = (color: string) => {
    const { start, end } = selection;

    // If no text is selected, just set the color for future typing
    if (start === end) {
      setCurrentFormat((prev) => ({
        ...prev,
        color,
      }));
      setShowColorPicker(false);
      return;
    }

    // Get the selected text
    const beforeSelection = value.substring(0, start);
    const selectedText = value.substring(start, end);
    const afterSelection = value.substring(end);

    // Apply color marker
    const colorCode = color.replace('#', '');
    const formattedText = `[color:${colorCode}]${selectedText}[/color]`;

    // Combine and update text
    const newText = beforeSelection + formattedText + afterSelection;
    onChangeText(newText);

    // Update selection to the end of formatted text
    const newCursorPos = start + formattedText.length;
    setTimeout(() => {
      setSelection({ start: newCursorPos, end: newCursorPos });
    }, 10);

    setShowColorPicker(false);
  };

  const toggleList = (type: "bullet" | "numbered") => {
    if (listType === type) {
      setListType("none");
    } else {
      setListType(type);
    }
  };

  const insertList = () => {
    if (listType === "none") return;

    const lines = value.split("\n");
    const currentLineIndex = value.substring(0, selection.start).split("\n").length - 1;
    const currentLine = lines[currentLineIndex];

    // Check if line already has a list marker
    const bulletRegex = /^[•●○]\s/;
    const numberedRegex = /^\d+\.\s/;

    if (listType === "bullet") {
      if (!bulletRegex.test(currentLine)) {
        lines[currentLineIndex] = "• " + currentLine.replace(bulletRegex, "").replace(numberedRegex, "");
      }
    } else if (listType === "numbered") {
      if (!numberedRegex.test(currentLine)) {
        const lineNumber = lines.slice(0, currentLineIndex).filter((l) => /^\d+\.\s/.test(l)).length + 1;
        lines[currentLineIndex] = `${lineNumber}. ` + currentLine.replace(bulletRegex, "").replace(numberedRegex, "");
      }
    }

    const newText = lines.join("\n");
    onChangeText(newText);
  };

  const handleTextChange = (text: string) => {
    // Auto-continue lists on new line
    if (text.length > value.length && text.endsWith("\n") && listType !== "none") {
      const lines = text.split("\n");
      const lastLineIndex = lines.length - 2;
      const lastLine = lines[lastLineIndex];

      if (listType === "bullet" && /^[•●○]\s/.test(lastLine)) {
        const newText = text + "• ";
        onChangeText(newText);
        return;
      } else if (listType === "numbered" && /^\d+\.\s/.test(lastLine)) {
        const currentNumber = parseInt(lastLine.match(/^\d+/)?.[0] || "0");
        const newText = text + `${currentNumber + 1}. `;
        onChangeText(newText);
        return;
      }
    }

    onChangeText(text);
  };

  // Build text style for current format
  const getTextStyle = () => {
    const styles: any = {
      color: currentFormat.color || "#FFFFFF",
    };

    if (currentFormat.bold) {
      styles.fontWeight = "700";
    }

    if (currentFormat.italic) {
      styles.fontStyle = "italic";
    }

    const decorations: string[] = [];
    if (currentFormat.underline) decorations.push("underline");
    if (currentFormat.strikethrough) decorations.push("line-through");

    if (decorations.length > 0) {
      styles.textDecorationLine = decorations.join(" ");
    }

    return styles;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Text Input Area */}
      <TextInput
        ref={textInputRef}
        style={[styles.textInput, { minHeight }, getTextStyle()]}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={handleTextChange}
        onSelectionChange={handleSelectionChange}
        multiline
        textAlignVertical="top"
        selection={selection}
      />

      {/* Formatting Toolbar */}
      <View style={styles.toolbar}>
        {/* Bold */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            currentFormat.bold && styles.toolbarButtonActive,
          ]}
          onPress={() => applyFormatToSelection("bold")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              currentFormat.bold && styles.toolbarIconActive,
            ]}
          >
            B
          </Text>
        </TouchableOpacity>

        {/* Italic */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            currentFormat.italic && styles.toolbarButtonActive,
          ]}
          onPress={() => applyFormatToSelection("italic")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              styles.italicIcon,
              currentFormat.italic && styles.toolbarIconActive,
            ]}
          >
            I
          </Text>
        </TouchableOpacity>

        {/* Underline */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            currentFormat.underline && styles.toolbarButtonActive,
          ]}
          onPress={() => applyFormatToSelection("underline")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              styles.underlineIcon,
              currentFormat.underline && styles.toolbarIconActive,
            ]}
          >
            U
          </Text>
        </TouchableOpacity>

        {/* Strikethrough */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            currentFormat.strikethrough && styles.toolbarButtonActive,
          ]}
          onPress={() => applyFormatToSelection("strikethrough")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              styles.strikethroughIcon,
              currentFormat.strikethrough && styles.toolbarIconActive,
            ]}
          >
            S
          </Text>
        </TouchableOpacity>

        {/* Bullet List */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            listType === "bullet" && styles.toolbarButtonActive,
          ]}
          onPress={() => {
            toggleList("bullet");
            setTimeout(insertList, 50);
          }}
          activeOpacity={0.7}
        >
          <Feather
            name="list"
            size={20}
            color={listType === "bullet" ? "#FFFFFF" : "#8E8E93"}
          />
        </TouchableOpacity>

        {/* Numbered List */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            listType === "numbered" && styles.toolbarButtonActive,
          ]}
          onPress={() => {
            toggleList("numbered");
            setTimeout(insertList, 50);
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              listType === "numbered" && styles.toolbarIconActive,
            ]}
          >
            123
          </Text>
        </TouchableOpacity>

        {/* Color Picker */}
        <View style={styles.colorPickerContainer}>
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              styles.colorButton,
              showColorPicker && styles.toolbarButtonActive,
            ]}
            onPress={() => setShowColorPicker(!showColorPicker)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: currentFormat.color || "#FFFFFF" },
              ]}
            />
            <Feather
              name="chevron-down"
              size={12}
              color={showColorPicker ? "#FFFFFF" : "#8E8E93"}
            />
          </TouchableOpacity>

          {/* Color Dropdown */}
          {showColorPicker && (
            <View style={styles.colorDropdown}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={styles.colorOption}
                  onPress={() => selectColor(color.value)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color.value },
                      currentFormat.color === color.value &&
                        styles.colorSwatchSelected,
                    ]}
                  />
                  <Text style={styles.colorLabel}>{color.label}</Text>
                  {currentFormat.color === color.value && (
                    <Feather name="check" size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Formatting Info */}
      {(selection.start !== selection.end || listType !== "none") && (
        <View style={styles.infoBar}>
          {selection.start !== selection.end && (
            <Text style={styles.infoText}>
              {selection.end - selection.start} characters selected
            </Text>
          )}
          {listType !== "none" && (
            <Text style={styles.infoText}>
              {listType === "bullet" ? "• Bullet List" : "1. Numbered List"}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  textInput: {
    fontSize: 15,
    color: "#FFFFFF",
    padding: 16,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    marginBottom: 12,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 4,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarButtonActive: {
    backgroundColor: Colors.primary,
  },
  toolbarIcon: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  toolbarIconActive: {
    color: "#FFFFFF",
  },
  italicIcon: {
    fontStyle: "italic",
  },
  underlineIcon: {
    textDecorationLine: "underline",
  },
  strikethroughIcon: {
    textDecorationLine: "line-through",
  },
  colorPickerContainer: {
    position: "relative",
  },
  colorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  colorDropdown: {
    position: "absolute",
    bottom: 48,
    right: 0,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 8,
    zIndex: 1000,
  },
  colorOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  colorSwatchSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  colorLabel: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
  },
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#8E8E93",
  },
});

export default RichTextEditor;
