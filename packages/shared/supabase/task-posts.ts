import { supabase } from './supabaseClient';

export type TaskPostStatus = 'open' | 'assigned' | 'completed' | 'cancelled';
export type BidStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';

export interface TaskPost {
  id: string;
  customer_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  address_street: string | null;
  address_postcode: string | null;
  address_city: string | null;
  address_country: string | null;
  latitude: number | null;
  longitude: number | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: TaskPostStatus;
  assigned_handy_id: string | null;
  assigned_bid_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskPostWithCategory extends TaskPost {
  category: { id: string; name: string } | null;
  bid_count?: number;
}

export interface TaskBid {
  id: string;
  task_post_id: string;
  handy_id: string;
  amount_cents: number;
  estimated_hours: number;
  message: string | null;
  status: BidStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskBidWithProfile extends TaskBid {
  handy_profile: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface CreateTaskPostInput {
  customer_id: string;
  category_id?: string;
  title: string;
  description?: string;
  budget_min_cents?: number;
  budget_max_cents?: number;
  address_street?: string;
  address_postcode?: string;
  address_city?: string;
  address_country?: string;
  latitude?: number;
  longitude?: number;
  preferred_date?: string;
  preferred_time?: string;
}

export interface CreateBidInput {
  task_post_id: string;
  handy_id: string;
  amount_cents: number;
  estimated_hours: number;
  message?: string;
}

// ==========================================
// Task Post Functions
// ==========================================

export async function createTaskPost(input: CreateTaskPostInput): Promise<TaskPost> {
  const { data, error } = await supabase
    .from('task_posts')
    .insert({
      customer_id: input.customer_id,
      category_id: input.category_id || null,
      title: input.title,
      description: input.description || null,
      budget_min_cents: input.budget_min_cents || null,
      budget_max_cents: input.budget_max_cents || null,
      address_street: input.address_street || null,
      address_postcode: input.address_postcode || null,
      address_city: input.address_city || null,
      address_country: input.address_country || 'UK',
      latitude: input.latitude || null,
      longitude: input.longitude || null,
      preferred_date: input.preferred_date || null,
      preferred_time: input.preferred_time || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task post:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function getOpenTaskPosts(options?: {
  categoryId?: string;
  limit?: number;
}): Promise<TaskPostWithCategory[]> {
  let query = supabase
    .from('task_posts')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching open task posts:', error);
    throw new Error(error.message);
  }
  return data || [];
}

export async function getMyTaskPosts(userId: string): Promise<TaskPostWithCategory[]> {
  const { data, error } = await supabase
    .from('task_posts')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my task posts:', error);
    throw new Error(error.message);
  }
  return data || [];
}

export async function getTaskPostById(postId: string): Promise<TaskPostWithCategory | null> {
  const { data, error } = await supabase
    .from('task_posts')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching task post:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function cancelTaskPost(postId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('task_posts')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', postId)
    .eq('customer_id', userId)
    .eq('status', 'open')
    .select();

  if (error || !data?.length) return false;
  return true;
}

// ==========================================
// Bid Functions
// ==========================================

export async function createBid(input: CreateBidInput): Promise<TaskBid> {
  const { data, error } = await supabase
    .from('task_bids')
    .insert({
      task_post_id: input.task_post_id,
      handy_id: input.handy_id,
      amount_cents: input.amount_cents,
      estimated_hours: input.estimated_hours,
      message: input.message || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating bid:', error);
    throw new Error(error.message);
  }

  // Send notification to task post owner
  supabase.functions
    .invoke('send-push-notification', {
      body: { event: 'new_bid', taskPostId: input.task_post_id },
    })
    .catch(() => undefined);

  return data;
}

export async function getBidsForTaskPost(postId: string): Promise<TaskBidWithProfile[]> {
  const { data: bids, error } = await supabase
    .from('task_bids')
    .select('*')
    .eq('task_post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching bids:', error);
    throw new Error(error.message);
  }

  if (!bids?.length) return [];

  // Fetch profiles for bidders
  const handyIds = [...new Set(bids.map((b) => b.handy_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name, avatar_url')
    .in('user_id', handyIds);

  const profileMap = new Map<string, TaskBidWithProfile['handy_profile']>();
  profiles?.forEach((p) => profileMap.set(p.user_id, p));

  return bids.map((bid) => ({
    ...bid,
    handy_profile: profileMap.get(bid.handy_id) || null,
  }));
}

export async function getMyBids(handyId: string): Promise<(TaskBid & { task_post: TaskPost | null })[]> {
  const { data, error } = await supabase
    .from('task_bids')
    .select(`
      *,
      task_post:task_posts(*)
    `)
    .eq('handy_id', handyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my bids:', error);
    throw new Error(error.message);
  }
  return data || [];
}

export async function acceptBid(
  postId: string,
  bidId: string,
  customerId: string
): Promise<boolean> {
  // Update task post to assigned
  const { error: postError } = await supabase
    .from('task_posts')
    .update({
      status: 'assigned',
      assigned_bid_id: bidId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .eq('customer_id', customerId)
    .eq('status', 'open');

  if (postError) {
    console.error('Error assigning task:', postError);
    return false;
  }

  // Get the bid to find the handy_id
  const { data: bid } = await supabase
    .from('task_bids')
    .select('handy_id')
    .eq('id', bidId)
    .single();

  if (bid) {
    // Update the accepted bid
    await supabase
      .from('task_bids')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', bidId);

    // Update assigned handy on task post
    await supabase
      .from('task_posts')
      .update({ assigned_handy_id: bid.handy_id })
      .eq('id', postId);

    // Decline all other bids
    await supabase
      .from('task_bids')
      .update({ status: 'declined', updated_at: new Date().toISOString() })
      .eq('task_post_id', postId)
      .neq('id', bidId)
      .eq('status', 'pending');

    // Notify the winning bidder
    supabase.functions
      .invoke('send-push-notification', {
        body: { event: 'bid_accepted', taskPostId: postId, bidId },
      })
      .catch(() => undefined);
  }

  return true;
}

export async function withdrawBid(bidId: string, handyId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('task_bids')
    .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
    .eq('id', bidId)
    .eq('handy_id', handyId)
    .eq('status', 'pending')
    .select();

  if (error || !data?.length) return false;
  return true;
}
