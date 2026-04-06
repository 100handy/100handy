import * as Location from 'expo-location';

export interface WelcomeCountry {
  countryName: string;
  countryCode: string;
}

const DEFAULT_COUNTRY: WelcomeCountry = {
  countryName: 'United Kingdom',
  countryCode: 'GB',
};

export function countryCodeToFlagEmoji(countryCode: string): string {
  if (countryCode.length !== 2) {
    return '🌍';
  }

  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}

export async function getWelcomeCountry(): Promise<WelcomeCountry> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return DEFAULT_COUNTRY;
    }

    const position =
      (await Location.getLastKnownPositionAsync()) ??
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }));

    if (!position) {
      return DEFAULT_COUNTRY;
    }

    const [geocode] = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    if (!geocode?.country) {
      return DEFAULT_COUNTRY;
    }

    return {
      countryName: geocode.country,
      countryCode: geocode.isoCountryCode?.toUpperCase() || DEFAULT_COUNTRY.countryCode,
    };
  } catch {
    return DEFAULT_COUNTRY;
  }
}
