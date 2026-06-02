import { useQuery } from '@tanstack/react-query';
import { getServiceAreaCoverage, type ServiceAreaCoverageResult } from '../../supabase/service-area-coverage';

export const serviceAreaCoverageKeys = {
  all: ['service-area-coverage'] as const,
  detail: (postcode: string) => [...serviceAreaCoverageKeys.all, postcode] as const,
};

export function useServiceAreaCoverage(postcode?: string | null) {
  const normalized = (postcode || '').trim();

  return useQuery<ServiceAreaCoverageResult>({
    queryKey: serviceAreaCoverageKeys.detail(normalized),
    queryFn: () => getServiceAreaCoverage(normalized),
    enabled: normalized.length > 0,
    staleTime: 60 * 1000,
  });
}
