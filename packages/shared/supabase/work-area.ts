// packages/shared/supabase/work-area.ts
import { supabase } from './supabaseClient.native';

// Types
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface WorkArea {
  id: string;
  user_id: string;
  coordinates: Coordinate[];
  created_at: string;
  updated_at: string;
}

export interface SaveWorkAreaInput {
  coordinates: Coordinate[];
}

const MIN_POLYGON_POINTS = 3;

/**
 * Get the current tasker's work area
 * @returns The tasker's work area with coordinates, or null if none is set
 * @throws {Error} If user is not authenticated or database query fails
 */
export async function getWorkArea(): Promise<WorkArea | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('professional_work_areas')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No work area exists yet - this is valid
      return null;
    }
    throw new Error(`Failed to fetch work area: ${error.message}`);
  }

  return data;
}

/**
 * Get work area for a specific tasker (for client search)
 * @param userId - The tasker's user ID
 * @returns The tasker's work area with coordinates, or null if none is set
 * @throws {Error} If database query fails
 */
export async function getWorkAreaByUserId(userId: string): Promise<WorkArea | null> {
  const { data, error } = await supabase
    .from('professional_work_areas')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No work area exists for this user
      return null;
    }
    throw new Error(`Failed to fetch work area: ${error.message}`);
  }

  return data;
}

/**
 * Save or update the current tasker's work area (upsert)
 * @param input - The coordinates forming the work area polygon
 * @returns The saved work area
 * @throws {Error} If user is not authenticated, validation fails, or save fails
 */
export async function saveWorkArea(input: SaveWorkAreaInput): Promise<WorkArea> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Validate coordinates
  if (!input.coordinates || input.coordinates.length < MIN_POLYGON_POINTS) {
    throw new Error(`A polygon requires at least ${MIN_POLYGON_POINTS} points`);
  }

  // Validate each coordinate value
  input.coordinates.forEach((coord, index) => {
    if (
      coord.latitude === undefined ||
      coord.latitude === null ||
      !isFinite(coord.latitude)
    ) {
      throw new Error(`Invalid latitude at point ${index}: value is not a valid number`);
    }
    if (coord.latitude < -90 || coord.latitude > 90) {
      throw new Error(`Invalid latitude at point ${index}: ${coord.latitude}. Must be between -90 and 90`);
    }
    if (
      coord.longitude === undefined ||
      coord.longitude === null ||
      !isFinite(coord.longitude)
    ) {
      throw new Error(`Invalid longitude at point ${index}: value is not a valid number`);
    }
    if (coord.longitude < -180 || coord.longitude > 180) {
      throw new Error(`Invalid longitude at point ${index}: ${coord.longitude}. Must be between -180 and 180`);
    }
  });

  // Use upsert to handle both insert and update
  // Note: updated_at is handled by database trigger
  const { data, error } = await supabase
    .from('professional_work_areas')
    .upsert(
      {
        user_id: user.id,
        coordinates: input.coordinates,
      },
      {
        onConflict: 'user_id',
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save work area: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from work area save operation');
  }

  return data;
}

/**
 * Delete the current tasker's work area
 * @throws {Error} If user is not authenticated or delete fails
 */
export async function deleteWorkArea(): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('professional_work_areas')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete work area: ${error.message}`);
  }
}

/**
 * Check if a location is within a tasker's work area
 * Basic ray-casting algorithm for point-in-polygon check
 * @param location - The location to check
 * @param workArea - The work area polygon
 * @returns True if location is inside the polygon
 * @throws {Error} If polygon has insufficient points or invalid coordinates
 */
export function isLocationInWorkArea(
  location: Coordinate,
  workArea: WorkArea
): boolean {
  const polygon = workArea.coordinates;

  // Validate polygon
  if (polygon.length < MIN_POLYGON_POINTS) {
    throw new Error(`Invalid polygon: requires at least ${MIN_POLYGON_POINTS} points`);
  }

  // Validate all coordinates exist
  for (const coord of polygon) {
    if (coord.latitude === undefined || coord.longitude === undefined) {
      throw new Error('Invalid coordinate in polygon');
    }
  }

  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i]!.latitude;
    const yi = polygon[i]!.longitude;
    const xj = polygon[j]!.latitude;
    const yj = polygon[j]!.longitude;

    const intersect = ((yi > location.longitude) !== (yj > location.longitude))
      && (location.latitude < (xj - xi) * (location.longitude - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}
