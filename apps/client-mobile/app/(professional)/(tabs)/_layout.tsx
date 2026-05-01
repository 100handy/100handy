import { Tabs, useRouter, useFocusEffect } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Home, MapPin, Calendar, BarChart, User, Briefcase } from 'lucide-react-native';
import { getHandyProfile } from '@shared/supabase/profile';
import {
  canAccessProfessionalTab,
  type ProfessionalVerificationStatus,
} from '@/lib/professional-access';

export default function ProfessionalTabLayout() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<ProfessionalVerificationStatus>(null);
  const hasLoadedOnFocusRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadVerificationStatus = async () => {
      try {
        const handyProfile = await getHandyProfile();
        if (isMounted) {
          setVerificationStatus(
            (handyProfile?.verification_status as ProfessionalVerificationStatus | undefined) ?? null
          );
        }
      } catch (error) {
        console.warn('Unable to load professional verification status:', error);
        if (isMounted) {
          setVerificationStatus(null);
        }
      }
    };

    loadVerificationStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedOnFocusRef.current) {
        hasLoadedOnFocusRef.current = true;
        return undefined;
      }

      let isMounted = true;

      const reloadVerificationStatus = async () => {
        try {
          const handyProfile = await getHandyProfile();
          if (isMounted) {
            setVerificationStatus(
              (handyProfile?.verification_status as ProfessionalVerificationStatus | undefined) ?? null
            );
          }
        } catch (error) {
          console.warn('Unable to refresh professional verification status:', error);
        }
      };

      reloadVerificationStatus();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const getRestrictedTabOptions = (
    name: 'jobs',
    title: string,
    Icon: typeof Briefcase
  ) => ({
    title,
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <Icon color={color} size={size} />
    ),
    tabBarButton: (props: any) => {
      const enabled = canAccessProfessionalTab(name, verificationStatus);

      return (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (enabled) {
              props.onPress?.();
              return;
            }

            router.replace('/(professional)/(tabs)/dashboard');
          }}
          style={[props.style, !enabled ? { opacity: 0.45 } : null]}
          className="flex-1 items-center justify-center"
        >
          {props.children}
          {!enabled ? (
            <Text className="text-[10px] font-worksans-medium text-[#B29D88] mt-0.5">
              Verify first
            </Text>
          ) : null}
        </Pressable>
      );
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#C1856A',
        tabBarInactiveTintColor: '#B29D88',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={getRestrictedTabOptions('jobs', 'Jobs', Briefcase)}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="work-area"
        options={{
          title: "Location",
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          href: null, // Hidden, accessible via dashboard
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
