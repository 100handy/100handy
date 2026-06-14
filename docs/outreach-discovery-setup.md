# Outreach Discovery Engine — Setup

The discovery engine scrapes lead sources via [Apify](https://apify.com) and feeds results
into the existing AI outreach queue. This doc lists everything ops needs to turn it on.

## 1. Supabase function secrets

Set these (Dashboard → Project Settings → Edge Functions, or `supabase secrets set`):

| Secret | Used by | Purpose |
| --- | --- | --- |
| `APIFY_TOKEN` | trigger, webhook, cron | Apify API token (starts actor runs, reads datasets). |
| `APIFY_WEBHOOK_SECRET` | trigger, webhook | HMAC secret signing the completion webhook URL. Any long random string. |
| `OUTREACH_CRON_SECRET` | cron | Shared secret the pg_cron dispatcher sends as `x-cron-secret`. |
| `OPENAI_API_KEY` | classifier (existing) | Classifies/draft messages. Without it, a deterministic fallback is used. |
| `OUTREACH_AI_MODEL` | classifier (existing) | Optional; defaults to `gpt-4o-mini`. |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are provided automatically.

```bash
supabase secrets set APIFY_TOKEN=apify_xxx APIFY_WEBHOOK_SECRET=$(openssl rand -hex 32) OUTREACH_CRON_SECRET=$(openssl rand -hex 32)
```

## 2. Deploy the functions

```bash
supabase functions deploy outreach-discovery-trigger
supabase functions deploy outreach-discovery-webhook   # verify_jwt=false (config.toml)
supabase functions deploy outreach-discovery-cron      # verify_jwt=false (config.toml)
```

The webhook and cron functions are public (no Supabase JWT) but guarded by the HMAC
signature / `OUTREACH_CRON_SECRET` respectively.

## 3. Scheduling (pg_cron)

The migration `20260614000021_extend_outreach_discovery.sql` enables `pg_cron` + `pg_net`
and registers a dispatcher job **only if** these database settings (GUCs) are present:

```sql
alter database postgres set app.settings.functions_base_url = 'https://<project-ref>.supabase.co';
alter database postgres set app.settings.outreach_cron_secret = '<same as OUTREACH_CRON_SECRET>';
```

After setting them, re-run the `cron.schedule(...)` block from the migration (or re-apply the
migration). The job `outreach-discovery-dispatch` then runs every 15 minutes, calling
`outreach-discovery-cron`, which triggers any source whose `next_run_at` is due.

## 4. Using it

1. Admin → **Outreach → Sources → New source**, then **Apply preset…** to prefill one of:
   Reddit / Facebook Groups / Nextdoor (customers), or Google Maps / Checkatrade / Yell / LinkedIn (workers).
2. Confirm the Apify actor id, input JSON, and field mapping (lead field → scraped field path).
   Preset actor ids are best-known defaults — verify them against your Apify account.
3. **Run now** for an on-demand scrape, or set a cadence + enable scheduling.
4. Results land in **Outreach → Leads** as `pending` for human approval. The **Runs** tab
   shows scrape counts, dedupes, and leads created.

## 5. Sending (email channel)

Approved messages can be emailed to **worker leads that have a valid public business email**
(`public_contact_method = 'email'`). Customer leads and non-email channels stay manual
("Mark sent"). Sending reuses the existing SMTP secrets:

| Secret | Purpose |
| --- | --- |
| `SMTP_HOST` / `SMTP_PORT` | SMTP server (port 465 = TLS). |
| `SMTP_USER` / `SMTP_PASSWORD` | SMTP credentials; the From address is `100 Handy <SMTP_USER>`. |

```bash
supabase functions deploy send-outreach-message
```

Flow: **Outreach → Leads → (worker lead) → approve message → Send email**. The send is
manual per message (one click), records `delivery_status='sent'`, marks the lead
`contacted`, and auto-schedules a 3-day follow-up reminder. Every email includes the
100Handy identity and an opt-out line.

## Compliance

Discovery never auto-contacts anyone — every lead is created `pending` and requires human
approval before any message is sent. Apify operates the scrapers, but 100Handy is the data
controller; keep the approval gate on and respect each platform's terms. `max_items` caps
per-run cost/volume; dedup prevents re-processing or re-contacting the same item.
