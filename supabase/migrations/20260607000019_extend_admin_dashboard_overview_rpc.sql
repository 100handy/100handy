create or replace function public.get_admin_dashboard_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'::public.user_role
      and account_status = 'active'
  ) then
    raise exception 'Active admin access is required';
  end if;

  with month_buckets as (
    select
      generate_series(
        date_trunc('month', now()) - interval '5 months',
        date_trunc('month', now()),
        interval '1 month'
      ) as month_start
  ),
  metrics as (
    select jsonb_build_object(
      'totalCustomers', jsonb_build_object('label', 'Customers', 'value', (select count(*) from public.profiles where role = 'customer'::public.user_role), 'format', 'number'),
      'totalProviders', jsonb_build_object('label', 'Providers', 'value', (select count(*) from public.profiles where role = 'handy'::public.user_role), 'format', 'number'),
      'pendingProviderApprovals', jsonb_build_object('label', 'Pending Provider Approvals', 'value', (select count(*) from public.handy_profiles where verified = false), 'format', 'number'),
      'activeJobs', jsonb_build_object('label', 'Active Jobs', 'value', (select count(*) from public.bookings where status in ('pending', 'accepted', 'in_progress')), 'format', 'number'),
      'completedJobs', jsonb_build_object('label', 'Completed Jobs', 'value', (select count(*) from public.bookings where status = 'completed'), 'format', 'number'),
      'cancelledJobs', jsonb_build_object('label', 'Cancelled Jobs', 'value', (select count(*) from public.bookings where status = 'cancelled'), 'format', 'number'),
      'revenue', jsonb_build_object('label', 'Revenue', 'value', coalesce((select sum(amount_cents) from public.payments where status = 'paid'), 0) / 100.0, 'format', 'currency'),
      'refunds', jsonb_build_object('label', 'Refunds', 'value', coalesce((select sum(amount_cents) from public.payments where status = 'refunded'), 0) / 100.0, 'format', 'currency'),
      'openDisputes', jsonb_build_object('label', 'Open Disputes', 'value', (select count(*) from public.disputes where status in ('open', 'investigating')), 'format', 'number'),
      'openSupportTickets', jsonb_build_object('label', 'Open Support Tickets', 'value', (select count(*) from public.support_tickets where status in ('open', 'pending')), 'format', 'number'),
      'failedPayments', jsonb_build_object('label', 'Failed Payments', 'value', (select count(*) from public.payments where status = 'failed'), 'format', 'number'),
      'newCustomersThisMonth', jsonb_build_object('label', 'New Customers This Month', 'value', (select count(*) from public.profiles where role = 'customer'::public.user_role and created_at >= date_trunc('month', now())), 'format', 'number'),
      'newProvidersThisMonth', jsonb_build_object('label', 'New Providers This Month', 'value', (select count(*) from public.profiles where role = 'handy'::public.user_role and created_at >= date_trunc('month', now())), 'format', 'number'),
      'jobsThisWeek', jsonb_build_object('label', 'Jobs This Week', 'value', (select count(*) from public.bookings where created_at >= date_trunc('week', now())), 'format', 'number'),
      'jobsAwaitingAssignment', jsonb_build_object('label', 'Jobs Awaiting Assignment', 'value', (select count(*) from public.bookings where handy_id is null and status in ('pending', 'accepted')), 'format', 'number'),
      'payoutQueue', jsonb_build_object('label', 'Payout Queue', 'value', (select count(*) from public.bookings where payout_status = 'pending'), 'format', 'number'),
      'pausedAccounts', jsonb_build_object('label', 'Paused Accounts', 'value', (select count(*) from public.profiles where account_status = 'paused'), 'format', 'number'),
      'disabledCategories', jsonb_build_object('label', 'Disabled Categories', 'value', (select count(*) from public.categories where active = false), 'format', 'number'),
      'enabledServiceAreas', jsonb_build_object('label', 'Enabled Service Areas', 'value', (select count(*) from public.service_areas where enabled = true), 'format', 'number')
    ) as data
  ),
  trends as (
    select jsonb_agg(
      jsonb_build_object(
        'label', to_char(month_start, 'Mon'),
        'bookings', (select count(*) from public.bookings b where b.created_at >= month_start and b.created_at < month_start + interval '1 month'),
        'revenue', coalesce((select sum(p.amount_cents) from public.payments p where p.status = 'paid' and p.created_at >= month_start and p.created_at < month_start + interval '1 month'), 0) / 100.0,
        'providerGrowth', (select count(*) from public.profiles pr where pr.role = 'handy'::public.user_role and pr.created_at >= month_start and pr.created_at < month_start + interval '1 month'),
        'customerGrowth', (select count(*) from public.profiles pr where pr.role = 'customer'::public.user_role and pr.created_at >= month_start and pr.created_at < month_start + interval '1 month')
      )
      order by month_start
    ) as data
    from month_buckets
  ),
  recent_bookings as (
    select jsonb_agg(
      jsonb_build_object(
        'id', b.id,
        'customer_name', coalesce(nullif(trim(concat(cp.first_name, ' ', cp.last_name)), ''), 'Unknown customer'),
        'provider_name', case when hp.user_id is null then 'Unassigned' else coalesce(nullif(trim(concat(hp.first_name, ' ', hp.last_name)), ''), 'Unassigned') end,
        'task_title', b.task_title,
        'category_name', coalesce(c.name, 'Uncategorised'),
        'status', b.status,
        'scheduled_date', b.scheduled_date
      )
      order by b.created_at desc
    ) as data
    from (
      select *
      from public.bookings
      order by created_at desc
      limit 8
    ) b
    left join public.profiles cp on cp.user_id = b.customer_id
    left join public.profiles hp on hp.user_id = b.handy_id
    left join public.categories c on c.id = b.category_id
  )
  select jsonb_build_object(
    'metrics', metrics.data,
    'trends', coalesce(trends.data, '[]'::jsonb),
    'recentBookings', coalesce(recent_bookings.data, '[]'::jsonb)
  )
  into result
  from metrics, trends, recent_bookings;

  return result;
end;
$$;

grant execute on function public.get_admin_dashboard_overview() to authenticated;
