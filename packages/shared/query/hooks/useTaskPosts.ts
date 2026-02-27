import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOpenTaskPosts,
  getMyTaskPosts,
  getTaskPostById,
  createTaskPost,
  cancelTaskPost,
  createBid,
  getBidsForTaskPost,
  getMyBids,
  acceptBid,
  withdrawBid,
  type TaskPostWithCategory,
  type TaskBidWithProfile,
  type TaskBid,
  type TaskPost,
  type CreateTaskPostInput,
  type CreateBidInput,
} from '../../supabase/task-posts';
import { useAuthStore } from '../../store';

// Query keys
export const taskPostKeys = {
  all: ['taskPosts'] as const,
  open: (categoryId?: string) => [...taskPostKeys.all, 'open', categoryId] as const,
  mine: (userId: string) => [...taskPostKeys.all, 'mine', userId] as const,
  detail: (postId: string) => [...taskPostKeys.all, 'detail', postId] as const,
  bids: (postId: string) => [...taskPostKeys.all, 'bids', postId] as const,
  myBids: (handyId: string) => [...taskPostKeys.all, 'myBids', handyId] as const,
};

/**
 * Hook for fetching open task posts (for professionals to browse)
 */
export function useOpenTaskPosts(categoryId?: string) {
  return useQuery({
    queryKey: taskPostKeys.open(categoryId),
    queryFn: () => getOpenTaskPosts({ categoryId }),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for fetching current user's task posts (for clients)
 */
export function useMyTaskPosts() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: taskPostKeys.mine(user?.id || ''),
    queryFn: () => getMyTaskPosts(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook for fetching a single task post by ID
 */
export function useTaskPostById(postId: string | null) {
  return useQuery({
    queryKey: taskPostKeys.detail(postId!),
    queryFn: () => getTaskPostById(postId!),
    enabled: !!postId,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook for creating a task post
 */
export function useCreateTaskPost() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (input: CreateTaskPostInput) => createTaskPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.all });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: taskPostKeys.mine(user.id) });
      }
    },
  });
}

/**
 * Hook for cancelling a task post
 */
export function useCancelTaskPost() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (postId: string) => cancelTaskPost(postId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.all });
    },
  });
}

/**
 * Hook for fetching bids on a task post
 */
export function useBidsForTaskPost(postId: string | null) {
  return useQuery({
    queryKey: taskPostKeys.bids(postId!),
    queryFn: () => getBidsForTaskPost(postId!),
    enabled: !!postId,
    staleTime: 15 * 1000, // 15 seconds
  });
}

/**
 * Hook for fetching current professional's bids
 */
export function useMyBids() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: taskPostKeys.myBids(user?.id || ''),
    queryFn: () => getMyBids(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook for creating a bid on a task post
 */
export function useCreateBid() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (input: CreateBidInput) => createBid(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.bids(variables.task_post_id) });
      queryClient.invalidateQueries({ queryKey: taskPostKeys.open() });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: taskPostKeys.myBids(user.id) });
      }
    },
  });
}

/**
 * Hook for accepting a bid (client)
 */
export function useAcceptBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, bidId, customerId }: { postId: string; bidId: string; customerId: string }) =>
      acceptBid(postId, bidId, customerId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: taskPostKeys.bids(variables.postId) });
      queryClient.invalidateQueries({ queryKey: taskPostKeys.all });
    },
  });
}

/**
 * Hook for withdrawing a bid (professional)
 */
export function useWithdrawBid() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (bidId: string) => withdrawBid(bidId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.all });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: taskPostKeys.myBids(user.id) });
      }
    },
  });
}

/**
 * Utility hook for invalidating task post queries
 */
export function useInvalidateTaskPosts() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.all });
    },
    invalidateOpen: () => {
      queryClient.invalidateQueries({ queryKey: taskPostKeys.open() });
    },
  };
}

// Re-export types for convenience
export type { TaskPostWithCategory, TaskBidWithProfile, TaskBid, TaskPost, CreateTaskPostInput, CreateBidInput };
