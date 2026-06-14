-- Automatic follow-up sequences for outreach.
-- Adds sequencing columns to outreach_follow_ups and an hourly dispatcher cron.

alter table public.outreach_follow_ups
  add column if not exists auto_send boolean not null default false,
  add column if not exists step integer not null default 0;

create index if not exists idx_outreach_follow_ups_auto_due
  on public.outreach_follow_ups(status, due_at)
  where auto_send;

-- Hourly dispatcher that calls the follow-up edge function (GUC-gated, like the
-- discovery dispatcher in migration 20260614000021). Re-run this block after
-- setting app.settings.functions_base_url / app.settings.outreach_cron_secret.
do $$
declare
  base_url text := current_setting('app.settings.functions_base_url', true);
  dispatch_secret text := current_setting('app.settings.outreach_cron_secret', true);
begin
  if base_url is null or dispatch_secret is null then
    raise notice 'outreach follow-up cron not scheduled: set app.settings.functions_base_url and app.settings.outreach_cron_secret, then re-run cron.schedule(...)';
    return;
  end if;

  if exists (select 1 from cron.job where jobname = 'outreach-follow-up-dispatch') then
    perform cron.unschedule('outreach-follow-up-dispatch');
  end if;

  perform cron.schedule(
    'outreach-follow-up-dispatch',
    '0 * * * *',
    format($cron$
      select net.http_post(
        url := %L,
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', %L),
        body := '{}'::jsonb
      );
    $cron$, base_url || '/functions/v1/outreach-follow-up-cron', dispatch_secret)
  );
end $$;
