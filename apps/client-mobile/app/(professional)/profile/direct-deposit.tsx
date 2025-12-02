import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { ChevronLeft, HelpCircle, Lock, Banknote, CheckCircle } from 'lucide-react-native';
import { getOrCreateStripeCustomer } from '@shared/supabase/payment-methods';
import { useAuthStore } from '@shared/supabase';

export default function DirectDepositScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [confirmBankAccountNumber, setConfirmBankAccountNumber] = useState('');
  const [bankSortCode, setBankSortCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [hasExistingAccount, setHasExistingAccount] = useState(false);

  useEffect(() => {
    loadStripeInfo();
  }, []);

  const loadStripeInfo = async () => {
    try {
      setIsLoading(true);
      const customerId = await getOrCreateStripeCustomer();
      setStripeCustomerId(customerId);

      // TODO: Check if user has existing bank account via Stripe Connect
      // This would require Stripe Connect backend functions
      // For now, we'll assume no existing account
      setHasExistingAccount(false);
    } catch (error) {
      console.error('Error loading Stripe info:', error);
      Alert.alert('Error', 'Failed to load payment information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStripeInfo();
    setIsRefreshing(false);
  };

  const handleSave = async () => {
    if (!bankAccountNumber || !confirmBankAccountNumber || !bankSortCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (bankAccountNumber !== confirmBankAccountNumber) {
      Alert.alert('Error', 'Bank account numbers do not match');
      return;
    }

    if (bankAccountNumber.length !== 8) {
      Alert.alert('Error', 'Bank account number must be 8 digits');
      return;
    }

    if (bankSortCode.length !== 6) {
      Alert.alert('Error', 'Bank sort code must be 6 digits');
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Implement Stripe Connect bank account setup
      // This requires backend edge functions for:
      // 1. Creating Stripe Connect account
      // 2. Adding external bank account
      // 3. Verifying the account

      // For now, show a message that this feature is being implemented
      Alert.alert(
        'Coming Soon',
        'Direct deposit setup via Stripe Connect is being implemented. Your information has been validated and will be saved once the integration is complete.',
        [{ text: 'OK', onPress: () => router.back() }]
      );

      console.log('Bank account details validated:', {
        customerId: stripeCustomerId,
        accountNumber: '****' + bankAccountNumber.slice(-4),
        sortCode: bankSortCode,
      });
    } catch (error) {
      console.error('Error saving bank account:', error);
      Alert.alert('Error', 'Failed to save bank account details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHelp = () => {
    Alert.alert(
      'Direct Deposit Help',
      'Direct deposit allows you to receive your earnings directly into your bank account. We use Stripe Connect for secure and fast transfers.\n\nYou\'ll need:\n• Your 8-digit bank account number\n• Your 6-digit bank sort code\n\nYour information is encrypted and secure.',
      [{ text: 'Got it' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Direct Deposit
        </Text>
        <Pressable className="w-10 items-end" onPress={handleHelp}>
          <HelpCircle color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B8926A" />
          <Text className="font-worksans text-gray-600 mt-4">Loading...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#B8926A"
            />
          }
        >
        {/* Info Card */}
        <View className="mx-5 mt-6 mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <View className="flex-col items-center space-y-4">
            <Text className="font-worksans-bold text-xl text-theme-font text-center">
              Make sure you get paid!
            </Text>
            <Text className="font-worksans text-sm text-gray-600 text-center leading-5">
              We use this information only to send you your Payments - securely and efficiently.
            </Text>
            <View className="w-[100px] h-[100px] rounded-full bg-sage-green items-center justify-center">
              <Banknote color="#30352D" size={50} strokeWidth={1.5} />
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View className="flex-col px-5 space-y-5">
          {/* Bank Account Number */}
          <View className="flex-col space-y-2">
            <Text className="font-worksans text-xs text-gray-400">
              Bank Account Number
            </Text>
            <View className="border-b border-gray-200 pb-2">
              <View className="flex-row items-center justify-between">
                <Input
                  variant="outline"
                  size="lg"
                  className="flex-1 border-0"
                >
                  <InputField
                    placeholder="00000000"
                    value={bankAccountNumber}
                    onChangeText={setBankAccountNumber}
                    keyboardType="numeric"
                    maxLength={8}
                    className="font-worksans text-lg text-theme-font px-0"
                    placeholderTextColor="#D1D1D1"
                  />
                </Input>
                <Lock color="#9CA3AF" size={20} strokeWidth={1.5} />
              </View>
            </View>
          </View>

          {/* Confirm Bank Account Number */}
          <View className="flex-col space-y-2">
            <Text className="font-worksans text-xs text-gray-400">
              Confirm Bank Account Number
            </Text>
            <View className="border-b border-gray-200 pb-2">
              <View className="flex-row items-center justify-between">
                <Input
                  variant="outline"
                  size="lg"
                  className="flex-1 border-0"
                >
                  <InputField
                    placeholder="00000000"
                    value={confirmBankAccountNumber}
                    onChangeText={setConfirmBankAccountNumber}
                    keyboardType="numeric"
                    maxLength={8}
                    className="font-worksans text-lg text-theme-font px-0"
                    placeholderTextColor="#D1D1D1"
                  />
                </Input>
                <Lock color="#9CA3AF" size={20} strokeWidth={1.5} />
              </View>
            </View>
          </View>

          {/* Bank Sort Code */}
          <View className="flex-col space-y-2">
            <Text className="font-worksans text-xs text-gray-400">
              Bank Sort Code
            </Text>
            <View className="border-b border-gray-200 pb-2">
              <Input
                variant="outline"
                size="lg"
                className="border-0"
              >
                <InputField
                  placeholder="000000"
                  value={bankSortCode}
                  onChangeText={setBankSortCode}
                  keyboardType="numeric"
                  maxLength={6}
                  className="font-worksans text-lg text-theme-font px-0"
                  placeholderTextColor="#D1D1D1"
                />
              </Input>
            </View>
          </View>
        </View>

        {/* Powered by Stripe Badge */}
        <View className="mx-5 mt-6">
          <View className="border-2 border-blue-600 rounded-lg px-4 py-2 self-start">
            <View className="flex-row items-center space-x-2">
              <Text className="font-worksans text-sm text-theme-font">
                Powered by
              </Text>
              <Text className="font-worksans-bold text-base text-blue-600">
                stripe
              </Text>
            </View>
          </View>
        </View>

        {/* Security Message */}
        <View className="flex-row mx-5 mt-6 items-start space-x-2">
          <Lock color="#C1856A" size={18} strokeWidth={2} className="mt-0.5" />
          <Text className="font-worksans text-sm text-clay-orange leading-5 flex-1">
            Your personal information is securely stored and kept confidential.
          </Text>
        </View>

        {/* Stripe Customer Info (Development) */}
        {stripeCustomerId && (
          <View className="mx-5 mt-4 bg-blue-50 rounded-lg p-3">
            <Text className="font-worksans text-xs text-gray-500">
              Stripe Customer ID: {stripeCustomerId.slice(0, 20)}...
            </Text>
          </View>
        )}
      </ScrollView>
      )}

      {/* Fixed Bottom Button */}
      {!isLoading && (
        <View className="px-5 pb-6 pt-4 bg-white border-t border-gray-100">
          <Pressable
            className={`rounded-full py-4 items-center ${
              isSaving ? 'bg-gray-400' : 'bg-sage-green'
            }`}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="white" />
                <Text className="font-worksans-semibold text-white text-lg">
                  Saving...
                </Text>
              </View>
            ) : (
              <Text className="font-worksans-semibold text-white text-lg">
                Save
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}