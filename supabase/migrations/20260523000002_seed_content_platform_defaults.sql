-- Seed default navigation, footer settings, and blog posts for the content platform

insert into public.navigation_items (
  id, nav_key, parent_id, label, href, item_type, location, audience, sort_order, visible
)
values
  ('nav_header_services', 'header-services', null, 'Services', '/services', 'internal', 'header', 'public', 10, true),
  ('nav_header_signin', 'header-signin', null, 'Sign up / Log in', '/sign-in', 'internal', 'header', 'public', 20, true),

  ('nav_footer_discover', 'footer-discover', null, 'Discover', '#', 'internal', 'footer', 'public', 10, true),
  ('nav_footer_company', 'footer-company', null, 'Company', '#', 'internal', 'footer', 'public', 20, true),
  ('nav_footer_services', 'footer-services', null, 'Services', '#', 'internal', 'footer', 'public', 30, true),
  ('nav_footer_legal', 'footer-legal', null, 'Legal', '#', 'internal', 'footer', 'public', 40, true),

  ('nav_footer_discover_1', 'footer-discover-1', 'nav_footer_discover', 'Become a 100 Handy Pro', '/become-100-handy-pro', 'internal', 'footer', 'public', 10, true),
  ('nav_footer_discover_2', 'footer-discover-2', 'nav_footer_discover', 'All Services', '/services', 'internal', 'footer', 'public', 20, true),
  ('nav_footer_discover_3', 'footer-discover-3', 'nav_footer_discover', 'Services by City', '/services-by-city', 'internal', 'footer', 'public', 30, true),
  ('nav_footer_discover_4', 'footer-discover-4', 'nav_footer_discover', '100 Handy Stars', '/100-handy-star', 'internal', 'footer', 'public', 40, true),

  ('nav_footer_company_1', 'footer-company-1', 'nav_footer_company', 'About Us', '/about-us', 'internal', 'footer', 'public', 10, true),
  ('nav_footer_company_2', 'footer-company-2', 'nav_footer_company', 'Careers', '/careers', 'internal', 'footer', 'public', 20, true),
  ('nav_footer_company_3', 'footer-company-3', 'nav_footer_company', 'Press', '/press', 'internal', 'footer', 'public', 30, true),
  ('nav_footer_company_4', 'footer-company-4', 'nav_footer_company', 'Blog', '/blog', 'internal', 'footer', 'public', 40, true),
  ('nav_footer_company_5', 'footer-company-5', 'nav_footer_company', 'Partner', '/partner', 'internal', 'footer', 'public', 50, true),
  ('nav_footer_company_6', 'footer-company-6', 'nav_footer_company', 'HandyCares', '/handycare', 'internal', 'footer', 'public', 60, true),
  ('nav_footer_company_7', 'footer-company-7', 'nav_footer_company', 'Help', '/help', 'internal', 'footer', 'public', 70, true),

  ('nav_footer_services_1', 'footer-services-1', 'nav_footer_services', 'Furniture Assembly', '/services/furniture-assembly/furniture-assembly', 'internal', 'footer', 'public', 10, true),
  ('nav_footer_services_2', 'footer-services-2', 'nav_footer_services', 'TV & Wall Mounting', '/services/tv-wall-mounting/tv-mounting', 'internal', 'footer', 'public', 20, true),
  ('nav_footer_services_3', 'footer-services-3', 'nav_footer_services', 'Home Repairs', '/services/home-repairs/minor-home-repairs', 'internal', 'footer', 'public', 30, true),
  ('nav_footer_services_4', 'footer-services-4', 'nav_footer_services', 'Plumbing', '/services/plumbing/leak-fixing', 'internal', 'footer', 'public', 40, true),
  ('nav_footer_services_5', 'footer-services-5', 'nav_footer_services', 'Electrical', '/services/electrical/light-installation', 'internal', 'footer', 'public', 50, true),
  ('nav_footer_services_6', 'footer-services-6', 'nav_footer_services', 'Cleaning', '/services/cleaning/sparkle-clean', 'internal', 'footer', 'public', 60, true),
  ('nav_footer_services_7', 'footer-services-7', 'nav_footer_services', 'Packing & Moving', '/services/packing-moving/moving-help', 'internal', 'footer', 'public', 70, true),
  ('nav_footer_services_8', 'footer-services-8', 'nav_footer_services', 'Outdoor Help', '/services/outdoor/great-outdoors', 'internal', 'footer', 'public', 80, true),

  ('nav_footer_legal_1', 'footer-legal-1', 'nav_footer_legal', 'Terms and Conditions', '/terms#terms-of-service', 'internal', 'footer', 'public', 10, true),
  ('nav_footer_legal_2', 'footer-legal-2', 'nav_footer_legal', 'Privacy Policy', '/terms#privacy-policy', 'internal', 'footer', 'public', 20, true),
  ('nav_footer_legal_3', 'footer-legal-3', 'nav_footer_legal', 'Cookie Settings', '/cookie-settings', 'internal', 'footer', 'public', 30, true),
  ('nav_footer_legal_4', 'footer-legal-4', 'nav_footer_legal', 'Legal Requirements', '/terms#platform-rules', 'internal', 'footer', 'public', 40, true)
on conflict (nav_key, location, audience) do update
set
  parent_id = excluded.parent_id,
  label = excluded.label,
  href = excluded.href,
  item_type = excluded.item_type,
  sort_order = excluded.sort_order,
  visible = excluded.visible;

insert into public.site_settings (setting_group, setting_key, value_json)
values
  ('header', 'header.pro_cta', '{"href":"/become-100-handy-pro","label":"Become a Pro"}'::jsonb),
  ('footer', 'footer.follow_text', '{"text":"Follow us we''re friendly"}'::jsonb),
  ('footer', 'footer.social_links', '{
    "items": [
      {"label":"TikTok","href":"https://www.tiktok.com/@100_handy"},
      {"label":"Instagram","href":"https://www.instagram.com/100_handy/"},
      {"label":"Facebook","href":"https://www.facebook.com/100handy/"},
      {"label":"YouTube","href":"https://www.youtube.com/@100_handy"},
      {"label":"LinkedIn","href":"https://linkedin.com/company/100handy"}
    ]
  }'::jsonb),
  ('footer', 'footer.app_downloads', '{
    "items": [
      {"label":"iOS App Store","href":"#"},
      {"label":"Google Play","href":"#"}
    ]
  }'::jsonb)
on conflict (setting_key) do update
set value_json = excluded.value_json;

insert into public.blog_posts (
  slug, title, excerpt, body, cover_image_url, category, tags, author_name, status, published_at
)
values
  (
    'tips-furniture-assembly',
    '10 Tips for a Stress-Free Furniture Assembly',
    'From organising your workspace to choosing the right tools, here are our top tips for making furniture assembly a breeze — whether you are tackling a flat-pack wardrobe or a full home office setup.',
    '{"intro":"Flat-pack furniture has a reputation for testing patience. But with a bit of preparation and the right approach, assembly can be quick and satisfying.","readTime":"6 min read","sections":[],"relatedSlugs":["ikea-assembly-tips","choose-right-handyman","tv-mounting-guide"]}',
    '/images/services/assembly/furniture-assembly.jpeg',
    'Assembly',
    array['assembly','furniture'],
    '100 Handy Team',
    'published',
    '2026-04-10T09:00:00Z'
  ),
  (
    'spring-cleaning-checklist',
    'Spring Cleaning Checklist: Room by Room',
    'Get your home sparkling with our comprehensive spring cleaning guide. We cover every room so nothing gets missed.',
    '{"intro":"Spring cleaning is more than a deep dust. It is a reset — a chance to clear the clutter, freshen every corner, and start the warmer months feeling organised.","readTime":"7 min read","sections":[],"relatedSlugs":["end-of-tenancy-cleaning","choose-right-handyman","signs-you-need-a-plumber"]}',
    '/images/services/cleaning/deep-clean.jpeg',
    'Cleaning',
    array['cleaning'],
    '100 Handy Team',
    'published',
    '2026-03-25T09:00:00Z'
  ),
  (
    'choose-right-handyman',
    'How to Choose the Right Handyman for Your Project',
    'Not all jobs are the same. Learn what to look for when hiring a professional for your next home improvement project.',
    '{"intro":"Hiring someone to work in your home requires trust. Whether you need a shelf put up or a bathroom renovated, choosing the right professional makes the difference between a job well done and a costly redo.","readTime":"5 min read","sections":[],"relatedSlugs":["tips-furniture-assembly","tv-mounting-guide","signs-you-need-a-plumber"]}',
    '/images/services/home-repairs/minor-home-repairs.jpeg',
    'Home Repairs',
    array['repairs','handyman'],
    '100 Handy Team',
    'published',
    '2026-03-12T09:00:00Z'
  ),
  (
    'tv-mounting-guide',
    'The Safe Way to Mount a TV on Any Wall Type',
    'Plasterboard, brick, or stud walls — each requires a different approach. Here is everything you need to know before you drill.',
    '{"intro":"A wall-mounted TV transforms a living room — but get it wrong and you are looking at a cracked screen, a damaged wall, or worse.","readTime":"6 min read","sections":[],"relatedSlugs":["tips-furniture-assembly","choose-right-handyman","ikea-assembly-tips"]}',
    '/images/services/mounting/tv-mounting.jpeg',
    'Mounting',
    array['mounting','tv'],
    '100 Handy Team',
    'published',
    '2026-02-28T09:00:00Z'
  ),
  (
    'signs-you-need-a-plumber',
    '5 Signs You Need a Plumber (Don''t Ignore These)',
    'A dripping tap might seem minor, but it could be the first sign of something bigger. Spot the warning signs before a small issue becomes a costly one.',
    '{"intro":"Plumbing problems rarely fix themselves. A small leak ignored becomes a mould problem. A slow drain ignored becomes a blockage.","readTime":"5 min read","sections":[],"relatedSlugs":["choose-right-handyman","spring-cleaning-checklist","end-of-tenancy-cleaning"]}',
    '/images/services/plumbing/leak-fixing.jpeg',
    'Plumbing',
    array['plumbing'],
    '100 Handy Team',
    'published',
    '2026-02-14T09:00:00Z'
  ),
  (
    'garden-spring-prep',
    'How to Prepare Your Garden for Spring',
    'Winter takes a toll on outdoor spaces. Follow our expert checklist to get your garden thriving again as soon as the temperature rises.',
    '{"intro":"After months of cold weather, your garden needs attention before it can thrive again.","readTime":"6 min read","sections":[],"relatedSlugs":["spring-cleaning-checklist","choose-right-handyman","moving-house-guide"]}',
    '/images/services/outdoor/gardening.jpeg',
    'Gardening',
    array['garden','outdoor'],
    '100 Handy Team',
    'published',
    '2026-01-30T09:00:00Z'
  ),
  (
    'moving-house-guide',
    'Moving House? Here''s How to Make It Less Stressful',
    'From packing strategies to booking the right help, a little preparation goes a long way. Our guide covers everything from first box to final unpack.',
    '{"intro":"Moving house consistently ranks as one of life''s most stressful events. But most of the stress comes from poor preparation.","readTime":"7 min read","sections":[],"relatedSlugs":["end-of-tenancy-cleaning","tips-furniture-assembly","choose-right-handyman"]}',
    '/images/services/moving/packing-and-moving.jpeg',
    'Moving',
    array['moving'],
    '100 Handy Team',
    'published',
    '2026-01-15T09:00:00Z'
  ),
  (
    'end-of-tenancy-cleaning',
    'End-of-Tenancy Cleaning: A Complete Guide for Renters',
    'Losing your deposit over cleaning is more common than you think. Here is how to leave your rental spotless and get every penny back.',
    '{"intro":"Getting your full deposit back hinges on leaving your rental in the same condition you found it.","readTime":"6 min read","sections":[],"relatedSlugs":["spring-cleaning-checklist","moving-house-guide","signs-you-need-a-plumber"]}',
    '/images/services/cleaning/end-of-tenancy.jpeg',
    'Cleaning',
    array['cleaning','tenancy'],
    '100 Handy Team',
    'published',
    '2025-12-20T09:00:00Z'
  ),
  (
    'ikea-assembly-tips',
    'IKEA Assembly Tips: The Mistakes Everyone Makes',
    'Missing a step in the instructions, overtightening screws, losing a dowel — sound familiar? We round up the most common IKEA assembly mistakes and how to avoid them.',
    '{"intro":"IKEA furniture is designed to be assembled by anyone. In practice, millions of people make the same avoidable mistakes every year.","readTime":"5 min read","sections":[],"relatedSlugs":["tips-furniture-assembly","tv-mounting-guide","choose-right-handyman"]}',
    '/images/services/assembly/ikea-assembly.jpeg',
    'Assembly',
    array['assembly','ikea'],
    '100 Handy Team',
    'published',
    '2025-12-05T09:00:00Z'
  )
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  cover_image_url = excluded.cover_image_url,
  category = excluded.category,
  tags = excluded.tags,
  author_name = excluded.author_name,
  status = excluded.status,
  published_at = excluded.published_at;
