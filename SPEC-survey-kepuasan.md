# Spec: Survey Kepuasan → Supabase (server-only)

## Decisions locked
- **API surface:** Astro server endpoint (choice B), not Edge Function
- **Adapter default:** `@astrojs/node` (standalone) so secrets stay on the Node process; pages that can stay static continue to prerender where possible (`prerender = true` on marketing pages; API `prerender = false`)
- **Rate limit:** 5 submissions / IP / rolling 1 hour
- **DB project:** Klinik Mataram Medika (`kdvgzvgupxbemeioiduf`)
- **Client secrets:** none — browser only calls same-origin `/api/survey-kepuasan`; no Supabase URL/key in client bundle

## Capability map (approved)

| Module id | Responsibility | Depends on |
|---|---|---|
| survey-schema | Table + RLS + checks | — |
| survey-submit-api | Astro POST handler, validation, service-role insert | survey-schema |
| survey-rate-limit | Count recent rows by IP hash; 429 when ≥ 5/hour | survey-submit-api |
| survey-client-wiring | Replace mock timeout in form with `fetch` + error mapping | survey-submit-api |

Build order: `survey-schema` → `survey-submit-api` + `survey-rate-limit` → `survey-client-wiring`

## Objective
Persist setiap pengiriman Survey Kepuasan Pelanggan ke Supabase secara aman: validasi + insert hanya di server, tabel terkunci RLS (anon tidak bisa baca/tulis), abuse dicegah rate limit. Sukses = submit nyata menggantikan mock `setTimeout` di `SurveyKepuasanPelanggan.tsx`.

## Tech stack
- Astro 7 + React island (existing)
- `@astrojs/node` adapter
- `@supabase/supabase-js` server-only client
- Postgres on existing Supabase project
- IP hashing in Node with SHA-256 + server pepper

## Commands
```
Dev:   npm run dev
Build: npm run build
Preview (Node): node ./dist/server/entry.mjs
```

## Project structure
```
SPEC-survey-kepuasan.md
supabase/migrations/20261012044742_create_survey_kepuasan_pelanggan.sql
src/pages/api/survey-kepuasan.ts
src/lib/supabase/server.ts
src/lib/survey/schema.ts
src/lib/survey/rateLimit.ts
src/components/klinik/pages/SurveyKepuasanPelanggan.tsx
.env → SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SURVEY_IP_HASH_PEPPER
```

## Module: survey-schema

**Table** `public.survey_kepuasan_pelanggan`:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `created_at` | `timestamptz` | `now()` |
| `nama` | `text` null | optional, trim, max 120 |
| `tanggal_kunjungan` | `date` null | optional |
| `layanan` | `text` null | check: `Klinik` \| `Apotek` \| `Klinik & Apotek` |
| `rating_pendaftaran` … `rating_keseluruhan` | `smallint` not null | each 1–5 |
| `nps` | `smallint` not null | 0–10 |
| `saran` | `text` null | max 500 chars |
| `consent` | `boolean` not null | check `consent = true` |
| `client_ip_hash` | `text` not null | SHA-256(pepper + IP); never store raw IP |
| `user_agent` | `text` null | truncated (~300) |

Indexes: `(client_ip_hash, created_at desc)` for rate-limit queries.

**RLS:** enabled; no policies for anon/authenticated. Inserts only via service role from Astro server.

## Module: survey-submit-api
- Route: `POST /api/survey-kepuasan`
- Validate body server-side; service role only via non-`VITE_` env
- Responses: `201 { ok: true, id }` or `{ ok: false, error: "validation"|"rate_limited"|"server" }`

## Module: survey-rate-limit
- Hash IP with pepper; count rows in last hour; ≥ 5 → 429

## Module: survey-client-wiring
- Form `fetch` to same-origin API; map errors; no Supabase client in islands

## Env / security boundaries
- Always: server-only service role; RLS on; validate server-side
- Never: service role in client; commit `.env`; store raw IP; disable RLS

## Success criteria
1. Migration applied with RLS, no anon policies
2. POST inserts via service role only
3. 6th submit from same IP within 1h → 429
4. Form success/error without mock timeout
5. No service-role material in client bundle
