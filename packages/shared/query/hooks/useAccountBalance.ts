import { useQuery } from '@tanstack/react-query';
import { getAccountBalance } from '../../supabase/balance';

// Query keys
export const accountBalanceKeys = {
  all: ['accountBalance'] as const,
  detail: () => [...accountBalanceKeys.all, 'detail'] as const,
};

/**
 * Hook for fetching user's account balance
 * Returns balance in cents
 */
export function useAccountBalance() {
  return useQuery({
    queryKey: accountBalanceKeys.detail(),
    queryFn: getAccountBalance,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
