import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  parent_id: string | null;
  level: number;
  display_order: number;
}

// Query keys for categories
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string[]) => [...categoryKeys.lists(), { filters }] as const,
};

// Fetch all categories ordered by hierarchy
const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('level')
    .order('display_order');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
};

// Fetch top-level categories only (parent_id is null)
const getTopLevelCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('display_order');

  if (error) {
    throw new Error(`Failed to fetch top-level categories: ${error.message}`);
  }

  return data || [];
};

// Fetch subcategories for a specific parent
const getSubcategories = async (parentId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('display_order');

  if (error) {
    throw new Error(`Failed to fetch subcategories: ${error.message}`);
  }

  return data || [];
};

// Fetch categories by level (0 = main, 1 = sub, 2 = sub-sub, etc.)
const getCategoriesByLevel = async (level: number): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('level', level)
    .order('display_order');

  if (error) {
    throw new Error(`Failed to fetch categories by level: ${error.message}`);
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

// Hook to get top-level categories only
export const useTopLevelCategories = () => {
  return useQuery({
    queryKey: [...categoryKeys.all, 'top-level'],
    queryFn: getTopLevelCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to get subcategories for a specific parent
export const useSubcategories = (parentId: string | null) => {
  return useQuery({
    queryKey: [...categoryKeys.all, 'subcategories', parentId],
    queryFn: () => parentId ? getSubcategories(parentId) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!parentId,
  });
};

// Hook to get categories by level
export const useCategoriesByLevel = (level: number) => {
  return useQuery({
    queryKey: [...categoryKeys.all, 'level', level],
    queryFn: () => getCategoriesByLevel(level),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Grouped subcategories interface for TaskRabbit-style home screen
export interface GroupedCategory {
  id: string;
  name: string;
  description: string | null;
  subcategories: Category[];
}

// Fetch all subcategories grouped by their parent category
const getGroupedSubcategories = async (): Promise<GroupedCategory[]> => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('level')
    .order('display_order');

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  if (!categories) return [];

  // Filter main categories (level 0) and subcategories (level 1)
  const mainCategories = categories.filter(c => c.level === 0);

  return mainCategories.map(main => ({
    id: main.id,
    name: main.name,
    description: main.description,
    subcategories: categories.filter(c => c.parent_id === main.id),
  }));
};

// Hook to get subcategories grouped by parent category (for TaskRabbit-style home screen)
export const useGroupedSubcategories = () => {
  return useQuery({
    queryKey: [...categoryKeys.all, 'grouped-subcategories'],
    queryFn: getGroupedSubcategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Utility: Build hierarchical tree from flat category array
export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export const buildCategoryTree = (categories: Category[]): CategoryTree[] => {
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  // First pass: create map of all categories with empty children arrays
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build the tree structure
  categories.forEach(category => {
    const node = categoryMap.get(category.id)!;

    if (category.parent_id === null) {
      // This is a root category
      rootCategories.push(node);
    } else {
      // This is a child category
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return rootCategories;
};

// Export the raw functions for non-hook usage
export {
  getCategories,
  getCategoriesByNames,
  getTopLevelCategories,
  getSubcategories,
  getCategoriesByLevel,
};