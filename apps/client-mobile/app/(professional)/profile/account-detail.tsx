import React from 'react';
import { ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { 
  Edit3,
  ChevronLeft
} from 'lucide-react-native';

interface FieldRowProps {
  label: string;
  value: string;
}

const FieldRow = ({ label, value }: FieldRowProps) => (
  <HStack className="px-6 py-5 items-center justify-between border-b border-gray-100">
    <Text className="font-worksans text-base text-theme-font">
      {label}
    </Text>
    <Text className="font-worksans text-base text-gray-600 text-right flex-1 ml-4">
      {value}
    </Text>
  </HStack>
);

export default function AccountDetailScreen() {
  const router = useRouter();

  const handleEdit = () => {
    console.log('Edit account details');
    // Navigate to edit screen when implemented
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <HStack className="py-4 px-6 items-center justify-between border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10">
          <ChevronLeft color="#30352D" size={24} strokeWidth={1.5} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Account detail
        </Text>
        <Pressable className="w-10 items-end" onPress={handleEdit}>
          <Edit3 color="#B8926A" size={24} strokeWidth={1.5} />
        </Pressable>
      </HStack>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <HStack className="px-6 py-8 items-center justify-between">
          <Text className="font-worksans-bold text-2xl text-theme-font">
            Mike W.
          </Text>
          <Box className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-300">
            <Image 
              source={{ uri: 'https://via.placeholder.com/120' }}
              className="w-full h-full"
              style={{ width: 120, height: 120 }}
            />
          </Box>
        </HStack>

        {/* Form Fields */}
        <VStack className="">
          <FieldRow label="Name" value="Mike W." />
          <FieldRow label="Email" value="Mikewilliam@gmail.com" />
          <FieldRow label="Mobile phone" value="+44 7435667700" />
          <FieldRow label="Postcode" value="E11 2ER" />
          <FieldRow label="Country" value="GB" />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}