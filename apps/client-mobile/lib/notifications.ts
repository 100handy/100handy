import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

let isConfigured = false;
let notificationsModulePromise: Promise<typeof import('expo-notifications')> | null = null;

export type NotificationRoute = string;

export interface NotificationData {
  route?: NotificationRoute;
}

async function getNotificationsModule() {
  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications');
  }

  return notificationsModulePromise;
}

export async function configureNotifications(): Promise<void> {
  if (isConfigured || !supportsPushNotifications()) return;
  isConfigured = true;

  const Notifications = await getNotificationsModule();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export function supportsPushNotifications(): boolean {
  return Device.isDevice;
}

export function getEasProjectId(): string | null {
  // Expo SDK 54: `projectId` is required in many cases (especially EAS builds).
  return (
    Constants.easConfig?.projectId ??
    (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId ??
    null
  );
}

export async function ensureAndroidNotificationChannelAsync(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const Notifications = await getNotificationsModule();

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF6B35',
  });
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    await configureNotifications();
    await ensureAndroidNotificationChannelAsync();

    if (!supportsPushNotifications()) {
      console.warn('[notifications] Push notifications require a physical device.');
      return null;
    }

    const Notifications = await getNotificationsModule();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[notifications] Notification permissions not granted.');
      return null;
    }

    const projectId = getEasProjectId();

    const tokenResponse = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();

    return tokenResponse.data;
  } catch (error) {
    console.warn('[notifications] Failed to register for push notifications:', error);
    return null;
  }
}

export function getRouteFromNotificationData(data: unknown): NotificationRoute | null {
  if (!data || typeof data !== 'object') return null;
  const route = (data as NotificationData).route;
  return typeof route === 'string' && route.length > 0 ? route : null;
}

export async function addNotificationResponseListener(
  onRoute: (route: NotificationRoute) => void
): Promise<{ remove: () => void } | null> {
  if (!supportsPushNotifications()) {
    return null;
  }

  const Notifications = await getNotificationsModule();

  return Notifications.addNotificationResponseReceivedListener((response) => {
    const route = getRouteFromNotificationData(
      response.notification.request.content.data
    );
    if (route) {
      onRoute(route);
    }
  });
}

export async function getLastNotificationRouteAsync(): Promise<NotificationRoute | null> {
  if (!supportsPushNotifications()) {
    return null;
  }

  const Notifications = await getNotificationsModule();
  const lastResponse = await Notifications.getLastNotificationResponseAsync();

  if (!lastResponse) {
    return null;
  }

  return getRouteFromNotificationData(lastResponse.notification.request.content.data);
}
