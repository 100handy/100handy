// packages/shared/supabase/availability.ts
import { supabase } from './supabaseClient';

// Types
export interface AvailabilitySlot {
  id: string;
  user_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;  // "HH:MM:SS" format from database
  end_time: string;    // "HH:MM:SS" format from database
  recurrence_type?: RecurrenceType | null;
  starts_on?: string | null;
  ends_on?: string | null;
  ends_after_occurrences?: number | null;
  day_of_month?: number | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';
export type RecurrenceEndType = 'never' | 'on_date' | 'after_occurrences';

export interface TimeSlotInput {
  id?: string; // Optional for updates
  startTime: string; // "HH:MM" format from UI
  endTime: string;   // "HH:MM" format from UI
  startsOn?: string;
  recurrenceType?: RecurrenceType;
}

export interface DayAvailabilityInput {
  dayIndex: number;
  slots: TimeSlotInput[];
}

export interface CreateAvailabilityInput {
  dayIndex: number;
  slot: TimeSlotInput;
  startsOn: string;
  recurrenceType: RecurrenceType;
  endsOn?: string | null;
  endsAfterOccurrences?: number | null;
}

export interface ReplaceAvailabilitySlotsInput {
  deleteSlotIds: string[];
  slots: CreateAvailabilityInput[];
}

export interface WeeklyAvailability {
  [dayIndex: number]: AvailabilitySlot[];
}

// Default timezone - could be made configurable per user
const DEFAULT_TIMEZONE = 'Europe/London';

type AvailabilityInsertRow = {
  id?: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean | null;
  recurrence_type?: RecurrenceType | null;
  starts_on?: string | null;
  ends_on?: string | null;
  ends_after_occurrences?: number | null;
  day_of_month?: number | null;
};

const RECURRENCE_SCHEMA_COLUMNS = [
  'recurrence_type',
  'starts_on',
  'ends_on',
  'ends_after_occurrences',
  'day_of_month',
];

let hasWarnedLegacyAvailabilitySchema = false;

function isMissingRecurrenceColumnError(error: { message?: string }): boolean {
  const message = error.message ?? '';
  return RECURRENCE_SCHEMA_COLUMNS.some((column) => message.includes(`'${column}'`));
}

function stripRecurrenceColumns(row: AvailabilityInsertRow) {
  const {
    recurrence_type: _recurrenceType,
    starts_on: _startsOn,
    ends_on: _endsOn,
    ends_after_occurrences: _endsAfterOccurrences,
    day_of_month: _dayOfMonth,
    ...legacyRow
  } = row;

  return legacyRow;
}

function requiresRecurrenceSchema(row: AvailabilityInsertRow): boolean {
  return row.recurrence_type !== undefined && row.recurrence_type !== null && row.recurrence_type !== 'weekly';
}

async function insertAvailabilityRows(
  rows: AvailabilityInsertRow | AvailabilityInsertRow[],
) {
  const { error } = await supabase
    .from('professional_availability')
    .insert(rows);

  if (!error) {
    return;
  }

  if (!isMissingRecurrenceColumnError(error)) {
    throw error;
  }

  if (!hasWarnedLegacyAvailabilitySchema) {
    console.warn(
      'professional_availability recurrence columns are not available; saving with legacy weekly availability schema.',
      error.message,
    );
    hasWarnedLegacyAvailabilitySchema = true;
  }

  const rowList = Array.isArray(rows) ? rows : [rows];
  if (rowList.some(requiresRecurrenceSchema)) {
    throw new Error(
      'This availability type requires the recurring availability database migration. Please update the database before saving one-time availability.',
    );
  }

  const legacyRows = Array.isArray(rows)
    ? rows.map(stripRecurrenceColumns)
    : stripRecurrenceColumns(rows);

  const { error: legacyError } = await supabase
    .from('professional_availability')
    .insert(legacyRows);

  if (legacyError) {
    throw legacyError;
  }
}

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentWeekDateForDay(dayIndex: number): string {
  const today = new Date();
  const date = new Date(today);
  date.setDate(today.getDate() - today.getDay() + dayIndex);
  return formatDateOnly(date);
}

function getLegacyWeeklyAnchorForDay(dayIndex: number): string {
  const sunday = parseDateOnly('1970-01-04');
  sunday.setDate(sunday.getDate() + dayIndex);
  return formatDateOnly(sunday);
}

function daysBetween(start: Date, end: Date): number {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endUtc - startUtc) / (24 * 60 * 60 * 1000));
}

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

export function doesAvailabilitySlotApplyToDate(
  slot: AvailabilitySlot,
  dateValue: string | Date,
): boolean {
  const targetDate =
    typeof dateValue === 'string' ? parseDateOnly(dateValue) : new Date(dateValue);
  const recurrenceType = slot.recurrence_type ?? 'weekly';
  const startsOnValue = slot.starts_on ?? getLegacyWeeklyAnchorForDay(slot.day_of_week);
  const startsOn = parseDateOnly(startsOnValue);

  if (!slot.is_active || targetDate < startsOn) {
    return false;
  }

  if (slot.ends_on && targetDate > parseDateOnly(slot.ends_on)) {
    return false;
  }

  let occurrenceIndex: number | null = null;

  if (recurrenceType === 'none') {
    occurrenceIndex = slot.starts_on && formatDateOnly(targetDate) === slot.starts_on ? 1 : null;
  } else if (recurrenceType === 'daily') {
    occurrenceIndex = daysBetween(startsOn, targetDate) + 1;
  } else if (recurrenceType === 'weekly') {
    const diffDays = daysBetween(startsOn, targetDate);
    occurrenceIndex =
      diffDays % 7 === 0 && targetDate.getDay() === slot.day_of_week
        ? diffDays / 7 + 1
        : null;
  } else if (recurrenceType === 'monthly') {
    const dayOfMonth = slot.day_of_month ?? startsOn.getDate();
    const diffMonths = monthsBetween(startsOn, targetDate);
    occurrenceIndex =
      diffMonths >= 0 && targetDate.getDate() === dayOfMonth ? diffMonths + 1 : null;
  }

  if (occurrenceIndex === null || occurrenceIndex < 1) {
    return false;
  }

  if (
    slot.ends_after_occurrences &&
    occurrenceIndex > slot.ends_after_occurrences
  ) {
    return false;
  }

  return true;
}

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
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dateKey = formatDateOnly(date);
    const dayIndex = date.getDay();
    const daySlots = slots.filter((slot) =>
      doesAvailabilitySlotApplyToDate(slot, dateKey),
    );

    if (daySlots.length > 0) {
      weekly[dayIndex] = daySlots.sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      );
    }
  }

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

export async function createAvailabilitySlot(
  input: CreateAvailabilityInput,
): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  if (input.dayIndex < 0 || input.dayIndex > 6) {
    throw new Error(`Invalid day index: ${input.dayIndex}. Must be 0-6`);
  }

  const recurrenceType = input.recurrenceType ?? 'none';
  const startsOn = parseDateOnly(input.startsOn);
  const endsOn = input.endsOn ? parseDateOnly(input.endsOn) : null;

  if (endsOn && endsOn < startsOn) {
    throw new Error('Recurrence end date must be on or after the start date');
  }

  if (
    input.endsAfterOccurrences !== undefined &&
    input.endsAfterOccurrences !== null &&
    input.endsAfterOccurrences < 1
  ) {
    throw new Error('Occurrences must be at least 1');
  }

  const row: AvailabilityInsertRow = {
    user_id: user.id,
    day_of_week: input.dayIndex,
    start_time: formatTimeForDB(input.slot.startTime),
    end_time: formatTimeForDB(input.slot.endTime),
    recurrence_type: recurrenceType,
    starts_on: input.startsOn,
    timezone: DEFAULT_TIMEZONE,
    is_active: true,
  };

  if (input.endsOn) {
    Object.assign(row, { ends_on: input.endsOn });
  }

  if (input.endsAfterOccurrences !== undefined && input.endsAfterOccurrences !== null) {
    Object.assign(row, { ends_after_occurrences: input.endsAfterOccurrences });
  }

  try {
    await insertAvailabilityRows(row);
  } catch (error) {
    throw new Error(`Failed to save availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function replaceAvailabilitySlots(
  input: ReplaceAvailabilitySlotsInput,
): Promise<void> {
  const slots = input.slots.map(({ dayIndex, slot, startsOn, recurrenceType, endsOn, endsAfterOccurrences }) => ({
    day_of_week: dayIndex,
    start_time: formatTimeForDB(slot.startTime),
    end_time: formatTimeForDB(slot.endTime),
    recurrence_type: recurrenceType,
    starts_on: startsOn,
    ends_on: endsOn ?? null,
    ends_after_occurrences: endsAfterOccurrences ?? null,
    timezone: DEFAULT_TIMEZONE,
  }));

  const { error } = await supabase.rpc('replace_professional_availability_slots', {
    p_delete_ids: input.deleteSlotIds,
    p_slots: slots,
  });

  if (error) {
    if (isMissingRecurrenceColumnError(error)) {
      throw new Error(
        'Recurring availability is not available in the database yet. Please run the latest migrations.',
      );
    }
    throw new Error(`Failed to save availability: ${error.message}`);
  }
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

  // Insert new slots. Default to one-time availability unless explicitly marked recurring.
  const defaultStartsOn = getCurrentWeekDateForDay(input.dayIndex);
  const slotsToInsert: AvailabilityInsertRow[] = input.slots.map(slot => ({
    user_id: user.id,
    day_of_week: input.dayIndex,
    start_time: formatTimeForDB(slot.startTime),
    end_time: formatTimeForDB(slot.endTime),
    recurrence_type: slot.recurrenceType ?? 'none',
    starts_on: slot.startsOn ?? defaultStartsOn,
    timezone: DEFAULT_TIMEZONE,
    is_active: true,
  }));

  try {
    await insertAvailabilityRows(slotsToInsert);
  } catch (insertError) {
    // Rollback: Re-insert original slots if insert failed
    if (existingSlots && existingSlots.length > 0) {
      try {
        await insertAvailabilityRows(existingSlots.map(slot => ({
          id: slot.id,
          user_id: slot.user_id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          recurrence_type: slot.recurrence_type,
          starts_on: slot.starts_on,
          timezone: slot.timezone,
          is_active: slot.is_active,
        })));
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        throw new Error(`Failed to save availability and rollback failed: ${insertError instanceof Error ? insertError.message : 'Unknown error'}. Please refresh and try again.`);
      }
    }
    throw new Error(`Failed to save availability: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`);
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
  const slotsToInsert: AvailabilityInsertRow[] = [];

  Object.entries(weekData).forEach(([dayIndex, slots]) => {
    slots.forEach(slot => {
      slotsToInsert.push({
        user_id: user.id,
        day_of_week: parseInt(dayIndex),
        start_time: formatTimeForDB(slot.startTime),
        end_time: formatTimeForDB(slot.endTime),
        recurrence_type: slot.recurrenceType ?? 'weekly',
        starts_on: getCurrentWeekDateForDay(parseInt(dayIndex)),
        timezone: DEFAULT_TIMEZONE,
        is_active: true,
      });
    });
  });

  if (slotsToInsert.length === 0) {
    return; // No slots to insert
  }

  try {
    await insertAvailabilityRows(slotsToInsert);
  } catch (insertError) {
    // Rollback: Re-insert original slots if insert failed
    if (existingSlots && existingSlots.length > 0) {
      try {
        await insertAvailabilityRows(existingSlots.map(slot => ({
          id: slot.id,
          user_id: slot.user_id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          recurrence_type: slot.recurrence_type,
          starts_on: slot.starts_on,
          timezone: slot.timezone,
          is_active: slot.is_active,
        })));
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        throw new Error(`Failed to save availability and rollback failed: ${insertError instanceof Error ? insertError.message : 'Unknown error'}. Please refresh and try again.`);
      }
    }
    throw new Error(`Failed to save availability: ${insertError instanceof Error ? insertError.message : 'Unknown error'}`);
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
