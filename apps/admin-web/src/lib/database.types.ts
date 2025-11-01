/**
 * Database type definitions
 *
 * This file contains TypeScript types for the Supabase database schema.
 * To regenerate these types after schema changes, run:
 *
 *   npx supabase gen types typescript --project-id <project-id> > src/lib/database.types.ts
 *
 * Or with local Supabase:
 *   npx supabase gen types typescript --local > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'handy' | 'admin'
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          role: UserRole
          first_name: string | null
          last_name: string | null
          phone: string | null
          postcode: string | null
          avatar_url: string | null
          rating: number
          jobs_completed: number
          created_at: string
        }
        Insert: {
          user_id: string
          role?: UserRole
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          postcode?: string | null
          avatar_url?: string | null
          rating?: number
          jobs_completed?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: UserRole
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          postcode?: string | null
          avatar_url?: string | null
          rating?: number
          jobs_completed?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string | null
          handy_id: string | null
          category_id: string | null
          task_title: string
          task_details: string | null
          scheduled_date: string
          scheduled_time: string
          address_id: string | null
          hourly_rate_cents: number
          estimated_hours: number
          status: BookingStatus
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          handy_id?: string | null
          category_id?: string | null
          task_title: string
          task_details?: string | null
          scheduled_date: string
          scheduled_time: string
          address_id?: string | null
          hourly_rate_cents: number
          estimated_hours?: number
          status?: BookingStatus
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          handy_id?: string | null
          category_id?: string | null
          task_title?: string
          task_details?: string | null
          scheduled_date?: string
          scheduled_time?: string
          address_id?: string | null
          hourly_rate_cents?: number
          estimated_hours?: number
          status?: BookingStatus
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string | null
          amount_cents: number
          status: PaymentStatus
          stripe_payment_intent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          amount_cents: number
          status?: PaymentStatus
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          amount_cents?: number
          status?: PaymentStatus
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
      }
      handy_profiles: {
        Row: {
          user_id: string
          bio: string | null
          hourly_rate_cents: number
          experience_years: number
          verified: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          bio?: string | null
          hourly_rate_cents?: number
          experience_years?: number
          verified?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          bio?: string | null
          hourly_rate_cents?: number
          experience_years?: number
          verified?: boolean
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string | null
          street: string
          apartment: string | null
          postcode: string
          city: string | null
          country: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          street: string
          apartment?: string | null
          postcode: string
          city?: string | null
          country?: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          street?: string
          apartment?: string | null
          postcode?: string
          city?: string | null
          country?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string | null
          customer_id: string | null
          handy_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          customer_id?: string | null
          handy_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          customer_id?: string | null
          handy_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      notification_settings: {
        Row: {
          user_id: string
          push_notifications: boolean
          sms_notifications: boolean
          email_notifications: boolean
          marketing_emails: boolean
        }
        Insert: {
          user_id: string
          push_notifications?: boolean
          sms_notifications?: boolean
          email_notifications?: boolean
          marketing_emails?: boolean
        }
        Update: {
          user_id?: string
          push_notifications?: boolean
          sms_notifications?: boolean
          email_notifications?: boolean
          marketing_emails?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      booking_status: BookingStatus
      payment_status: PaymentStatus
    }
  }
}
