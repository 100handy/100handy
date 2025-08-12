import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Center } from '@/components/ui/center';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';

import {
  MapPinIcon,
  SearchIcon,
  WrenchIcon,
  PaintbrushIcon,
  CalculatorIcon,
  MegaphoneIcon,
  LeafIcon,
  DumbbellIcon,
  CarIcon,
  SparklesIcon,
} from 'lucide-react-native';

// Brand colors
const colors = {
  clayOrange: '#D9896C',
  sageGreen: '#A3B899',
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8',
  themeFont: '#333A31',
};

interface CategoryCardProps {
  bg: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
}

function CategoryCard({ bg, icon: Icon, title, subtitle }: CategoryCardProps) {
  return (
    <VStack style={{ width: 160, height: 120 }}>
      <Pressable
        className="rounded-xl p-4 flex-1 justify-between"
        style={{
          backgroundColor: bg,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }}
      >
        <Center className="w-10 h-10 rounded-lg self-start" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
          <Icon size={20} color="white" />
        </Center>
        <VStack className="flex-1 justify-end">
          <Text className="text-white font-semibold text-sm mb-1" numberOfLines={1}>{title}</Text>
          <Text className="text-white/90 text-xs leading-4" numberOfLines={2}>{subtitle}</Text>
        </VStack>
      </Pressable>
    </VStack>
  );
}

export default function ServicesHomeScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.themeBackground }}>
      <Box className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <VStack className="px-4 pt-3">

            {/* Top bar */}
            <HStack className="items-center justify-between mb-4">
              <Pressable className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
                style={{ backgroundColor: 'white' }}>
                <MapPinIcon size={20} color={colors.themeFont} />
              </Pressable>
              <Pressable className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
                style={{ backgroundColor: 'white' }}>
                <SearchIcon size={20} color={colors.themeFont} />
              </Pressable>
            </HStack>

            {/* Search input */}
            <Input className="bg-white rounded-xl px-4 py-3 mb-6 shadow-sm border border-gray-100">
              <InputIcon as={SearchIcon} className="text-[#8F9A8A] mr-3" size="sm" />
              <InputField
                placeholder="Search for services..."
                placeholderTextColor="#8F9A8A"
                className="text-[16px] text-[#333A31] flex-1"
                style={{ color: '#333A31' }}
              />
            </Input>

            {/* Service Categories */}
            <VStack className="mb-6">
              <Heading size="lg" className="text-[20px] text-[#333A31] text-center mb-4">
                Service Categories
              </Heading>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0, gap: 12 }}
                className="mb-4"
              >
                <CategoryCard
                  bg={colors.sageGreen}
                  icon={WrenchIcon}
                  title="Handyman Services"
                  subtitle="Repairs, installations, maintenance"
                />
                <CategoryCard
                  bg={colors.warmTaupe}
                  icon={PaintbrushIcon}
                  title="Cleaning Services"
                  subtitle="Home, office, deep cleaning"
                />
              </ScrollView>
            </VStack>

            <Divider className="opacity-0 my-1" />

            {/* Business Services */}
            <VStack className="mb-6">
              <Heading size="lg" className="text-[20px] text-[#333A31] text-center mb-4">
                Business Services
              </Heading>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0, gap: 12 }}
                className="mb-4"
              >
                <CategoryCard
                  bg={colors.clayOrange}
                  icon={CalculatorIcon}
                  title="Accounting"
                  subtitle="Bookkeeping, tax preparation"
                />
                <CategoryCard
                  bg={colors.sageGreen}
                  icon={MegaphoneIcon}
                  title="Digital Marketing"
                  subtitle="SEO, social media, ads"
                />
              </ScrollView>
            </VStack>

            <Divider className="opacity-0 my-1" />

            {/* Health & Wellness */}
            <VStack className="mb-6">
              <Heading size="lg" className="text-[20px] text-[#333A31] text-center mb-4">
                Health & Wellness
              </Heading>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0, gap: 12 }}
                className="mb-4"
              >
                <CategoryCard
                  bg={colors.warmTaupe}
                  icon={LeafIcon}
                  title="Massage Therapy"
                  subtitle="Relaxation, deep tissue"
                />
                <CategoryCard
                  bg={colors.clayOrange}
                  icon={DumbbellIcon}
                  title="Personal Training"
                  subtitle="Fitness, strength, cardio"
                />
              </ScrollView>
            </VStack>

            <Divider className="opacity-0 my-1" />

            {/* Automotive */}
            <VStack className="mb-6">
              <Heading size="lg" className="text-[20px] text-[#333A31] text-center mb-4">
                Automotive
              </Heading>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0, gap: 12 }}
                className="mb-2"
              >
                <CategoryCard
                  bg={colors.sageGreen}
                  icon={CarIcon}
                  title="Auto Repair"
                  subtitle="Engine, brakes, transmission"
                />
                <CategoryCard
                  bg={colors.warmTaupe}
                  icon={SparklesIcon}
                  title="Car Detailing"
                  subtitle="Wash, wax, interior clean"
                />
              </ScrollView>
            </VStack>

          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}