import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCategoryFormFields } from '../../supabase/form-fields';
import type { FormField } from '../../supabase/types/forms';

export function useCategoryFormFields(
  categoryId: string | undefined
): UseQueryResult<FormField[], Error> {
  return useQuery({
    queryKey: ['category-form-fields', categoryId],
    queryFn: () => {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }
      return getCategoryFormFields(categoryId);
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes - form configs don't change often
  });
}
