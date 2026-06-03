import { supabase } from './supabaseClient';

export type PublicAnnouncementAudience = 'all' | 'client' | 'professional' | 'web';
export type PublicAnnouncementPlacement = 'banner' | 'dashboard' | 'modal' | 'support';
export type PublicAnnouncementChannel = 'web' | 'app';
export type PublicAnnouncementChannelScope = 'both' | 'web' | 'app';

export interface PublicAnnouncementRecord {
  id: string;
  audience: PublicAnnouncementAudience;
  placement: PublicAnnouncementPlacement;
  channel_scope: PublicAnnouncementChannelScope;
  title: string;
  body: string;
  cta_label: string | null;
  cta_href: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  updated_at: string;
}

interface GetPublicAnnouncementsInput {
  channel: PublicAnnouncementChannel;
  audiences: PublicAnnouncementAudience[];
  placements?: PublicAnnouncementPlacement[];
}

export async function getPublicAnnouncements({
  channel,
  audiences,
  placements,
}: GetPublicAnnouncementsInput): Promise<PublicAnnouncementRecord[]> {
  const requestedAudiences = Array.from(new Set(audiences));
  const channelScopes: PublicAnnouncementChannelScope[] = ['both', channel];

  let query = supabase
    .from('announcements')
    .select(
      'id,audience,placement,channel_scope,title,body,cta_label,cta_href,starts_at,ends_at,active,updated_at',
    )
    .in('channel_scope', channelScopes)
    .in('audience', requestedAudiences)
    .order('starts_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false });

  if (placements?.length) {
    query = query.in('placement', placements);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as PublicAnnouncementRecord[];
}
