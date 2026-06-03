import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import {
  getPublicAnnouncements,
  type PublicAnnouncementAudience,
  type PublicAnnouncementPlacement,
  type PublicAnnouncementRecord,
} from '@shared/supabase';
import { useAuthStore } from '@shared/store';

function useAppAnnouncements() {
  const userRole = useAuthStore((state) => state.userRole);
  const audiences = useMemo<PublicAnnouncementAudience[]>(() => {
    const next: PublicAnnouncementAudience[] = ['all'];
    if (userRole === 'handy') {
      next.push('professional');
    } else {
      next.push('client');
    }
    return Array.from(new Set(next));
  }, [userRole]);
  const [announcements, setAnnouncements] = useState<PublicAnnouncementRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    getPublicAnnouncements({
      channel: 'app',
      audiences,
    })
      .then((data) => {
        if (!cancelled) {
          setAnnouncements(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load app announcements:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [audiences]);

  return announcements;
}

async function openAnnouncementLink(announcement: PublicAnnouncementRecord) {
  if (!announcement.cta_href) {
    return;
  }

  try {
    await Linking.openURL(announcement.cta_href);
  } catch (error) {
    console.error('Failed to open announcement CTA link:', error);
  }
}

function AnnouncementCard({
  announcement,
  compact = false,
}: {
  announcement: PublicAnnouncementRecord;
  compact?: boolean;
}) {
  return (
    <View className="rounded-2xl border border-[#E2D3C7] bg-[#F7EEE7] px-4 py-4">
      <Text className="font-worksans-semibold text-[16px] text-[#30352D]">
        {announcement.title}
      </Text>
      <Text className="mt-2 font-worksans text-[14px] leading-6 text-[#4B5448]">
        {announcement.body}
      </Text>
      {announcement.cta_label && announcement.cta_href ? (
        <Pressable
          onPress={() => {
            void openAnnouncementLink(announcement);
          }}
          className="mt-3 self-start rounded-full bg-[#C1856A] px-4 py-2"
        >
          <Text className="font-worksans-semibold text-[13px] text-white">
            {announcement.cta_label}
          </Text>
        </Pressable>
      ) : null}
      {!compact && announcement.starts_at ? (
        <Text className="mt-3 font-worksans text-[12px] text-[#7B8477]">
          Live from {new Date(announcement.starts_at).toLocaleDateString()}
        </Text>
      ) : null}
    </View>
  );
}

export function GlobalAppAnnouncementsHost() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const announcements = useAppAnnouncements();
  const [dismissedModalIds, setDismissedModalIds] = useState<string[]>([]);

  const isAuthenticatedAppSurface =
    segments[0] === '(client)' || segments[0] === '(professional)';

  const bannerAnnouncements = announcements.filter(
    (item) => item.placement === 'banner',
  );
  const modalAnnouncement = announcements.find(
    (item) =>
      item.placement === 'modal' && !dismissedModalIds.includes(item.id),
  );

  if (!isAuthenticatedAppSurface) {
    return null;
  }

  return (
    <>
      {bannerAnnouncements.length > 0 ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: insets.top + 6,
            left: 12,
            right: 12,
            zIndex: 80,
          }}
        >
          <View className="gap-3">
            {bannerAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                compact
              />
            ))}
          </View>
        </View>
      ) : null}

      {modalAnnouncement ? (
        <Modal
          isOpen
          onClose={() =>
            setDismissedModalIds((current) => [...current, modalAnnouncement.id])
          }
        >
          <ModalBackdrop />
          <ModalContent className="bg-white">
            <ModalBody>
              <View className="px-4 py-5">
                <View className="mb-3 flex-row items-start justify-between">
                  <Text className="mr-4 flex-1 font-worksans-semibold text-[18px] text-[#30352D]">
                    {modalAnnouncement.title}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setDismissedModalIds((current) => [
                        ...current,
                        modalAnnouncement.id,
                      ])
                    }
                  >
                    <X color="#30352D" size={20} strokeWidth={2} />
                  </Pressable>
                </View>
                <Text className="font-worksans text-[14px] leading-6 text-[#4B5448]">
                  {modalAnnouncement.body}
                </Text>
                <View className="mt-5 flex-row justify-end gap-3">
                  <Pressable
                    onPress={() =>
                      setDismissedModalIds((current) => [
                        ...current,
                        modalAnnouncement.id,
                      ])
                    }
                    className="rounded-full border border-[#D6D6D6] px-4 py-2"
                  >
                    <Text className="font-worksans-medium text-[13px] text-[#30352D]">
                      Dismiss
                    </Text>
                  </Pressable>
                  {modalAnnouncement.cta_label && modalAnnouncement.cta_href ? (
                    <Pressable
                      onPress={() => {
                        void openAnnouncementLink(modalAnnouncement);
                      }}
                      className="rounded-full bg-[#C1856A] px-4 py-2"
                    >
                      <Text className="font-worksans-semibold text-[13px] text-white">
                        {modalAnnouncement.cta_label}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}

export function InlineAppAnnouncements({
  placement,
}: {
  placement: PublicAnnouncementPlacement;
}) {
  const announcements = useAppAnnouncements().filter(
    (item) => item.placement === placement,
  );

  if (announcements.length === 0) {
    return null;
  }

  return (
    <View className="px-5 pt-4">
      <View className="gap-3">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </View>
    </View>
  );
}

export function AppAnnouncementsFeed() {
  const announcements = useAppAnnouncements();

  if (announcements.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-worksans-semibold text-[16px] text-[#30352D]">
          No new announcements
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </View>
    </ScrollView>
  );
}
