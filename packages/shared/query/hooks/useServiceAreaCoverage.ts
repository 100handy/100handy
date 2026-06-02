import { useQuery } from '@tanstack/react-query';
import { getServiceAreaCoverage, type ServiceAreaCoverageResult } from '../../supabase/service-area-coverage';

export const serviceAreaCoverageKeys = {
  all: ['service-area-coverage'] as const,
  detail: (postcode: string, categoryId?: string | null) => [...serviceAreaCoverageKeys.all, postcode, categoryId || null] as const,
};

export function useServiceAreaCoverage(postcode?: string | null, categoryId?: string | null) {
  const normalized = (postcode || '').trim();

  return useQuery<ServiceAreaCoverageResult>({
    queryKey: serviceAreaCoverageKeys.detail(normalized, categoryId),
    queryFn: () => getServiceAreaCoverage(normalized, categoryId),
    enabled: normalized.length > 0,
    staleTime: 60 * 1000,
  });
}
