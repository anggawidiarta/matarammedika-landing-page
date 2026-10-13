# Spec: CMS POC — Layanan & Fasilitas

## Decisions locked
- **Landing refresh:** Client island (1B) — React fetch; **same-origin Astro GET APIs** (not browser Supabase anon key), matching survey security pattern
- **Visual field:** Lucide descriptors in DB (2A) — `icon_kind`, `icon_name`, optional `icon_tone`
- **Content types in POC:** Layanan + Fasilitas only
- **DB project:** Klinik Mataram Medika (`kdvgzvgupxbemeioiduf`)
- **Workflow POC:** simple `is_published` boolean (no draft/approval/version/omnichannel from PRD)
- **Operational data:** No existing marketing layanan/fasilitas tables; `Poli` is visit ops — do **not** couple. New CMS tables are the POC source of truth for marketing copy

## Capability map

| Module id | Responsibility | Depends on |
|---|---|---|
| cms-schema | Table `cms_feature_items` + RLS + seed from current hardcoded data | — |
| cms-admin-crud | Sidebar menu CMS + list/create/edit/delete/publish for Layanan & Fasilitas | cms-schema |
| cms-public-api | Astro `GET` endpoints returning only published rows | cms-schema |
| cms-landing-islands | Layanan/Fasilitas (and Home preview) fetch API → render existing cards | cms-public-api |

Build order: `cms-schema` → `cms-admin-crud` + `cms-public-api` → `cms-landing-islands`

## Objective
Staf/admin dapat CRUD item Layanan & Fasilitas di matarammedika-admin; item yang `is_published = true` muncul di landing matarammedika-landing-page tanpa ubah kode Astro data hardcoded. Sukses = vertical slice end-to-end, bukan CMS penuh PRD.

## Tech stack
- Admin: React + Vite + `supabaseClient` (`src/utils/supabase.ts`)
- Landing: Astro + React islands + Node adapter (existing survey path)
- Supabase Postgres + RLS (`authenticated` for admin write/read; public via service-role API only)

## Commands
```
# Admin
npm run dev
npm run build
npm run lint

# Landing
npm run dev
npm run build
```

## Project structure (target)
```
# landing-page
SPEC-cms-layanan-fasilitas-poc.md
supabase/migrations/<ts>_create_cms_feature_items.sql
src/pages/api/public/layanan.ts
src/pages/api/public/fasilitas.ts
src/lib/cms/types.ts
src/lib/cms/mapFeatureItem.ts
src/components/layanan/LayananPage.tsx
src/components/fasilitas/FasilitasPage.tsx
src/components/home/HomePage.tsx

# admin
src/layouts/Sidebar.tsx
src/main.tsx
src/pages/cms/CmsLayout.tsx
src/pages/cms/layanan/CmsLayananPage.tsx
src/pages/cms/fasilitas/CmsFasilitasPage.tsx
src/pages/cms/shared/...
```

## Module: cms-schema

**Table** `public.cms_feature_items`:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `created_at` / `updated_at` | `timestamptz` | `now()`; trigger/update on write |
| `content_type` | `text` | check: `layanan` \| `fasilitas` |
| `section` | `text` | layanan: `umum_gigi` \| `spesialis`; fasilitas: `umum` \| `lainnya` |
| `title` | `text` not null | trim, max 120 |
| `body` | `text` not null | trim, max 1000 |
| `icon_kind` | `text` not null | `lucide` \| `lucideCircle` |
| `icon_name` | `text` not null | must be key in landing `klinikLucideIcons` |
| `icon_tone` | `text` null | required when `lucideCircle` |
| `sort_order` | `int` not null | default 0; ascending display |
| `is_published` | `boolean` not null | default `false` |
| `is_deleted` | `boolean` not null | default `false` (soft delete) |

Indexes: `(content_type, is_published, is_deleted, section, sort_order)`.

**RLS:** enabled
- `authenticated`: SELECT/INSERT/UPDATE (soft-delete via UPDATE)
- `anon`: **no** direct table access
- Public read only through Astro API using `SUPABASE_SERVICE_ROLE_KEY` filtering `is_published = true AND is_deleted = false`

**Seed:** current arrays from `layananData.ts` / `fasilitasData.ts` as published rows.

## Module: cms-admin-crud
- Sidebar CMS → `/cms/layanan`, `/cms/fasilitas`
- List + modal form; create/edit/soft-delete/toggle publish
- Icon picker limited to known Lucide allowlist

## Module: cms-public-api
- `GET /api/public/layanan` and `GET /api/public/fasilitas`
- Published-only payload with nested `icon` object

## Module: cms-landing-islands
- Client islands fetch public APIs; fallback to hardcoded data on failure/empty
- Home preview uses same APIs

## Boundaries
- **Always:** published-only on public API; soft delete; icon allowlist; controlled migration
- **Ask first:** Storage/media; RBAC beyond authenticated; destructive prod migration
- **Never:** service-role in browser; couple to `Poli`; approval/version/omnichannel in this POC

## Success criteria
- [ ] Menu CMS di admin membuka Layanan & Fasilitas
- [ ] CRUD + publish/unpublish + soft-delete terhadap `cms_feature_items`
- [ ] Public APIs hanya published, non-deleted
- [ ] `/layanan-klinik` dan `/fasilitas-klinik` dari API
- [ ] Home preview ikut sumber yang sama (atau fallback)
- [ ] Seed membuat landing tidak kosong
- [ ] Tidak ada secret Supabase di bundle client landing untuk fitur ini

## Out of scope (POC)
Approval, version history, media library, SEO/slug, dokter CMS, artikel, omnichannel, Edge Functions
