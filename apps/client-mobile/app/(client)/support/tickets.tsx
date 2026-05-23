import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; import { ScrollView, View, Text, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native'; import { useRouter } from 'expo-router'; import { ChevronLeft, MessageCircle, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react-native'; import Header from '@/components/Header'; import { useSupportStore } from '@shared/store/support'; import { formatDistanceToNow } from 'date-fns'; import { SupportTicket } from '@shared/supabase';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

const DEFAULT_CONTENT = {
  'header.title': 'My Tickets',
  'actions.create': 'Create New Ticket',
  'loading.text': 'Loading tickets...',
  'empty.title': 'No Support Tickets',
  'empty.body': "You haven't created any support tickets yet",
  'sections.active_prefix': 'Active',
  'sections.closed_prefix': 'Closed',
  'delete.title': 'Delete Ticket',
  'delete.body_template': 'Are you sure you want to delete "{subject}"? This action cannot be undone.',
  'delete.cancel_cta': 'Cancel',
  'delete.confirm_cta': 'Delete',
  'delete.success_title': 'Success',
  'delete.success_body': 'Ticket deleted successfully',
  'delete.error_title': 'Error',
  'delete.error_body': 'Failed to delete ticket. Please try again.',
} as const;

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
  const content = useAppContent('client_support_tickets', DEFAULT_CONTENT);

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
      getAppContentValue(content, 'delete.title', DEFAULT_CONTENT['delete.title']),
      getAppContentValue(content, 'delete.body_template', DEFAULT_CONTENT['delete.body_template']).replace('{subject}', subject),
      [
        {
          text: getAppContentValue(content, 'delete.cancel_cta', DEFAULT_CONTENT['delete.cancel_cta']),
          style: 'cancel',
        },
        {
          text: getAppContentValue(content, 'delete.confirm_cta', DEFAULT_CONTENT['delete.confirm_cta']),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTicket(ticketId);
              Alert.alert(
                getAppContentValue(content, 'delete.success_title', DEFAULT_CONTENT['delete.success_title']),
                getAppContentValue(content, 'delete.success_body', DEFAULT_CONTENT['delete.success_body'])
              );
            } catch (error) {
              Alert.alert(
                getAppContentValue(content, 'delete.error_title', DEFAULT_CONTENT['delete.error_title']),
                getAppContentValue(content, 'delete.error_body', DEFAULT_CONTENT['delete.error_body'])
              );
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
          <Text className="text-sm text-gray-600 mt-3">
            {getAppContentValue(content, 'loading.text', DEFAULT_CONTENT['loading.text'])}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <Header
          title={getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
          onBackPress={() => goBackOrReplace(router, '/(client)/profile/support')}
          showBellIcon={false}
        />

        {/* Create New Ticket Button */}
        <View className="bg-white px-5 py-3 border-b border-gray-200">
          <Pressable
            onPress={handleCreateNew}
            className="bg-[#C1856A] rounded-lg py-3 items-center justify-center"
          >
            <Text className="text-white font-semibold text-base">
              {getAppContentValue(content, 'actions.create', DEFAULT_CONTENT['actions.create'])}
            </Text>
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
              <Text className="text-lg font-medium text-gray-500 mt-4">
                {getAppContentValue(content, 'empty.title', DEFAULT_CONTENT['empty.title'])}
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center px-10">
                {getAppContentValue(content, 'empty.body', DEFAULT_CONTENT['empty.body'])}
              </Text>
            </View>
          ) : (
            <>
              {/* Open Tickets Section */}
              {openTickets.length > 0 && (
                <View className="mt-4">
                  <Text className="text-xs font-semibold text-gray-500 uppercase px-5 mb-2">
                    {getAppContentValue(content, 'sections.active_prefix', DEFAULT_CONTENT['sections.active_prefix'])} ({openTickets.length})
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
                    {getAppContentValue(content, 'sections.closed_prefix', DEFAULT_CONTENT['sections.closed_prefix'])} ({closedTickets.length})
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
