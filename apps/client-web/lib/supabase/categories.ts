import { createClient } from '@/lib/supabase-client';
import type { Category, CategoryWithChildren } from './types';

/**
 * Fetch all categories from the database
 */
export async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch categories by level (0 = main, 1 = subcategory, etc.)
 */
export async function getCategoriesByLevel(level: number): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('level', level)
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching level ${level} categories:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch main categories (level 0) only
 */
export async function getMainCategories(): Promise<Category[]> {
  return getCategoriesByLevel(0);
}

/**
 * Fetch subcategories for a specific parent category
 */
export async function getSubcategories(parentId: string): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching subcategories for parent ${parentId}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch a category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * Fetch a category by name (case-insensitive, handles URL encoding)
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
  const supabase = createClient();

  // Decode URL encoding and normalize the name
  const normalizedName = decodeURIComponent(name).trim();

  // First try exact match (case-insensitive)
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .ilike('name', normalizedName)
    .single();

  if (!error && data) {
    return data;
  }

  // If exact match fails, try partial match (for cases like "Assembly" matching "Furniture Assembly & Installation")
  const { data: partialMatches } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .ilike('name', `%${normalizedName}%`)
    .order('level', { ascending: false }) // Prefer subcategories (more specific)
    .limit(1);

  if (partialMatches && partialMatches.length > 0) {
    console.log(`Category "${name}" matched to "${partialMatches[0].name}"`);
    return partialMatches[0];
  }

  console.error(`No category found matching "${name}"`);
  return null;
}

export async function getCategoryByRouteSlug(routeSlug: string): Promise<Category | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('route_slug', routeSlug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching category by route slug ${routeSlug}:`, error);
    return null;
  }

  return data;
}

export async function getServiceCategoryByRoute(
  categorySlug: string,
  serviceSlug: string
): Promise<{ parent: Category; service: Category } | null> {
  const parent = await getCategoryByRouteSlug(categorySlug);
  if (!parent) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parent.id)
    .eq('route_slug', serviceSlug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error(
      `Error fetching service category by route ${categorySlug}/${serviceSlug}:`,
      error
    );
    return null;
  }

  if (!data) {
    if (parent.route_slug === serviceSlug) {
      return { parent, service: parent };
    }
    return null;
  }

  return { parent, service: data };
}

/**
 * Build hierarchical category tree
 * Recursively fetches subcategories for each parent
 */
export async function getCategoryTree(): Promise<CategoryWithChildren[]> {
  const allCategories = await getAllCategories();

  // Build a map for quick lookup
  const categoryMap = new Map<string, CategoryWithChildren>();
  allCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, subcategories: [] });
  });

  // Build the tree structure
  const rootCategories: CategoryWithChildren[] = [];

  allCategories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;

    if (cat.parent_id === null) {
      // Root level category
      rootCategories.push(category);
    } else {
      // Add to parent's subcategories
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.subcategories = parent.subcategories || [];
        parent.subcategories.push(category);
      }
    }
  });

  return rootCategories;
}

/**
 * Get category with its immediate children only (not full tree)
 */
export async function getCategoryWithChildren(categoryId: string): Promise<CategoryWithChildren | null> {
  const category = await getCategoryById(categoryId);
  if (!category) return null;

  const children = await getSubcategories(categoryId);

  return {
    ...category,
    subcategories: children.map(child => ({ ...child, subcategories: [] }))
  };
}

/**
 * Search categories by name (case-insensitive)
 */
export async function searchCategories(searchTerm: string): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .ilike('name', `%${searchTerm}%`)
    .order('level', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error searching categories for "${searchTerm}":`, error);
    throw error;
  }

  return data || [];
}

/**
 * Get the full path of a category (parent chain)
 */
export async function getCategoryPath(categoryId: string): Promise<Category[]> {
  const path: Category[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;

    path.unshift(category); // Add to beginning
    currentId = category.parent_id;
  }

  return path;
}
