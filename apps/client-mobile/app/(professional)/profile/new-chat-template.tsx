import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { useRouter } from 'expo-router'; import { ChevronLeft } from 'lucide-react-native'; import { saveChatTemplate } from '@shared/supabase';

export default function NewChatTemplateScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const MAX_TITLE_LENGTH = 50;
    const MAX_MESSAGE_LENGTH = 500;

    const handleSave = async () => {
        if (!title.trim() || !message.trim()) return;

        setIsSaving(true);
        try {
            // Use title as the template_type (prefixed with 'custom_' to distinguish from default/ongoing)
            // Sanitize: only allow alphanumeric and spaces (converted to underscores)
            const sanitized = title.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
            const templateType = `custom_${sanitized}`;

            const result = await saveChatTemplate({
                template_type: templateType,
                message: message.trim(),
            });

            if (result) {
                Alert.alert('Success', 'Template saved successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', 'Failed to save template. Please try again.');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            Alert.alert('Error', 'Failed to save template. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const isValid = title.trim().length > 0 && message.trim().length > 0;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row py-4 px-5 items-center justify-between border-b border-gray-100 bg-white z-10">
                <Pressable className="w-10 items-start" onPress={() => router.back()}>
                    <ChevronLeft color="#30352D" size={28} strokeWidth={2} />
                </Pressable>
                <Text className="font-worksans-bold text-xl text-theme-font">
                    New chat template
                </Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-5 pt-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Title Input */}
                    <View className="mb-6">
                        <View className="border border-gray-200 rounded-lg px-4 py-3 bg-white">
                            <TextInput
                                className="font-worksans text-base text-theme-font"
                                placeholder="Template title..."
                                placeholderTextColor="#ADAEBC"
                                value={title}
                                onChangeText={setTitle}
                                maxLength={MAX_TITLE_LENGTH}
                            />
                        </View>
                        <Text className="text-right text-xs text-gray-400 mt-1 font-worksans">
                            {title.length}/{MAX_TITLE_LENGTH}
                        </Text>
                    </View>

                    {/* Message Input */}
                    <View className="mb-6">
                        <View className="border border-gray-200 rounded-lg px-4 py-3 bg-white h-64">
                            <TextInput
                                className="font-worksans text-base text-theme-font flex-1"
                                placeholder="Say it now, save it for later..."
                                placeholderTextColor="#ADAEBC"
                                value={message}
                                onChangeText={setMessage}
                                maxLength={MAX_MESSAGE_LENGTH}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                        <Text className="text-right text-xs text-gray-400 mt-1 font-worksans">
                            {message.length}/{MAX_MESSAGE_LENGTH}
                        </Text>
                    </View>

                </ScrollView>

                {/* Save Button */}
                <View className="px-5 pb-6 pt-4 bg-white">
                    <Pressable
                        className={`rounded-full py-4 items-center ${isValid && !isSaving ? 'bg-clay-orange' : 'bg-gray-200'}`}
                        onPress={handleSave}
                        disabled={!isValid || isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className={`font-worksans-semibold text-lg ${isValid ? 'text-white' : 'text-gray-400'}`}>
                                Save
                            </Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
