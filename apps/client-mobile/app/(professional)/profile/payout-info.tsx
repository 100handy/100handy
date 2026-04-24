import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <View className="bg-white rounded-2xl p-5">
      <Text className="font-worksans-bold text-[18px] text-brand-dark-alt mb-4">
        {title}
      </Text>
      <View className="gap-4">{children}</View>
    </View>
  );
}

interface StageItemProps {
  title: string;
  timing: string;
  description: string;
}

function StageItem({ title, timing, description }: StageItemProps) {
  return (
    <View className="border border-[#F0F0F0] rounded-xl p-4">
      <View className="flex-row items-baseline justify-between gap-3 mb-2">
        <Text className="font-worksans-bold text-[15px] text-brand-dark-alt flex-1">
          {title}
        </Text>
        <Text className="font-worksans-semibold text-[13px] text-brand-taupe">
          {timing}
        </Text>
      </View>
      <Text className="font-worksans text-[14px] leading-5 text-[#5F5F5F]">
        {description}
      </Text>
    </View>
  );
}

interface ReasonItemProps {
  title: string;
  description: string;
}

function ReasonItem({ title, description }: ReasonItemProps) {
  return (
    <View className="gap-1">
      <Text className="font-worksans-bold text-[15px] text-brand-dark-alt">
        {title}
      </Text>
      <Text className="font-worksans text-[14px] leading-5 text-[#5F5F5F]">
        {description}
      </Text>
    </View>
  );
}

export default function PayoutInfoScreen() {
  const router = useRouter();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(professional)/profile/earnings');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['top']}>
      <View className="bg-white px-5 py-4 border-b border-[#F0F0F0]">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack} className="w-8">
            <ArrowLeft size={24} color="#30352D" />
          </Pressable>
          <Text className="font-worksans-bold text-[20px] text-brand-dark-alt">
            How payouts work
          </Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4 gap-4">
          <InfoSection title="Payment timeline">
            <Text className="font-worksans text-[14px] leading-6 text-[#5F5F5F]">
              Payouts usually arrive in your bank account 4–8 business days after you submit an invoice.
            </Text>
          </InfoSection>

          <InfoSection title="Tips">
            <Text className="font-worksans text-[14px] leading-6 text-[#5F5F5F]">
              Clients can add a tip within 24 hours of your invoice.
            </Text>
            <Text className="font-worksans text-[14px] leading-6 text-[#5F5F5F]">
              Tips added later will be paid separately.
            </Text>
          </InfoSection>

          <InfoSection title="Bulk payouts">
            <Text className="font-worksans text-[14px] leading-6 text-[#5F5F5F]">
              If you invoice multiple jobs in one day, they may be combined into a single payout.
            </Text>
          </InfoSection>

          <InfoSection title="Split payouts">
            <Text className="font-worksans text-[14px] leading-6 text-[#5F5F5F]">
              If a client uses a discount or credit, your payment may arrive in two separate payouts.
            </Text>
          </InfoSection>

          <InfoSection title="Payment stages">
            <StageItem
              title="Submitted"
              timing="24 hours"
              description="Your invoice is under review while the client has time to add a tip."
            />
            <StageItem
              title="Collecting"
              timing="After 24 hours"
              description="The client is charged for the job."
            />
            <StageItem
              title="Sending"
              timing="1 business day"
              description="The payment is being transferred to your bank."
            />
            <StageItem
              title="Sent"
              timing="3–5 business days"
              description="The payment has been sent and should appear in your account soon."
            />
          </InfoSection>

          <InfoSection title="Special cases">
            <Text className="font-worksans text-[14px] leading-6 text-[#5F5F5F]">
              Sometimes payments may be delayed. Here are the most common reasons:
            </Text>

            <ReasonItem
              title="Bank issue"
              description="Check that your bank details are correct in your account settings."
            />
            <ReasonItem
              title="Charge failed"
              description="If the client’s payment fails, request payment again and our team will review."
            />
            <ReasonItem
              title="In review"
              description="100Handy is reviewing the payment request. Please allow up to 5 business days."
            />
            <ReasonItem
              title="Paid by 100Handy"
              description="100Handy may cover the payment if the client’s payment method fails."
            />
            <ReasonItem
              title="Task not paid"
              description="If payment is not approved, contact support for help."
            />
          </InfoSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
