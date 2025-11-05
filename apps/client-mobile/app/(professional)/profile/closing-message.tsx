import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useProfessionalProfileStore } from '@shared/supabase';

export default function ClosingMessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isOngoing = params.type === 'ongoing';
  const templateType = isOngoing ? 'ongoing' : 'default';

  const { chatTemplates, setChatTemplate, loadChatTemplates } = useProfessionalProfileStore();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const maxLength = 500;

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    await loadChatTemplates();
    setMessage(chatTemplates[templateType]);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setIsSaving(true);
    try {
      await setChatTemplate(templateType, message);
      Alert.alert('Success', 'Message saved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save message. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const title = isOngoing ? 'Ongoing closing message' : 'Closing Message';

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D17852" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <HStack className="py-4 px-5 items-center justify-between border-b border-gray-100">
        <Pressable className="w-10 items-start" onPress={() => router.back()}>
          <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
        </Pressable>
        <Text className="font-worksans-bold text-xl text-theme-font">
          {title}
        </Text>
        <Box className="w-10" />
      </HStack>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Text Input Container */}
        <Box className="mx-5 mt-6">
          <Box className="border border-gray-200 rounded-lg p-4" style={{ minHeight: 200 }}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Edit your default closing statement to Clients"
              placeholderTextColor="#9CA3AF"
              multiline={true}
              textAlignVertical="top"
              maxLength={maxLength}
              style={{
                fontFamily: 'Work Sans',
                fontSize: 16,
                color: '#30352D',
                flex: 1,
                minHeight: 160,
              }}
            />
          </Box>
          
          {/* Character Count */}
          <Text className="text-right mt-2 text-gray-500 font-worksans text-sm">
            {message.length}/{maxLength}
          </Text>
        </Box>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <Box className="px-5 pb-6 pt-4 bg-white">
        <Pressable
          className={`rounded-full py-4 items-center ${isSaving ? 'bg-gray-400' : 'bg-[#D17852]'}`}
          onPress={handleSave}
          disabled={isSaving}
          style={{
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-worksans-semibold text-white text-lg">
              Save
            </Text>
          )}
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}