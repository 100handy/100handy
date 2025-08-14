import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { WrenchIcon, PaintbrushIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { TaskCard, Tab } from '@/components/tasks';

// Using Tailwind design tokens - colors are now defined in tailwind.config.js

export default function TasksScreen() {
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const router = useRouter();



  return (
    <SafeAreaView className="flex-1 bg-secondary-bg">
      <Box className="flex-1">
        {/* Top App Bar */}
        <Header 
          title="My Tasks" 
          onBackPress={() => {}} 
          onBellPress={() => {}} 
          showFilterIcon={false}
          showBellIcon={true}
        />

        <Divider className="h-px bg-border-color opacity-80" />

        {/* Segmented Tabs */}
        <HStack className="bg-primary-bg">
          <Tab id="upcoming" label="Upcoming" active={activeTab === 'upcoming'} onPress={setActiveTab} />
          <Tab id="past" label="Past" active={activeTab === 'past'} onPress={setActiveTab} />
          <Tab id="cancelled" label="Cancelled" active={activeTab === 'cancelled'} onPress={setActiveTab} />
        </HStack>

        <Divider className="h-px bg-border-color opacity-80" />

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <VStack className="space-y-2">
            {/* Card 1 */}
            <TaskCard
              icon={WrenchIcon}
              iconTone="orange"
              title="Plumbing Repair"
              timeLine1="Tomorrow, 2:00 PM - 4:00 PM"
              timeLine2="123 Main Street, London SW1A"
              statusLabel="Scheduled"
              statusTone="scheduled"
              onPress={() => {}}
            />

            {/* Card 2 */}
            <TaskCard
              icon={PaintbrushIcon}
              iconTone="sage"
              title="Wall Painting"
              timeLine1="Dec 18, 9:00 AM - 12:00 PM"
              timeLine2="456 Oak Avenue, London N1"
              statusLabel="In progress"
              statusTone="progress"
              onPress={() => {}}
            />

            {/* Empty-state helper */}
            <HStack className="justify-center pt-6">
              <Text className="text-xs font-work-sans text-tertiary-text leading-4">
                Tap to view details
              </Text>
            </HStack>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}