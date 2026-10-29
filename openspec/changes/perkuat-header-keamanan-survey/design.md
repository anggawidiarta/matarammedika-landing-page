# Design

## Context

Alasan perubahan ada di proposal.md (bagian Why), dan perilaku yang dituju ada di `specs/header-keamanan-http` dan `specs/customer-satisfaction-survey`. Kondisi kode saat ini yang membentuk pendekatan:

- **Middleware.** `src/middleware.ts` keluar lebih awal (`return next()`) untuk path selain `/kelola` dan `/api/kelola`. Satu-satunya header yang dipasang adalah `X-Robots-Tag` dan `Cache-Control: no-store`, lewat `withKelolaHeaders`. Fungsi itu sudah menangani respons dengan header immutable (misalnya hasil `context.redirect`) dengan cara membuat ulang `Response`.
- **Halaman prerender.** `/dokter-klinik` dan `/survey-kepuasan-pelanggan` dilayani adapter Node sebagai file statis. Middleware tidak berjalan untuk keduanya saat runtime.
- **CSP bawaan Astro 7.** Astro 7.3.6 punya `security.csp` (sudah stabil). Fitur ini meng-hash script dan style inline hasil build, lalu menulis policy ke `<meta http-equiv="content-security-policy">` di `<head>` untuk halaman prerender, dan ke header respons `Content-Security-Policy` untuk route SSR (terverifikasi di build produksi). Arah `style.attribute` dan `script.attribute` dirender sebagai `style-src-attr` dan `script-src-attr`. Kalau tidak dikonfigurasi, `script-src` dan `style-src` berisi `'self'` + hash. CSP ini tidak aktif di `astro dev`.
- **Resource yang dipakai situs:**
  - Gambar promo dari `${SUPABASE_URL}/storage/v1/object/public/Klinik/`, dimuat di halaman publik dan di dialog Instagram (`crossOrigin = "anonymous"` lalu digambar ke canvas).
  - Preview upload memakai `URL.createObjectURL` (`blob:`).
  - Ada 4 tempat React memakai `style={{...}}`: `WhatsAppIcon`, `featureIcon` (2 tempat), dan `SurveyProgress`. Saat SSR, keempatnya menjadi atribut `style=""` di HTML.
  - Tidak ada script, font, atau stylesheet dari domain luar. Font di-host sendiri lewat API fonts Astro.
  - `fetch` dari client hanya ke origin sendiri.
- **Survey.** `POST /api/survey-kepuasan` memanggil `request.json()` tanpa batas ukuran body. `resolveClientIp` mengambil entri **pertama** `X-Forwarded-For` bila `TRUST_PROXY` bernilai `1` atau `true`.
- **Helper bersama.** `readLimited` dan `readJsonBody` ada di `src/lib/kelola/http.ts`. `readJsonBody` membalas lewat `fail()`, yang menghasilkan bentuk `{ok:false,error}`, sama dengan bentuk error survey.

## Goals / Non-Goals

**Goals:**

- Satu sumber kebenaran untuk header keamanan di semua respons SSR, sehingga endpoint baru otomatis ikut terlindungi.
- CSP tanpa `'unsafe-inline'` untuk script.
- Perilaku `TRUST_PROXY` tetap kompatibel dengan nilai `.env` yang ada.

**Non-Goals:**

- Mode CSP report-only atau endpoint pelaporan pelanggaran CSP.
- Nonce per-request.
- Mengubah cara halaman prerender disajikan, misalnya menjadikannya SSR hanya demi header.

## Decisions

### 1. Header non-CSP dipasang di middleware untuk semua path

Middleware akan memasang header keamanan pada **setiap** respons, lalu menambahkan header khusus /kelola (`X-Robots-Tag`, `no-store`) hanya untuk path /kelola. Mekanisme fallback immutable yang ada di `withKelolaHeaders` dipakai ulang untuk kedua kelompok header.

Header yang dipasang:

| Header | Nilai |
| --- | --- |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` | `frame-ancestors 'none'` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`, hanya bila `import.meta.env.PROD` |

Header CSP dari middleware **hanya** berisi `frame-ancestors`, dan ditambahkan dengan `append`, bukan `set`: pada route SSR Astro sudah mengirim kebijakan script/style-nya di header yang sama, sehingga `set` akan menimpanya. Bila ada lebih dari satu CSP (dua kebijakan dalam satu header, atau header + meta), browser menerapkan semuanya sekaligus (irisan), sehingga tidak saling melemahkan. `frame-ancestors` memang diabaikan browser bila ditulis di meta tag, jadi direktif ini harus lewat header.

- *Alternatif: pasang header di Traefik/Dokploy.* Ditolak sebagai sumber utama karena konfigurasinya tidak ikut versi kode, tidak teruji di `astro preview`, dan mudah hilang saat pindah host. Traefik tetap boleh menambahkan header untuk halaman prerender (lihat Risks).
- *Alternatif: opsi `staticHeaders` di adapter Node.* Opsi ini hanya memindahkan CSP hasil hash Astro ke header untuk halaman prerender, bukan header lain. Untuk dua halaman statis yang tidak punya aksi berbahaya, manfaatnya kecil, jadi tidak dipakai sekarang.
- *Soal `includeSubDomains`:* direktif ini mewajibkan HTTPS untuk semua subdomain. Sebelum deploy, perlu dipastikan tidak ada subdomain `matarammedika` yang masih melayani HTTP biasa (lihat Migration Plan). `preload` sengaja tidak dipasang karena sulit dibatalkan.

### 2. CSP utama memakai `security.csp` bawaan Astro

Rancangan konfigurasi di `astro.config.mjs`:

```js
security: {
  checkOrigin: false,
  csp: {
    directives: [
      "default-src 'self'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ],
    styleDirective: {
      resources: ["'self'", { resource: "'unsafe-inline'", kind: "attribute" }],
    },
  },
},
```

Bentuk ini sudah dicocokkan dengan schema `security.csp` di Astro 7.3.6 (`node_modules/astro/dist/core/csp/config.js`). Begitu `resources` diisi, Astro tidak lagi menambahkan `'self'` secara otomatis, jadi `'self'` wajib ditulis. Hasil yang dituju: `style-src 'self' <hash>` dan `style-src-attr 'unsafe-inline'`, sementara `script-src` tetap default (`'self'` + hash). `directives` tidak boleh memuat `script-src` atau `style-src`, karena schema menolaknya.

- **Mengapa `style-src-attr 'unsafe-inline'`:** keempat `style={{...}}` di React dirender sebagai atribut HTML saat SSR. Atribut style tidak bisa di-hash secara praktis. Risiko injeksi lewat atribut style (CSS exfiltration) jauh lebih kecil daripada injeksi script, dan direktif ini tidak melonggarkan `<style>` maupun script.
  - *Alternatif:* mengganti keempatnya dengan kelas Tailwind atau CSS custom property. Ini ditolak untuk change ini: `SurveyProgress` butuh nilai dinamis, dan `WhatsAppIcon` memakai `mask` dengan URL aset.
- **Mengapa `https://*.supabase.co`:** CSP Astro ditulis saat build, sedangkan `SUPABASE_URL` adalah secret runtime yang tidak tersedia di tahap build Docker. Wildcard project Supabase sudah cukup sempit untuk `img-src`.
  - *Alternatif:* membaca `SUPABASE_URL` lewat `loadEnv` saat build. Ditolak karena membuat image Docker bergantung pada env build dan ikut mengunci URL ke dalam image.
- **Mengapa `connect-src 'self'` cukup:** dialog Instagram memuat gambar Supabase sebagai `<img>` (diatur `img-src`), bukan lewat `fetch`. Posting ke Graph API terjadi di server.
- **`'strict-dynamic'` tidak dipakai.** Semua script berasal dari origin sendiri, jadi `'self'` + hash sudah cukup dan lebih mudah diaudit.

### 3. Survey memakai `readJsonBody` bersama dengan batas 8 KB

`readLimited`, `readJsonBody` dan tipe `JsonBody` dipindah ke `src/lib/http.ts`. Fungsi `fail` milik /kelola tetap di `src/lib/kelola/http.ts`.

Agar `src/lib/http.ts` tidak bergantung pada modul kelola, `readJsonBody` membalas langsung lewat `jsonResponse` dengan `{ok:false,error:"validation"}`: status 413 bila body terlalu besar, 400 bila JSON tidak valid. Bentuk ini identik dengan keluaran `fail("validation", ...)` sekarang, sehingga perilaku /kelola tidak berubah. `src/lib/kelola/http.ts` meng-impor ulang helper dari `src/lib/http.ts` sehingga pemanggil yang ada tidak perlu diubah, atau pemanggilnya diubah ke path baru. Pilih salah satu, dan jangan biarkan dua salinan.

Konstanta batas body survey diletakkan di `src/lib/survey/constants.ts`: `SURVEY_BODY_MAX_BYTES = 8 * 1024`. Payload terbesar yang sah adalah 120 + 500 karakter. Kalaupun semuanya karakter 4-byte atau escape `\u00XX`, totalnya masih di bawah 4 KB, jadi 8 KB memberi ruang lebih dari 2x.

Client tidak perlu diubah: `useSurveyForm` sudah menampilkan pesan "Data survey tidak valid…" untuk `body.error === "validation"`, apa pun status HTTP-nya.

### 4. `TRUST_PROXY` menjadi jumlah hop dan IP dibaca dari kanan

Aturan parsing `TRUST_PROXY`:

- Kosong, `0`, atau `false` berarti tidak aktif.
- `true` sama dengan `1`.
- Bilangan bulat positif berarti jumlah hop.
- Nilai lain dianggap tidak aktif, dan peringatan dicatat sekali saat modul dimuat.

`resolveClientIp` lalu memecah `X-Forwarded-For` per koma, membuang spasi dan entri kosong, kemudian mengambil entri di indeks `length - hops`. Bila indeks itu di luar rentang, server memakai `clientAddress`.

Dengan 1 hop (Traefik), hasilnya benar baik Traefik **menimpa** header (hanya ada satu entri) maupun **menambahkan** IP koneksi ke ujung kanan header kiriman klien. Tidak perlu tahu persis perilaku Traefik.

- *Alternatif: tetap memakai entri paling kiri dan mengandalkan proxy untuk membuang header kiriman klien.* Ditolak karena kebenarannya bergantung pada konfigurasi di luar repo.
- *Alternatif: header khusus CDN seperti `CF-Connecting-IP`.* Tidak dipakai karena saat ini tidak ada CDN yang diketahui. Bila nanti ada Cloudflare, cukup set `TRUST_PROXY=2`.

Untuk privasi, IP hasil resolusi tetap hanya dipakai untuk `hashClientIp` dan tidak pernah dicatat di log.

## Risks / Trade-offs

- **[CSP memblokir resource sah yang terlewat]** → Wajib verifikasi lewat `npm run build` + `astro preview` (CSP tidak aktif di dev). Buka setiap halaman publik dan /kelola, dengan console terbuka, untuk mencari pelanggaran. Rollback cukup dengan menghapus blok `csp` di config.
- **[Pustaka React atau Astro menyisipkan `<style>` saat runtime yang tidak ter-hash]** → Ini akan terlihat sebagai pelanggaran `style-src` saat verifikasi. Tangani per kasus dengan memindahkan style ke CSS, bukan dengan `'unsafe-inline'` untuk style element.
- **[`includeSubDomains` mematahkan subdomain HTTP]** → Cek daftar subdomain sebelum deploy. Bila ragu, mulai tanpa `includeSubDomains` dengan `max-age` pendek, lalu naikkan.
- **[`TRUST_PROXY` salah hitung hop]** → Bila hop terlalu besar, semua klien jatuh ke `clientAddress`, yaitu IP proxy, sehingga survey dibatasi 5 per jam untuk semua orang. Bila terlalu kecil, IP proxy yang dihitung, dengan efek yang sama. Keduanya gagal ke arah ketat (spam tidak lolos), bukan ke arah longgar. Dokumentasikan di `.env.example`.
- **[Halaman prerender tanpa `X-Frame-Options` dan HSTS]** → Diterima, dengan alasan di proposal (Di luar lingkup). Begitu satu respons SSR diterima, HSTS tetap berlaku untuk seluruh origin, karena kebijakan HSTS melekat pada domain, bukan halaman.
- **[`default-src 'self'` memblokir `<iframe>` Google Maps atau embed lain di masa depan]** → Siapa pun yang menambah embed harus menambah direktif yang sesuai. Spec `header-keamanan-http` menjadi pengingatnya.

## Migration Plan

1. Deploy seperti biasa. Tidak ada perubahan skema atau secret baru.
2. Biarkan `TRUST_PROXY=1` bila Dokploy/Traefik adalah satu-satunya proxy. Bila ada CDN di depannya, set ke `2`.
3. Sebelum mengaktifkan `includeSubDomains`, pastikan semua subdomain `matarammedika` melayani HTTPS.
4. Setelah deploy, cek dengan `curl -I` pada `/`, `/kelola/masuk` dan `/api/public/layanan`, lalu buka situs dengan DevTools untuk memastikan tidak ada pelanggaran CSP.
5. Rollback: revert commit. HSTS yang sudah diterima browser tetap berlaku sampai `max-age` habis, dan ini aman selama situs tetap HTTPS.
