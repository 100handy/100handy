'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  getPublicAnnouncements,
  type PublicAnnouncementAudience,
  type PublicAnnouncementPlacement,
  type PublicAnnouncementRecord,
} from '@shared/supabase';
import { useAuthContext } from '@/components/providers/auth-provider';

function useWebAnnouncements() {
  const { user } = useAuthContext();
  const role = user?.user_metadata?.role;
  const audiences = useMemo<PublicAnnouncementAudience[]>(() => {
    const next: PublicAnnouncementAudience[] = ['all', 'web'];
    if (role === 'handy') {
      next.push('professional');
    } else if (user) {
      next.push('client');
    }
    return Array.from(new Set(next));
  }, [role, user]);

  const [announcements, setAnnouncements] = useState<PublicAnnouncementRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    getPublicAnnouncements({
      channel: 'web',
      audiences,
    })
      .then((data) => {
        if (!cancelled) {
          setAnnouncements(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load public web announcements:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [audiences]);

  return announcements;
}

function AnnouncementLink({
  announcement,
  className,
}: {
  announcement: PublicAnnouncementRecord;
  className?: string;
}) {
  if (!announcement.cta_href || !announcement.cta_label) {
    return null;
  }

  const isExternal = /^https?:\/\//.test(announcement.cta_href);

  if (isExternal) {
    return (
      <a
        href={announcement.cta_href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {announcement.cta_label}
      </a>
    );
  }

  return (
    <Link href={announcement.cta_href} className={className}>
      {announcement.cta_label}
    </Link>
  );
}

export function GlobalAnnouncementsHost() {
  const pathname = usePathname();
  const announcements = useWebAnnouncements();
  const [dismissedModalIds, setDismissedModalIds] = useState<string[]>([]);

  const bannerAnnouncements = announcements.filter(
    (item) => item.placement === 'banner',
  );
  const activeModal = announcements.find(
    (item) =>
      item.placement === 'modal' && !dismissedModalIds.includes(item.id),
  );

  const supportsGlobalAnnouncements = pathname !== null;

  if (!supportsGlobalAnnouncements) {
    return null;
  }

  return (
    <>
      {bannerAnnouncements.length > 0 && (
        <div className="sticky top-0 z-[80] border-b border-[#d8c1ad] bg-[#f6e7db]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 text-sm text-brand-dark-alt md:px-6">
            {bannerAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">{announcement.title}</p>
                  <p className="text-brand-dark/80">{announcement.body}</p>
                </div>
                <AnnouncementLink
                  announcement={announcement}
                  className="text-sm font-semibold text-brand-terracotta hover:underline"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[520px] rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-brand-dark-alt">
                  {activeModal.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-dark/80">
                  {activeModal.body}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDismissedModalIds((current) => [...current, activeModal.id])
                }
                className="rounded-full p-2 text-brand-dark/70 hover:bg-gray-100"
                aria-label="Close announcement"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDismissedModalIds((current) => [...current, activeModal.id])
                }
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-brand-dark-alt"
              >
                Dismiss
              </button>
              <AnnouncementLink
                announcement={activeModal}
                className="rounded-lg bg-brand-terracotta px-4 py-2 text-sm font-semibold text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function InlineAnnouncements({
  placement,
  emptyFallback = null,
}: {
  placement: PublicAnnouncementPlacement;
  emptyFallback?: ReactNode;
}) {
  const announcements = useWebAnnouncements();
  const items = announcements.filter((item) => item.placement === placement);

  if (items.length === 0) {
    return <>{emptyFallback}</>;
  }

  return (
    <div className="mx-auto mb-8 flex w-full max-w-[1200px] flex-col gap-4 px-4 md:px-8">
      {items.map((announcement) => (
        <div
          key={announcement.id}
          className="rounded-lg border border-[#d8c1ad] bg-[#f8efe8] px-5 py-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-brand-dark-alt">
                {announcement.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-brand-dark/80">
                {announcement.body}
              </p>
            </div>
            <AnnouncementLink
              announcement={announcement}
              className="text-sm font-semibold text-brand-terracotta hover:underline"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
