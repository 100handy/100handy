import { supabase } from './supabaseClient';

export interface ServiceAreaCoverageResult {
  available: boolean;
  postcode: string;
  matchedAreaId: string | null;
  matchedPrefix: string | null;
  matchedCity: string | null;
  reason: 'missing_postcode' | 'no_enabled_service_area' | 'disabled_location_chain' | 'covered';
  message: string;
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

function normalizePostcode(value: string) {
  return value.replace(/\s+/g, '').toUpperCase();
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

export async function getServiceAreaCoverage(postcode?: string | null): Promise<ServiceAreaCoverageResult> {
  const normalizedPostcode = normalizePostcode(postcode || '');

  if (!normalizedPostcode) {
    return {
      available: false,
      postcode: '',
      matchedAreaId: null,
      matchedPrefix: null,
      matchedCity: null,
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
      reason: 'no_enabled_service_area',
      message: 'We do not currently have any 100Handy Pros available in this area.',
    };
  }

  const locationMap = new Map<string, LocationAreaCoverageRow>(
    ((locationAreas ?? []) as LocationAreaCoverageRow[]).map((area) => [area.id, area]),
  );

  for (const area of matchingAreas) {
    if (locationChainIsEnabled(area.location_area_id, locationMap)) {
      return {
        available: true,
        postcode: normalizedPostcode,
        matchedAreaId: area.id,
        matchedPrefix: area.postcode_prefix,
        matchedCity: area.city,
        reason: 'covered',
        message: '',
      };
    }
  }

  const bestMatch = matchingAreas[0]!;
  return {
    available: false,
    postcode: normalizedPostcode,
    matchedAreaId: bestMatch.id,
    matchedPrefix: bestMatch.postcode_prefix,
    matchedCity: bestMatch.city,
    reason: 'disabled_location_chain',
    message: 'We do not currently have any 100Handy Pros available in this area.',
  };
}
