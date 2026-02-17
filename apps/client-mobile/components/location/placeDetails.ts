/**
 * Utility functions for Google Places API place details
 */

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface AddressComponents {
  streetAddress: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceDetailsResponse {
  result: {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  };
  status: string;
}

/**
 * Fetch place details from Google Places API using place_id
 */
export async function fetchPlaceDetails(placeId: string): Promise<AddressComponents | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&key=${GOOGLE_MAPS_API_KEY}&fields=address_components,formatted_address,geometry`
    );

    const data: PlaceDetailsResponse = await response.json();

    if (data.status !== 'OK' || !data.result?.address_components) {
      console.error('Error fetching place details:', data.status);
      return null;
    }

    const parsed = parseAddressComponents(data.result.address_components, data.result.formatted_address);
    const lat = data.result.geometry?.location?.lat;
    const lng = data.result.geometry?.location?.lng;

    return {
      ...parsed,
      latitude: typeof lat === 'number' ? lat : undefined,
      longitude: typeof lng === 'number' ? lng : undefined,
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Parse address components from Google Places API response
 */
function parseAddressComponents(
  components: AddressComponent[],
  formattedAddress: string
): AddressComponents {
  let streetNumber = '';
  let route = '';
  let city = '';
  let county = '';
  let postcode = '';
  let country = '';

  for (const component of components) {
    const types = component.types;

    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      route = component.long_name;
    } else if (types.includes('locality')) {
      city = component.long_name;
    } else if (types.includes('postal_town') && !city) {
      // UK addresses use postal_town instead of locality
      city = component.long_name;
    } else if (types.includes('administrative_area_level_2')) {
      // County/State level 2
      county = component.long_name;
    } else if (types.includes('administrative_area_level_1') && !county) {
      // Fallback to state/province if county not found
      county = component.long_name;
    } else if (types.includes('postal_code')) {
      postcode = component.long_name;
    } else if (types.includes('country')) {
      country = component.short_name;
    }
  }

  // Combine street number and route
  const streetAddress = [streetNumber, route].filter(Boolean).join(' ').trim() || formattedAddress;

  return {
    streetAddress,
    city,
    county,
    postcode,
    country,
  };
}

