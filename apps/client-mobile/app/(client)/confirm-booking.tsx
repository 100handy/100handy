import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useLocationStore, usePendingBookingStore, type PendingBookingData } from '@shared/store';
import { useCreateBooking, useCategoryById, doesAvailabilitySlotApplyToDate, type Coordinate } from '@shared/query';
import { ScrollView, Image, Alert, ActivityIndicator, View, Text, Pressable, BackHandler, Switch, Platform } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context'; import { ChevronLeft, MapPin, Calendar, Clock, Edit, ChevronRight, CreditCard } from 'lucide-react-native'; import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'; import { useHandymanProfile } from '@shared/query'; import { type FormResponse, listPaymentMethods, type PaymentMethod, createPaymentIntent, cancelPaymentIntent, checkBookingConflict, getWorkAreaByUserId, getAvailabilityByUserId, isLocationInWorkArea, type BookingFrequency, FREQUENCY_OPTIONS, calculateDiscountedRate } from '@shared/supabase';
import { useAuthStore } from '@shared/store';
import { useToast } from '@/components/ui/toast';
import { FrequencySelector } from '@/components/booking';
import { getUnsupportedNativeFeatureMessage, initStripePaymentSheet, presentStripePaymentSheet, supportsStripeNative } from '@/lib/native-feature-support';
import { PullDownDismiss } from '@/components/ui/pull-down-dismiss';
import { goBackOrReplace } from '@/lib/navigation';
import { getAppContentValue, useAppContent } from '@/lib/app-content';

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const content = useAppContent('client_confirm_booking', {
    'header.title': 'Review and confirm',
    'sections.tasker': 'Your 100Handy Pro',
    'sections.details': 'Task Details',
    'sections.repeat': 'Repeat service',
    'sections.payment': 'Payment',
    'sections.hourly_rate': 'Hourly Rate',
    'repeat.enabled_body': 'Turn this on to view repeat booking options.',
    'repeat.disabled_body': 'Recurring booking is not available for this service.',
    'payment.fallback_method': 'Apple Pay or card',
    'pricing.savings_template': "You're saving {discount}% with your recurring booking!",
    'pricing.hold_notice': "You may see a temporary hold on your payment method of £{amount}. Don't worry -- you're only billed when your task is complete!",
    'pricing.fee_notice': "Pricing is inclusive of a £7.46/hr Trust and Support fee, as well as VAT, which is billed on 100Handy's fees.",
    'pricing.billing_notice': 'You will not be billed until the task is complete and can cancel at any time. Tasks cancelled less than 24 hours before the start time may be billed a cancellation fee of one hour. Tasks have a one-hour minimum.',
    'pricing.assurance': "You won't be billed until your task is complete.",
    'actions.confirm': 'Confirm and chat',
    'loading.text': 'Loading...',
  });

  // Task details from previous screens
  const taskerId = params.taskerId as string;
  const categoryId = params.categoryId as string;
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : '';
  const selectedDate = params.selectedDate as string;
  const selectedTime = params.selectedTime as string;
  const selectedFrequencyParam =
    typeof params.selectedFrequency === 'string' ? params.selectedFrequency : 'once';
  const { data: selectedCategory, isLoading: categoryLoading } = useCategoryById(categoryId);
  const supportsRecurringFrequency =
    selectedCategory?.supports_recurring ?? categoryName.toLowerCase().includes('clean');

  if (categoryId && !categoryLoading && !selectedCategory) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center">
            <Pressable onPress={() => goBackOrReplace(router, '/(client)/(tabs)/home')} className="mr-4">
              <ChevronLeft size={24} color="#000000" strokeWidth={2} />
            </Pressable>
            <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
              {getAppContentValue(content, 'header.title', 'Review and confirm')}
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
            Service unavailable
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            This service category is currently turned off. Please choose another service.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Parse form responses
  const formResponses: FormResponse = useMemo(() => {
    try {
      return params.formResponses ? JSON.parse(params.formResponses as string) : {};
    } catch {
      return {};
    }
  }, [params.formResponses]);

  // Get user from auth store
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Get location from store
  const location = useLocationStore((state) => state.location);

  // Pending booking store for saving booking before auth
  const { setPendingBooking, clearPendingBooking, getPendingBooking } = usePendingBookingStore();

  // Fetch tasker profile with skill-specific pricing
  const { data: profile, isLoading: profileLoading } = useHandymanProfile(taskerId, selectedCategory?.id);

  // Create booking mutation
  const createBookingMutation = useCreateBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState<BookingFrequency>(
    supportsRecurringFrequency &&
      FREQUENCY_OPTIONS.some((option) => option.value === selectedFrequencyParam)
      ? (selectedFrequencyParam as BookingFrequency)
      : 'once'
  );
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(
    supportsRecurringFrequency && selectedFrequencyParam !== 'once'
  );
  const isSubmittingRef = useRef(false);
  const toast = useToast();
  const recurringFrequencies = useMemo(
    () => FREQUENCY_OPTIONS.filter((option) => option.value !== 'once').map((option) => option.value),
    []
  );

  const fetchPaymentMethods = useCallback(async (): Promise<PaymentMethod[]> => {
    if (!isAuthenticated) {
      setLoadingPayment(false);
      setPaymentMethods([]);
      return [];
    }

    try {
      setLoadingPayment(true);
      const methods = await listPaymentMethods();
      const resolvedMethods = methods || [];
      setPaymentMethods(resolvedMethods);
      return resolvedMethods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    } finally {
      setLoadingPayment(false);
    }
  }, [isAuthenticated]);

  // Fetch payment methods on mount and when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPaymentMethods();
    }, [fetchPaymentMethods])
  );

  // Handle back navigation - ask user if they want to clear pending booking
  const handleBackPress = useCallback(() => {
    const pendingBooking = getPendingBooking();
    const isCurrentPendingDraft =
      !!pendingBooking &&
      pendingBooking.tasker.id === taskerId &&
      pendingBooking.categoryId === categoryId &&
      pendingBooking.selectedDate === selectedDate &&
      pendingBooking.selectedTime === selectedTime;

    if (isCurrentPendingDraft && isAuthenticated) {
      Alert.alert(
        'Cancel Booking?',
        'Are you sure you want to go back? Your booking progress will be lost.',
        [
          {
            text: 'Stay',
            style: 'cancel',
          },
          {
            text: 'Go Back',
            style: 'destructive',
            onPress: () => {
              clearPendingBooking();
              goBackOrReplace(router, '/(client)/(tabs)/home');
            },
          },
        ]
      );
      return true; // Prevent default back behavior
    }

    // No pending booking, just go back normally
    goBackOrReplace(router, '/(client)/(tabs)/home');
    return true;
  }, [
    categoryId,
    clearPendingBooking,
    getPendingBooking,
    isAuthenticated,
    router,
    selectedDate,
    selectedTime,
    taskerId,
  ]);

  // Handle hardware back button on Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true; // Prevent default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [handleBackPress])
  );

  // Calculate estimated price from form responses
  const taskSize = formResponses.task_size as string | undefined;
  const estimatedHours = taskSize === 'small' ? 1 : taskSize === 'large' ? 4 : 2.5; // Default to medium
  const originalHourlyRateCents = profile ? profile.hourly_rate_cents : 0;
  const hourlyRate = originalHourlyRateCents / 100;

  // Calculate discount based on frequency
  const frequencyOption = FREQUENCY_OPTIONS.find((f) => f.value === selectedFrequency);
  const discountPercent = frequencyOption?.discountPercent || 0;
  const { discountedRateCents } = calculateDiscountedRate(
    originalHourlyRateCents,
    discountPercent
  );
  const discountedHourlyRate = discountedRateCents / 100;
  const authorizationHours = Math.max(2, estimatedHours);
  const authorizationAmountCents = Math.round(discountedRateCents * authorizationHours);
  const authorizationAmount = authorizationAmountCents / 100;

  // Save pending booking data to storage and redirect to auth
  const savePendingBookingAndRedirect = () => {
    if (!profile || !location?.streetAddress) {
      return;
    }

    const pendingBookingData: PendingBookingData = {
      categoryId,
      categoryName,
      tasker: {
        id: taskerId,
        userId: profile.user_id,
        displayName: profile.display_name || '100Handy Pro',
        avatarUrl: profile.avatar_url,
        hourlyRateCents: profile.hourly_rate_cents,
        verified: profile.verified || false,
        rating: profile.rating,
      },
      selectedDate,
      selectedTime,
      location: {
        streetAddress: location.streetAddress,
        unitNumber: location.unitNumber,
        city: location.city,
        country: location.country,
        postalCode: location.postalCode,
        formattedAddress: location.formattedAddress,
        placeId: location.placeId,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      formResponses,
      frequency: selectedFrequency,
      discountPercent,
      createdAt: Date.now(),
      returnPath: '/(client)/confirm-booking',
    };

    setPendingBooking(pendingBookingData);

    // Redirect to sign up screen
    router.push('/(auth)/(client)/sign-up');
  };

  const handleFrequencyChange = useCallback((frequency: BookingFrequency) => {
    if (frequency !== 'once') {
      toast.info(
        'Recurring Bookings Coming Soon',
        'Recurring booking checkout is temporarily unavailable in the mobile app.'
      );
      return;
    }

    setSelectedFrequency(frequency);
  }, [toast]);

  const handleRepeatToggle = useCallback((value: boolean) => {
    if (!supportsRecurringFrequency) {
      return;
    }

    setIsRepeatEnabled(value);
    if (!value) {
      setSelectedFrequency('once');
    }
  }, [supportsRecurringFrequency]);

  const handleCreateBooking = async () => {
    // Debounce/mutex guard to prevent double-submission
    if (isSubmittingRef.current) return;

    // Check if profile and location are loaded
    if (!profile) {
      Alert.alert('Error', '100Handy Pro profile not loaded');
      return;
    }

    if (!location?.streetAddress) {
      Alert.alert('Error', 'Location information missing');
      return;
    }

    // Validate hourly rate is set
    if (originalHourlyRateCents <= 0) {
      toast.error('Pricing Error', 'This 100Handy Pro has not set their hourly rate for this service. Please choose another 100Handy Pro.');
      return;
    }

    // Validate that selected date+time is not in the past (with 5-min grace)
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    if (!isNaN(selectedDateTime.getTime()) && selectedDateTime.getTime() < Date.now() - 5 * 60 * 1000) {
      Alert.alert(
        'Invalid Date/Time',
        'The selected date and time has already passed. Please choose a future time.'
      );
      return;
    }

    // If not authenticated, save booking and redirect to sign up
    if (!isAuthenticated || !user) {
      Alert.alert(
        'Sign In Required',
        'Please create an account or sign in to complete your booking. Your booking details will be saved.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Up',
            onPress: savePendingBookingAndRedirect,
          },
        ]
      );
      return;
    }

    if (loadingPayment) {
      toast.info('Loading payment method', 'Please wait a moment and try again.');
      return;
    }

    if (selectedFrequency !== 'once') {
      toast.error(
        'Recurring Booking Unavailable',
        'Recurring booking checkout is temporarily unavailable in the mobile app.'
      );
      return;
    }

    if (!supportsStripeNative()) {
      Alert.alert('Unsupported in Expo Go', getUnsupportedNativeFeatureMessage('Booking payment authorization'));
      return;
    }

    let authorizedPaymentIntentId: string | null = null;
    isSubmittingRef.current = true;

    try {
      setIsSubmitting(true);

      // --- VALIDATION PHASE ---

      // 1. Check work area coverage (if tasker has set a work area)
      const workArea = await getWorkAreaByUserId(profile.user_id);
      if (workArea && location.latitude && location.longitude) {
        const clientLocation: Coordinate = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        const isInWorkArea = isLocationInWorkArea(clientLocation, workArea);
        if (!isInWorkArea) {
          setIsSubmitting(false);
          Alert.alert(
            'Location Not Covered',
            `${profile.display_name || 'This 100Handy Pro'} doesn't serve your selected location. Please choose another 100Handy Pro.`,
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // 2. Check availability for the selected date/time
      const availability = await getAvailabilityByUserId(profile.user_id);
      if (availability && availability.length > 0) {
        const daySlots = availability.filter((slot) =>
          doesAvailabilitySlotApplyToDate(slot, selectedDate),
        );

        if (daySlots.length === 0) {
          setIsSubmitting(false);
          Alert.alert(
            'Not Available',
            `${profile.display_name || 'This 100Handy Pro'} is not available on this day. Please select another date.`,
            [{ text: 'OK' }]
          );
          return;
        }

        // Check if selected time + task duration fits within any availability slot
        const parseTimeToMinutes = (time: string): number => {
          const parts = time.split(':').map(Number);
          return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
        };
        const selectedMinutes = parseTimeToMinutes(selectedTime);
        const taskEndMinutes = selectedMinutes + estimatedHours * 60;
        const isTimeAvailable = daySlots.some((slot) => {
          const slotStart = parseTimeToMinutes(slot.start_time);
          const slotEnd = parseTimeToMinutes(slot.end_time);
          return selectedMinutes >= slotStart && taskEndMinutes <= slotEnd;
        });

        if (!isTimeAvailable) {
          setIsSubmitting(false);
          Alert.alert(
            'Time Not Available',
            `${profile.display_name || 'This 100Handy Pro'} is not available at ${selectedTime}. Please select another time.`,
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // 3. Check for booking conflicts
      const hasConflict = await checkBookingConflict(
        profile.user_id,
        selectedDate,
        selectedTime,
        estimatedHours
      );
      if (hasConflict) {
        setIsSubmitting(false);
        Alert.alert(
          'Time Slot Unavailable',
          `${profile.display_name || 'This 100Handy Pro'} already has a booking at this time. Please select another time.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // --- END VALIDATION ---

      // --- PAYMENT AUTHORIZATION HOLD ---
      // Taskrabbit-style: authorize (hold) now, capture later when job is completed.
      // Match web behavior: hold minimum 2 hours worth of the hourly rate.
      // Use discounted rate for recurring bookings.
      const paymentIntent = await createPaymentIntent(authorizationAmountCents, {
        handy_id: profile.user_id,
        category_id: categoryId,
        estimated_hours: estimatedHours.toString(),
        source: 'mobile',
      });

      if (!paymentIntent) {
        setIsSubmitting(false);
        Alert.alert('Payment Error', 'Failed to initialize payment authorization. Please try again.');
        return;
      }

      const { error: initPaymentError } = await initStripePaymentSheet({
        paymentIntentClientSecret: paymentIntent.clientSecret,
        merchantDisplayName: '100Handy',
        ...(Platform.OS === 'ios' ? { applePay: { merchantCountryCode: 'GB' } } : {}),
        ...(Platform.OS === 'android'
          ? { googlePay: { merchantCountryCode: 'GB', testEnv: __DEV__ } }
          : {}),
        style: 'automatic',
      });

      if (initPaymentError) {
        setIsSubmitting(false);
        Alert.alert('Payment Error', initPaymentError.message || 'Failed to initialize payment authorization. Please try again.');
        return;
      }

      const { error: paymentError } = await presentStripePaymentSheet();

      if (paymentError) {
        setIsSubmitting(false);
        if (paymentError.code !== 'Canceled') {
          Alert.alert('Payment Error', paymentError.message || 'Payment authorization failed. Please try again.');
        }
        return;
      }

      authorizedPaymentIntentId = paymentIntent.paymentIntentId;

      // Create booking(s) - use recurring bookings for non-once frequencies
      const bookingInput = {
        customer_id: user.id,
        handy_id: profile.user_id,
        category_id: categoryId,
        task_title: categoryName,
        task_details: (formResponses.additional_details as string) || undefined,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        address_street: location.streetAddress,
        address_apartment: location.unitNumber || undefined,
        address_postcode: location.postalCode || '',
        address_city: location.city || '',
        address_country: location.country || 'UK',
        hourly_rate_cents: originalHourlyRateCents,
        estimated_hours: estimatedHours,
        form_responses: formResponses,
        payment_intent_id: authorizedPaymentIntentId,
      };

      const newBooking = await createBookingMutation.mutateAsync(bookingInput);
      const newBookingId = newBooking.id;

      // Clear any pending booking after successful creation
      clearPendingBooking();

      // Navigate to success screen
      router.push({
        pathname: '/(client)/booking-success',
        params: {
          taskerName: profile.display_name || '100Handy Pro',
          taskerAvatar: profile.avatar_url || '',
          categoryName,
          selectedDate,
          selectedTime,
          bookingId: newBookingId,
        },
      });
    } catch (error: unknown) {
      console.error('Error creating booking:', error);
      // If payment was authorized but booking creation failed, release the hold.
      if (authorizedPaymentIntentId) {
        try {
          await cancelPaymentIntent(authorizedPaymentIntentId);
        } catch {
          Alert.alert(
            'Payment Hold Notice',
            'Your booking failed and we could not release the card hold automatically. The hold will expire within 7 days, or contact support for immediate release.'
          );
          return;
        }
      }
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-col flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C1856A" />
          <Text className="text-sm text-gray-600 mt-3">
            {getAppContentValue(content, 'loading.text', 'Loading...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-col px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={handleBackPress} className="mr-4">
            <ChevronLeft size={24} color="#000000" strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-black mr-10">
            {getAppContentValue(content, 'header.title', 'Review and confirm')}
          </Text>
        </View>
      </View>

      <PullDownDismiss onDismiss={handleBackPress}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-col px-5 py-6 gap-6">
          {/* Tasker Info */}
          <View className="flex-col bg-white rounded-lg border border-gray-300 p-5">
            <Text className="text-base font-semibold text-brand-dark-alt mb-4">
              {getAppContentValue(content, 'sections.tasker', 'Your 100Handy Pro')}
            </Text>
            <View className="flex-row items-center gap-3">
              <Image
                source={profile?.avatar_url ? { uri: profile.avatar_url } : require('@/assets/images/icon.png')}
                className="w-16 h-16 rounded-full bg-gray-100"
              />
              <View className="flex-col flex-1">
                <Text className="text-lg font-semibold text-brand-dark-alt">
                  {profile?.display_name || '100Handy Pro'}
                </Text>
                {profile?.verified && (
                  <View className="flex-row items-center gap-1 mt-1">
                    <View className="flex-col w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#82BE56' }} />
                    <Text className="text-xs font-medium" style={{ color: '#82BE56' }}>
                      Verified Pro
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-lg font-bold text-brand-terracotta">
                £{hourlyRate.toFixed(2)}/hr
              </Text>
            </View>
          </View>

          {/* Task Details */}
          <View className="flex-col bg-white rounded-lg border border-gray-300 p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-semibold text-brand-dark-alt">
                {getAppContentValue(content, 'sections.details', 'Task Details')}
              </Text>
              <Pressable onPress={() => router.push({
                pathname: '/(client)/task-form',
                params: {
                  taskerId,
                  categoryId,
                  categoryName,
                  selectedDate,
                  selectedTime,
                  formResponses: JSON.stringify(formResponses),
                },
              })}>
                <Edit size={18} color="#C1856A" />
              </Pressable>
            </View>

            <View className="flex-col gap-3">
              {/* Category */}
              <View className="flex-col">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Service
                </Text>
                <Text className="text-sm text-brand-dark-alt">
                  {categoryName}
                </Text>
              </View>

              {/* Location */}
              <View className="flex-col">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                  Location
                </Text>
                <View className="flex-row items-start gap-2">
                  <MapPin size={14} color="#6B7280" className="mt-0.5" />
                  <Text className="flex-1 text-sm text-brand-dark-alt">
                    {location?.streetAddress}
                    {location?.unitNumber ? `, ${location.unitNumber}` : ''}
                  </Text>
                </View>
              </View>

              {/* Date & Time */}
              <View className="flex-row gap-4">
                <View className="flex-col flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Date
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-sm text-brand-dark-alt">
                      {formatDate(selectedDate)}
                    </Text>
                  </View>
                </View>

                <View className="flex-col flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Time
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Clock size={14} color="#6B7280" />
                    <Text className="text-sm text-brand-dark-alt">
                      {selectedTime}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Display form responses dynamically */}
              {Object.entries(formResponses).map(([key, value]) => {
                // Skip if empty or null
                if (value === null || value === undefined || value === '') return null;

                // Format the key into a readable label
                const label = key
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                // Format the value based on type
                let displayValue: string;
                if (Array.isArray(value)) {
                  displayValue = value.join(', ');
                } else if (typeof value === 'boolean') {
                  displayValue = value ? 'Yes' : 'No';
                } else if (key === 'task_size') {
                  displayValue = `${value} (${estimatedHours} ${estimatedHours === 1 ? 'hour' : 'hours'})`;
                } else if (key === 'vehicle_requirement') {
                  displayValue = value === 'not_needed' ? 'Not needed' : String(value);
                } else {
                  displayValue = String(value);
                }

                return (
                  <View key={key} className="flex-col">
                    <Text className="text-xs font-medium text-gray-600 mb-1">
                      {label}
                    </Text>
                    <Text className="text-sm text-brand-dark-alt capitalize">
                      {displayValue}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="rounded-lg border border-gray-300 bg-white p-5">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#30352D] mb-1">
                  {getAppContentValue(content, 'sections.repeat', 'Repeat service')}
                </Text>
                <Text className="text-sm text-gray-600">
                  {supportsRecurringFrequency
                    ? getAppContentValue(content, 'repeat.enabled_body', 'Turn this on to view repeat booking options.')
                    : getAppContentValue(content, 'repeat.disabled_body', 'Recurring booking is not available for this service.')}
                </Text>
              </View>
              <Switch
                value={supportsRecurringFrequency ? isRepeatEnabled : false}
                onValueChange={handleRepeatToggle}
                disabled={!supportsRecurringFrequency}
                trackColor={{ false: '#D1D5DB', true: '#A7D8C8' }}
                thumbColor={
                  supportsRecurringFrequency && isRepeatEnabled ? '#047857' : '#F9FAFB'
                }
              />
            </View>

          </View>

          {supportsRecurringFrequency && isRepeatEnabled ? (
            <FrequencySelector
              selectedFrequency={selectedFrequency}
              onFrequencyChange={handleFrequencyChange}
              disabledFrequencies={recurringFrequencies}
              disabledMessage="Recurring booking checkout is temporarily unavailable on mobile."
            />
          ) : null}

          {/* Payment Method */}
          <Pressable
            onPress={() => router.push('/(client)/profile/payment-methods')}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
          >
            <Text className="text-lg font-semibold text-brand-dark-alt">
              {getAppContentValue(content, 'sections.payment', 'Payment')}
            </Text>
            <View className="flex-row items-center gap-2">
              {loadingPayment ? (
                <ActivityIndicator size="small" color="#C1856A" />
              ) : paymentMethods.length > 0 ? (
                <>
                  <Text className="text-base text-brand-dark-alt capitalize">
                    {(paymentMethods.find((m) => m.isDefault) ?? paymentMethods[0]).card.brand} ••••{' '}
                    {(paymentMethods.find((m) => m.isDefault) ?? paymentMethods[0]).card.last4}
                  </Text>
                  <ChevronRight size={20} color="#6B7280" />
                </>
              ) : (
                <>
                  <Text className="text-base text-brand-terracotta">
                    {getAppContentValue(content, 'payment.fallback_method', 'Apple Pay or card')}
                  </Text>
                  <ChevronRight size={20} color="#C1856A" />
                </>
              )}
            </View>
          </Pressable>

          {/* Hourly Rate */}
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-lg font-semibold text-brand-dark-alt">
              {getAppContentValue(content, 'sections.hourly_rate', 'Hourly Rate')}
            </Text>
            <View className="flex-row items-center gap-2">
              {discountPercent > 0 && (
                <Text className="text-base text-gray-400 line-through">
                  £{hourlyRate.toFixed(2)}/hr
                </Text>
              )}
              <Text className="text-lg font-semibold" style={{ color: discountPercent > 0 ? '#82BE56' : '#30352D' }}>
                £{discountedHourlyRate.toFixed(2)}/hr
              </Text>
            </View>
          </View>

          {/* Savings Banner - only show when discount applied */}
          {discountPercent > 0 && (
            <View
              className="flex-row items-center px-4 py-3 rounded-lg mb-4"
              style={{ backgroundColor: '#E8F5E1' }}
            >
              <Text className="flex-1 text-sm font-medium" style={{ color: '#2E7D32' }}>
                {getAppContentValue(content, 'pricing.savings_template', "You're saving {discount}% with your recurring booking!").replace('{discount}', String(discountPercent))}
              </Text>
            </View>
          )}

          {/* Payment Hold Notice */}
          <View className="flex-col py-6">
            <Text className="text-sm text-gray-600 leading-5 mb-4">
              {getAppContentValue(content, 'pricing.hold_notice', "You may see a temporary hold on your payment method of £{amount}. Don't worry -- you're only billed when your task is complete!").replace('{amount}', authorizationAmount.toFixed(2))}
            </Text>

            <Text className="text-sm text-gray-600 leading-5 mb-4">
              {getAppContentValue(content, 'pricing.fee_notice', "Pricing is inclusive of a £7.46/hr Trust and Support fee, as well as VAT, which is billed on 100Handy's fees.")}
            </Text>

            <Text className="text-sm text-gray-600 leading-5">
              {getAppContentValue(content, 'pricing.billing_notice', 'You will not be billed until the task is complete and can cancel at any time. Tasks cancelled less than 24 hours before the start time may be billed a cancellation fee of one hour. Tasks have a one-hour minimum.')}
            </Text>
          </View>

          {/* Billing Assurance */}
          <View className="flex-row items-center px-4 py-3 rounded-lg mb-4"
            style={{ backgroundColor: '#FFF4ED' }}
          >
            <CreditCard size={20} color="#C1856A" className="mr-3" />
            <Text className="flex-1 text-sm text-brand-terracotta">
              {getAppContentValue(content, 'pricing.assurance', "You won't be billed until your task is complete.")}
            </Text>
          </View>
          </View>
        </ScrollView>

        {/* Bottom Confirm Button */}
        <View className="flex-col px-5 py-4 bg-white border-t border-gray-200">
          <Pressable
            onPress={handleCreateBooking}
            disabled={isSubmitting}
            className="w-full py-4 rounded-full items-center"
            style={{ backgroundColor: isSubmitting ? '#D1D5DB' : '#C1856A' }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {getAppContentValue(content, 'actions.confirm', 'Confirm and chat')}
              </Text>
            )}
          </Pressable>
        </View>
      </PullDownDismiss>
    </SafeAreaView>
  );
}
