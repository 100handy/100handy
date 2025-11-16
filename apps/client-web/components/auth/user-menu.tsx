'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function UserMenu() {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/sign-in"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 text-sm font-medium text-white bg-[#C1856A] rounded-md hover:bg-[#C1856A]/90"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-700">
        {user?.user_metadata?.first_name || user?.email}
      </div>
      <div className="relative group">
        <button className="h-10 w-10 rounded-full bg-[#C1856A] text-white flex items-center justify-center">
          {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
        </button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Account Settings
          </Link>
          <Link
            href="/my-tasks"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Tasks
          </Link>
          <hr className="my-1" />
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

