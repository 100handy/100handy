// packages/shared/supabase/availability.ts
import { supabase } from './supabaseClient.native';

// Types
export interface AvailabilitySlot {
  id: string;
  user_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;  // "HH:MM:SS" format from database
  end_time: string;    // "HH:MM:SS" format from database
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlotInput {
  id?: string; // Optional for updates
  startTime: string; // "HH:MM" format from UI
  endTime: string;   // "HH:MM" format from UI
}

export interface DayAvailabilityInput {
  dayIndex: number;
  slots: TimeSlotInput[];
}

export interface WeeklyAvailability {
  [dayIndex: number]: AvailabilitySlot[];
}

// Default timezone - could be made configurable per user
const DEFAULT_TIMEZONE = 'Europe/London';

/**
 * Convert UI time format to database format with validation
 * @param time - Time string in "HH:MM" format
 * @returns Time string in "HH:MM:SS" format
 * @throws {Error} If time format or values are invalid
 */
function formatTimeForDB(time: string): string {
  const parts = time.split(':');

  if (parts.length === 3) {
    // Already in HH:MM:SS format - validate values
    const [hours, minutes, seconds] = parts;
    const h = parseInt(hours!, 10);
    const m = parseInt(minutes!, 10);
    const s = parseInt(seconds!, 10);

    if (isNaN(h) || h < 0 || h > 23) {
      throw new Error(`Invalid hour: ${hours}. Must be 00-23`);
    }
    if (isNaN(m) || m < 0 || m > 59) {
      throw new Error(`Invalid minute: ${minutes}. Must be 00-59`);
    }
    if (isNaN(s) || s < 0 || s > 59) {
      throw new Error(`Invalid second: ${seconds}. Must be 00-59`);
    }

    return time;
  }

  if (parts.length === 2) {
    const [hours, minutes] = parts;

    // Validate format
    if (!/^\d{2}$/.test(hours!) || !/^\d{2}$/.test(minutes!)) {
      throw new Error(`Invalid time format: "${time}". Expected HH:MM`);
    }

    // Validate value ranges
    const h = parseInt(hours!, 10);
    const m = parseInt(minutes!, 10);

    if (h < 0 || h > 23) {
      throw new Error(`Invalid hour: ${h}. Must be 0-23`);
    }
    if (m < 0 || m > 59) {
      throw new Error(`Invalid minute: ${m}. Must be 0-59`);
    }

    return `${time}:00`;
  }

  throw new Error(`Invalid time format: "${time}". Expected HH:MM or HH:MM:SS`);
}

/**
 * Get all availability slots for the current tasker
 * @returns Array of availability slots
 * @throws {Error} If user is not authenticated or query fails
 */
export async function getAvailability(): Promise<AvailabilitySlot[]> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('professional_availability')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) {
    throw new Error(`Failed to fetch availability: ${error.message}`);
  }

  return data || [];
}

/**
 * Get availability grouped by day of week
 * @returns Object mapping day index to array of slots
 * @throws {Error} If user is not authenticated or query fails
 */
export async function getWeeklyAvailability(): Promise<WeeklyAvailability> {
  const slots = await getAvailability();
  const weekly: WeeklyAvailability = {};

  slots.forEach(slot => {
    if (!weekly[slot.day_of_week]) {
      weekly[slot.day_of_week] = [];
    }
    weekly[slot.day_of_week]!.push(slot);
  });

  return weekly;
}

/**
 * Get availability for a specific tasker (for client booking)
 * @param userId - The tasker's user ID
 * @returns Array of availability slots
 * @throws {Error} If query fails
 */
export async function getAvailabilityByUserId(userId: string): Promise<AvailabilitySlot[]> {
  const { data, error } = await supabase
    .from('professional_availability')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) {
    throw new Error(`Failed to fetch availability: ${error.message}`);
  }

  return data || [];
}

/**
 * Get availability for multiple taskers in a single query (for batch client booking)
 * @param userIds - Array of tasker user IDs
 * @returns Record mapping user ID to array of availability slots
 * @throws {Error} If query fails
 */
export async function getAvailabilityByUserIds(userIds: string[]): Promise<Record<string, AvailabilitySlot[]>> {
  if (!userIds.length) return {};

  const { data, error } = await supabase
    .from('professional_availability')
    .select('*')
    .in('user_id', userIds)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) {
    throw new Error(`Failed to fetch availability: ${error.message}`);
  }

  // Group by user_id
  const result: Record<string, AvailabilitySlot[]> = {};
  userIds.forEach(id => { result[id] = []; });

  (data || []).forEach(slot => {
    if (!result[slot.user_id]) {
      result[slot.user_id] = [];
    }
    result[slot.user_id]!.push(slot);
  });

  return result;
}

/**
 * Save availability for a specific day
 * This replaces all slots for that day (delete + insert pattern with rollback)
 * @param input - Day index and array of time slots
 * @throws {Error} If user is not authenticated, validation fails, or save fails
 */
export async function saveDayAvailability(input: DayAvailabilityInput): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Validate day index
  if (input.dayIndex < 0 || input.dayIndex > 6) {
    throw new Error(`Invalid day index: ${input.dayIndex}. Must be 0-6`);
  }

  // Fetch existing slots for potential rollback
  const { data: existingSlots } = await supabase
    .from('professional_availability')
    .select('*')
    .eq('user_id', user.id)
    .eq('day_of_week', input.dayIndex);

  // Delete existing slots for this day
  const { error: deleteError } = await supabase
    .from('professional_availability')
    .delete()
    .eq('user_id', user.id)
    .eq('day_of_week', input.dayIndex);

  if (deleteError) {
    throw new Error(`Failed to clear existing availability: ${deleteError.message}`);
  }

  // If no new slots, we're done
  if (!input.slots.length) {
    return;
  }

  // Insert new slots
  const slotsToInsert = input.slots.map(slot => ({
    user_id: user.id,
    day_of_week: input.dayIndex,
    start_time: formatTimeForDB(slot.startTime),
    end_time: formatTimeForDB(slot.endTime),
    timezone: DEFAULT_TIMEZONE,
    is_active: true,
  }));

  const { error: insertError } = await supabase
    .from('professional_availability')
    .insert(slotsToInsert);

  if (insertError) {
    // Rollback: Re-insert original slots if insert failed
    if (existingSlots && existingSlots.length > 0) {
      const { error: rollbackError } = await supabase
        .from('professional_availability')
        .insert(existingSlots.map(slot => ({
          id: slot.id,
          user_id: slot.user_id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          timezone: slot.timezone,
          is_active: slot.is_active,
        })));

      if (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        throw new Error(`Failed to save availability and rollback failed: ${insertError.message}. Please refresh and try again.`);
      }
    }
    throw new Error(`Failed to save availability: ${insertError.message}`);
  }
}

/**
 * Save entire week's availability at once (with rollback on failure)
 * @param weekData - Object mapping day index to array of time slots
 * @throws {Error} If user is not authenticated or save fails
 */
export async function saveWeeklyAvailability(
  weekData: { [dayIndex: number]: TimeSlotInput[] }
): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch existing slots for potential rollback
  const { data: existingSlots } = await supabase
    .from('professional_availability')
    .select('*')
    .eq('user_id', user.id);

  // Delete all existing availability for user
  const { error: deleteError } = await supabase
    .from('professional_availability')
    .delete()
    .eq('user_id', user.id);

  if (deleteError) {
    throw new Error(`Failed to clear existing availability: ${deleteError.message}`);
  }

  // Collect all slots to insert
  const slotsToInsert: Array<{
    user_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    timezone: string;
    is_active: boolean;
  }> = [];

  Object.entries(weekData).forEach(([dayIndex, slots]) => {
    slots.forEach(slot => {
      slotsToInsert.push({
        user_id: user.id,
        day_of_week: parseInt(dayIndex),
        start_time: formatTimeForDB(slot.startTime),
        end_time: formatTimeForDB(slot.endTime),
        timezone: DEFAULT_TIMEZONE,
        is_active: true,
      });
    });
  });

  if (slotsToInsert.length === 0) {
    return; // No slots to insert
  }

  const { error: insertError } = await supabase
    .from('professional_availability')
    .insert(slotsToInsert);

  if (insertError) {
    // Rollback: Re-insert original slots if insert failed
    if (existingSlots && existingSlots.length > 0) {
      const { error: rollbackError } = await supabase
        .from('professional_availability')
        .insert(existingSlots.map(slot => ({
          id: slot.id,
          user_id: slot.user_id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          timezone: slot.timezone,
          is_active: slot.is_active,
        })));

      if (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        throw new Error(`Failed to save availability and rollback failed: ${insertError.message}. Please refresh and try again.`);
      }
    }
    throw new Error(`Failed to save availability: ${insertError.message}`);
  }
}

/**
 * Delete a specific availability slot
 * @param slotId - The slot ID to delete
 * @throws {Error} If user is not authenticated or delete fails
 */
export async function deleteAvailabilitySlot(slotId: string): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('professional_availability')
    .delete()
    .eq('id', slotId)
    .eq('user_id', user.id); // Security: ensure user owns the slot

  if (error) {
    throw new Error(`Failed to delete availability slot: ${error.message}`);
  }
}

/**
 * Clear all availability for the current tasker
 * @throws {Error} If user is not authenticated or clear fails
 */
export async function clearAllAvailability(): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('professional_availability')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to clear availability: ${error.message}`);
  }
}
