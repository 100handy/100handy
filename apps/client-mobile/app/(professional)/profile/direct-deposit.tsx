import React, { useState } from 'react';
import { ScrollView, Alert, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, InputField } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { ChevronLeft, HelpCircle, Lock, Banknote } from 'lucide-react-native';

export default function DirectDepositScreen() {
  const router = useRouter();
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [confirmBankAccountNumber, setConfirmBankAccountNumber] = useState('');
  const [bankSortCode, setBankSortCode] = useState('');

  const handleSave = () => {
    if (!bankAccountNumber || !confirmBankAccountNumber || !bankSortCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (bankAccountNumber !== confirmBankAccountNumber) {
      Alert.alert('Error', 'Bank account numbers do not match');
      return;
    }

    console.log('Saving direct deposit information:', {
      bankAccountNumber,
      bankSortCode
    });

    Alert.alert('Success', 'Direct deposit information saved successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleHelp = () => {
    console.log('Show help information');
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

      <ScrollView 
        className="flex-1 bg-white" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
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
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="px-5 pb-6 pt-4 bg-white">
        <Pressable 
          className="bg-sage-green rounded-full py-4 items-center"
          onPress={handleSave}
        >
          <Text className="font-worksans-semibold text-white text-lg">
            Save
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}