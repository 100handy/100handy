import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon_url: string;
}

// Query keys for categories
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string[]) => [...categoryKeys.lists(), { filters }] as const,
};

// Fetch all categories
const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
};

// Fetch categories by specific names
const getCategoriesByNames = async (names: string[]): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .in('name', names)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
};

// Hook to get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get categories by names
export const useCategoriesByNames = (names: string[]) => {
  return useQuery({
    queryKey: categoryKeys.list(names),
    queryFn: () => getCategoriesByNames(names),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: names.length > 0, // Only run if names are provided
  });
};

// Export the raw functions for non-hook usage
export { getCategories, getCategoriesByNames };