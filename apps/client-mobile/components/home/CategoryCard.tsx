import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
    <View style={{ width, height: 120 }} className="flex-col">
      <Pressable
        onPress={() => router.push('/(client)/search-services')}
        className={`rounded-xl p-4 flex-1 justify-between ${bg} shadow-sm`}
      >
        <View className="w-10 h-10 rounded-lg self-start bg-white/25 items-center justify-center">
          <Icon size={20} color="white" />
        </View>
        <View className="flex-1 justify-end flex-col">
          <Text className="text-white font-worksans-semibold text-sm mb-1" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-white/90 text-xs leading-4 font-worksans" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}