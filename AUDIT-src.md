# Audit `src/`: efisiensi, efektivitas, best practice Astro, redundansi

## Konteks

Audit struktur kode `src/` (Astro 7 + React islands + Tailwind 4 + Supabase, `output: "server"`, adapter node) beserta saran perbaikan. Temuan diurutkan berdasarkan dampak. Tiap fase bisa dikerjakan dan di-merge terpisah.

## Temuan utama (urut dampak)

### P0 — Aset dokter ±53 MB (masalah performa terbesar)

- `src/assets/dokter/*.svg` adalah SVG berisi raster base64 tertanam: `bunga-nurmalita.svg` 23 MB, `dhesty-dadhilah.svg` 9 MB, `zainul-mujahid.svg` 7.8 MB, `musa-taufiq.svg` 5.8 MB, sisanya 0.4–1.2 MB.
- `/dokter-klinik` memuat ke-13 kartu sekaligus tanpa `loading="lazy"` (`src/components/dokter/DokterPage.tsx`). `HomeDoctorShowcase` preload kartu berikutnya tiap 3 detik, jadi beranda ikut mengunduh puluhan MB.
- SVG tidak bisa dioptimasi oleh `astro:assets`.

### P1 — Gambar tidak dioptimasi

- Semua gambar dipakai sebagai `<img src={assetUrl(import)}>` di React, tanpa resize/WebP/AVIF. `banner-family.png` 1.4 MB ditampilkan 576×329; logo asuransi 25–167 KB ditampilkan ±150×60.
- `assetUrl()` (`src/components/shared/data/assetUrl.ts`) hanya membungkus `.src`, dan `logos.ts`/`icons.ts`/`photos.ts` hanya memanggilnya: lapisan redundan.
- `bannerTexture` di `HomePage.tsx` tanpa `width`/`height`/`loading="lazy"`.

### P1 — JS yang tidak perlu dikirim (islands kebesaran)

- `KlinikHeader` `client:load` di **semua** halaman (`src/layouts/Layout.astro`), padahal menu mobile sudah `<details>` native; React hanya dipakai untuk menutup menu saat navigasi. Akibatnya halaman statis murni (profil, promo, dokter, layanan, fasilitas) tetap mengirim runtime React (±45 KB gz).
- Survey: `<SurveyKepuasanPage client:load />` menghidrasi seluruh halaman, termasuk judul, footer, dan shell. Cukup form-nya saja yang jadi island.

### P1 — Struktur layout tidak idiomatik Astro

- Footer (`SiteFooter`) dirender lewat `KlinikPageShell` di dalam tiap komponen halaman React. Seharusnya di `Layout.astro` (sekali, statis), sejajar dengan header.
- Komponen "halaman" (`ProfilPage`, `PromoPage`, `DokterPage`, `LayananPage`, `FasilitasPage`, `HomePage`) adalah React tanpa state yang dirender statis. Ini sah, tapi markup statis lebih idiomatik sebagai `.astro`. Saran bertahap, tidak wajib.

### P2 — SSR + data CMS

- `index`, `layanan-klinik`, `fasilitas-klinik` memakai `prerender = false`, sehingga query Supabase jalan di **setiap request** tanpa cache. Tambahkan `Astro.response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400")` (berlaku jika ada CDN/proxy) dan/atau memo in-process dengan TTL singkat di `loadPublishedFeatures`.
- Baca CMS publik memakai **service role key** (`getServiceSupabase`). Lebih aman pakai anon key + RLS `is_published = true` untuk read publik; service role cukup untuk insert survey.
- `/api/public/layanan` & `/api/public/fasilitas` tidak dipanggil dari kode di repo ini, tetapi **dipakai konsumen eksternal**, jadi tetap dipertahankan.

### P2 — Redundansi / dead code

- `src/components/shared/ui/index.ts` (barrel) dan `src/components/shared/data/assets.ts` (re-export) **tidak diimpor di mana pun**: hapus.
- `src/components/survey/constants.ts` me-re-export `LIKERT`/`NAMA_MAX`/`SARAN_MAX` dan alias `LAYANAN_OPTIONS = LAYANAN_VALUES`: impor langsung dari `@/lib/survey/constants`.
- `trustProxyEnabled()` di `src/lib/survey/rateLimit.ts` menduplikasi logika baca env (`process.env` vs `import.meta.env`) dari `src/lib/env.ts`. Gantikan keduanya dengan `astro:env` (lihat P3), atau minimal tambah `readServerEnv(name)` opsional di `env.ts`.
- Helper `json()` ada dua kali (`src/lib/cms/publicApi.ts`, `src/pages/api/survey-kepuasan.ts`): satukan di `src/lib/http.ts`.
- `public/favicon.svg` identik byte-per-byte dengan `public/logo.svg`: pakai satu.
- `LayananSelect` & `DatePicker` menduplikasi class trigger dan logika outside-click/Escape: ekstrak `triggerClass(invalid, open)` ke `survey/constants.ts` dan hook kecil `useDismiss(ref, open, onClose)`.

### P3 — Best practice Astro lainnya

- **SEO**: `Layout.astro` hanya punya `title` default yang tak pernah di-override; tidak ada `<meta name="description">`, canonical, atau Open Graph. Tambah prop `title`/`description` per halaman.
- **Env**: gunakan `astro:env` (`env.schema` di `astro.config.mjs`, `access: "secret", context: "server"`): validasi saat startup, typed, menggantikan `lib/env.ts` dan duplikasi di `rateLimit.ts`.
- **Font**: Google Fonts via `<link>` bersifat render-blocking dan pihak ketiga. Pakai Astro Fonts API (`fonts` di config + `<Font />`) agar self-hosted, ter-preload, dengan fallback metric-adjusted. Kurangi juga bobot Poppins (300–700 = 5 file) ke yang benar-benar dipakai.
- `<meta name="viewport">` belum memuat `initial-scale=1`.
- Preload `/logo.svg` & `/wordmark.svg` tidak perlu (sudah `fetchPriority="high"` di `<img>` above-the-fold).

## Rencana implementasi (bertahap)

### Fase 1 — Gambar (dampak terbesar)

1. Rasterisasi tiap kartu SVG dokter utuh (ellipse/gradient/mask ikut) ke PNG 2× (882×1036) dengan `sharp` (sudah terpasang sebagai dependensi Astro) lewat skrip sekali jalan → `src/assets/dokter/<nama>.png`; hapus SVG lama. `astro:assets` lalu menghasilkan WebP/AVIF sesuai ukuran tampil. `outline.svg` (4 KB) tetap.
2. Optimasi gambar via `astro:assets`: di frontmatter `.astro`, `getImage({ src, width, format: "webp" })` lalu kirim `src`/`srcset` ke komponen React sebagai props; atau pindahkan markup gambar ke `.astro` dan pakai `<Image>`/`<Picture>`.
3. `DokterPage`: `loading="lazy"` untuk kartu di bawah lipatan; showcase tetap preload 1 kartu berikutnya, tapi ukurannya kini kecil.
4. Hapus `assetUrl.ts`, `logos.ts`, `icons.ts`, `photos.ts` setelah migrasi.

### Fase 2 — Kurangi JS & rapikan layout

1. Konversi `KlinikHeader` → `KlinikHeader.astro` + `<script>` kecil: `document.addEventListener("astro:after-swap", () => menu.removeAttribute("open"))`. Pertahankan `transition:persist`.
2. Pindahkan `SiteFooter` ke `Layout.astro` (konversi ke `.astro`), hapus `KlinikPageShell` (wrapper `overflow-x-clip` pindah ke layout).
3. Survey: `survey-kepuasan-pelanggan.astro` merender judul secara statis; hanya `<SurveyApp client:load />` (status + form/success) yang jadi island.

### Fase 3 — Data & keamanan

1. Cache-Control di 3 halaman SSR + memo TTL di `loadPublishedFeatures`.
2. Client Supabase anon (`getPublicSupabase`) + RLS untuk read `cms_feature_items`.
3. `/api/public/*` dipertahankan; tambahkan Cache-Control yang sama dan pindahkan `json()` ke `src/lib/http.ts`, dipakai bersama `survey-kepuasan.ts`.

### Fase 4 — Kebersihan

1. Hapus barrel/re-export mati, alias `LAYANAN_OPTIONS`, favicon duplikat.
2. `astro:env` menggantikan `lib/env.ts` & `trustProxyEnabled`.
3. Ekstrak `useDismiss` + `triggerClass` bersama untuk `LayananSelect`/`DatePicker`.
4. Prop SEO di `Layout.astro`; Fonts API; viewport meta.

## Verifikasi

- `npx astro check` + `npx tsc --noEmit` bersih.
- `npm run build`: bandingkan ukuran `dist/client` (target total aset dokter < 1.5 MB) dan daftar `_astro/*.js` (halaman profil/promo/dokter tanpa bundle React setelah Fase 2).
- `astro dev --background`, buka tiap halaman: menu mobile menutup saat navigasi (ClientRouter), footer tampil sekali, survey terkirim sukses, dan error validasi memfokuskan field.
- Lighthouse mobile pada `/` dan `/dokter-klinik` sebelum/sesudah (LCP, total byte weight).
