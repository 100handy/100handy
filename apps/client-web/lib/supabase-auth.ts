// apps/client-web/lib/supabase-auth.ts
import { createClient } from './supabase';

/**
 * Supabase Auth wrapper for client-web
 * This provides a unified auth interface matching the Better Auth structure
 * Uses the browser client with proper cookie handling for session persistence
 *
 * NOTE: For email OTP verification to work during sign-up:
 * 1. Go to Supabase Dashboard > Authentication > Email Templates
 * 2. Edit the "Confirm signup" template
 * 3. Replace {{ .ConfirmationURL }} with {{ .Token }} to send a 6-digit OTP code
 * 4. Update the email copy to instruct users to enter the code instead of clicking a link
 */

type AuthCallbacks = {
  onRequest?: () => void;
  onResponse?: () => void;
  onError?: (ctx: { error: { message: string } }) => void;
  onSuccess?: () => void;
};

export const supabaseAuth: {
  signUp: {
    email: (credentials: { email: string; password: string; name: string; phone?: string; postcode?: string }, callbacks?: AuthCallbacks) => Promise<unknown>;
  };
  signIn: {
    email: (credentials: { email: string; password: string }, callbacks?: AuthCallbacks) => Promise<unknown>;
  };
  resetPassword: {
    email: (email: string, callbacks?: AuthCallbacks) => Promise<unknown>;
    sendOTP: (email: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  };
  updatePassword: (newPassword: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  signOut: (callbacks?: AuthCallbacks) => Promise<void>;
  verifyOTP: (phone: string, token: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  resendOTP: (phone: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  verifyEmailOTP: (email: string, token: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  resendEmailOTP: (email: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  verifyPasswordResetOTP: (email: string, token: string, callbacks?: AuthCallbacks) => Promise<unknown>;
  signInWithGoogle: () => Promise<unknown>;
  signInWithApple: () => Promise<unknown>;
} = {
  signUp: {
    email: async (
      credentials: { email: string; password: string; name: string; phone?: string; postcode?: string },
      callbacks?: {
        onRequest?: () => void;
        onResponse?: () => void;
        onError?: (ctx: { error: { message: string } }) => void;
        onSuccess?: () => void;
      }
    ) => {
      try {
        callbacks?.onRequest?.();
        const supabase = createClient();

        const [firstName, ...lastNameParts] = credentials.name.split(' ');
        const lastName = lastNameParts.join(' ');

        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          phone: credentials.phone,
          options: {
            data: {
              role: 'customer',
              first_name: firstName || '',
              last_name: lastName || '',
              full_name: credentials.name,
              postcode: credentials.postcode || '',
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/auth/callback`,
          },
        });

        if (error) throw error;

        callbacks?.onResponse?.();
        callbacks?.onSuccess?.();
        return data;
      } catch (error) {
        callbacks?.onResponse?.();
        callbacks?.onError?.({
          error: {
            message: error instanceof Error ? error.message : 'Sign up failed',
          },
        });
        throw error;
      }
    },
  },

  signIn: {
    email: async (
      credentials: { email: string; password: string },
      callbacks?: {
        onRequest?: () => void;
        onResponse?: () => void;
        onError?: (ctx: { error: { message: string } }) => void;
        onSuccess?: () => void;
      }
    ) => {
      try {
        callbacks?.onRequest?.();
        const supabase = createClient();
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;

        callbacks?.onResponse?.();
        callbacks?.onSuccess?.();
        return data;
      } catch (error) {
        callbacks?.onResponse?.();
        callbacks?.onError?.({
          error: {
            message: error instanceof Error ? error.message : 'Sign in failed',
          },
        });
        throw error;
      }
    },
  },

  resetPassword: {
    email: async (
      email: string,
      callbacks?: {
        onRequest?: () => void;
        onResponse?: () => void;
        onError?: (ctx: { error: { message: string } }) => void;
        onSuccess?: () => void;
      }
    ) => {
      try {
        callbacks?.onRequest?.();
        const supabase = createClient();

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/auth/callback?next=/reset-password`,
        });

        if (error) throw error;

        callbacks?.onResponse?.();
        callbacks?.onSuccess?.();
        return data;
      } catch (error) {
        callbacks?.onResponse?.();
        callbacks?.onError?.({
          error: {
            message: error instanceof Error ? error.message : 'Password reset failed',
          },
        });
        throw error;
      }
    },

    sendOTP: async (
      email: string,
      callbacks?: {
        onRequest?: () => void;
        onResponse?: () => void;
        onError?: (ctx: { error: { message: string } }) => void;
        onSuccess?: () => void;
      }
    ) => {
      try {
        callbacks?.onRequest?.();
        const supabase = createClient();

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/reset-password`,
        });

        if (error) throw error;

        callbacks?.onResponse?.();
        callbacks?.onSuccess?.();
        return data;
      } catch (error) {
        callbacks?.onResponse?.();
        callbacks?.onError?.({
          error: {
            message: error instanceof Error ? error.message : 'Failed to send reset code',
          },
        });
        throw error;
      }
    },
  },

  updatePassword: async (
    newPassword: string,
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
      return data;
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'Password update failed',
        },
      });
      throw error;
    }
  },

  signOut: async (
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'Sign out failed',
        },
      });
      throw error;
    }
  },

  verifyOTP: async (
    phone: string,
    token: string,
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
      return data;
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'OTP verification failed',
        },
      });
      throw error;
    }
  },

  resendOTP: async (
    phone: string,
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();

      const { data, error } = await supabase.auth.resend({
        type: 'sms',
        phone,
      });

      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
      return data;
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'Resend OTP failed',
        },
      });
      throw error;
    }
  },

  verifyEmailOTP: async (
    email: string,
    token: string,
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
      return data;
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'Email OTP verification failed',
        },
      });
      throw error;
    }
  },

  resendEmailOTP: async (
    email: string,
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();

      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
      return data;
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'Resend email OTP failed',
        },
      });
      throw error;
    }
  },

  verifyPasswordResetOTP: async (
    email: string,
    token: string,
    callbacks?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
      onSuccess?: () => void;
    }
  ) => {
    try {
      callbacks?.onRequest?.();
      const supabase = createClient();

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });

      if (error) throw error;

      callbacks?.onResponse?.();
      callbacks?.onSuccess?.();
      return data;
    } catch (error) {
      callbacks?.onResponse?.();
      callbacks?.onError?.({
        error: {
          message: error instanceof Error ? error.message : 'Failed to verify reset code',
        },
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    const supabase = createClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  },

  signInWithApple: async () => {
    const supabase = createClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  },
};
