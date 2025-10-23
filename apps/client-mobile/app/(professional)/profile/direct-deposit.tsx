import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
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
      <HStack className="py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Direct Deposit
        </Text>
        <Pressable className="w-10 items-end" onPress={handleHelp}>
          <HelpCircle color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
      </HStack>

      <ScrollView 
        className="flex-1 bg-white" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Info Card */}
        <Box className="mx-5 mt-6 mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <VStack className="items-center space-y-4">
            <Text className="font-worksans-bold text-xl text-theme-font text-center">
              Make sure you get paid!
            </Text>
            <Text className="font-worksans text-sm text-gray-600 text-center leading-5">
              We use this information only to send you your Payments - securely and efficiently.
            </Text>
            <Box className="w-[100px] h-[100px] rounded-full bg-sage-green items-center justify-center">
              <Banknote color="#30352D" size={50} strokeWidth={1.5} />
            </Box>
          </VStack>
        </Box>

        {/* Form Fields */}
        <VStack className="px-5 space-y-5">
          {/* Bank Account Number */}
          <VStack className="space-y-2">
            <Text className="font-worksans text-xs text-gray-400">
              Bank Account Number
            </Text>
            <Box className="border-b border-gray-200 pb-2">
              <HStack className="items-center justify-between">
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
              </HStack>
            </Box>
          </VStack>

          {/* Confirm Bank Account Number */}
          <VStack className="space-y-2">
            <Text className="font-worksans text-xs text-gray-400">
              Confirm Bank Account Number
            </Text>
            <Box className="border-b border-gray-200 pb-2">
              <HStack className="items-center justify-between">
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
              </HStack>
            </Box>
          </VStack>

          {/* Bank Sort Code */}
          <VStack className="space-y-2">
            <Text className="font-worksans text-xs text-gray-400">
              Bank Sort Code
            </Text>
            <Box className="border-b border-gray-200 pb-2">
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
            </Box>
          </VStack>
        </VStack>

        {/* Powered by Stripe Badge */}
        <Box className="mx-5 mt-6">
          <Box className="border-2 border-blue-600 rounded-lg px-4 py-2 self-start">
            <HStack className="items-center space-x-2">
              <Text className="font-worksans text-sm text-theme-font">
                Powered by
              </Text>
              <Text className="font-worksans-bold text-base text-blue-600">
                stripe
              </Text>
            </HStack>
          </Box>
        </Box>

        {/* Security Message */}
        <HStack className="mx-5 mt-6 items-start space-x-2">
          <Lock color="#C1856A" size={18} strokeWidth={2} className="mt-0.5" />
          <Text className="font-worksans text-sm text-clay-orange leading-5 flex-1">
            Your personal information is securely stored and kept confidential.
          </Text>
        </HStack>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <Box className="px-5 pb-6 pt-4 bg-white">
        <Pressable 
          className="bg-sage-green rounded-full py-4 items-center"
          onPress={handleSave}
        >
          <Text className="font-worksans-semibold text-white text-lg">
            Save
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}