import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { CategoryCard } from './CategoryCard';

interface ServiceItem {
  bg: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
}

interface ServiceSectionProps {
  title: string;
  services: ServiceItem[];
}

export function ServiceSection({ title, services }: ServiceSectionProps) {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 16; // 4 * 4 (px-4 class)
  const availableWidth = screenWidth - (paddingHorizontal * 2);
  
  // Calculate dynamic width for cards when there are only 2 services
  const shouldFillSpace = services.length === 2;
  const cardWidth = shouldFillSpace ? (availableWidth - 12) / 2 : 160; // 12 is the gap
  
  const contentContainerStyle = shouldFillSpace 
    ? { paddingHorizontal: 0, gap: 12, width: availableWidth }
    : { paddingHorizontal: 0, gap: 12 };

  return (
    <View className="mb-6 flex-col">
      <Text className="text-[20px] text-theme-font text-center mb-4 font-worksans-bold">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        className="mb-4"
        scrollEnabled={true}
      >
        {services.map((service, index) => (
          <CategoryCard
            key={index}
            bg={service.bg}
            icon={service.icon}
            title={service.title}
            subtitle={service.subtitle}
            width={cardWidth}
          />
        ))}
      </ScrollView>
    </View>
  );
}