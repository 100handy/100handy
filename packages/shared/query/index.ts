// Query client configuration
export { createQueryClient, queryClient } from './queryClient';

// Category hooks and utilities
export {
  useCategories,
  useCategoriesByNames,
  useTopLevelCategories,
  useSubcategories,
  useCategoriesByLevel,
  useGroupedSubcategories,
  getCategories,
  getCategoriesByNames,
  getTopLevelCategories,
  getSubcategories,
  getCategoriesByLevel,
  buildCategoryTree,
  categoryKeys,
  type Category,
  type CategoryTree,
  type GroupedCategory,
} from './hooks/useCategories';

// Booking hooks and utilities
export {
  useUpcomingBookings,
  usePastBookings,
  useCancelledBookings,
  useBookingById,
  useUserBookings,
  useInvalidateBookings,
  useCreateBooking,
  bookingKeys,
} from './hooks/useBookings';

// Booking types
export type { CreateBookingInput } from '../supabase/bookings';

// Profile hooks and utilities
export {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
  useDeleteAvatar,
  useInvalidateProfile,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  usePrivacySettings,
  useUpdatePrivacySettings,
  useDeleteAccount,
  profileKeys,
} from './hooks/useProfile';

// Handymen hooks and utilities
export {
  useHandymen,
  useHandymenByCategory,
  useHandymanProfile,
  useHandymanReviews,
  useHandymanCategories,
  getHandymen,
  getHandymanProfile,
  getHandymanReviews,
  getHandymanCategories,
  handymenKeys,
  type HandymanProfile,
  type HandymanFilters,
} from './hooks/useHandymen';

// Support hooks and utilities
export {
  useSupportTickets,
  useSupportTicket,
  useTicketMessages,
  useCreateSupportTicket,
  useSendMessage,
  useInvalidateSupport,
  supportKeys,
} from './hooks/useSupport';

// Favorites hooks and utilities
export {
  useFavoriteHandymen,
  useAddFavorite,
  useRemoveFavorite,
  useIsFavorite,
  useInvalidateFavorites,
  favoriteKeys,
} from './hooks/useFavorites';

// Favorites types
export type { Favorite } from '../supabase/favorites';

// Conversation hooks and utilities
export {
  useConversations,
  useConversation,
  useConversationByBooking,
  useConversationMessages,
  useSendConversationMessage,
  useMarkAsRead,
  useInvalidateConversations,
  conversationKeys,
} from './hooks/useConversations';

// Conversation types
export type {
  Conversation,
  ConversationMessage,
  ConversationWithProfiles,
  SendConversationMessageInput,
} from '../supabase/conversations';

// Form fields hooks and utilities
export { useCategoryFormFields } from './hooks/useCategoryFormFields';

// Work area hooks and utilities
export {
  useWorkArea,
  useWorkAreaByUserId,
  useSaveWorkArea,
  useDeleteWorkArea,
  useInvalidateWorkArea,
  workAreaKeys,
  type WorkArea,
  type Coordinate,
  type SaveWorkAreaInput,
} from './hooks/useWorkArea';

// Availability hooks and utilities
export {
  useAvailability,
  useWeeklyAvailability,
  useAvailabilityByUserId,
  useSaveDayAvailability,
  useSaveWeeklyAvailability,
  useDeleteAvailabilitySlot,
  useClearAllAvailability,
  useInvalidateAvailability,
  availabilityKeys,
  type AvailabilitySlot,
  type DayAvailabilityInput,
  type TimeSlotInput,
  type WeeklyAvailability,
} from './hooks/useAvailability';

// Handy profile hooks and utilities
export {
  useHandyProfileExtras,
  useUpdateHandyTools,
  useUpdateHandyVehicles,
  useUpdateHandyQuickFacts,
  useUpdateHandyAboutMe,
  useUpdateHandySyncCalendars,
  useInvalidateHandyProfile,
  handyProfileKeys,
  type HandyProfileExtras,
} from './hooks/useHandyProfile';