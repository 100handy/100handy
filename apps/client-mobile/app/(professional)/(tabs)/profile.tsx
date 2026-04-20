import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Image,
  Alert,
  View,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  Megaphone,
  CreditCard,
  Bell,
  HelpCircle,
  Shield,
  Info,
  Lock,
  LogOut,
  ChevronRight,
  Camera,
  Globe,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { switchToCustomerRole, useAuthStore } from "@shared/supabase";
import { useProfileStore } from "@shared/supabase";
import { useUnreadNotificationCount } from "@shared/query";
import { queryClient } from "@shared/query/queryClient";
import * as ImagePicker from "expo-image-picker";
import AddProfilePhotoModal from "@/components/modals/AddProfilePhotoModal";
import { useToast } from "@/components/ui/toast";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  isLogout?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
}

export default function ProfessionalProfileScreen() {
  const router = useRouter();
  const { signOut, user, checkAuth } = useAuthStore();
  const { profile, fetchProfile, uploadAvatar } = useProfileStore();
  const toast = useToast();
  const { data: unreadCount } = useUnreadNotificationCount(user?.id || '', 'handy');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isSwitchingToClient, setIsSwitchingToClient] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
          "Switch failed",
          "Could not switch to client mode. Please try again.",
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
        "Switch failed",
        "An error occurred while switching roles. Please try again.",
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
        "Permission Required",
        "Sorry, we need camera roll permissions to upload a photo.",
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
        Alert.alert("Success", "Profile photo updated successfully!");
      } else {
        Alert.alert("Error", "Failed to upload photo. Please try again.");
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take a photo.",
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
        Alert.alert("Success", "Profile photo updated successfully!");
      } else {
        Alert.alert("Error", "Failed to upload photo. Please try again.");
      }
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <User color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Account detail",
      onPress: () => router.push("/(professional)/profile/account-detail"),
    },
    {
      icon: <FileText color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Pro profile",
      onPress: () => router.push("/(professional)/profile/tasker-profile"),
    },
    {
      icon: <BarChart3 color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Performance",
      onPress: () => router.push("/(professional)/(tabs)/performance"),
    },
    {
      icon: <Calendar color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Sync calendar",
      onPress: () => router.push("/(professional)/profile/calendar-settings"),
    },
    {
      icon: <MessageSquare color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Chat templates",
      onPress: () => router.push("/(professional)/profile/chat-templates"),
    },
    {
      icon: <Megaphone color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Promote yourself",
      onPress: () => router.push("/(professional)/profile/promote-yourself"),
    },
    {
      icon: <CreditCard color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Payments",
      onPress: () => router.push("/(professional)/profile/payments"),
    },
    {
      icon: <Bell color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Notifications",
      onPress: () => router.push("/(professional)/profile/notifications"),
    },
    {
      icon: <HelpCircle color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Support",
      onPress: () => router.push("/(professional)/profile/support"),
    },
    {
      icon: <Shield color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Account security",
      onPress: () => router.push("/(professional)/profile/account-security"),
    },
    {
      icon: <Info color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "About",
      onPress: () => router.push("/profile/about"),
    },
    {
      icon: <Lock color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Password",
      onPress: () => router.push("/profile/change-password"),
    },
    {
      icon: <Globe color="#B29D88" size={24} strokeWidth={1.5} />,
      label: "Go 100Handy",
      isDisabled: isSwitchingToClient,
      onPress: handleSwitchToClient,
    },
    {
      icon: <LogOut color="#C1856A" size={24} strokeWidth={1.5} />,
      label: "Log out",
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
            Profile
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
                : profile?.first_name || "Professional"}
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
              {profile?.avatar_url ? "Change Photo" : "Add Photo"}
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
