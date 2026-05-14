import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter } from 'expo-router'; import { useFocusEffect } from '@react-navigation/native'; import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react-native'; import { getAllChatTemplates, deleteChatTemplateById, ChatTemplate } from '@shared/supabase';
import { goBackOrReplace } from '@/lib/navigation';

interface TemplateItem {
  title: string;
  onPress?: () => void;
}

export default function ChatTemplatesScreen() {
  const router = useRouter();
  const [customTemplates, setCustomTemplates] = useState<ChatTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      const templates = await getAllChatTemplates();
      // Filter only custom templates (those starting with 'custom_')
      const custom = templates.filter(t => t.template_type.startsWith('custom_'));
      setCustomTemplates(custom);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload templates when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTemplates();
    }, [])
  );

  const handleNewTemplate = () => {
    router.push('/(professional)/profile/new-chat-template');
  };

  const handleDeleteCustomTemplate = (template: ChatTemplate) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${formatTemplateName(template.template_type)}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteChatTemplateById(template.id);
              if (success) {
                // Remove from local state immediately
                setCustomTemplates(prev => prev.filter(t => t.id !== template.id));
              } else {
                Alert.alert('Error', 'Failed to delete template');
              }
            } catch (error) {
              console.error('Error deleting template:', error);
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
  };

  // Convert template_type like 'custom_my_template' to 'My Template'
  const formatTemplateName = (templateType: string): string => {
    return templateType
      .replace('custom_', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const defaultTemplates: TemplateItem[] = [
    {
      title: 'Closing messages',
      onPress: () => router.push('/(professional)/profile/closing-message?type=default')
    },
    {
      title: 'Ongoing closing message',
      onPress: () => router.push('/(professional)/profile/closing-message?type=ongoing')
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => goBackOrReplace(router, '/(professional)/(tabs)/profile')}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          Chat Templates
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Default Templates Section */}
        <View className="px-5 pt-6 pb-3">
          <Text className="font-worksans text-base text-gray-500">
            Closing messages
          </Text>
        </View>

        <View className="flex-col">
          {defaultTemplates.map((template, index) => (
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

        {/* Custom Templates Section */}
        {isLoading ? (
          <View className="px-5 py-8 items-center">
            <ActivityIndicator size="small" color="#C1856A" />
          </View>
        ) : customTemplates.length > 0 ? (
          <>
            <View className="px-5 pt-6 pb-3">
              <Text className="font-worksans text-base text-gray-500">
                Custom templates
              </Text>
            </View>

            <View className="flex-col">
              {customTemplates.map((template) => (
                <View
                  key={template.id}
                  className="px-5 py-5 border-b border-gray-100 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="font-worksans-bold text-lg text-theme-font">
                      {formatTemplateName(template.template_type)}
                    </Text>
                    <Text className="font-worksans text-sm text-gray-500 mt-1" numberOfLines={1}>
                      {template.message}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleDeleteCustomTemplate(template)}
                    className="p-2 ml-2"
                  >
                    <Trash2 color="#EF4444" size={20} strokeWidth={2} />
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        ) : null}
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
