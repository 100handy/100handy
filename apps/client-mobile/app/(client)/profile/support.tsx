import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft, Mail, Phone, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react-native';

interface SupportOptionProps {
  icon: any;
  title: string;
  description: string;
  onPress: () => void;
}

const SupportOption = ({ icon, title, description, onPress }: SupportOptionProps) => (
  <Pressable onPress={onPress}>
    <HStack className="items-center py-4 border-b border-gray-200">
      <Box className="w-12 h-12 bg-[#FBF4ED] rounded-full items-center justify-center mr-4">
        <Icon as={icon} size="lg" className="text-[#C1856A]" />
      </Box>
      <VStack className="flex-1">
        <Text className="text-base font-semibold text-[#333333] mb-1">{title}</Text>
        <Text className="text-sm text-[#666666]">{description}</Text>
      </VStack>
      <Icon as={ChevronRight} size="md" className="text-gray-400" />
    </HStack>
  </Pressable>
);

export default function SupportScreen() {
  const router = useRouter();

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@100handy.com');
  };

  const handlePhoneSupport = () => {
    Linking.openURL('tel:+442012345678');
  };

  const handleLiveChat = () => {
    console.log('Open live chat');
  };

  const handleFAQ = () => {
    console.log('Open FAQ');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center px-6 py-4 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Icon as={ChevronLeft} size="lg" className="text-[#333333]" />
            <Text className="text-base text-[#333333] ml-2">Profile</Text>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-[#333333] mr-16">
            Support
          </Text>
        </HStack>

        <ScrollView className="flex-1">
          <VStack className="px-6 py-6">
            <Text className="text-2xl font-bold text-[#333333] mb-2">How can we help?</Text>
            <Text className="text-sm text-[#666666] mb-6">
              Choose the best way to get support
            </Text>

            <SupportOption
              icon={Mail}
              title="Email Support"
              description="Get help via email - we'll respond within 24 hours"
              onPress={handleEmailSupport}
            />

            <SupportOption
              icon={Phone}
              title="Phone Support"
              description="Call us Monday-Friday, 9am-6pm"
              onPress={handlePhoneSupport}
            />

            <SupportOption
              icon={MessageCircle}
              title="Live Chat"
              description="Chat with us in real-time"
              onPress={handleLiveChat}
            />

            <SupportOption
              icon={HelpCircle}
              title="Help Center & FAQ"
              description="Browse common questions and answers"
              onPress={handleFAQ}
            />

            <Box className="mt-8 p-4 bg-[#FBF4ED] rounded-lg">
              <Text className="text-base font-semibold text-[#333333] mb-2">
                Need urgent help?
              </Text>
              <Text className="text-sm text-[#666666] mb-4">
                For urgent matters related to active tasks, please contact your tasker directly through the task chat.
              </Text>
              <Pressable
                className="bg-[#C1856A] rounded-full py-3 items-center"
                onPress={() => console.log('Go to active tasks')}
              >
                <Text className="text-white font-semibold">View Active Tasks</Text>
              </Pressable>
            </Box>

            <Box className="mt-6 p-4 border border-gray-200 rounded-lg">
              <Text className="text-xs text-[#666666] text-center">
                Operating Hours: Monday - Friday, 9:00 AM - 6:00 PM GMT
              </Text>
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
