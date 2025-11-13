import React from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, View, Text, Pressable } from 'react-native';
import {
  MapPin,
  Search,
  Armchair,
  Sparkles,
  Wrench,
  Truck,
  Flower2,
  ShoppingBag,
  Baby,
  Music,
  Scissors,
  HeartPulse,
  Coffee,
  Camera,
  Monitor,
  Briefcase,
  Home,
  Palette,
  Users,
  PaintRoller,
  Hammer,
  Laptop,
  Car,
  Heart,
  Dumbbell,
  Calendar,
  Wind,
  Smile,
  Hand,
  Droplets,
  UserCircle,
  Snowflake,
  Wifi,
  LucideIcon,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocationStore, useTopLevelCategories } from '@shared/supabase';
import LocationSelectionSheet from '@/components/tasker/LocationSelectionSheet';

// Icon mapping function - maps category names/keywords to icons
const getCategoryIcon = (categoryName: string): LucideIcon => {
  const name = categoryName.toLowerCase();

  // Map based on keywords in category name
  if (name.includes('furniture') || name.includes('assembly')) return Armchair;
  if (name.includes('clean')) return Sparkles;
  if (name.includes('handyman') || name.includes('repair') || name.includes('maintenance')) return Wrench;
  if (name.includes('moving') || name.includes('lifting') || name.includes('delivery')) return Truck;
  if (name.includes('mount') || name.includes('installation') || name.includes('tv')) return Monitor;
  if (name.includes('yard') || name.includes('lawn') || name.includes('garden') || name.includes('outdoor') || name.includes('landscaping')) return Flower2;
  if (name.includes('shopping') || name.includes('errand')) return ShoppingBag;
  if (name.includes('assistant') || name.includes('virtual') || name.includes('office')) return Briefcase;
  if (name.includes('baby') || name.includes('family') || name.includes('child')) return Baby;
  if (name.includes('seasonal') || name.includes('holiday')) return Snowflake;
  if (name.includes('contactless') || name.includes('online') || name.includes('tech')) return Wifi;
  if (name.includes('entertainment') || name.includes('music') || name.includes('event')) return Music;
  if (name.includes('creative') || name.includes('artistic') || name.includes('art')) return Palette;
  if (name.includes('relaxation') || name.includes('luxury') || name.includes('spa')) return Heart;
  if (name.includes('food') || name.includes('dining') || name.includes('cook') || name.includes('chef')) return Coffee;
  if (name.includes('group') || name.includes('social')) return Users;
  if (name.includes('fitness') || name.includes('gym') || name.includes('workout')) return Dumbbell;
  if (name.includes('themed') || name.includes('experience')) return Calendar;
  if (name.includes('photography') || name.includes('photo') || name.includes('media')) return Camera;
  if (name.includes('hair') || name.includes('salon') || name.includes('barber')) return Scissors;
  if (name.includes('removal') || name.includes('wax')) return Wind;
  if (name.includes('face') || name.includes('beauty') || name.includes('facial') || name.includes('makeup')) return Smile;
  if (name.includes('nail') || name.includes('manicure') || name.includes('pedicure')) return Hand;
  if (name.includes('body') || name.includes('treatment')) return Droplets;
  if (name.includes('massage') || name.includes('wellness') || name.includes('spa')) return HeartPulse;
  if (name.includes('men') || name.includes('grooming')) return UserCircle;
  if (name.includes('paint')) return PaintRoller;
  if (name.includes('building') || name.includes('construction')) return Hammer;
  if (name.includes('computer') || name.includes('laptop')) return Laptop;
  if (name.includes('car') || name.includes('automotive') || name.includes('vehicle')) return Car;

  // Default icon
  return Home;
};

// Service chip data for horizontal scrollable rows
const serviceChips = [
  ['Furniture Assembly', 'Home Cleaning', 'Handyman'],
  ['Moving & Lifting', 'TV Mounting', 'Yard Work'],
  ['Grocery Shopping', 'Delivery', 'Virtual Assistant'],
  ['Babysitting', 'Office Services', 'Seasonal Help'],
  ['Event Planning', 'Photography', 'Personal Chef'],
];

// Fallback service cards data (used when categories are loading or empty)
const fallbackServiceCards = [
  { title: 'Furniture & Assembly', icon: Armchair, bgColor: '#30352d' },
  { title: 'Home Cleaning', icon: Sparkles, bgColor: '#BFA28D' },
  { title: 'Handyman & Repairs', icon: Wrench, bgColor: '#BFA28D' },
  { title: 'Moving & Lifting', icon: Truck, bgColor: '#30352d' },
  { title: 'Yard & Outdoor', icon: Flower2, bgColor: '#30352d' },
  { title: 'Shopping & Delivery', icon: ShoppingBag, bgColor: '#BFA28D' },
  { title: 'Family & Baby Prep', icon: Baby, bgColor: '#BFA28D' },
  { title: 'Entertainment', icon: Music, bgColor: '#30352d' },
  { title: 'Hair Services', icon: Scissors, bgColor: '#30352d' },
  { title: 'Massage & Wellness', icon: HeartPulse, bgColor: '#BFA28D' },
  { title: 'Food & Dining', icon: Coffee, bgColor: '#BFA28D' },
  { title: 'Photography', icon: Camera, bgColor: '#30352d' },
  { title: 'Mounting & Installation', icon: Monitor, bgColor: '#30352d' },
  { title: 'Virtual Assistant', icon: Briefcase, bgColor: '#BFA28D' },
];

export function ServicesHomeScreen() {
  const router = useRouter();
  const { location } = useLocationStore();
  const { data: categories, isLoading } = useTopLevelCategories();
  const [showBookingSheet, setShowBookingSheet] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState({ id: '', name: '' });

  // Parse location for display
  const getLocationDisplay = () => {
    if (!location || !location.streetAddress) {
      return {
        line1: '16 Leicester Square, London',
        line2: 'WC2H 7LE, UK'
      };
    }

    // Extract main address and postal code
    const parts = location.streetAddress.split(',').map(p => p.trim());

    if (parts.length >= 2) {
      // Show first part (street) + city
      const line1 = `${parts[0]}${parts[1] ? ', ' + parts[1] : ''}`;
      // Show remaining parts (postal code, country)
      const line2 = parts.slice(2).join(', ') || location.country || '';
      return { line1, line2 };
    }

    return {
      line1: location.streetAddress,
      line2: location.country || ''
    };
  };

  const locationDisplay = getLocationDisplay();

  // Transform categories from database into service cards format
  const serviceCards = React.useMemo(() => {
    if (!categories || categories.length === 0) {
      return fallbackServiceCards;
    }

    // Map categories to cards with alternating colors
    return categories.map((category, index) => ({
      id: category.id,
      title: category.name,
      icon: getCategoryIcon(category.name),
      bgColor: index % 2 === 0 ? '#30352d' : '#BFA28D',
    }));
  }, [categories]);

  const handleServicePress = (categoryId: string, categoryName: string) => {
    if (!categoryId || !categoryName) {
      // If no category info, navigate to search instead
      router.push('/(client)/search-services');
      return;
    }
    setSelectedCategory({ id: categoryId, name: categoryName });
    setShowBookingSheet(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="flex-1 flex-col">
        {/* Header Section */}
        <View className="bg-white px-5 pt-4 pb-4 flex-col">
          <View className="items-center justify-between flex-row">
            <View className="gap-0 flex-col">
              <Text className="text-xs text-gray-500" style={{ fontWeight: '400' }}>100</Text>
              <Text className="text-2xl text-stone-900" style={{ fontWeight: '700', letterSpacing: 0.5 }}>HANDY</Text>
            </View>
            <Pressable onPress={() => router.push('/(client)/location')}>
              <View className="items-end gap-0 flex-col">
                <View className="items-center gap-1 flex-row">
                  <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }} numberOfLines={1}>
                    {locationDisplay.line1}
                  </Text>
                  <MapPin size={16} color="#ff6b35" />
                </View>
                <Text className="text-xs text-stone-800" style={{ fontWeight: '400' }} numberOfLines={1}>
                  {locationDisplay.line2}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Search Section with Dark Background */}
        <View className="px-5 pt-5 pb-4 flex-col" style={{ backgroundColor: '#30352D' }}>
          <Text className="text-xl font-bold text-white mb-4">
            What task do you need done?
          </Text>

          {/* Search Input - Navigate to Search Screen */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log('Search pressed!');
              router.push('/(client)/search-services');
            }}
          >
            <View
              className="rounded-xl px-4 py-3 items-center gap-3 flex-row"
              style={{ backgroundColor: '#4a4e4d', borderWidth: 1, borderColor: '#5a5e5d' }}
            >
              <Search size={18} color="#8b9199" />
              <Text style={{ color: '#8b9199', fontSize: 15 }}>
                Try: painting, moving, repairs
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Horizontal Scrollable Service Chips */}
        <View className="py-3 gap-2.5 flex-col" style={{ backgroundColor: '#30352D' }}>
          {serviceChips.map((row, rowIndex) => (
            <ScrollView
              key={rowIndex}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {row.map((service, index) => (
                <Pressable
                  key={index}
                  className="px-6 py-2.5 rounded-full"
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: '#ffffff'
                  }}
                  onPress={() => {
                    // Find category by name for chips - try to match with existing categories
                    const category = categories?.find(c => 
                      c.name.toLowerCase().includes(service.toLowerCase()) ||
                      service.toLowerCase().includes(c.name.toLowerCase())
                    );
                    if (category) {
                      handleServicePress(category.id, category.name);
                    } else {
                      // If no exact match found, still try to open action sheet with service name
                      // Use a temporary ID format for fallback categories
                      handleServicePress(`temp-${service.toLowerCase().replace(/\s+/g, '-')}`, service);
                    }
                  }}
                >
                  <Text className="text-white text-sm" style={{ fontWeight: '500' }}>
                    {service}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          ))}
        </View>

        {/* Section Title */}
        <View className="px-5 pt-5 pb-4 bg-white flex-col">
          <Text className="text-xl text-stone-900 mb-1" style={{ fontWeight: '700' }}>
            Need Something done?
          </Text>
          <Text className="text-sm text-gray-600" style={{ fontWeight: '400' }}>
            Browse our top trending categories
          </Text>
        </View>

        {/* Service Cards Grid */}
        <View className="px-5 pb-6 bg-white flex-col">
          {isLoading ? (
            <View className="items-center justify-center py-12 flex-col">
              <ActivityIndicator size="large" color="#30352d" />
              <Text className="text-sm text-gray-600 mt-3">Loading categories...</Text>
            </View>
          ) : (
            <View className="gap-3 flex-col">
              {Array.from({ length: Math.ceil(serviceCards.length / 2) }).map((_, rowIndex) => (
                <View key={rowIndex} className="gap-3 flex-row">
                  {serviceCards.slice(rowIndex * 2, rowIndex * 2 + 2).map((service) => {
                    const Icon = service.icon;
                    const serviceId = ('id' in service && service.id) ? String(service.id) : service.title;

                    return (
                      <Pressable
                        key={serviceId}
                        className="flex-1 rounded-2xl items-center justify-center"
                        style={{
                          backgroundColor: service.bgColor,
                          height: 140,
                          padding: 16
                        }}
                        onPress={() => {
                          if ('id' in service && service.id) {
                            // Has a real category ID from database
                            handleServicePress(String(service.id), service.title);
                          } else {
                            // Fallback card - use title as category name with temp ID
                            handleServicePress(`temp-${service.title.toLowerCase().replace(/\s+/g, '-')}`, service.title);
                          }
                        }}
                      >
                        <View className="items-center gap-2 flex-col">
                          <Icon size={36} color="white" strokeWidth={1.5} />
                          <Text className="text-white font-medium text-sm text-center">
                            {service.title}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>

    {/* Booking Action Sheet */}
    <LocationSelectionSheet
      isOpen={showBookingSheet}
      onClose={() => setShowBookingSheet(false)}
      categoryId={selectedCategory.id}
      categoryName={selectedCategory.name}
    />
    </SafeAreaView>
  );
}