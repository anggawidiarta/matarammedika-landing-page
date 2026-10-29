# Proposal

## Why

Area /kelola bisa dimuat di dalam iframe situs lain. Penyerang dapat menumpuk halaman palsu di atasnya dan memancing staf yang sedang login untuk mengklik tombol hapus atau terbitkan tanpa sadar. Situs juga tidak mengirim header keamanan dasar yang membatasi dari mana script dan gambar boleh dimuat, sehingga dampak celah XSS di masa depan tidak teredam.

Batas lima kiriman survey per jam per IP juga belum dapat diandalkan. Di belakang proxy, IP dibaca dari entri `X-Forwarded-For` paling kiri yang bisa ditulis siapa pun. Akibatnya pengirim spam bisa membanjiri data survey klinik, atau sebaliknya semua pasien tertolak karena terbaca sebagai satu IP. Body permintaan survey pun belum dibatasi ukurannya.

## What Changes

- Semua respons SSR mengirim header keamanan:
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - larangan pemuatan dalam frame: `X-Frame-Options` dan CSP `frame-ancestors`
  - HSTS, khusus di produksi
- Content Security Policy diaktifkan untuk semua halaman, termasuk yang di-prerender. Script dan style inline hanya diizinkan lewat hash yang dibuat Astro; gambar hanya dari situs sendiri, Supabase Storage, `data:` dan `blob:`.
- Endpoint `POST /api/survey-kepuasan` menolak body di atas batas ukuran dengan 413 dan menolak body yang bukan JSON dengan 400, sebelum menyentuh database.
- IP klien untuk rate limit dibaca dari entri `X-Forwarded-For` yang ditulis proxy tepercaya (dihitung dari kanan), bukan entri paling kiri.
- `TRUST_PROXY` kini juga menerima jumlah hop proxy (`1`, `2`, …). Nilai lama `1`/`true` tetap berarti satu proxy, jadi `.env` produksi tidak perlu diubah.
- Helper `readJsonBody`/`readLimited` dipindah dari `src/lib/kelola/http.ts` ke `src/lib/http.ts` agar dipakai bersama oleh /kelola dan survey.

## Capabilities

### New Capabilities
- `header-keamanan-http`: header keamanan dan Content Security Policy yang dikirim situs untuk halaman publik, area /kelola dan API.

### Modified Capabilities
- `customer-satisfaction-survey`: menambah requirement sisi server untuk batas ukuran body, penolakan payload tidak valid, dan cara penentuan IP klien untuk rate limit di belakang proxy.

## Di luar lingkup

- Mencabut policy RLS `authenticated` di `cms_items` dan izin tulis `authenticated` di bucket `Klinik`. Ini direkomendasikan karena signup Supabase sudah mati dan CMS di matarammedika-admin sudah tidak dipakai. Namun bucket `Klinik` mungkin masih dipakai fitur lain di database bersama, jadi perlu change terpisah yang dikoordinasikan.
- Temuan advisor Supabase di luar landing page: tabel tanpa RLS, fungsi `SECURITY DEFINER` yang bisa dipanggil `anon`, dan upgrade Postgres.
- Header `X-Frame-Options` dan HSTS untuk dua halaman prerender (`/dokter-klinik`, `/survey-kepuasan-pelanggan`). Halaman ini disajikan sebagai file statis tanpa middleware. CSP-nya tetap aktif lewat meta tag, dan halaman ini tidak punya aksi yang bisa disalahgunakan lewat clickjacking. Header tambahan bisa dipasang di Traefik bila diinginkan.
- Race condition antara cek rate limit dan insert survey. Selisihnya paling banyak beberapa kiriman pada permintaan paralel, sehingga tidak sebanding dengan perubahan skema.
- Menambah test runner.

## Impact

- **Kode:**
  - `astro.config.mjs` (konfigurasi `security.csp`)
  - `src/middleware.ts` (header untuk semua respons SSR, tidak lagi hanya /kelola)
  - `src/lib/http.ts`
  - `src/lib/kelola/http.ts`
  - `src/lib/survey/rateLimit.ts`
  - `src/pages/api/survey-kepuasan.ts`
  - `.env.example` dan komentar di `Dockerfile` (arti baru `TRUST_PROXY`)
- **Performa:** tidak ada JS, gambar, atau font baru yang dikirim ke client. CSP menambah satu meta tag kecil di `<head>`, dan header menambah beberapa ratus byte per respons.
- **Privasi/keamanan:**
  - Clickjacking di /kelola ditutup.
  - Dampak XSS diredam oleh CSP.
  - Rate limit survey tidak bisa lagi dilewati dengan memalsukan `X-Forwarded-For`.
  - IP tetap hanya disimpan sebagai hash ber-pepper.
- **Risiko:** CSP yang terlalu ketat bisa memblokir resource yang sah, misalnya gambar promo, preview blob di /kelola, atau style inline React. Karena CSP Astro tidak aktif di `astro dev`, verifikasi wajib lewat `astro build` + `astro preview`.
- **Deploy:** bila ada CDN atau proxy kedua di depan Traefik, `TRUST_PROXY` harus diset ke jumlah hop yang sesuai. Tanpa itu rate limit akan menghitung IP CDN.
- **matarammedika-admin / skema Supabase:** tidak ada perubahan.
- **Dependensi:** tidak ada dependensi baru.
