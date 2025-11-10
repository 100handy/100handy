import React, { useState } from 'react';
import { ScrollView, Switch, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import gluestack-ui components

// Import lucide-react-native icons
import { ChevronLeft, Edit } from 'lucide-react-native';

interface NotificationToggleProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
}) => (
  <View className="flex-row justify-between items-center py-3">
    <View className="flex-col flex-1 pr-4">
      <Text className="font-work-sans text-base text-notification-text-primary leading-6">
        {title}
      </Text>
      <Text className="font-work-sans text-sm text-notification-text-secondary leading-5 mt-1">
        {subtitle}
      </Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: '#E5E7EB',
        true: '#A3B899',
      }}
      thumbColor="#FFFFFF"
      style={{
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
      }}
    />
  </View>
);

interface NotificationSectionProps {
  title: string;
  children: React.ReactNode;
  footerNote?: string;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  children,
  footerNote,
}) => (
  <View className="flex-col mb-6">
    <Text className="font-work-sans text-xs font-semibold text-notification-text-secondary uppercase tracking-wider leading-4 mb-4">
      {title}
    </Text>
    <View className="flex-col space-y-0">
      {children}
    </View>
    {footerNote && (
      <Text className="font-work-sans text-sm text-notification-text-secondary leading-5 mt-4">
        {footerNote}
      </Text>
    )}
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  
  // State for notification toggles
  const [pushNotifications, setPushNotifications] = useState({
    taskIdeasAndOffers: true,
  });
  
  const [textMessages, setTextMessages] = useState({
    taskUpdates: true,
    taskIdeasAndOffers: false,
  });
  
  const [emailNotifications, setEmailNotifications] = useState({
    taskIdeasAndOffers: true,
  });

  const handleTestPushNotifications = () => {
    // TODO: Implement test push notification functionality
    console.log('Test push notifications');
  };

  return (
    <SafeAreaView className="flex-1 bg-notification-bg-primary">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-notification-bg-primary">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <ChevronLeft size={24} color="#1F2937" />
          <Text className="font-work-sans text-base text-notification-text-primary ml-1">
            Edit
          </Text>
        </Pressable>
        
        <View className="flex-1" />
        
        <Text className="font-work-sans text-lg font-semibold text-notification-text-primary leading-7">
          Notification
        </Text>
      </View>

      <ScrollView 
        className="flex-1 bg-notification-bg-primary"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Push Notifications Section */}
        <NotificationSection
          title="Push Notifications"
          footerNote="You'll always receive push notification updates for your tasks and account activity."
        >
          <NotificationToggle
            title="Task Ideas and Offers"
            subtitle="Task recommendations and promotional offers"
            value={pushNotifications.taskIdeasAndOffers}
            onValueChange={(value) =>
              setPushNotifications(prev => ({ ...prev, taskIdeasAndOffers: value }))
            }
          />
        </NotificationSection>

        {/* Divider */}
        <View className="h-px bg-notification-border mb-6" />

        {/* Text Messages Section */}
        <NotificationSection title="Text Messages">
          <NotificationToggle
            title="Task Updates"
            subtitle="Updates from HQ or your Handy"
            value={textMessages.taskUpdates}
            onValueChange={(value) =>
              setTextMessages(prev => ({ ...prev, taskUpdates: value }))
            }
          />
          
          {/* Divider between items */}
          <View className="h-px bg-notification-border my-3" />
          
          <NotificationToggle
            title="Task Ideas and Offers"
            subtitle="Task recommendations and promotional offers"
            value={textMessages.taskIdeasAndOffers}
            onValueChange={(value) =>
              setTextMessages(prev => ({ ...prev, taskIdeasAndOffers: value }))
            }
          />
        </NotificationSection>

        {/* Divider */}
        <View className="h-px bg-notification-border mb-6" />

        {/* Email Notifications Section */}
        <NotificationSection
          title="Email Notifications"
          footerNote="You'll always receive email updates for your tasks and account."
        >
          <NotificationToggle
            title="Task Ideas and Offers"
            subtitle="Task recommendations and promotional offers"
            value={emailNotifications.taskIdeasAndOffers}
            onValueChange={(value) =>
              setEmailNotifications(prev => ({ ...prev, taskIdeasAndOffers: value }))
            }
          />
        </NotificationSection>

        {/* Divider */}
        <View className="h-px bg-notification-border mb-6" />

        {/* Test Push Notifications Section */}
        <NotificationSection title="Test Push Notifications">
          <Pressable
            onPress={handleTestPushNotifications}
            className="border border-notification-primary rounded-lg py-2 px-4 self-start"
          >
            <Text className="font-work-sans text-base font-medium text-notification-primary text-center leading-5">
              Test Push Notifications
            </Text>
          </Pressable>
        </NotificationSection>
      </ScrollView>
    </SafeAreaView>
  );
}