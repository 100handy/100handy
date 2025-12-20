import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase, enable2FA, useProfile } from '@shared/supabase';
import { OtpInput } from 'react-native-otp-entry';

interface Verify2FAScreenProps {
    email: string;
}

export default function Verify2FAScreen({ email }: Verify2FAScreenProps) {
    const router = useRouter();
    const { refetch: refetchProfile } = useProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(60);

    // Countdown timer for resend
    React.useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    const handleVerify = async (otpCode: string) => {
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Verify OTP
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: email,
                token: otpCode,
                type: 'email',
            });

            if (verifyError) {
                throw verifyError;
            }

            // Enable 2FA for the user
            const enabled = await enable2FA();

            if (!enabled) {
                throw new Error('Failed to enable 2FA. Please try again.');
            }

            // Refetch profile to update the cache with new 2FA status
            await refetchProfile();

            // Show success and navigate back
            Alert.alert(
                'Success',
                'Two-factor authentication has been enabled successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (err) {
            console.error('Error verifying OTP:', err);
            setError(err instanceof Error ? err.message : 'Invalid verification code');
            Alert.alert(
                'Verification Failed',
                'The code you entered is incorrect. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return; // Prevent resend if timer is active

        setIsLoading(true);
        setError(null);

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: false,
                },
            });

            if (otpError) {
                throw otpError;
            }

            // Reset timer
            setResendTimer(60);

            Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
        } catch (err) {
            console.error('Error resending OTP:', err);
            Alert.alert('Error', 'Failed to resend code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center p-4 border-b border-gray-200">
                    <Pressable onPress={() => router.back()} className="p-2">
                        <ChevronLeft size={28} color="#000000" />
                    </Pressable>
                    <Text className="flex-1 text-center text-lg font-worksans-semibold">Verify Code</Text>
                    <View className="w-8" />
                </View>

                {/* Content */}
                <View className="flex-col p-6 space-y-6 flex-1">
                    <View className="flex-col gap-2">
                        <Text className="text-2xl font-worksans-bold text-gray-800">Enter verification code</Text>
                        <Text className="text-base font-worksans text-gray-600">
                            We've sent a 6-digit code to {email}
                        </Text>
                    </View>

                    {/* OTP Input */}
                    <View className="mt-8 px-2">
                        <OtpInput
                            numberOfDigits={6}
                            focusColor="#B8926A"
                            focusStickBlinkingDuration={500}
                            onFilled={(text) => handleVerify(text)}
                            textInputProps={{
                                accessibilityLabel: "One-Time Password",
                            }}
                            theme={{
                                containerStyle: { width: '100%' },
                                pinCodeContainerStyle: {
                                    width: 50,
                                    height: 60,
                                    borderWidth: 2,
                                    borderColor: '#E5E5E5',
                                    borderRadius: 12,
                                    backgroundColor: '#FFFFFF',
                                },
                                pinCodeTextStyle: {
                                    color: '#30352D',
                                    fontSize: 28,
                                    fontWeight: '700',
                                    fontFamily: 'WorkSans-Bold',
                                },
                                focusStickStyle: {
                                    backgroundColor: '#B8926A',
                                },
                                focusedPinCodeContainerStyle: {
                                    borderColor: '#B8926A',
                                    backgroundColor: '#FFF5F0',
                                },
                                filledPinCodeContainerStyle: {
                                    borderColor: '#B8926A',
                                    backgroundColor: '#FFF5F0',
                                },
                            }}
                        />
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <Text className="text-red-600 text-sm font-worksans">{error}</Text>
                        </View>
                    )}

                    {/* Resend Code */}
                    <View className="mt-6">
                        {resendTimer > 0 ? (
                            <Text className="text-gray-400 text-center text-base font-worksans">
                                Resend code in {resendTimer}s
                            </Text>
                        ) : (
                            <Pressable onPress={handleResendCode} disabled={isLoading}>
                                <Text className="text-[#B8926A] text-center text-base font-worksans-semibold">
                                    Didn't receive a code? Tap to resend
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    <View className="flex-1" />

                    {/* Verifying Status */}
                    {isLoading ? (
                        <View className="bg-[#B8926A]/10 rounded-xl py-4 items-center">
                            <View className="flex-row items-center gap-3">
                                <ActivityIndicator size="small" color="#B8926A" />
                                <Text className="text-[#B8926A] text-base font-worksans-semibold">
                                    Verifying your code...
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="items-center">
                            <Text className="text-gray-400 text-sm font-worksans">
                                Enter all 6 digits to verify automatically
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
