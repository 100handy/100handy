insert into public.site_settings (setting_group, setting_key, value_json)
values
  (
    'seo',
    'seo.defaults',
    '{
      "defaultMetaDescription": "Trusted local help for furniture assembly, mounting, cleaning, repairs, moving, and more.",
      "defaultOgImageUrl": "/images/hero/heroimage2.jpeg",
      "canonicalBaseUrl": "https://www.100handy.com",
      "robotsIndex": true,
      "robotsFollow": true
    }'::jsonb
  ),
  (
    'seo',
    'seo.organization',
    '{
      "name": "100 Handy",
      "url": "https://www.100handy.com",
      "logo": "/logos/100handy-green.png",
      "sameAs": [
        "https://www.instagram.com/100_handy/",
        "https://www.facebook.com/100handy/",
        "https://www.youtube.com/@100_handy",
        "https://linkedin.com/company/100handy"
      ]
    }'::jsonb
  )
on conflict (setting_key) do update
set value_json = excluded.value_json;
