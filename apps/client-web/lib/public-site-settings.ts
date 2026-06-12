'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export function usePublicSiteSetting<T extends Record<string, unknown>>(settingKey: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    void supabase
      .from('site_settings')
      .select('value_json')
      .eq('setting_key', settingKey)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted || error || !data?.value_json) {
          if (error) {
            console.error(`[site-settings] Failed to load ${settingKey}:`, error);
          }
          return;
        }

        setValue({
          ...fallback,
          ...(data.value_json as T),
        });
      });

    return () => {
      isMounted = false;
    };
  }, [fallback, settingKey]);

  return value;
}
