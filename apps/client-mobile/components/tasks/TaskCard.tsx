import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { IconTile } from './IconTile';
import { StatusPill } from './StatusPill';

interface TaskCardProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconTone?: 'sage' | 'orange' | 'taupe';
  title: string;
  timeLine1: string;
  timeLine2: string;
  statusLabel: string;
  statusTone?: 'scheduled' | 'progress' | 'neutral';
  bookingId?: number;
  onPress?: () => void;
}

export function TaskCard({
  icon,
  iconTone = 'sage',
  title,
  timeLine1,
  timeLine2,
  statusLabel,
  statusTone,
  bookingId,
  onPress,
}: TaskCardProps) {
  const IconComp = icon;
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress}
      className="bg-bg-primary border border-border rounded-lg mx-4 my-2 shadow-sm"
    >
      <VStack className="p-4">
        <HStack className="items-start justify-between">
          <HStack className="space-x-3 flex-1">
            <IconTile tone={iconTone}>
              <IconComp size={20} color="#D9896C" />
            </IconTile>

            <VStack className="flex-1 ml-3">
              <Text className="text-sm font-work-sans font-medium mb-1 text-text-primary leading-5">
                {title}
              </Text>

              <Text className="text-xs font-work-sans text-text-secondary leading-4 mb-0.5">
                {timeLine1}
              </Text>
              <Text className="text-xs font-work-sans text-text-tertiary leading-4">
                {timeLine2}
              </Text>
            </VStack>
          </HStack>

          <VStack className="items-end">
            <StatusPill label={statusLabel} tone={statusTone} />
            <Pressable className="mt-2" onPress={() => router.push('/tasks/details')}>
              <Text className="text-xs font-work-sans font-medium text-clay-orange leading-4">
                View Details
              </Text>
            </Pressable>
          </VStack>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default TaskCard;