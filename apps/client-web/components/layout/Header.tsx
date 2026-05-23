"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import HeaderClient from "./HeaderClient";

interface HeaderProps {
  currentPage?: "get-e10" | "book-task" | "my-tasks" | "account";
}

const fallbackHeaderSettings = {
  signedOutLinks: [
    { href: "/services", label: "Services" },
    { href: "/sign-in", label: "Sign up / Log in" },
  ],
  proCta: { href: "/become-100-handy-pro", label: "Become a Pro" },
}

export default function Header({ currentPage }: HeaderProps) {
  const [settings, setSettings] = useState(fallbackHeaderSettings)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    Promise.all([
      supabase
        .from("navigation_items")
        .select("label,href")
        .eq("location", "header")
        .eq("audience", "public")
        .eq("visible", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("site_settings")
        .select("value_json")
        .eq("setting_key", "header.pro_cta")
        .maybeSingle(),
    ]).then(([navRes, ctaRes]) => {
      const next = { ...fallbackHeaderSettings }
      if (navRes.data && navRes.data.length > 0) {
        next.signedOutLinks = navRes.data.map((item) => ({ href: item.href, label: item.label }))
      }
      const value = ctaRes.data?.value_json as Record<string, unknown> | undefined
      if (typeof value?.href === "string" && typeof value?.label === "string") {
        next.proCta = { href: value.href, label: value.label }
      }
      setSettings(next)
    })
  }, [])

  return (
    <HeaderClient
      currentPage={currentPage}
      signedOutLinks={settings.signedOutLinks}
      proCta={settings.proCta}
    />
  )
}
