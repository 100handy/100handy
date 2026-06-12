import { createClient } from '@/lib/supabase-client';

export interface Address {
  id: string;
  user_id: string;
  street: string;
  apartment: string | null;
  postcode: string;
  city: string | null;
  country: string;
  is_primary: boolean;
  created_at: string;
}

export interface CreateAddressData {
  user_id: string;
  street: string;
  apartment?: string;
  postcode: string;
  city?: string;
  country?: string;
  is_primary?: boolean;
}

export interface UpdateAddressData {
  street?: string;
  apartment?: string;
  postcode?: string;
  city?: string;
  country?: string;
  is_primary?: boolean;
}

/**
 * Create a new address
 */
export async function createAddress(addressData: CreateAddressData): Promise<Address | null> {
  const supabase = createClient();

  // If this is set as primary, unset other primary addresses first
  if (addressData.is_primary) {
    await supabase
      .from('addresses')
      .update({ is_primary: false })
      .eq('user_id', addressData.user_id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: addressData.user_id,
      street: addressData.street,
      apartment: addressData.apartment || null,
      postcode: addressData.postcode,
      city: addressData.city || null,
      country: addressData.country || 'UK',
      is_primary: addressData.is_primary || false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating address:', error);
    throw error;
  }

  return data;
}

/**
 * Get a single address by ID
 */
export async function getAddress(addressId: string): Promise<Address | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', addressId)
    .single();

  if (error) {
    console.error(`Error fetching address ${addressId}:`, error);
    return null;
  }

  return data;
}

/**
 * Get all addresses for a user
 */
export async function getUserAddresses(userId: string): Promise<Address[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching addresses for user ${userId}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Get user's primary address
 */
export async function getPrimaryAddress(userId: string): Promise<Address | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .single();

  if (error) {
    console.error(`Error fetching primary address for user ${userId}:`, error);
    return null;
  }

  return data;
}

/**
 * Update an address
 */
export async function updateAddress(
  addressId: string,
  updates: UpdateAddressData
): Promise<Address | null> {
  const supabase = createClient();

  // If setting as primary, get the user_id first to unset other primary addresses
  if (updates.is_primary) {
    const { data: addressData } = await supabase
      .from('addresses')
      .select('user_id')
      .eq('id', addressId)
      .single();

    if (addressData) {
      await supabase
        .from('addresses')
        .update({ is_primary: false })
        .eq('user_id', addressData.user_id);
    }
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating address ${addressId}:`, error);
    throw error;
  }

  return data;
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    return false;
  }

  return true;
}

/**
 * Set an address as primary
 */
export async function setPrimaryAddress(addressId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  // Unset all other primary addresses for this user
  await supabase
    .from('addresses')
    .update({ is_primary: false })
    .eq('user_id', userId);

  // Set this address as primary
  const { error } = await supabase
    .from('addresses')
    .update({ is_primary: true })
    .eq('id', addressId);

  if (error) {
    console.error(`Error setting primary address ${addressId}:`, error);
    return false;
  }

  return true;
}

/**
 * Find or create address from Google Places data
 * Useful for task booking flow
 */
export async function findOrCreateAddress(
  userId: string,
  googlePlace: {
    formatted_address: string;
    address_components?: any[];
  },
  apartment?: string
): Promise<Address | null> {
  const supabase = createClient();

  // Extract postcode and city from address components
  let postcode = '';
  let city = '';
  let country = 'UK';

  if (googlePlace.address_components) {
    for (const component of googlePlace.address_components) {
      if (component.types.includes('postal_code')) {
        postcode = component.long_name;
      }
      if (component.types.includes('locality') || component.types.includes('postal_town')) {
        city = component.long_name;
      }
      if (component.types.includes('country')) {
        country = component.short_name;
      }
    }
  }

  // Check if address already exists for user
  const { data: existingAddresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('street', googlePlace.formatted_address)
    .eq('postcode', postcode);

  if (existingAddresses && existingAddresses.length > 0) {
    return existingAddresses[0];
  }

  // Create new address
  return createAddress({
    user_id: userId,
    street: googlePlace.formatted_address,
    apartment: apartment || undefined,
    postcode,
    city,
    country,
    is_primary: false,
  });
}
