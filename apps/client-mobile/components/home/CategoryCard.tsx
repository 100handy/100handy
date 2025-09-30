import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Center } from '@/components/ui/center';
import { useRouter } from 'expo-router';

interface CategoryCardProps {
  bg: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
  width?: number;
}

export function CategoryCard({ bg, icon: Icon, title, subtitle, width = 160 }: CategoryCardProps) {
  const router = useRouter();
  
  return (
    <VStack style={{ width, height: 120 }}>
      <Pressable
        onPress={() => router.push('/professionals/available')}
        className={`rounded-xl p-4 flex-1 justify-between ${bg} shadow-sm`}
      >
        <Center className="w-10 h-10 rounded-lg self-start bg-white/25">
          <Icon size={20} color="white" />
        </Center>
        <VStack className="flex-1 justify-end">
          <Text className="text-white font-worksans-semibold text-sm mb-1" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-white/90 text-xs leading-4 font-worksans" numberOfLines={2}>
            {subtitle}
          </Text>
        </VStack>
      </Pressable>
    </VStack>
  );
}