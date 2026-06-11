import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FirebaseService from '../services/firebase';

type AuthMode = 'signIn' | 'signUp';

export const LoginScreen = () => {
    const [mode, setMode] =
        useState<AuthMode>('signIn');
    const [identifier, setIdentifier] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isSignIn = mode === 'signIn';

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (isSignIn) {
                await FirebaseService.signInWithPassword(
                    identifier,
                    password,
                );
            } else {
                await FirebaseService.signUpWithPassword({
                    email: identifier,
                    password,
                    username,
                    phoneNumber,
                });
            }
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        try {
            setLoading(true);
            await FirebaseService.sendPasswordReset(
                identifier,
            );

            Alert.alert(
                'Check your email',
                'A password reset link has been sent.',
            );
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await FirebaseService.signInWithGoogle();
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(isSignIn ? 'signUp' : 'signIn');
        setPassword('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Welcome
                    </Text>
                    <Text style={styles.subtitle}>
                        Taking- Note
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType={
                            isSignIn
                                ? 'default'
                                : 'email-address'
                        }
                        placeholder={
                            isSignIn
                                ? 'Username, Email & Phone Number'
                                : 'Email'
                        }
                        placeholderTextColor="#6F6F76"
                        style={styles.input}
                        value={identifier}
                        onChangeText={setIdentifier}
                    />

                    {!isSignIn && (
                        <>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Username"
                                placeholderTextColor="#6F6F76"
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                            />

                            <TextInput
                                keyboardType="phone-pad"
                                placeholder="Phone Number"
                                placeholderTextColor="#6F6F76"
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={
                                    setPhoneNumber
                                }
                            />
                        </>
                    )}

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#6F6F76"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />

                    {isSignIn && (
                        <Pressable
                            disabled={loading}
                            onPress={handlePasswordReset}
                            style={styles.forgotButton}
                        >
                            <Text style={styles.forgotText}>
                                Forgot Password ?
                            </Text>
                        </Pressable>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.85}
                        disabled={loading}
                        style={[
                            styles.primaryButton,
                            loading &&
                                styles.disabledButton,
                        ]}
                        onPress={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text
                                style={
                                    styles.primaryButtonText
                                }
                            >
                                {isSignIn
                                    ? 'Sign in'
                                    : 'Sign up'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>
                            {isSignIn
                                ? 'Or Sign up With'
                                : 'Or Sign in With'}
                        </Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.75}
                        disabled={loading}
                        style={styles.googleButton}
                        onPress={handleGoogleSignIn}
                    >
                        <Text style={styles.googleText}>G</Text>
                    </TouchableOpacity>

                    <Pressable
                        disabled={loading}
                        onPress={switchMode}
                        style={styles.switchButton}
                    >
                        <Text style={styles.switchText}>
                            {isSignIn
                                ? 'Create an account'
                                : 'Already have an account? Sign in'}
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const showError = (error: unknown) => {
    const message =
        error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.';

    Alert.alert('Authentication failed', message);
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    container: {
        flex: 1,
        paddingHorizontal: 28,
        backgroundColor: '#FFFFFF',
    },

    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 64,
    },

    title: {
        color: '#33333A',
        fontSize: 30,
        fontWeight: '800',
    },

    subtitle: {
        marginTop: 14,
        color: '#33333A',
        fontSize: 18,
        fontWeight: '500',
    },

    form: {
        width: '100%',
    },

    input: {
        width: '100%',
        minHeight: 58,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#F1F1F3',
        color: '#222228',
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 18,
    },

    forgotButton: {
        alignSelf: 'flex-end',
        paddingVertical: 16,
    },

    forgotText: {
        color: '#222228',
        fontSize: 15,
        fontWeight: '700',
    },

    primaryButton: {
        width: '100%',
        minHeight: 60,
        marginTop: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E278E9',
    },

    disabledButton: {
        opacity: 0.65,
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
    },

    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 44,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E7D3E8',
    },

    dividerText: {
        marginHorizontal: 12,
        color: '#33333A',
        fontSize: 14,
        fontWeight: '700',
    },

    googleButton: {
        alignSelf: 'center',
        width: 56,
        height: 56,
        marginTop: 34,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F2F8',
    },

    googleText: {
        color: '#4285F4',
        fontSize: 30,
        fontWeight: '800',
    },

    switchButton: {
        alignSelf: 'center',
        marginTop: 28,
        padding: 8,
    },

    switchText: {
        color: '#E278E9',
        fontSize: 15,
        fontWeight: '800',
    },
});
