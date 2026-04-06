import React, { useState } from 'react';
import { TextInput, Alert, View, Text, Pressable } from 'react-native';
import { Paperclip, Send } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MessageInputProps {
  onSend: (message: string, attachment?: any) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput = ({
  onSend,
  disabled = false,
  placeholder = 'Type a message',
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    console.log('handleSend called, message:', message, 'attachment:', attachment);
    if (message.trim() || attachment) {
      console.log('Calling onSend');
      onSend(message.trim(), attachment);
      setMessage('');
      setAttachment(null);
    } else {
      console.log('Message empty, not sending');
    }
  };

  const handleAttachment = async () => {
    Alert.alert('Add Attachment', 'Choose attachment type', [
      {
        text: 'Camera',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setAttachment(result.assets[0]);
            }
          }
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setAttachment(result.assets[0]);
            }
          }
        },
      },
      {
        text: 'Document',
        onPress: async () => {
          const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
            copyToCacheDirectory: true,
          });

          if (!result.canceled && result.assets[0]) {
            setAttachment(result.assets[0]);
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View
      className="bg-white border-t border-gray-200 px-4 pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {/* Show attachment preview if present */}
      {attachment && (
        <View className="mb-2 p-2 bg-gray-100 rounded flex-row items-center justify-between">
          <Text className="text-[13px] text-[#666666]">
            📎 {attachment.name || 'Attachment'}
          </Text>
          <Pressable onPress={() => setAttachment(null)}>
            <Text className="text-[13px] text-[#C1856A]">Remove</Text>
          </Pressable>
        </View>
      )}

      <View className="items-center gap-2 flex-row">
        {/* Attachment button */}
        <Pressable
          onPress={handleAttachment}
          disabled={disabled}
          className="p-2"
        >
          <Paperclip size={24} color="#666666" />
        </Pressable>

        {/* Text input */}
        <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
          <TextInput
            value={message}
            onChangeText={(text) => {
              console.log('Text changed:', text);
              setMessage(text);
            }}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            multiline
            maxLength={1000}
            editable={!disabled}
            className="text-[15px] text-[#30352D] max-h-[100px]"
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              console.log('Submit editing triggered');
              handleSend();
            }}
          />
        </View>

        {/* Send button */}
        <Pressable
          onPress={() => {
            console.log('Send button pressed');
            handleSend();
          }}
          disabled={disabled || (!message.trim() && !attachment)}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            disabled || (!message.trim() && !attachment)
              ? 'bg-gray-300'
              : 'bg-[#4CAF50]'
          }`}
          style={{ zIndex: 999 }}
        >
          <Send
            size={20}
            color={
              disabled || (!message.trim() && !attachment)
                ? '#6B7280'
                : '#FFFFFF'
            }
          />
        </Pressable>
      </View>
    </View>
  );
};
