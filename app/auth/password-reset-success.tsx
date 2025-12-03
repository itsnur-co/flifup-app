import { PrimaryButton } from '@/components/buttons';
import { Colors } from '@/constants/colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/**
 * Password Reset Success Screen
 * Displays confirmation after successful password reset
 */
export default function PasswordResetSuccessScreen() {
    const router = useRouter();

    /**
     * Handles navigation to login screen
     */
    const handleLogin = () => {
        // Reset navigation stack and go to login
        router.replace('/auth/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.dark} />

            <View style={styles.content}>


                <Image
                    source={require("@/assets/visuals /succssfully-reset-password-visual.png")}
                    style={styles.visualContainer}
                    contentFit="contain"
                />


                {/* Success Message */}
                <View
                    style={styles.messageContainer}
                >
                    <Text style={styles.title}>Password Changed</Text>
                    <Text style={styles.description}>
                        Password changed succesfully, you can login again with new password
                    </Text>
                </View>

                {/* Login Button */}
                <View

                    style={styles.buttonContainer}
                >
                    <PrimaryButton
                        title="Login"
                        onPress={handleLogin}
                        style={styles.loginButton}
                        textStyle={styles.loginButtonText}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.dark,
    },
    content: {
        flex: 1,
        paddingHorizontal: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visualContainer: {
        position: 'relative',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
    },
    starDecoration: {
        position: 'absolute',
        top: -10,
        left: 0,
        zIndex: 10,
    },
    starIcon: {
        fontSize: 24,
    },
    dotDecorationLeft: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 10,
    },
    dotDecorationRight: {
        position: 'absolute',
        bottom: 30,
        right: -10,
        zIndex: 10,
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ADE80',
    },
    greenDotOutline: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#4ADE80',
        backgroundColor: 'transparent',
    },
    gradientCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    innerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.ui.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.ui.white,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: Colors.ui.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 8,
    },
    loginButton: {
        backgroundColor: Colors.primary,
    },
    loginButtonText: {
        color: Colors.ui.white,
    },
});
