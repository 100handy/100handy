import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { Center } from '@/components/ui/center';
import {
  ChevronLeftIcon,
  BellIcon,
  WrenchIcon,
  PaintbrushIcon,
  ArrowBigLeft,
  ArrowLeftToLineIcon,
  MoveLeft,
  ArrowLeft,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

// Brand colors
const colors = {
  clayOrange: '#D9896C',
  sageGreen: '#A3B899',
  warmTaupe: '#BFA28D',
  themeBackground: '#F6E4D8',
  themeFont: '#333A31',
};

interface StatusPillProps {
  label: string;
  tone?: 'scheduled' | 'progress' | 'neutral';
}

function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  const stylesByTone: Record<'scheduled' | 'progress' | 'neutral', { bg: string; text: string }> = {
    scheduled: {
      bg: 'rgba(163, 184, 153, 0.2)', // sageGreen tint
      text: colors.themeFont,
    },
    progress: {
      bg: 'rgba(217, 137, 108, 0.15)', // clayOrange tint
      text: colors.themeFont,
    },
    neutral: {
      bg: 'rgba(0,0,0,0.06)',
      text: colors.themeFont,
    },
  };
  const t = stylesByTone[tone] ?? stylesByTone.neutral;

  return (
    <HStack
      className="px-3 py-1 rounded-full items-center"
      style={{ backgroundColor: t.bg }}
    >
      <Text className="text-xs font-medium" style={{ color: t.text }}>
        {label}
      </Text>
    </HStack>
  );
}

interface IconTileProps {
  tone?: 'sage' | 'orange' | 'taupe';
  children: React.ReactNode;
}

function IconTile({ tone = 'sage', children }: IconTileProps) {
  const bgByTone: Record<'sage' | 'orange' | 'taupe', string> = {
    sage: 'rgba(163, 184, 153, 0.2)',
    orange: 'rgba(217, 137, 108, 0.2)',
    taupe: 'rgba(191, 162, 141, 0.2)',
  };
  return (
    <Center
      className="w-14 h-14 rounded-lg"
      style={{ backgroundColor: bgByTone[tone] || bgByTone.sage }}
    >
      {children}
    </Center>
  );
}

interface TaskCardProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconTone?: 'sage' | 'orange' | 'taupe';
  title: string;
  timeLine1: string;
  timeLine2: string;
  statusLabel: string;
  statusTone?: 'scheduled' | 'progress' | 'neutral';
  onPress: () => void;
}

function TaskCard({
  icon,
  iconTone = 'sage',
  title,
  timeLine1,
  timeLine2,
  statusLabel,
  statusTone,
  onPress,
}: TaskCardProps) {
  const IconComp = icon;
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl mt-2"
      style={{
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <VStack className="p-4">
        <HStack className="items-start justify-between">
          <HStack className="space-x-3 flex-1">
            <IconTile  tone={iconTone}>
              <IconComp size={25} color={colors.clayOrange} />
            </IconTile>

            <VStack className="flex-1 ml-4">
              <Text className="text-base font-semibold mb-1" style={{ color: colors.themeFont }}>
                {title}
              </Text>

              <Text className="text-sm mb-0.5" style={{ color: 'rgba(51,58,49,0.75)' }}>
                {timeLine1}
              </Text>
              <Text className="text-sm" style={{ color: 'rgba(51,58,49,0.75)' }}>
                {timeLine2}
              </Text>
            </VStack>
          </HStack>

          <VStack className="items-end">
            <StatusPill label={statusLabel} tone={statusTone} />
            <Pressable className="mt-2" onPress={() => router.push('/task-details')}>
              <Text className="text-sm font-medium" style={{ color: colors.clayOrange }}>
                View details
              </Text>
            </Pressable>
          </VStack>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default function TasksScreen() {
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const router = useRouter();

  const Tab = ({ id, label }: { id: string; label: string }) => {
    const active = activeTab === id;
    return (
      <Pressable onPress={() => setActiveTab(id)} className="flex-1 pt-3">
        <VStack className="items-center">
          <Text
            className="text-sm font-medium"
            style={{ color: active ? colors.clayOrange : 'rgba(51,58,49,0.6)' }}
          >
            {label}
          </Text>
          <Box
            className="mt-2"
            style={{
              height: 2,
              width: active ? '80%' : 0,
              backgroundColor: active ? colors.clayOrange : 'transparent',
            }}
          />
        </VStack>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.themeBackground }}>
      <Box className="flex-1">
        {/* Top App Bar */}
        <Header 
          title="My Tasks" 
          onBackPress={() => {}} 
          onBellPress={() => {}} 
          showFilterIcon={false}
          showBellIcon={true}
        />

        <Divider className="opacity-20" style={{ backgroundColor: 'rgba(0,0,0,0.08)', height: 1 }} />

        {/* Segmented Tabs */}
        <HStack className="" style={{ backgroundColor: 'white' }}>
          <Tab id="upcoming" label="Upcoming" />
          <Tab id="past" label="Past" />
          <Tab id="cancelled" label="Cancelled" />
        </HStack>

        <Divider className="opacity-20" style={{ backgroundColor: 'rgba(0,0,0,0.08)', height: 1 }} />

        {/* Content */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <VStack className="space-y-4">
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

            {/* Empty-state helper (as in screenshot: “Tap to view details”) */}
            <HStack className="justify-center pt-6">
              <Text className="text-xs" style={{ color: 'rgba(51,58,49,0.6)' }}>
                Tap to view details
              </Text>
            </HStack>
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}