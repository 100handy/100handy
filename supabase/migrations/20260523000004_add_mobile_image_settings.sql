insert into public.site_settings (setting_group, setting_key, value_json)
values
  (
    'app_images',
    'app.images.brand',
    '{
      "greenLogo": "/logos/100handy-green.png",
      "creamLogo": "/logos/100handy-cream.png"
    }'::jsonb
  ),
  (
    'app_images',
    'app.images.welcome',
    '{
      "background": "/images/welcome-background.png",
      "logo": "/logos/100handy-green.png"
    }'::jsonb
  ),
  (
    'app_images',
    'app.images.onboarding',
    '{
      "avatarLukas": "/images/avatar-lukas.png",
      "avatarJana": "/images/avatar-jana.png"
    }'::jsonb
  ),
  (
    'app_images',
    'app.images.categories',
    '{
      "items": []
    }'::jsonb
  )
on conflict (setting_key) do update
set value_json = excluded.value_json;
