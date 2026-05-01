import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; import { ScrollView, View, Text, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native'; import { useRouter } from 'expo-router'; import { ChevronLeft, MessageCircle, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react-native'; import Header from '@/components/Header'; import { useSupportStore } from '@shared/store/support'; import { formatDistanceToNow } from 'date-fns'; import { SupportTicket } from '@shared/supabase';

interface TicketItemProps {
  ticket: SupportTicket;
  onPress: () => void;
  onDelete: () => void;
}

const TicketItem = ({ ticket, onPress, onDelete }: TicketItemProps) => {
  const statusConfig = {
    open: { icon: MessageCircle, color: '#3B82F6', label: 'Open' },
    in_progress: { icon: Clock, color: '#F59E0B', label: 'In Progress' },
    resolved: { icon: CheckCircle, color: '#10B981', label: 'Resolved' },
    closed: { icon: XCircle, color: '#6B7280', label: 'Closed' },
  };

  const config = statusConfig[ticket.status];
  const StatusIcon = config.icon;

  const timeAgo = formatDistanceToNow(new Date(ticket.last_message_at), { addSuffix: true });

  return (
    <View className="bg-white border-b border-gray-200">
      <Pressable
        onPress={onPress}
        className="px-5 py-4 active:bg-gray-50"
      >
        <View className="flex-row items-start">
          {/* Status Icon */}
          <View className="mr-3 mt-1">
            <StatusIcon size={20} color={config.color} strokeWidth={2} />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Subject */}
            <Text className="text-base font-semibold text-[#30352D] mb-1" numberOfLines={1}>
              {ticket.subject}
            </Text>

            {/* Status and Time */}
            <View className="flex-row items-center">
              <Text className="text-xs font-medium" style={{ color: config.color }}>
                {config.label}
              </Text>
              <Text className="text-xs text-gray-400 mx-2">•</Text>
              <Text className="text-xs text-gray-500">{timeAgo}</Text>
            </View>

            {/* Priority Badge (if high or urgent) */}
            {(ticket.priority === 'high' || ticket.priority === 'urgent') && (
              <View className={`mt-2 self-start px-2 py-1 rounded ${
                ticket.priority === 'urgent' ? 'bg-red-100' : 'bg-orange-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  ticket.priority === 'urgent' ? 'text-red-700' : 'text-orange-700'
                }`}>
                  {ticket.priority.toUpperCase()} PRIORITY
                </Text>
              </View>
            )}
          </View>

          {/* Delete Button */}
          <Pressable
            onPress={onDelete}
            className="ml-2 p-2 active:bg-red-50 rounded-lg"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={18} color="#EF4444" strokeWidth={2} />
          </Pressable>

          {/* Chevron */}
          <View className="ml-1">
            <ChevronLeft size={20} color="#D1D5DB" style={{ transform: [{ rotate: '180deg' }] }} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default function TicketsScreen() {
  const router = useRouter();
  const { tickets, isLoadingTickets, fetchTickets, deleteTicket } = useSupportStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

  const handleTicketPress = (ticketId: string) => {
    router.push({
      pathname: '/(client)/support/message-support',
      params: { ticketId },
    });
  };

  const handleCreateNew = () => {
    router.push({
      pathname: '/(client)/support/message-support',
      params: { forceNew: 'true' },
    });
  };

  const handleDeleteTicket = (ticketId: string, subject: string) => {
    Alert.alert(
      'Delete Ticket',
      `Are you sure you want to delete "${subject}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTicket(ticketId);
              Alert.alert('Success', 'Ticket deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete ticket. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Group tickets by status
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const closedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  if (isLoadingTickets && tickets.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">Loading tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <Header title="My Tickets" onBackPress={() => router.back()} showBellIcon={false} />

        {/* Create New Ticket Button */}
        <View className="bg-white px-5 py-3 border-b border-gray-200">
          <Pressable
            onPress={handleCreateNew}
            className="bg-[#C1856A] rounded-lg py-3 items-center justify-center"
          >
            <Text className="text-white font-semibold text-base">Create New Ticket</Text>
          </Pressable>
        </View>

        {/* Tickets List */}
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#C1856A" />
          }
        >
          {tickets.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <MessageCircle size={64} color="#D1D5DB" strokeWidth={1.5} />
              <Text className="text-lg font-medium text-gray-500 mt-4">No Support Tickets</Text>
              <Text className="text-sm text-gray-400 mt-2 text-center px-10">
                You haven't created any support tickets yet
              </Text>
            </View>
          ) : (
            <>
              {/* Open Tickets Section */}
              {openTickets.length > 0 && (
                <View className="mt-4">
                  <Text className="text-xs font-semibold text-gray-500 uppercase px-5 mb-2">
                    Active ({openTickets.length})
                  </Text>
                  {openTickets.map((ticket) => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      onPress={() => handleTicketPress(ticket.id)}
                      onDelete={() => handleDeleteTicket(ticket.id, ticket.subject)}
                    />
                  ))}
                </View>
              )}

              {/* Closed Tickets Section */}
              {closedTickets.length > 0 && (
                <View className="mt-6">
                  <Text className="text-xs font-semibold text-gray-500 uppercase px-5 mb-2">
                    Closed ({closedTickets.length})
                  </Text>
                  {closedTickets.map((ticket) => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      onPress={() => handleTicketPress(ticket.id)}
                      onDelete={() => handleDeleteTicket(ticket.id, ticket.subject)}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          {/* Bottom Spacing */}
          <View className="h-8" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
