import { QueryClient } from '@tanstack/react-query'

/**
 * React Query client configuration
 *
 * This configuration sets up caching and retry logic for all API calls
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,

      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Retry failed requests up to 3 times
      retry: 3,

      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Don't refetch on window focus in development
      refetchOnWindowFocus: import.meta.env.PROD,

      // Don't refetch on mount by default (data is fresh for 5 minutes)
      refetchOnMount: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations up to 1 time
      retry: 1,

      // Show error notifications for mutations by default
      onError: (error) => {
        console.error('Mutation error:', error)
        // TODO: Add toast notification here when toast library is added
      },
    },
  },
})
