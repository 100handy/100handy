import { Tabs } from 'expo-router';
import { Home, Briefcase, Heart, User } from 'lucide-react-native';

export default function ClientTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="taskers"
        options={{
          title: "My Taskers",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      
      {/* Hide subdirectory routes from tabs */}
      <Tabs.Screen name="tasks/details" options={{ href: null }} />
      <Tabs.Screen name="tasks/choose-category" options={{ href: null }} />
      <Tabs.Screen name="booking/manage" options={{ href: null }} />
      <Tabs.Screen name="booking/address" options={{ href: null }} />
      <Tabs.Screen name="professionals/available" options={{ href: null }} />
      <Tabs.Screen name="professionals/details" options={{ href: null }} />
    </Tabs>
  );
}
