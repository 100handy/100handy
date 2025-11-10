import React from 'react';
import { Image } from 'expo-image';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';

// Import lucide-react-native icons
import {
  ArrowLeft,
  Share2,
  MapPin,
  Heart,
  Star,
  MessageSquare,
} from 'lucide-react-native';

// --- Main Screen Component ---
export default function ProviderDetailsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View className="flex-1 bg-gray-50">
        {/* Section 1: Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <Pressable>
            <ArrowLeft size={24} color="#1F2937" />
          </Pressable>
          <Text className="text-lg font-semibold">Provider Details</Text>
          <Pressable>
            <Share2 size={24} color="#1F2937" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Section 2: Provider Info */}
         <View className="flex-col bg-white p-4 space-y-4">
    {/* Top Row: Avatar, Name, and Favorite Icon */}
    <View className="flex-row justify-between items-start">
        <View className="flex-row items-start flex-1">
            {/* Avatar with Online Indicator */}
            <View className="w-20 h-20">
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?u=marcus' }}
                    alt="Provider Avatar"
                    className="w-full h-full rounded-full"
                />
                <View className="w-5 h-5 bg-green-500 rounded-full border-2 border-white absolute top-0 right-0" />
            </View>
            {/* Name and Location */}
            <View className="flex-col ml-4 mt-1">
                <Text className="text-2xl font-bold">Marcus Johnson</Text>
                <View className="flex-row items-center mt-1">
                    <MapPin size={16} color="#6B7280" />
                    <Text className="text-gray-500 ml-1">0.8 miles away</Text>
                </View>
            </View>
        </View>
        <Pressable className="pl-2">
            <Heart size={24} color="#CBD5E0" />
        </Pressable>
    </View>

    {/* CORRECTED: Stats Row with more accurate structure */}
    <View className="flex-row items-center">
        {/* Rating Block */}
        <View className="flex-row items-center">
            <Star size={20} color="#FBBF24" fill="#FBBF24" />
            <Text className="ml-1">
                <Text className="font-bold">4.9</Text>
                <Text className="text-gray-500"> (127 reviews)</Text>
            </Text>
        </View>
        {/* Jobs Completed Block */}
        <View className="flex-row items-center ml-6">
             <Text className="font-bold">89</Text>
             <Text className="text-gray-500 ml-1">jobs completed</Text>
        </View>
    </View>

    {/* Price and Availability Row */}
    <View className="flex-col">
        <Text className="text-xl font-bold">$45/hour</Text>
        <Text className="text-green-600 font-semibold text-sm">Available today at 2:00 PM</Text>
    </View>
</View>
          
          {/* Section 3: Professional Description & Skills */}
          <View className="flex-col bg-white px-4 pb-4 border-t border-gray-100">
              <Text className="text-gray-700 leading-6 mt-4">
                  Professional handyman with 8+ years of experience in home repairs, furniture assembly, and electrical work. Certified IKEA installer with excellent customer service record.
              </Text>
              <View className="flex-col mt-4">
                  <Text className="text-lg font-semibold mb-3">Skills & Specialties</Text>
                  <View className="flex-row flex-wrap">
                      <View className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Furniture assembly</Text>
                      </View>
                      <View className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">IKEA certified</Text>
                      </View>
                      <View className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Electrical basics</Text>
                      </View>
                      <View className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Plumbing repair</Text>
                      </View>
                      <View className="bg-gray-100 rounded-full py-2 px-4 mr-2 mb-2">
                          <Text className="text-gray-800 font-medium">Wall mounting</Text>
                      </View>
                  </View>
              </View>
          </View>

          {/* Section 4: Reviews */}
          <View className="flex-col p-4 mt-4 space-y-5 bg-white">
              <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold">Reviews</Text>
                  <Pressable>
                      <Text className="text-blue-500 font-semibold">See all</Text>
                  </Pressable>
              </View>

              {/* Review 1 */}
              <View className="flex-col border-b border-gray-100 pb-4">
                  <View className="flex-row justify-between items-start">
                      <View className="flex-row items-center space-x-3">
                          <Image source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }} alt="Sarah M." className="w-10 h-10 rounded-full" />
                          <View className="flex-col">
                              <Text className="font-semibold">Sarah M.</Text>
                              <View className="flex-row">
                                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={'#FBBF24'} color="#FBBF24" />)}
                              </View>
                          </View>
                      </View>
                      <Text className="text-gray-500 text-sm">2 days ago</Text>
                  </View>
                  <Text className="mt-2 text-gray-700 leading-5">Excellent work assembling my IKEA wardrobe. Very professional and cleaned up after himself. Would definitely book again!</Text>
              </View>

              {/* Review 2 */}
              <View className="flex-col border-b border-gray-100 pb-4">
                  <View className="flex-row justify-between items-start">
                      <View className="flex-row items-center space-x-3">
                          <Image source={{ uri: 'https://i.pravatar.cc/150?u=david' }} alt="David R." className="w-10 h-10 rounded-full" />
                          <View className="flex-col">
                              <Text className="font-semibold">David R.</Text>
                              <View className="flex-row">
                                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={'#FBBF24'} color="#FBBF24" />)}
                              </View>
                          </View>
                      </View>
                      <Text className="text-gray-500 text-sm">1 week ago</Text>
                  </View>
                  <Text className="mt-2 text-gray-700 leading-5">Fixed my kitchen sink leak quickly and efficiently. Great communication and fair pricing.</Text>
              </View>

              {/* Review 3 */}
              <View className="flex-col">
                  <View className="flex-row justify-between items-start">
                      <View className="flex-row items-center space-x-3">
                          <Image source={{ uri: 'https://i.pravatar.cc/150?u=lisa' }} alt="Lisa K." className="w-10 h-10 rounded-full" />
                          <View className="flex-col">
                              <Text className="font-semibold">Lisa K.</Text>
                              <View className="flex-row">
                                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? '#FBBF24' : '#E5E7EB'} color={i < 4 ? '#FBBF24' : '#E5E7EB'} />)}
                              </View>
                          </View>
                      </View>
                      <Text className="text-gray-500 text-sm">2 weeks ago</Text>
                  </View>
                  <Text className="mt-2 text-gray-700 leading-5">Mounted my TV perfectly and helped organize cables. Very neat and professional work.</Text>
              </View>
          </View>
        </ScrollView>
        
        {/* Section 5: Bottom Action Bar */}
        <View className="flex-row absolute bottom-0 w-full p-4 bg-white border-t border-gray-200 space-x-4">
            <Button className="flex-1 bg-gray-200" action="secondary">
                <MessageSquare size={20} color="#374151" className="mr-2"/>
                <ButtonText className="text-gray-800 font-bold">Message</ButtonText>
            </Button>
            <Button className="flex-1" style={{ backgroundColor: '#D9896C' }}>
                <ButtonText className="font-bold">Select Provider</ButtonText>
            </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}