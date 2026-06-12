import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-client";

export function useClientPageContent(pageKey: string) {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_content")
          .select("section_key, field_key, value")
          .eq("page_key", pageKey);

        if (error) throw error;
        if (cancelled) return;

        const nextContent: Record<string, string> = {};
        for (const row of data ?? []) {
          nextContent[`${row.section_key}.${row.field_key}`] = row.value;
        }
        setContent(nextContent);
      } catch (error) {
        console.error(`[CMS] Failed to fetch client page content for "${pageKey}":`, error);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  return useMemo(
    () => (key: string, fallback: string) => content[key] || fallback,
    [content]
  );
}
