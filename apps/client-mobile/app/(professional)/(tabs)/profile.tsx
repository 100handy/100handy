import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from '@shared/store';
import { ScrollView, Image, Alert, View, Text, Pressable, RefreshControl, } from "react-native"; import { SafeAreaView } from "react-native-safe-area-context"; import {   User, FileText, BarChart3, Calendar, MessageSquare, Megaphone, CreditCard, Bell, HelpCircle, Shield, Info, Lock, LogOut, ChevronRight, Camera, Globe, } from "lucide-react-native"; import { useRouter } from "expo-router"; import { switchToCustomerRole } from '@shared/supabase';
import { useProfileStore } from '@shared/store';
import { useUnreadNotificationCount } from "@shared/query";
import { queryClient } from "@shared/query/queryClient";
import * as ImagePicker from "expo-image-picker";
import AddProfilePhotoModal from "@/components/modals/AddProfilePhotoModal";
import { useToast } from "@/components/ui/toast";
import { getAppContentValue, useAppContent } from '@/lib/app-content';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  isLogout?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
}

const DEFAULT_CONTENT = {
  'header.title': 'Profile',
  'photo.add': 'Add Photo',
  'photo.change': 'Change Photo',
  'photo.permission_title': 'Permission Required',
  'photo.library_permission_body': 'Sorry, we need camera roll permissions to upload a photo.',
  'photo.camera_permission_body': 'Sorry, we need camera permissions to take a photo.',
  'photo.success_title': 'Success',
  'photo.success_body': 'Profile photo updated successfully!',
  'photo.error_title': 'Error',
  'photo.error_body': 'Failed to upload photo. Please try again.',
  'misc.fallback_name': 'Professional',
  'menu.account_detail': 'Account detail',
  'menu.pro_profile': 'Pro profile',
  'menu.performance': 'Performance',
  'menu.sync_calendar': 'Sync calendar',
  'menu.chat_templates': 'Chat templates',
  'menu.promote_yourself': 'Promote yourself',
  'menu.payments': 'Payments',
  'menu.notifications': 'Notifications',
  'menu.support': 'Support',
  'menu.account_security': 'Account security',
  'menu.about': 'About',
  'menu.password': 'Password',
  'menu.switch_to_client': 'Go 100Handy',
  'menu.logout': 'Log out',
  'switch.error_title': 'Switch failed',
  'switch.error_body': 'Could not switch to client mode. Please try again.',
  'switch.generic_error_body': 'An error occurred while switching roles. Please try again.',
} as const;

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { signOut, user, checkAuth } = useAuthStore();
  const { profile, fetchProfile, uploadAvatar } = useProfileStore();
  const toast = useToast();
  const { data: unreadCount } = useUnreadNotificationCount(user?.id || '', 'handy');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isSwitchingToClient, setIsSwitchingToClient] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const content = useAppContent('professional_profile', DEFAULT_CONTENT);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProfile();
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProfile]);

  const handleSwitchToClient = async (): Promise<void> => {
    if (!user?.id) {
      router.replace("/(auth)/(client)");
      return;
    }

    setIsSwitchingToClient(true);
    try {
      const ok = await switchToCustomerRole();
      if (!ok) {
        console.error("Failed to switch to customer role");
        toast.error(
          getAppContentValue(content, 'switch.error_title', DEFAULT_CONTENT['switch.error_title']),
          getAppContentValue(content, 'switch.error_body', DEFAULT_CONTENT['switch.error_body']),
        );
        return;
      }

      await checkAuth();
      // Invalidate all queries after role switch to avoid stale data
      queryClient.invalidateQueries();
      router.replace("/(client)/(tabs)/home");
    } catch (err) {
      console.error("Error switching to customer:", err);
      toast.error(
        getAppContentValue(content, 'switch.error_title', DEFAULT_CONTENT['switch.error_title']),
        getAppContentValue(content, 'switch.generic_error_body', DEFAULT_CONTENT['switch.generic_error_body']),
      );
    } finally {
      setIsSwitchingToClient(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        getAppContentValue(content, 'photo.permission_title', DEFAULT_CONTENT['photo.permission_title']),
        getAppContentValue(content, 'photo.library_permission_body', DEFAULT_CONTENT['photo.library_permission_body']),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
        const uploaded = await uploadAvatar(result.assets[0].uri);
      if (uploaded) {
        await fetchProfile();
        Alert.alert(
          getAppContentValue(content, 'photo.success_title', DEFAULT_CONTENT['photo.success_title']),
          getAppContentValue(content, 'photo.success_body', DEFAULT_CONTENT['photo.success_body']),
        );
      } else {
        Alert.alert(
          getAppContentValue(content, 'photo.error_title', DEFAULT_CONTENT['photo.error_title']),
          getAppContentValue(content, 'photo.error_body', DEFAULT_CONTENT['photo.error_body']),
        );
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        getAppContentValue(content, 'photo.permission_title', DEFAULT_CONTENT['photo.permission_title']),
        getAppContentValue(content, 'photo.camera_permission_body', DEFAULT_CONTENT['photo.camera_permission_body']),
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uploaded = await uploadAvatar(result.assets[0].uri);
      if (uploaded) {
        await fetchProfile();
        Alert.alert(
          getAppContentValue(content, 'photo.success_title', DEFAULT_CONTENT['photo.success_title']),
          getAppContentValue(content, 'photo.success_body', DEFAULT_CONTENT['photo.success_body']),
        );
      } else {
        Alert.alert(
          getAppContentValue(content, 'photo.error_title', DEFAULT_CONTENT['photo.error_title']),
          getAppContentValue(content, 'photo.error_body', DEFAULT_CONTENT['photo.error_body']),
        );
      }
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <User color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.account_detail', DEFAULT_CONTENT['menu.account_detail']),
      onPress: () => router.push("/(professional)/profile/account-detail"),
    },
    {
      icon: <FileText color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.pro_profile', DEFAULT_CONTENT['menu.pro_profile']),
      onPress: () => router.push("/(professional)/profile/tasker-profile"),
    },
    {
      icon: <BarChart3 color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.performance', DEFAULT_CONTENT['menu.performance']),
      onPress: () => router.push("/(professional)/(tabs)/performance"),
    },
    {
      icon: <Calendar color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.sync_calendar', DEFAULT_CONTENT['menu.sync_calendar']),
      onPress: () => router.push("/(professional)/profile/calendar-settings"),
    },
    {
      icon: <MessageSquare color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.chat_templates', DEFAULT_CONTENT['menu.chat_templates']),
      onPress: () => router.push("/(professional)/profile/chat-templates"),
    },
    {
      icon: <Megaphone color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.promote_yourself', DEFAULT_CONTENT['menu.promote_yourself']),
      onPress: () => router.push("/(professional)/profile/promote-yourself"),
    },
    {
      icon: <CreditCard color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.payments', DEFAULT_CONTENT['menu.payments']),
      onPress: () => router.push("/(professional)/profile/payments"),
    },
    {
      icon: <Bell color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.notifications', DEFAULT_CONTENT['menu.notifications']),
      onPress: () => router.push("/(professional)/profile/notifications"),
    },
    {
      icon: <HelpCircle color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.support', DEFAULT_CONTENT['menu.support']),
      onPress: () => router.push("/(professional)/profile/support"),
    },
    {
      icon: <Shield color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.account_security', DEFAULT_CONTENT['menu.account_security']),
      onPress: () => router.push("/(professional)/profile/account-security"),
    },
    {
      icon: <Info color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.about', DEFAULT_CONTENT['menu.about']),
      onPress: () => router.push("/profile/about"),
    },
    {
      icon: <Lock color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.password', DEFAULT_CONTENT['menu.password']),
      onPress: () => router.push("/profile/change-password"),
    },
    {
      icon: <Globe color="#B29D88" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.switch_to_client', DEFAULT_CONTENT['menu.switch_to_client']),
      isDisabled: isSwitchingToClient,
      onPress: handleSwitchToClient,
    },
    {
      icon: <LogOut color="#C1856A" size={24} strokeWidth={1.5} />,
      label: getAppContentValue(content, 'menu.logout', DEFAULT_CONTENT['menu.logout']),
      isLogout: true,
      onPress: handleSignOut,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="py-6 px-5 border-b border-gray-100">
        <View className="flex-row items-center justify-center">
          <View style={{ width: 40 }} />
          <Text className="flex-1 text-center font-worksans-bold text-2xl text-theme-font">
            {getAppContentValue(content, 'header.title', DEFAULT_CONTENT['header.title'])}
          </Text>
          <Pressable
            onPress={() => router.push("/(professional)/notifications")}
            style={{ width: 40 }}
            className="items-end"
          >
            <View>
              <Bell size={24} color="#333A31" />
              {!!unreadCount && unreadCount > 0 && (
                <View
                  className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1"
                  style={{ backgroundColor: "#C1856A" }}
                >
                  <Text className="text-white text-[10px] font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#C1856A"
          />
        }
      >
        {/* Profile Photo Section */}
        <View className="flex-col px-6 py-8 items-center gap-4 border-b border-gray-100">
          <View className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-300 relative">
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                className="w-full h-full"
                style={{ width: 100, height: 100 }}
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-brand-terracotta/20">
                <Text className="font-worksans-bold text-3xl text-brand-terracotta">
                  {profile?.first_name?.[0] ||
                    user?.email?.[0]?.toUpperCase() ||
                    "?"}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-col items-center gap-1">
            <Text className="font-worksans-bold text-xl text-theme-font">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name || getAppContentValue(content, 'misc.fallback_name', DEFAULT_CONTENT['misc.fallback_name'])}
            </Text>
            {profile?.email && (
              <Text className="font-worksans text-sm text-gray-600">
                {profile.email}
              </Text>
            )}
          </View>

          <Pressable
            onPress={() => setShowPhotoModal(true)}
            className="flex-row items-center gap-2 px-4 py-2"
          >
            <Camera size={18} color="#B29D88" />
            <Text className="font-worksans-semibold text-sm text-brand-taupe">
              {profile?.avatar_url
                ? getAppContentValue(content, 'photo.change', DEFAULT_CONTENT['photo.change'])
                : getAppContentValue(content, 'photo.add', DEFAULT_CONTENT['photo.add'])}
            </Text>
          </Pressable>
        </View>

        {/* Menu Items */}
        <View className="flex-col ">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              className={`px-5 py-5 border-b border-gray-100 ${item.isDisabled ? "opacity-50" : ""}`}
              onPress={item.onPress}
              disabled={item.isDisabled}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-6 h-6 items-center justify-center mr-4">
                    {item.icon}
                  </View>
                  <Text
                    className={`font-worksans text-lg ${
                      item.isLogout ? "text-clay-orange" : "text-theme-font"
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
                {!item.isLogout && (
                  <ChevronRight color="#BDBDBD" size={22} strokeWidth={2} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Add Profile Photo Modal */}
      <AddProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onTakePhoto={takePhoto}
        onChooseFromLibrary={pickImage}
      />
    </SafeAreaView>
  );
}
