import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

type PushEvent =
  | { event: 'chat_message'; conversationId: string; messagePreview?: string }
  | { event: 'booking_status'; bookingId: string; status: string }
  | { event: 'test'; route?: string; title?: string; body?: string }
  | { event: 'admin_campaign'; delivery_job_id: string };

type UserRole = 'customer' | 'handy' | 'admin';

function json(resBody: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(resBody), {
    ...init,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
}

function buildChatRouteForRecipient(role: UserRole, conversationId: string): string {
  return role === 'handy'
    ? `/(professional)/chat/${conversationId}`
    : `/(client)/chat/conversation?conversationId=${encodeURIComponent(conversationId)}`;
}

function buildBookingRouteForRecipient(role: UserRole, bookingId: string): string {
  return role === 'handy'
    ? `/(professional)/job-details/${bookingId}`
    : `/(client)/booking-details/${bookingId}`;
}

async function handleAdminCampaign(
  serviceClient: ReturnType<typeof createClient>,
  userId: string,
  deliveryJobId: string,
) {
  const { data: adminProfile, error: adminProfileError } = await serviceClient
    .from('profiles')
    .select('role, admin_role, account_status')
    .eq('user_id', userId)
    .maybeSingle();

  if (adminProfileError) throw adminProfileError;
  if (
    !adminProfile ||
    adminProfile.role !== 'admin' ||
    adminProfile.account_status !== 'active'
  ) {
    return json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: job, error: jobError } = await serviceClient
    .from('push_delivery_jobs')
    .select('*')
    .eq('id', deliveryJobId)
    .single();

  if (jobError || !job) {
    return json({ error: 'Delivery job not found' }, { status: 404 });
  }

  await serviceClient
    .from('push_delivery_jobs')
    .update({ delivery_status: 'processing', error_message: null })
    .eq('id', deliveryJobId);

  const { data: profiles, error: profilesError } = await serviceClient
    .from('profiles')
    .select('user_id, role, account_status');

  if (profilesError) throw profilesError;

  const recipients = (profiles ?? []).filter((row) => {
    if (row.account_status !== 'active') return false;
    switch (job.recipient_group) {
      case 'client':
      case 'new_users':
        return row.role === 'client' || row.role === 'customer';
      case 'professional':
      case 'new_handys':
        return row.role === 'professional' || row.role === 'handy';
      case 'admin':
        return row.role === 'admin';
      case 'all':
      default:
        return row.role === 'client' || row.role === 'customer' || row.role === 'professional' || row.role === 'handy';
    }
  });

  const recipientIds = recipients.map((row) => row.user_id);
  if (recipientIds.length === 0) {
    await serviceClient
      .from('push_delivery_jobs')
      .update({
        delivery_status: 'sent',
        recipient_count: 0,
        sent_count: 0,
        failed_count: 0,
        completed_at: new Date().toISOString(),
      })
      .eq('id', deliveryJobId);
    return json({ ok: true, sent: 0, skipped: true, reason: 'no recipients' });
  }

  const [{ data: settings, error: settingsError }, { data: tokens, error: tokensError }] = await Promise.all([
    serviceClient
      .from('notification_settings')
      .select('user_id, push_notifications')
      .in('user_id', recipientIds),
    serviceClient
      .from('device_push_tokens')
      .select('user_id, expo_push_token')
      .in('user_id', recipientIds),
  ]);

  if (settingsError) throw settingsError;
  if (tokensError) throw tokensError;

  const pushEnabledByUser = new Map(
    (settings ?? []).map((row) => [row.user_id, row.push_notifications !== false]),
  );

  const recipientUsers = recipientIds.filter((userId) => pushEnabledByUser.get(userId) !== false);
  const tokenRows = (tokens ?? []).filter(
    (row) =>
      recipientUsers.includes(row.user_id) &&
      typeof row.expo_push_token === 'string' &&
      row.expo_push_token.length > 0,
  );

  const uniqueTokens = [...new Set(tokenRows.map((row) => row.expo_push_token))];

  if (uniqueTokens.length === 0) {
    await serviceClient
      .from('push_delivery_jobs')
      .update({
        delivery_status: 'sent',
        recipient_count: recipientUsers.length,
        sent_count: 0,
        failed_count: 0,
        completed_at: new Date().toISOString(),
        error_message: 'No device tokens available for the selected audience.',
      })
      .eq('id', deliveryJobId);
    return json({ ok: true, sent: 0, skipped: true, reason: 'no device tokens' });
  }

  const messages = uniqueTokens.map((to) => ({
    to,
    sound: 'default',
    title: job.message_title,
    body: job.message_body,
    data: { route: job.route ?? '/' },
  }));

  const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages.length === 1 ? messages[0] : messages),
  });

  const expoJson = await expoRes.json().catch(() => null);

  if (!expoRes.ok) {
    const errorMessage = `Expo push send failed (${expoRes.status})`;
    await serviceClient
      .from('push_delivery_jobs')
      .update({
        delivery_status: 'failed',
        recipient_count: recipientUsers.length,
        sent_count: 0,
        failed_count: uniqueTokens.length,
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq('id', deliveryJobId);

    return json({ error: errorMessage, details: expoJson }, { status: 502 });
  }

  const resultRows = Array.isArray(expoJson?.data) ? expoJson.data : expoJson?.data ? [expoJson.data] : [];
  const sentCount = resultRows.filter((row: { status?: string }) => row?.status === 'ok').length || uniqueTokens.length;
  const failedCount = Math.max(uniqueTokens.length - sentCount, 0);

  await serviceClient
    .from('push_delivery_jobs')
    .update({
      delivery_status: failedCount > 0 && sentCount === 0 ? 'failed' : 'sent',
      recipient_count: recipientUsers.length,
      sent_count: sentCount,
      failed_count: failedCount,
      error_message: failedCount > 0 ? `${failedCount} push deliveries failed.` : null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', deliveryJobId);

  return json({
    ok: true,
    sent: sentCount,
    failed: failedCount,
    recipient_count: recipientUsers.length,
    expo: expoJson,
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
    } = await userClient.auth.getUser();

    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await req.json()) as PushEvent;

    if (payload.event === 'admin_campaign') {
      const deliveryJobId = payload.delivery_job_id?.trim();
      if (!deliveryJobId) {
        return json({ error: 'delivery_job_id is required' }, { status: 400 });
      }
      return await handleAdminCampaign(serviceClient, user.id, deliveryJobId);
    }

    let recipientId: string | null = null;
    let title = '100Handy';
    let body = 'You have an update';
    let route: string | null = null;

    if (payload.event === 'chat_message') {
      const { conversationId, messagePreview } = payload;
      if (!conversationId) {
        return json({ error: 'conversationId is required' }, { status: 400 });
      }

      const { data: conversation, error: convErr } = await serviceClient
        .from('conversations')
        .select('id, client_id, tasker_id')
        .eq('id', conversationId)
        .single();

      if (convErr || !conversation) {
        return json({ error: 'Conversation not found' }, { status: 404 });
      }

      if (user.id !== conversation.client_id && user.id !== conversation.tasker_id) {
        return json({ error: 'Forbidden' }, { status: 403 });
      }

      recipientId = user.id === conversation.client_id ? conversation.tasker_id : conversation.client_id;

      // Sender name for nicer title (best-effort)
      const { data: senderProfile } = await serviceClient
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const senderName =
        senderProfile?.first_name || senderProfile?.last_name
          ? `${senderProfile?.first_name ?? ''} ${senderProfile?.last_name ?? ''}`.trim()
          : 'New message';

      const { data: recipientProfile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('user_id', recipientId)
        .maybeSingle();

      const recipientRole = (recipientProfile?.role ?? 'customer') as UserRole;

      title = senderName;
      body = messagePreview?.slice(0, 140) || 'Sent you a message';
      route = buildChatRouteForRecipient(recipientRole, conversationId);
    }

    if (payload.event === 'booking_status') {
      const { bookingId, status } = payload;
      if (!bookingId || !status) {
        return json({ error: 'bookingId and status are required' }, { status: 400 });
      }

      const { data: booking, error: bookingErr } = await serviceClient
        .from('bookings')
        .select('id, customer_id, handy_id, task_title, status')
        .eq('id', bookingId)
        .single();

      if (bookingErr || !booking) {
        return json({ error: 'Booking not found' }, { status: 404 });
      }

      if (user.id !== booking.customer_id && user.id !== booking.handy_id) {
        return json({ error: 'Forbidden' }, { status: 403 });
      }

      recipientId = user.id === booking.customer_id ? booking.handy_id : booking.customer_id;

      const { data: recipientProfile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('user_id', recipientId)
        .maybeSingle();

      const recipientRole = (recipientProfile?.role ?? 'customer') as UserRole;
      route = buildBookingRouteForRecipient(recipientRole, bookingId);

      title = 'Booking update';
      const taskTitle = booking.task_title ? `“${booking.task_title}”` : 'your booking';
      const s = status.toLowerCase();
      if (s === 'accepted') body = `Your booking ${taskTitle} was accepted`;
      else if (s === 'in_progress') body = `Your booking ${taskTitle} has started`;
      else if (s === 'completed') body = `Your booking ${taskTitle} was completed`;
      else if (s === 'cancelled') body = `Your booking ${taskTitle} was cancelled`;
      else body = `Booking status changed to ${status}`;
    }

    if (payload.event === 'test') {
      recipientId = user.id;
      title = payload.title ?? 'Test notification';
      body = payload.body ?? 'This is a test push notification.';
      route = payload.route ?? '/';
    }

    if (!recipientId) {
      return json({ error: 'Unable to determine recipient' }, { status: 400 });
    }

    // Respect recipient preferences
    const { data: settings } = await serviceClient
      .from('notification_settings')
      .select('push_notifications')
      .eq('user_id', recipientId)
      .maybeSingle();

    if (settings?.push_notifications === false) {
      return json({ ok: true, skipped: true, reason: 'push_notifications disabled' });
    }

    const { data: tokens, error: tokensErr } = await serviceClient
      .from('device_push_tokens')
      .select('expo_push_token')
      .eq('user_id', recipientId);

    if (tokensErr) {
      return json({ error: 'Failed to fetch device tokens' }, { status: 500 });
    }

    const expoPushTokens = (tokens ?? [])
      .map((t) => t.expo_push_token)
      .filter((t) => typeof t === 'string' && t.length > 0);

    if (expoPushTokens.length === 0) {
      return json({ ok: true, skipped: true, reason: 'no device tokens' });
    }

    const messages = expoPushTokens.map((to) => ({
      to,
      sound: 'default',
      title,
      body,
      data: { route },
    }));

    const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages.length === 1 ? messages[0] : messages),
    });

    const expoJson = await expoRes.json().catch(() => null);

    if (!expoRes.ok) {
      return json(
        { error: 'Expo push send failed', status: expoRes.status, details: expoJson },
        { status: 502 }
      );
    }

    return json({ ok: true, sent: expoPushTokens.length, route, expo: expoJson });
  } catch (error: any) {
    console.error('send-push-notification error:', error);
    return json({ error: error?.message ?? 'Unknown error' }, { status: 500 });
  }
});

