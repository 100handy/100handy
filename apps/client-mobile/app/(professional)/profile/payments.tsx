import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface PaymentItem {
  title: string;
  onPress?: () => void;
}

export default function PaymentsScreen() {
  const router = useRouter();

  const handleDirectDeposit = () => {
    router.push('/profile/direct-deposit');
  };

  const paymentItems: PaymentItem[] = [
    {
      title: 'Direct deposit',
      onPress: handleDirectDeposit,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Payments
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Payment Options */}
        <View className="flex-col ">
          {paymentItems.map((item, index) => (
            <Pressable
              key={index}
              className="px-5 py-6 border-b border-gray-100"
              onPress={item.onPress}
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-worksans font-bold text-lg text-theme-font flex-1">
                  {item.title}
                </Text>
                <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}