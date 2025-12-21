/**
 * Reusable Screen Header Component
 * Implements consistent header design across all screens
 * Following composition pattern for flexibility
 */

import { Fonts } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightAction?: ReactNode;
    children?: ReactNode;
    style?: ViewStyle;
    hideBackButton?: boolean;
    backgroundColor?: string;
    useGlassmorphism?: boolean;
}


export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    subtitle,
    onBack,
    rightAction,
    children,
    style,
    hideBackButton = false,
    backgroundColor = "#8b5cf6",
    useGlassmorphism = false,
}) => {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const headerContent = (
        <View style={styles.headerRow}>
            {!hideBackButton && (
                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
            )}

            <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && (
                    <Text style={styles.headerSubtitle}>{subtitle}</Text>
                )}
            </View>

            {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
        </View>
    );

    if (useGlassmorphism) {
        return (
            <View style={[styles.header, styles.glassmorphismContainer, style]}>
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </BlurView>
                ) : (
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                )}
                {headerContent}
            </View>
        );
    }

    return (
        <View style={[styles.header, { backgroundColor }, style]}>
            {headerContent}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#8b5cf6",
        paddingTop: 32,
        paddingBottom: 14,
        paddingHorizontal: 14,
    },
    glassmorphismContainer: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 0,
        zIndex: 1,
    },
    headerTextContainer: {
        alignItems: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        fontFamily: Fonts.rounded,
    },
    headerSubtitle: {
        color: "#EEE1FF",
        fontSize: 13,
        marginTop: 2,
        fontFamily: Fonts.rounded,
    },
    rightAction: {
        flexShrink: 0,
    },
    childrenContainer: {
        marginTop: 16,
    },
});
