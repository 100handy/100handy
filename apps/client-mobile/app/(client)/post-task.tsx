import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useAuthStore, useLocationStore, createTaskPost, useGroupedSubcategories } from '@shared/supabase';

export default function PostTaskScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const location = useLocationStore((s) => s.location);
  const { data: categories } = useGroupedSubcategories();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Sign In Required', 'Please sign in to post a task.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a task title.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTaskPost({
        customer_id: user.id,
        category_id: selectedCategoryId || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        budget_min_cents: budgetMin ? Math.round(parseFloat(budgetMin) * 100) : undefined,
        budget_max_cents: budgetMax ? Math.round(parseFloat(budgetMax) * 100) : undefined,
        address_street: location?.streetAddress || undefined,
        address_postcode: location?.postalCode || undefined,
        address_city: location?.city || undefined,
        preferred_date: preferredDate || undefined,
        preferred_time: preferredTime || undefined,
      });

      Alert.alert('Posted!', 'Your task has been posted. Professionals can now submit bids.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flatten categories for selection
  const allCategories = categories?.flatMap((group) => group.subcategories) || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="mr-3">
          <ChevronLeft size={24} color="#30352D" />
        </Pressable>
        <Text className="text-lg font-worksans-semibold" style={{ color: '#30352D' }}>
          Post a Task
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
        <View className="gap-5">
          {/* Title */}
          <View>
            <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
              What do you need done? *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Mount TV on wall, Deep clean kitchen"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
              style={{ color: '#30352D' }}
            />
          </View>

          {/* Category */}
          <View>
            <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {allCategories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategoryId(cat.id === selectedCategoryId ? null : cat.id)}
                    className={`px-4 py-2 rounded-full border ${
                      cat.id === selectedCategoryId ? 'border-brand-terracotta bg-orange-50' : 'border-gray-300'
                    }`}
                  >
                    <Text
                      className="text-sm font-worksans-medium"
                      style={{ color: cat.id === selectedCategoryId ? '#C1856A' : '#30352D' }}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Description */}
          <View>
            <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
              Details
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what you need..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
              style={{ color: '#30352D', textAlignVertical: 'top', minHeight: 100 }}
            />
          </View>

          {/* Budget Range */}
          <View>
            <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
              Budget Range (optional)
            </Text>
            <View className="flex-row gap-3">
              <TextInput
                value={budgetMin}
                onChangeText={setBudgetMin}
                placeholder="Min £"
                keyboardType="numeric"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
                style={{ color: '#30352D' }}
              />
              <TextInput
                value={budgetMax}
                onChangeText={setBudgetMax}
                placeholder="Max £"
                keyboardType="numeric"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
                style={{ color: '#30352D' }}
              />
            </View>
          </View>

          {/* Preferred Date & Time */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
                Preferred Date
              </Text>
              <TextInput
                value={preferredDate}
                onChangeText={setPreferredDate}
                placeholder="YYYY-MM-DD"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
                style={{ color: '#30352D' }}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-worksans-medium mb-2" style={{ color: '#6B7280' }}>
                Preferred Time
              </Text>
              <TextInput
                value={preferredTime}
                onChangeText={setPreferredTime}
                placeholder="HH:MM"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm font-worksans"
                style={{ color: '#30352D' }}
              />
            </View>
          </View>

          {/* Location Info */}
          {location?.streetAddress && (
            <View className="bg-gray-50 rounded-lg p-4">
              <Text className="text-xs font-worksans-medium mb-1" style={{ color: '#6B7280' }}>
                LOCATION
              </Text>
              <Text className="text-sm font-worksans" style={{ color: '#30352D' }}>
                {location.streetAddress}{location.postalCode ? `, ${location.postalCode}` : ''}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-5 py-4 border-t border-gray-200">
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting || !title.trim()}
          className="w-full py-4 rounded-full items-center flex-row justify-center gap-2"
          style={{ backgroundColor: isSubmitting || !title.trim() ? '#D1D5DB' : '#C1856A' }}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Send size={18} color="white" />
              <Text className="text-base font-worksans-semibold text-white">Post Task</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
