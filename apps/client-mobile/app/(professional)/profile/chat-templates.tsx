import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface TemplateItem {
  title: string;
  onPress?: () => void;
}

export default function ChatTemplatesScreen() {
  const router = useRouter();

  const handleNewTemplate = () => {
    router.push('/(professional)/profile/new-chat-template');
  };

  const templates: TemplateItem[] = [
    {
      title: 'Closing messages',
      onPress: () => router.push('/profile/closing-message?type=default')
    },
    {
      title: 'Ongoing closing message',
      onPress: () => router.push('/profile/closing-message?type=ongoing')
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
          Chat Templates
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <View className="px-5 pt-6 pb-3">
          <Text className="font-worksans text-base text-gray-500">
            Closing messages
          </Text>
        </View>

        {/* Template List */}
        <View className="flex-col ">
          {templates.map((template, index) => (
            <Pressable
              key={index}
              className="px-5 py-5 border-b border-gray-100"
              onPress={template.onPress}
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-worksans-bold text-lg text-theme-font flex-1">
                  {template.title}
                </Text>
                <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="px-5 pb-6 pt-4 bg-white">
        <Pressable
          className="bg-clay-orange rounded-full py-4 items-center"
          onPress={handleNewTemplate}
        >
          <Text className="font-worksans-semibold text-white text-lg">
            New chat template
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}