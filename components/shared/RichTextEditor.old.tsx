/**
 * Rich Text Editor Component
 * Text editor with formatting toolbar for bold, italic, underline, strikethrough, and color
 */

import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  color: string;
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

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChangeText,
  placeholder = "Write your thoughts, feelings, or experiences...",
  containerStyle,
  minHeight = 200,
}) => {
  const [textStyle, setTextStyle] = useState<TextStyle>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    color: "#FFFFFF",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleStyle = (style: keyof Omit<TextStyle, "color">) => {
    setTextStyle((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  const selectColor = (color: string) => {
    setTextStyle((prev) => ({
      ...prev,
      color,
    }));
    setShowColorPicker(false);
  };

  // Build text style object for TextInput
  const getTextInputStyle = () => {
    const styles: any = {
      color: textStyle.color,
    };

    if (textStyle.bold) {
      styles.fontWeight = "700";
    }

    if (textStyle.italic) {
      styles.fontStyle = "italic";
    }

    if (textStyle.underline && textStyle.strikethrough) {
      styles.textDecorationLine = "underline line-through";
    } else if (textStyle.underline) {
      styles.textDecorationLine = "underline";
    } else if (textStyle.strikethrough) {
      styles.textDecorationLine = "line-through";
    }

    return styles;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Text Input Area */}
      <TextInput
        style={[
          styles.textInput,
          { minHeight },
          getTextInputStyle(),
        ]}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
      />

      {/* Formatting Toolbar */}
      <View style={styles.toolbar}>
        {/* Bold */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            textStyle.bold && styles.toolbarButtonActive,
          ]}
          onPress={() => toggleStyle("bold")}
          activeOpacity={0.7}
        >
          <Text style={[styles.toolbarIcon, textStyle.bold && styles.toolbarIconActive]}>
            B
          </Text>
        </TouchableOpacity>

        {/* Italic */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            textStyle.italic && styles.toolbarButtonActive,
          ]}
          onPress={() => toggleStyle("italic")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              styles.italicIcon,
              textStyle.italic && styles.toolbarIconActive,
            ]}
          >
            I
          </Text>
        </TouchableOpacity>

        {/* Underline */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            textStyle.underline && styles.toolbarButtonActive,
          ]}
          onPress={() => toggleStyle("underline")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              styles.underlineIcon,
              textStyle.underline && styles.toolbarIconActive,
            ]}
          >
            U
          </Text>
        </TouchableOpacity>

        {/* Strikethrough */}
        <TouchableOpacity
          style={[
            styles.toolbarButton,
            textStyle.strikethrough && styles.toolbarButtonActive,
          ]}
          onPress={() => toggleStyle("strikethrough")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toolbarIcon,
              styles.strikethroughIcon,
              textStyle.strikethrough && styles.toolbarIconActive,
            ]}
          >
            S
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
            <View style={[styles.colorPreview, { backgroundColor: textStyle.color }]} />
            <Feather
              name="chevron-down"
              size={12}
              color={showColorPicker ? Colors.primary : "#8E8E93"}
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
                      textStyle.color === color.value && styles.colorSwatchSelected,
                    ]}
                  />
                  <Text style={styles.colorLabel}>{color.label}</Text>
                  {textStyle.color === color.value && (
                    <Feather name="check" size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
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
    fontSize: 18,
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
});

export default RichTextEditor;
