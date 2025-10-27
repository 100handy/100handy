// TypeScript types for Supabase tables
export interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  postcode: string | null;
  avatar_url: string | null;
  role: 'customer' | 'handy' | 'admin';
  rating: number;
  jobs_completed: number;
  created_at: string;
}

export interface ProfileWithAuth extends UserProfile {
  email: string;
  emailVerified: boolean;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  postcode?: string;
  avatar_url?: string;
}

export interface NotificationSettings {
  user_id: string;
  push_notifications: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  marketing_emails: boolean;
  marketing_sms: boolean;
  marketing_push: boolean;
}

export interface BusinessInfo {
  id: string;
  user_id: string;
  vat_id: string | null;
  company_name: string | null;
  business_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  amount_cents: number;
  expires_at: string | null;
  max_uses: number;
  current_uses: number;
  created_at: string;
}

export interface PromoCodeRedemption {
  id: string;
  user_id: string;
  promo_code_id: string;
  amount_cents: number;
  redeemed_at: string;
}

export interface Transaction {
  id: string;
  booking_id: string;
  amount_cents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  task_title?: string;
  category_name?: string;
  scheduled_date?: string;
}

