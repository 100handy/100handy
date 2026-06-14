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
      admin_audit_logs: {
        Row: {
          id: string
          actor_id: string
          actor_admin_role:
            | 'super_admin'
            | 'content_admin'
            | 'ops_admin'
            | 'support_admin'
            | 'finance_admin'
            | 'seo_admin'
            | null
          action: string
          entity_type: string
          entity_id: string | null
          summary: string
          metadata_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          actor_id: string
          actor_admin_role?:
            | 'super_admin'
            | 'content_admin'
            | 'ops_admin'
            | 'support_admin'
            | 'finance_admin'
            | 'seo_admin'
            | null
          action: string
          entity_type: string
          entity_id?: string | null
          summary: string
          metadata_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string
          actor_admin_role?:
            | 'super_admin'
            | 'content_admin'
            | 'ops_admin'
            | 'support_admin'
            | 'finance_admin'
            | 'seo_admin'
            | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          summary?: string
          metadata_json?: Json
          created_at?: string
        }
      }
      outreach_sources: {
        Row: {
          id: string
          source_key: string
          name: string
          platform: string
          source_type: 'customer_finder' | 'worker_finder' | 'mixed'
          url: string | null
          location: string | null
          service_type: string | null
          active: boolean
          notes: string | null
          apify_actor_id: string | null
          apify_input: Json
          field_mapping: Json
          default_service_type: string | null
          max_items: number
          schedule_cadence: 'off' | 'hourly' | 'every_6h' | 'every_12h' | 'daily' | 'weekly'
          schedule_enabled: boolean
          next_run_at: string | null
          last_run_at: string | null
          last_run_status: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          source_key: string
          name: string
          platform: string
          source_type: 'customer_finder' | 'worker_finder' | 'mixed'
          url?: string | null
          location?: string | null
          service_type?: string | null
          active?: boolean
          notes?: string | null
          apify_actor_id?: string | null
          apify_input?: Json
          field_mapping?: Json
          default_service_type?: string | null
          max_items?: number
          schedule_cadence?: 'off' | 'hourly' | 'every_6h' | 'every_12h' | 'daily' | 'weekly'
          schedule_enabled?: boolean
          next_run_at?: string | null
          last_run_at?: string | null
          last_run_status?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          source_key?: string
          name?: string
          platform?: string
          source_type?: 'customer_finder' | 'worker_finder' | 'mixed'
          url?: string | null
          location?: string | null
          service_type?: string | null
          active?: boolean
          notes?: string | null
          apify_actor_id?: string | null
          apify_input?: Json
          field_mapping?: Json
          default_service_type?: string | null
          max_items?: number
          schedule_cadence?: 'off' | 'hourly' | 'every_6h' | 'every_12h' | 'daily' | 'weekly'
          schedule_enabled?: boolean
          next_run_at?: string | null
          last_run_at?: string | null
          last_run_status?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      outreach_discovery_runs: {
        Row: {
          id: string
          source_id: string
          apify_run_id: string | null
          apify_dataset_id: string | null
          status: 'queued' | 'running' | 'succeeded' | 'failed' | 'ingested' | 'aborted' | 'timed_out'
          trigger: 'manual' | 'scheduled'
          triggered_by: string | null
          items_scraped: number
          items_new: number
          items_duplicate: number
          items_skipped: number
          leads_created: number
          error: string | null
          metadata: Json
          started_at: string | null
          finished_at: string | null
          ingested_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_id: string
          apify_run_id?: string | null
          apify_dataset_id?: string | null
          status?: 'queued' | 'running' | 'succeeded' | 'failed' | 'ingested' | 'aborted' | 'timed_out'
          trigger?: 'manual' | 'scheduled'
          triggered_by?: string | null
          items_scraped?: number
          items_new?: number
          items_duplicate?: number
          items_skipped?: number
          leads_created?: number
          error?: string | null
          metadata?: Json
          started_at?: string | null
          finished_at?: string | null
          ingested_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          apify_run_id?: string | null
          apify_dataset_id?: string | null
          status?: 'queued' | 'running' | 'succeeded' | 'failed' | 'ingested' | 'aborted' | 'timed_out'
          trigger?: 'manual' | 'scheduled'
          triggered_by?: string | null
          items_scraped?: number
          items_new?: number
          items_duplicate?: number
          items_skipped?: number
          leads_created?: number
          error?: string | null
          metadata?: Json
          started_at?: string | null
          finished_at?: string | null
          ingested_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      outreach_raw_items: {
        Row: {
          id: string
          run_id: string
          source_id: string
          external_id: string | null
          raw_payload: Json
          raw_text: string | null
          source_url: string | null
          dedup_key: string | null
          status: 'new' | 'classified' | 'lead_created' | 'duplicate' | 'skipped' | 'error'
          lead_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          run_id: string
          source_id: string
          external_id?: string | null
          raw_payload?: Json
          raw_text?: string | null
          source_url?: string | null
          dedup_key?: string | null
          status?: 'new' | 'classified' | 'lead_created' | 'duplicate' | 'skipped' | 'error'
          lead_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          run_id?: string
          source_id?: string
          external_id?: string | null
          raw_payload?: Json
          raw_text?: string | null
          source_url?: string | null
          dedup_key?: string | null
          status?: 'new' | 'classified' | 'lead_created' | 'duplicate' | 'skipped' | 'error'
          lead_id?: string | null
          created_at?: string
        }
      }
      outreach_leads: {
        Row: {
          id: string
          source_id: string | null
          lead_type: 'customer' | 'worker'
          source_platform: string
          source_url: string | null
          source_posted_at: string | null
          profile_name: string | null
          profile_url: string | null
          business_name: string | null
          location: string | null
          coverage_area: string | null
          service_type: string
          urgency: 'low' | 'medium' | 'high' | null
          intent_strength: 'low' | 'medium' | 'high' | null
          source_confidence: 'low' | 'medium' | 'high' | null
          raw_text: string
          evidence_text: string | null
          public_contact_method: 'website' | 'email' | 'phone' | 'social_profile' | 'profile_only' | 'unknown' | null
          contact_detail: string | null
          contact_allowed: 'yes' | 'no' | 'unknown'
          ai_score: number | null
          ai_summary: string | null
          status: 'new' | 'reviewed' | 'approved' | 'contacted' | 'replied' | 'rejected' | 'closed'
          approval_status: 'pending' | 'approved' | 'rejected'
          do_not_contact_reason: string | null
          duplicate_check_key: string | null
          converted_user_id: string | null
          converted_booking_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          source_id?: string | null
          lead_type: 'customer' | 'worker'
          source_platform: string
          source_url?: string | null
          source_posted_at?: string | null
          profile_name?: string | null
          profile_url?: string | null
          business_name?: string | null
          location?: string | null
          coverage_area?: string | null
          service_type: string
          urgency?: 'low' | 'medium' | 'high' | null
          intent_strength?: 'low' | 'medium' | 'high' | null
          source_confidence?: 'low' | 'medium' | 'high' | null
          raw_text: string
          evidence_text?: string | null
          public_contact_method?: 'website' | 'email' | 'phone' | 'social_profile' | 'profile_only' | 'unknown' | null
          contact_detail?: string | null
          contact_allowed?: 'yes' | 'no' | 'unknown'
          ai_score?: number | null
          ai_summary?: string | null
          status?: 'new' | 'reviewed' | 'approved' | 'contacted' | 'replied' | 'rejected' | 'closed'
          approval_status?: 'pending' | 'approved' | 'rejected'
          do_not_contact_reason?: string | null
          duplicate_check_key?: string | null
          converted_user_id?: string | null
          converted_booking_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          source_id?: string | null
          lead_type?: 'customer' | 'worker'
          source_platform?: string
          source_url?: string | null
          source_posted_at?: string | null
          profile_name?: string | null
          profile_url?: string | null
          business_name?: string | null
          location?: string | null
          coverage_area?: string | null
          service_type?: string
          urgency?: 'low' | 'medium' | 'high' | null
          intent_strength?: 'low' | 'medium' | 'high' | null
          source_confidence?: 'low' | 'medium' | 'high' | null
          raw_text?: string
          evidence_text?: string | null
          public_contact_method?: 'website' | 'email' | 'phone' | 'social_profile' | 'profile_only' | 'unknown' | null
          contact_detail?: string | null
          contact_allowed?: 'yes' | 'no' | 'unknown'
          ai_score?: number | null
          ai_summary?: string | null
          status?: 'new' | 'reviewed' | 'approved' | 'contacted' | 'replied' | 'rejected' | 'closed'
          approval_status?: 'pending' | 'approved' | 'rejected'
          do_not_contact_reason?: string | null
          duplicate_check_key?: string | null
          converted_user_id?: string | null
          converted_booking_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      outreach_messages: {
        Row: {
          id: string
          lead_id: string
          message_type: 'initial' | 'follow_up' | 'reply_note'
          channel: 'manual' | 'email' | 'phone' | 'website_form' | 'social_dm' | 'comment' | 'other'
          draft_text: string
          personalised_reason: string | null
          approval_status: 'pending' | 'approved' | 'rejected'
          delivery_status: 'not_sent' | 'queued' | 'sent' | 'failed' | 'replied'
          approved_by: string | null
          approved_at: string | null
          sent_by: string | null
          sent_at: string | null
          external_message_url: string | null
          failure_reason: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          message_type?: 'initial' | 'follow_up' | 'reply_note'
          channel?: 'manual' | 'email' | 'phone' | 'website_form' | 'social_dm' | 'comment' | 'other'
          draft_text: string
          personalised_reason?: string | null
          approval_status?: 'pending' | 'approved' | 'rejected'
          delivery_status?: 'not_sent' | 'queued' | 'sent' | 'failed' | 'replied'
          approved_by?: string | null
          approved_at?: string | null
          sent_by?: string | null
          sent_at?: string | null
          external_message_url?: string | null
          failure_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          message_type?: 'initial' | 'follow_up' | 'reply_note'
          channel?: 'manual' | 'email' | 'phone' | 'website_form' | 'social_dm' | 'comment' | 'other'
          draft_text?: string
          personalised_reason?: string | null
          approval_status?: 'pending' | 'approved' | 'rejected'
          delivery_status?: 'not_sent' | 'queued' | 'sent' | 'failed' | 'replied'
          approved_by?: string | null
          approved_at?: string | null
          sent_by?: string | null
          sent_at?: string | null
          external_message_url?: string | null
          failure_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      outreach_follow_ups: {
        Row: {
          id: string
          lead_id: string
          message_id: string | null
          due_at: string
          status: 'pending' | 'completed' | 'skipped' | 'cancelled'
          notes: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          message_id?: string | null
          due_at: string
          status?: 'pending' | 'completed' | 'skipped' | 'cancelled'
          notes?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          message_id?: string | null
          due_at?: string
          status?: 'pending' | 'completed' | 'skipped' | 'cancelled'
          notes?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          user_id: string
          role: UserRole
          admin_role:
            | 'super_admin'
            | 'content_admin'
            | 'ops_admin'
            | 'support_admin'
            | 'finance_admin'
            | 'seo_admin'
            | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          postcode: string | null
          avatar_url: string | null
          account_status: 'active' | 'paused' | 'deleted'
          status_reason: string | null
          status_updated_at: string
          deleted_at: string | null
          rating: number
          jobs_completed: number
          created_at: string
        }
        Insert: {
          user_id: string
          role?: UserRole
          admin_role?:
            | 'super_admin'
            | 'content_admin'
            | 'ops_admin'
            | 'support_admin'
            | 'finance_admin'
            | 'seo_admin'
            | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          postcode?: string | null
          avatar_url?: string | null
          account_status?: 'active' | 'paused' | 'deleted'
          status_reason?: string | null
          status_updated_at?: string
          deleted_at?: string | null
          rating?: number
          jobs_completed?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: UserRole
          admin_role?:
            | 'super_admin'
            | 'content_admin'
            | 'ops_admin'
            | 'support_admin'
            | 'finance_admin'
            | 'seo_admin'
            | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          postcode?: string | null
          avatar_url?: string | null
          account_status?: 'active' | 'paused' | 'deleted'
          status_reason?: string | null
          status_updated_at?: string
          deleted_at?: string | null
          rating?: number
          jobs_completed?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          active: boolean
          benefits_json: Json
          content_image_url: string | null
          created_at: string
          display_order: number
          faqs_json: Json
          hero_image_url: string | null
          id: string
          description: string | null
          icon_url: string | null
          level: number
          long_description: string | null
          marketing_description: string | null
          marketing_title: string | null
          name: string
          parent_id: string | null
          route_slug: string | null
          supports_recurring: boolean
          tasks_json: Json
          updated_at: string
        }
        Insert: {
          active?: boolean
          benefits_json?: Json
          content_image_url?: string | null
          created_at?: string
          display_order?: number
          faqs_json?: Json
          hero_image_url?: string | null
          id?: string
          description?: string | null
          icon_url?: string | null
          level?: number
          long_description?: string | null
          marketing_description?: string | null
          marketing_title?: string | null
          name: string
          parent_id?: string | null
          route_slug?: string | null
          supports_recurring?: boolean
          tasks_json?: Json
          updated_at?: string
        }
        Update: {
          active?: boolean
          benefits_json?: Json
          content_image_url?: string | null
          created_at?: string
          display_order?: number
          faqs_json?: Json
          hero_image_url?: string | null
          id?: string
          description?: string | null
          icon_url?: string | null
          level?: number
          long_description?: string | null
          marketing_description?: string | null
          marketing_title?: string | null
          name?: string
          parent_id?: string | null
          route_slug?: string | null
          supports_recurring?: boolean
          tasks_json?: Json
          updated_at?: string
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
          payment_status?: string | null
          payout_status?: string | null
          payout_amount_cents?: number | null
          platform_fee_cents?: number | null
          transfer_id?: string | null
          payment_intent_id?: string | null
          completed_at?: string | null
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
          payment_status?: string | null
          payout_status?: string | null
          payout_amount_cents?: number | null
          platform_fee_cents?: number | null
          transfer_id?: string | null
          payment_intent_id?: string | null
          completed_at?: string | null
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
          payment_status?: string | null
          payout_status?: string | null
          payout_amount_cents?: number | null
          platform_fee_cents?: number | null
          transfer_id?: string | null
          payment_intent_id?: string | null
          completed_at?: string | null
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
          refund_id?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          amount_cents: number
          status?: PaymentStatus
          stripe_payment_intent_id?: string | null
          refund_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          amount_cents?: number
          status?: PaymentStatus
          stripe_payment_intent_id?: string | null
          refund_id?: string | null
          created_at?: string
        }
      }
      disputes: {
        Row: {
          id: string
          booking_id: string
          customer_id: string | null
          provider_id: string | null
          assigned_to: string | null
          status: 'open' | 'investigating' | 'resolved' | 'refunded' | 'rejected'
          subject: string
          description: string
          resolution_summary: string | null
          refund_amount_cents: number | null
          opened_at: string
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          customer_id?: string | null
          provider_id?: string | null
          assigned_to?: string | null
          status?: 'open' | 'investigating' | 'resolved' | 'refunded' | 'rejected'
          subject: string
          description: string
          resolution_summary?: string | null
          refund_amount_cents?: number | null
          opened_at?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          customer_id?: string | null
          provider_id?: string | null
          assigned_to?: string | null
          status?: 'open' | 'investigating' | 'resolved' | 'refunded' | 'rejected'
          subject?: string
          description?: string
          resolution_summary?: string | null
          refund_amount_cents?: number | null
          opened_at?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dispute_messages: {
        Row: {
          id: string
          dispute_id: string
          sender_id: string
          message: string
          internal_only: boolean
          attachment_url: string | null
          attachment_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dispute_id: string
          sender_id: string
          message: string
          internal_only?: boolean
          attachment_url?: string | null
          attachment_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dispute_id?: string
          sender_id?: string
          message?: string
          internal_only?: boolean
          attachment_url?: string | null
          attachment_name?: string | null
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string | null
          subject: string | null
          status: string | null
          priority: string | null
          assigned_to: string | null
          last_message_at: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          subject?: string | null
          status?: string | null
          priority?: string | null
          assigned_to?: string | null
          last_message_at?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          subject?: string | null
          status?: string | null
          priority?: string | null
          assigned_to?: string | null
          last_message_at?: string | null
          updated_at?: string | null
          created_at?: string
        }
      }
      support_messages: {
        Row: {
          id: string
          ticket_id: string | null
          from_user: boolean
          message: string
          attachment_url: string | null
          attachment_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id?: string | null
          from_user: boolean
          message: string
          attachment_url?: string | null
          attachment_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string | null
          from_user?: boolean
          message?: string
          attachment_url?: string | null
          attachment_name?: string | null
          created_at?: string
        }
      }
      support_ticket_internal_notes: {
        Row: {
          id: string
          ticket_id: string
          admin_id: string
          note: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          admin_id: string
          note: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          admin_id?: string
          note?: string
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
          stripe_connect_account_id?: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          bio?: string | null
          hourly_rate_cents?: number
          experience_years?: number
          verified?: boolean
          stripe_connect_account_id?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          bio?: string | null
          hourly_rate_cents?: number
          experience_years?: number
          verified?: boolean
          stripe_connect_account_id?: string | null
          created_at?: string
        }
      }
      professional_work_areas: {
        Row: {
          id: string
          user_id: string
          coordinates: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          coordinates: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          coordinates?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      service_areas: {
        Row: {
          id: string
          city: string
          postcode_prefix: string
          location_area_id: string | null
          enabled: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city: string
          postcode_prefix: string
          location_area_id?: string | null
          enabled?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city?: string
          postcode_prefix?: string
          location_area_id?: string | null
          enabled?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      location_areas: {
        Row: {
          id: string
          name: string
          slug: string
          area_type: 'country' | 'nation' | 'region' | 'city' | 'borough' | 'postcode_area' | 'postcode_district'
          parent_id: string | null
          country_code: string
          enabled: boolean
          sort_order: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          area_type: 'country' | 'nation' | 'region' | 'city' | 'borough' | 'postcode_area' | 'postcode_district'
          parent_id?: string | null
          country_code?: string
          enabled?: boolean
          sort_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          area_type?: 'country' | 'nation' | 'region' | 'city' | 'borough' | 'postcode_area' | 'postcode_district'
          parent_id?: string | null
          country_code?: string
          enabled?: boolean
          sort_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      provider_service_areas: {
        Row: {
          id: string
          service_area_id: string
          provider_id: string
          assigned_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service_area_id: string
          provider_id: string
          assigned_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          service_area_id?: string
          provider_id?: string
          assigned_by?: string | null
          created_at?: string
        }
      }
      service_area_demand_logs: {
        Row: {
          id: string
          postcode_normalized: string
          postcode_outward: string
          category_id: string | null
          channel: 'web' | 'mobile'
          route: string | null
          available: boolean
          reason: string
          matched_area_id: string | null
          matched_prefix: string | null
          matched_city: string | null
          eligible_provider_count: number
          created_at: string
        }
        Insert: {
          id?: string
          postcode_normalized: string
          postcode_outward: string
          category_id?: string | null
          channel: 'web' | 'mobile'
          route?: string | null
          available: boolean
          reason: string
          matched_area_id?: string | null
          matched_prefix?: string | null
          matched_city?: string | null
          eligible_provider_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          postcode_normalized?: string
          postcode_outward?: string
          category_id?: string | null
          channel?: 'web' | 'mobile'
          route?: string | null
          available?: boolean
          reason?: string
          matched_area_id?: string | null
          matched_prefix?: string | null
          matched_city?: string | null
          eligible_provider_count?: number
          created_at?: string
        }
      }
      service_area_category_overrides: {
        Row: {
          id: string
          service_area_id: string
          category_id: string
          enabled: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_area_id: string
          category_id: string
          enabled?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_area_id?: string
          category_id?: string
          enabled?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rollout_presets: {
        Row: {
          id: string
          name: string
          description: string | null
          rollout_month: string
          status: 'draft' | 'scheduled' | 'applied' | 'archived'
          category_states: Json
          service_area_states: Json
          area_category_states: Json
          notes: string | null
          created_by: string | null
          applied_by: string | null
          applied_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          rollout_month: string
          status?: 'draft' | 'scheduled' | 'applied' | 'archived'
          category_states?: Json
          service_area_states?: Json
          area_category_states?: Json
          notes?: string | null
          created_by?: string | null
          applied_by?: string | null
          applied_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          rollout_month?: string
          status?: 'draft' | 'scheduled' | 'applied' | 'archived'
          category_states?: Json
          service_area_states?: Json
          area_category_states?: Json
          notes?: string | null
          created_by?: string | null
          applied_by?: string | null
          applied_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_method_configs: {
        Row: {
          id: string
          display_name: string
          provider_key: string
          method_type: 'gateway' | 'payout' | 'wallet' | 'bank_transfer'
          status: 'active' | 'inactive' | 'pending'
          public_enabled: boolean
          supported_currencies: string[]
          config_reference: string | null
          notes: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_name: string
          provider_key: string
          method_type: 'gateway' | 'payout' | 'wallet' | 'bank_transfer'
          status?: 'active' | 'inactive' | 'pending'
          public_enabled?: boolean
          supported_currencies?: string[]
          config_reference?: string | null
          notes?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          provider_key?: string
          method_type?: 'gateway' | 'payout' | 'wallet' | 'bank_transfer'
          status?: 'active' | 'inactive' | 'pending'
          public_enabled?: boolean
          supported_currencies?: string[]
          config_reference?: string | null
          notes?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_pricing_rules: {
        Row: {
          id: string
          category_id: string
          location_area_id: string | null
          currency_code: string
          rate_kind: 'hourly' | 'fixed'
          base_rate_cents: number
          active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          location_area_id?: string | null
          currency_code?: string
          rate_kind?: 'hourly' | 'fixed'
          base_rate_cents: number
          active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          location_area_id?: string | null
          currency_code?: string
          rate_kind?: 'hourly' | 'fixed'
          base_rate_cents?: number
          active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
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
          reviewer_type?: 'customer' | 'handy'
          private_notes?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          customer_id?: string | null
          handy_id?: string | null
          rating: number
          comment?: string | null
          reviewer_type?: 'customer' | 'handy'
          private_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          customer_id?: string | null
          handy_id?: string | null
          rating?: number
          comment?: string | null
          reviewer_type?: 'customer' | 'handy'
          private_notes?: string | null
          created_at?: string
        }
      }
      review_moderation_events: {
        Row: {
          id: string
          review_id: string
          admin_id: string
          action: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          admin_id: string
          action: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          admin_id?: string
          action?: string
          reason?: string | null
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
      device_push_tokens: {
        Row: {
          id: string
          user_id: string
          expo_push_token: string
          platform: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expo_push_token: string
          platform: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expo_push_token?: string
          platform?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_templates: {
        Row: {
          id: string
          template_key: string
          title: string
          template_kind: 'template' | 'campaign_draft'
          recipient_group: string
          subject: string
          preview_text: string | null
          body: string
          active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          template_key: string
          title: string
          template_kind: 'template' | 'campaign_draft'
          recipient_group: string
          subject: string
          preview_text?: string | null
          body: string
          active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          template_key?: string
          title?: string
          template_kind?: 'template' | 'campaign_draft'
          recipient_group?: string
          subject?: string
          preview_text?: string | null
          body?: string
          active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
      }
      email_delivery_jobs: {
        Row: {
          id: string
          template_id: string | null
          template_key: string
          title: string
          recipient_group: string
          subject: string
          preview_text: string | null
          body: string
          delivery_status: 'queued' | 'processing' | 'sent' | 'failed'
          recipient_count: number
          sent_count: number
          failed_count: number
          error_message: string | null
          triggered_by: string | null
          triggered_at: string
          completed_at: string | null
          audience_filters: Json
          scheduled_for: string | null
          test_recipient: string | null
        }
        Insert: {
          id?: string
          template_id?: string | null
          template_key: string
          title: string
          recipient_group: string
          subject: string
          preview_text?: string | null
          body: string
          delivery_status?: 'queued' | 'processing' | 'sent' | 'failed'
          recipient_count?: number
          sent_count?: number
          failed_count?: number
          error_message?: string | null
          triggered_by?: string | null
          triggered_at?: string
          completed_at?: string | null
          audience_filters?: Json
          scheduled_for?: string | null
          test_recipient?: string | null
        }
        Update: {
          id?: string
          template_id?: string | null
          template_key?: string
          title?: string
          recipient_group?: string
          subject?: string
          preview_text?: string | null
          body?: string
          delivery_status?: 'queued' | 'processing' | 'sent' | 'failed'
          recipient_count?: number
          sent_count?: number
          failed_count?: number
          error_message?: string | null
          triggered_by?: string | null
          triggered_at?: string
          completed_at?: string | null
          audience_filters?: Json
          scheduled_for?: string | null
          test_recipient?: string | null
        }
      }
      push_notification_campaigns: {
        Row: {
          id: string
          campaign_key: string
          title: string
          campaign_kind: 'template' | 'campaign_draft'
          recipient_group: string
          message_title: string
          message_body: string
          route: string | null
          active: boolean
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          campaign_key: string
          title: string
          campaign_kind: 'template' | 'campaign_draft'
          recipient_group: string
          message_title: string
          message_body: string
          route?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          campaign_key?: string
          title?: string
          campaign_kind?: 'template' | 'campaign_draft'
          recipient_group?: string
          message_title?: string
          message_body?: string
          route?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
      push_delivery_jobs: {
        Row: {
          id: string
          campaign_id: string | null
          campaign_key: string
          title: string
          recipient_group: string
          message_title: string
          message_body: string
          route: string | null
          delivery_status: 'queued' | 'processing' | 'sent' | 'failed'
          recipient_count: number
          sent_count: number
          failed_count: number
          error_message: string | null
          triggered_by: string | null
          triggered_at: string
          completed_at: string | null
          audience_filters: Json
          scheduled_for: string | null
          test_recipient: string | null
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          campaign_key: string
          title: string
          recipient_group: string
          message_title: string
          message_body: string
          route?: string | null
          delivery_status?: 'queued' | 'processing' | 'sent' | 'failed'
          recipient_count?: number
          sent_count?: number
          failed_count?: number
          error_message?: string | null
          triggered_by?: string | null
          triggered_at?: string
          completed_at?: string | null
          audience_filters?: Json
          scheduled_for?: string | null
          test_recipient?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string | null
          campaign_key?: string
          title?: string
          recipient_group?: string
          message_title?: string
          message_body?: string
          route?: string | null
          delivery_status?: 'queued' | 'processing' | 'sent' | 'failed'
          recipient_count?: number
          sent_count?: number
          failed_count?: number
          error_message?: string | null
          triggered_by?: string | null
          triggered_at?: string
          completed_at?: string | null
          audience_filters?: Json
          scheduled_for?: string | null
          test_recipient?: string | null
        }
      }
      notification_audit_events: {
        Row: {
          id: string
          channel: 'email' | 'push' | 'announcement'
          action: string
          entity_type: string
          entity_id: string | null
          actor_id: string | null
          metadata_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          channel: 'email' | 'push' | 'announcement'
          action: string
          entity_type: string
          entity_id?: string | null
          actor_id?: string | null
          metadata_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          channel?: 'email' | 'push' | 'announcement'
          action?: string
          entity_type?: string
          entity_id?: string | null
          actor_id?: string | null
          metadata_json?: Json
          created_at?: string
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
