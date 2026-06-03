import { supabase } from './supabaseClient';

export interface ServiceAreaCoverageResult {
  available: boolean;
  postcode: string;
  matchedAreaId: string | null;
  matchedPrefix: string | null;
  matchedCity: string | null;
  eligibleProviderCount: number;
  reason: 'missing_postcode' | 'no_enabled_service_area' | 'disabled_location_chain' | 'no_eligible_providers' | 'covered';
  message: string;
}

export interface ServiceAreaCoverageAttemptLogInput {
  postcode?: string | null;
  categoryId?: string | null;
  channel: 'web' | 'mobile';
  route: string;
  result: ServiceAreaCoverageResult;
}

interface ServiceAreaCoverageRow {
  id: string;
  city: string;
  postcode_prefix: string;
  location_area_id: string | null;
}

interface LocationAreaCoverageRow {
  id: string;
  parent_id: string | null;
  name: string;
}

interface ProviderServiceAreaRow {
  service_area_id: string;
  provider_id: string;
}

interface ServiceAreaCategoryOverrideRow {
  service_area_id: string;
  category_id: string;
  enabled: boolean;
}

function normalizePostcode(value: string) {
  return value.replace(/\s+/g, '').toUpperCase();
}

function getPostcodeOutward(value: string) {
  const normalized = normalizePostcode(value);
  if (!normalized) return '';
  return normalized.length > 3 ? normalized.slice(0, -3) : normalized;
}

function locationChainIsEnabled(
  areaId: string | null,
  locationMap: Map<string, LocationAreaCoverageRow>,
) {
  if (!areaId) return true;

  const visited = new Set<string>();
  let currentId: string | null = areaId;

  while (currentId) {
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    const current = locationMap.get(currentId);
    if (!current) return false;
    currentId = current.parent_id;
  }

  return true;
}

export async function getServiceAreaCoverage(
  postcode?: string | null,
  categoryId?: string | null,
): Promise<ServiceAreaCoverageResult> {
  const normalizedPostcode = normalizePostcode(postcode || '');

  if (!normalizedPostcode) {
    return {
      available: false,
      postcode: '',
      matchedAreaId: null,
      matchedPrefix: null,
      matchedCity: null,
      eligibleProviderCount: 0,
      reason: 'missing_postcode',
      message: 'Enter a valid postcode to check availability.',
    };
  }

  const [{ data: serviceAreas, error: serviceAreaError }, { data: locationAreas, error: locationAreaError }] = await Promise.all([
    supabase
      .from('service_areas')
      .select('id, city, postcode_prefix, location_area_id')
      .eq('enabled', true),
    supabase
      .from('location_areas')
      .select('id, parent_id, name')
      .eq('enabled', true),
  ]);

  if (serviceAreaError) {
    throw new Error(serviceAreaError.message);
  }

  if (locationAreaError) {
    throw new Error(locationAreaError.message);
  }

  const matchingAreas = ((serviceAreas ?? []) as ServiceAreaCoverageRow[])
    .filter((area) => normalizedPostcode.startsWith(normalizePostcode(area.postcode_prefix)))
    .sort((a, b) => normalizePostcode(b.postcode_prefix).length - normalizePostcode(a.postcode_prefix).length);

  if (matchingAreas.length === 0) {
    return {
      available: false,
      postcode: normalizedPostcode,
      matchedAreaId: null,
      matchedPrefix: null,
      matchedCity: null,
      eligibleProviderCount: 0,
      reason: 'no_enabled_service_area',
      message: 'We do not currently have any 100Handy Pros available in this area.',
    };
  }

  const locationMap = new Map<string, LocationAreaCoverageRow>(
    ((locationAreas ?? []) as LocationAreaCoverageRow[]).map((area) => [area.id, area]),
  );

  for (const area of matchingAreas) {
    if (locationChainIsEnabled(area.location_area_id, locationMap)) {
      const { data: assignments, error: assignmentsError } = await supabase
        .from('provider_service_areas')
        .select('service_area_id, provider_id')
        .eq('service_area_id', area.id);

      if (assignmentsError) {
        throw new Error(assignmentsError.message);
      }

      const providerIds = Array.from(
        new Set(((assignments ?? []) as ProviderServiceAreaRow[]).map((row) => row.provider_id)),
      );

      if (providerIds.length === 0) {
        continue;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id')
        .in('user_id', providerIds)
        .eq('role', 'handy')
        .eq('account_status', 'active');

      if (profilesError) {
        throw new Error(profilesError.message);
      }

      let eligibleProviderIds = new Set((profiles ?? []).map((profile) => profile.user_id));

      if (categoryId && eligibleProviderIds.size > 0) {
        const { data: overrides, error: overridesError } = await supabase
          .from('service_area_category_overrides')
          .select('service_area_id, category_id, enabled')
          .eq('service_area_id', area.id)
          .eq('category_id', categoryId);

        if (overridesError) {
          throw new Error(overridesError.message);
        }

        const typedOverrides = (overrides ?? []) as ServiceAreaCategoryOverrideRow[];
        if (typedOverrides.length > 0 && !typedOverrides.some((row) => row.enabled)) {
          continue;
        }

        const { data: handyCategories, error: handyCategoriesError } = await supabase
          .from('handy_categories')
          .select('handy_id')
          .eq('category_id', categoryId)
          .in('handy_id', Array.from(eligibleProviderIds));

        if (handyCategoriesError) {
          throw new Error(handyCategoriesError.message);
        }

        eligibleProviderIds = new Set((handyCategories ?? []).map((row) => row.handy_id));
      }

      if (eligibleProviderIds.size > 0) {
        return {
          available: true,
          postcode: normalizedPostcode,
          matchedAreaId: area.id,
          matchedPrefix: area.postcode_prefix,
          matchedCity: area.city,
          eligibleProviderCount: eligibleProviderIds.size,
          reason: 'covered',
          message: '',
        };
      }
    }
  }

  const bestMatch = matchingAreas[0]!;
  return {
    available: false,
    postcode: normalizedPostcode,
    matchedAreaId: bestMatch.id,
    matchedPrefix: bestMatch.postcode_prefix,
    matchedCity: bestMatch.city,
    eligibleProviderCount: 0,
    reason: locationChainIsEnabled(bestMatch.location_area_id, locationMap)
      ? 'no_eligible_providers'
      : 'disabled_location_chain',
    message: 'We do not currently have any 100Handy Pros available in this area.',
  };
}

export async function logServiceAreaCoverageAttempt(input: ServiceAreaCoverageAttemptLogInput) {
  const normalizedPostcode = normalizePostcode(input.postcode || input.result.postcode || '');
  if (!normalizedPostcode) return;

  const { error } = await supabase.from('service_area_demand_logs').insert({
    postcode_normalized: normalizedPostcode,
    postcode_outward: getPostcodeOutward(normalizedPostcode),
    category_id: input.categoryId ?? null,
    channel: input.channel,
    route: input.route,
    available: input.result.available,
    reason: input.result.reason,
    matched_area_id: input.result.matchedAreaId,
    matched_prefix: input.result.matchedPrefix,
    matched_city: input.result.matchedCity,
    eligible_provider_count: input.result.eligibleProviderCount,
  });

  if (error) {
    console.error('Failed to log service area coverage attempt', error);
  }
}
