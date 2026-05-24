create table if not exists public.help_articles (
  id uuid primary key default gen_random_uuid(),
  article_key text not null unique,
  slug text not null unique,
  title text not null,
  breadcrumb text not null,
  summary text,
  sidebar_links_json jsonb not null default '[]'::jsonb,
  body_html text not null default '',
  related_links_json jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_help_articles_status on public.help_articles(status);
create index if not exists idx_help_articles_slug on public.help_articles(slug);

alter table public.help_articles enable row level security;

drop policy if exists "Public can read published help articles" on public.help_articles;
create policy "Public can read published help articles"
on public.help_articles
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can manage help articles" on public.help_articles;
create policy "Admins can manage help articles"
on public.help_articles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.help_articles (
  article_key,
  slug,
  title,
  breadcrumb,
  summary,
  sidebar_links_json,
  body_html,
  related_links_json,
  status
)
values (
  'trust-safety',
  'trust-safety',
  'Overview of Trust and Safety',
  '100Handy Support / policy center / trust and safety / policy basics',
  '100Handy is committed to creating fantastic and safe experiences.',
  '[
    {"name":"Overview of trust and safety","href":"/help/trust-safety"},
    {"name":"What kind of insurance does 100Handy offer?","href":"/help/trust-safety#insurance"},
    {"name":"Limitations of insurance","href":"/help/trust-safety#limitations"},
    {"name":"Safety guidelines","href":"/help/trust-safety#safety"}
  ]'::jsonb,
  '<p>100Handy is committed to creating fantastic and safe experiences.</p>
  <section class="space-y-3">
    <h3 class="text-[16px] font-bold">Security of Personal Information</h3>
    <p>We take the security of all user information extremely seriously, and any sensitive information provided is kept secure and encrypted as a best practice. All financial information is handled carefully in accordance with our Privacy Policy.</p>
  </section>
  <section class="space-y-3">
    <h3 class="text-[16px] font-bold">Background Checks</h3>
    <p>All 100Handy professionals undergo an extensive screening process before they can join our community. This includes a comprehensive identity and criminal background check, which reports information from national, local, and sex offender databases.</p>
  </section>
  <section class="space-y-3">
    <h3 class="text-[16px] font-bold">100Handy Happiness Pledge</h3>
    <p>For every booking and every task, we offer the 100Handy Happiness Pledge. Please note that the Happiness Pledge is secondary to any insurance policies you already have in place and will apply for qualifying property damage or bodily injury claims within 30 days of the task giving rise to the claim.</p>
  </section>
  <section class="space-y-3">
    <h3 class="text-[16px] font-bold">Dispute Resolution Process</h3>
    <p>To report a tasker, any damages, injuries, or invoice disputes, our Customer Support team is available via live chat, phone, or email. If you have any relevant documentation, such as pictures or receipts, we ask that you please submit them as they will be required to complete your claim.</p>
  </section>'::text,
  '[
    {"label":"What Kind of Insurance Does 100Handy Offer?","href":"/help/trust-safety#insurance"},
    {"label":"What is the 100Handy Trust & Support Fee?","href":"/help/trust-safety#support-fee"},
    {"label":"100Handy Global Terms of Service","href":"/terms"},
    {"label":"The 100Handy Happiness Pledge","href":"/help/trust-safety#happiness-pledge"},
    {"label":"100Handy Global Privacy Policy","href":"/terms"}
  ]'::jsonb,
  'published'
)
on conflict (article_key) do update
set
  slug = excluded.slug,
  title = excluded.title,
  breadcrumb = excluded.breadcrumb,
  summary = excluded.summary,
  sidebar_links_json = excluded.sidebar_links_json,
  body_html = excluded.body_html,
  related_links_json = excluded.related_links_json,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
