import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Alert, View, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { MessageList } from '@/components/support/MessageList';
import { MessageInput } from '@/components/support/MessageInput';
import { useSupportStore } from '@shared/store/support';

export default function MessageSupportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ticketId = params.ticketId as string | undefined;
  const forceNew = params.forceNew === 'true'; // Force create new ticket

  const {
    activeTicket,
    messages,
    isLoadingMessages,
    isSendingMessage,
    isCreatingTicket,
    fetchTickets,
    createTicket,
    openTicket,
    closeActiveTicket,
    sendTicketMessage,
    unsubscribeFromMessages,
  } = useSupportStore();

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize ticket on mount
  useEffect(() => {
    const initializeSupport = async () => {
      try {
        if (ticketId) {
          // Open existing ticket by ID
          await openTicket(ticketId);
        } else if (forceNew) {
          // Force create a new ticket (skip open ticket check)
          const newTicket = await createTicket({
            subject: 'General Support',
            message: 'Hello',
          });

          // Set the newly created ticket as active and subscribe to messages
          await openTicket(newTicket.id);
        } else {
          // Check if user has any open tickets first
          await fetchTickets();

          // Get updated tickets from store after fetch
          const allTickets = useSupportStore.getState().tickets;
          const openTickets = allTickets.filter(
            (t) => t.status === 'open' || t.status === 'in_progress'
          );

          if (openTickets.length > 0) {
            // Use the most recent open ticket
            await openTicket(openTickets[0].id);
          }
        }
      } catch (error) {
        console.error('Error initializing support:', error);
        Alert.alert(
          'Error',
          'Failed to load support chat. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSupport();

    // Cleanup on unmount
    return () => {
      unsubscribeFromMessages();
      closeActiveTicket();
    };
  }, [ticketId, forceNew]);

  const handleSendMessage = async (message: string, attachment?: any) => {
    try {
      if (!message.trim() && !attachment) {
        return;
      }

      if (!activeTicket) {
        const initialMessage = message.trim() || 'Attachment sent';
        const newTicket = await createTicket({
          subject: 'General Support',
          message: initialMessage,
        });

        await openTicket(newTicket.id);
        return;
      }

      await sendTicketMessage({
        message: message || '',
        attachment: attachment || null,
      });

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isInitializing || isCreatingTicket) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-[16px] text-[#666666] mt-4">
            {isCreatingTicket ? 'Creating support ticket...' : 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-gray-200 bg-[#2C5F5D]">
          <Pressable onPress={handleBack} className="flex-row items-center">
            <ChevronLeft size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-bold text-white">
              100Handy Support
            </Text>
            <Text className="text-[12px] text-white/80">
              We're here to help
            </Text>
          </View>
          {/* Spacer for centering */}
          <View className="w-6" />
        </View>

        {/* Messages */}
        <View className="flex-1">
          <MessageList
            messages={messages}
            loading={isLoadingMessages}
            onRefresh={() => {
              if (activeTicket) {
                openTicket(activeTicket.id);
              }
            }}
          />
        </View>

        {/* Input */}
        <MessageInput
          onSend={handleSendMessage}
          disabled={isSendingMessage}
          placeholder={activeTicket ? 'Type a message' : 'Start a conversation with support'}
        />
      </View>
    </SafeAreaView>
  );
}
