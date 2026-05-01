import { Redirect, useLocalSearchParams } from 'expo-router';

export default function EliteAliasRoute() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();

  if (slug === 'index') {
    return <Redirect href="/(professional)/elite" />;
  }

  return <Redirect href="/(professional)/(tabs)/dashboard" />;
}
