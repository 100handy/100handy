import { Redirect } from 'expo-router';

export default function ClientAuthIndex() {
  return <Redirect href="/(auth)/welcome" />;
}
