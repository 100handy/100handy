import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from 'lucide-react-native';
import { MessageList } from '@/components/support/MessageList';
import { MessageInput } from '@/components/support/MessageInput';
import { useSupportStore } from '@shared/store/support';

export default function MessageSupportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ticketId = params.ticketId as string | undefined;

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
            console.log('Found existing open ticket:', openTickets[0].id);
            await openTicket(openTickets[0].id);
          } else {
            // Create new ticket only if no open tickets exist
            console.log('No open tickets found, creating new ticket');
            const newTicket = await createTicket({
              subject: 'General Support',
              message: 'Hello, I need help with something.',
            });

            // Set the newly created ticket as active and subscribe to messages
            await openTicket(newTicket.id);
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
  }, [ticketId]);

  const handleSendMessage = async (message: string, attachment?: any) => {
    try {
      console.log('Sending message:', message, 'attachment:', attachment);

      if (!message.trim() && !attachment) {
        console.log('Empty message, skipping send');
        return;
      }

      await sendTicketMessage({
        message: message || '',
        attachment: attachment || null,
      });

      console.log('Message sent successfully');
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
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-[16px] text-[#666666] mt-4">
            {isCreatingTicket ? 'Creating support ticket...' : 'Loading...'}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1">
        {/* Header */}
        <HStack className="items-center px-6 py-4 border-b border-gray-200 bg-[#2C5F5D]">
          <Pressable onPress={handleBack} className="flex-row items-center">
            <Icon as={ChevronLeft} size="lg" className="text-white" />
          </Pressable>
          <Box className="flex-1 items-center">
            <Text className="text-[18px] font-bold text-white">
              100 Handy Support
            </Text>
            <Text className="text-[12px] text-white/80">
              We're here to help
            </Text>
          </Box>
          {/* Spacer for centering */}
          <Box className="w-6" />
        </HStack>

        {/* Messages */}
        <Box className="flex-1">
          <MessageList
            messages={messages}
            loading={isLoadingMessages}
            onRefresh={() => {
              if (activeTicket) {
                openTicket(activeTicket.id);
              }
            }}
          />
        </Box>

        {/* Input */}
        <MessageInput
          onSend={handleSendMessage}
          disabled={isSendingMessage || !activeTicket}
          placeholder="Type a message"
        />
      </Box>
    </SafeAreaView>
  );
}
