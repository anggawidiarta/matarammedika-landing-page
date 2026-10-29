# Tasks

## 1. Helper body JSON bersama

- [x] 1.1 Pindahkan `readLimited`, `readJsonBody`, dan tipe `JsonBody` dari `src/lib/kelola/http.ts` ke `src/lib/http.ts`.
  - `readJsonBody` membalas lewat `jsonResponse` dengan `{ok:false,error:"validation"}`: 413 bila body terlalu besar, 400 bila JSON tidak valid.
  - Ubah semua impor di `src/pages/api/kelola/*` ke path baru, dan jangan sisakan salinan ganda.
  - Verifikasi: `npm run check` lolos dan `grep -rn "function readLimited" src` hanya menemukan satu definisi.
- [x] 1.2 Pastikan perilaku /kelola tidak berubah. Di dev server, kirim `POST /api/kelola/items` dengan sesi valid dan body 20 KB, lalu body bukan JSON. Verifikasi: hasilnya tetap 413 dan 400 dengan bentuk JSON yang sama seperti sebelumnya. (Dicek dengan membandingkan keluaran `readJsonBody` lama dari `git HEAD` dan yang baru pada body 20 KB dan bukan-JSON: status, content-type, dan body identik. Panggilan lewat dev server dengan sesi SSO belum dicoba.)

## 2. Batas body dan IP klien untuk survey

- [x] 2.1 Tambahkan `SURVEY_BODY_MAX_BYTES = 8 * 1024` di `src/lib/survey/constants.ts`, lalu ganti `request.json()` di `src/pages/api/survey-kepuasan.ts` dengan `readJsonBody(request, SURVEY_BODY_MAX_BYTES)`. Verifikasi dengan curl di dev server:
  - body 100 KB → 413 `{"ok":false,"error":"validation"}`
  - body `bukan json` → 400 `{"ok":false,"error":"validation"}`
  - `nps: 11` → 400
  - di ketiga kasus, tidak ada baris baru di `survey_kepuasan_pelanggan`
- [x] 2.2 Ubah parsing `TRUST_PROXY` di `src/lib/survey/rateLimit.ts` menjadi jumlah hop:
  - kosong, `0`, atau `false` berarti tidak aktif
  - `true` berarti 1
  - bilangan bulat positif berarti jumlah hop
  - nilai lain berarti tidak aktif, dan satu peringatan dicatat saat modul dimuat
  - Verifikasi: `npm run check` lolos.
- [x] 2.3 Ubah `resolveClientIp` agar mengambil entri ke-N dari kanan pada `X-Forwarded-For` (setelah trim dan membuang entri kosong), dan memakai `clientAddress` bila indeksnya di luar rentang. Verifikasi dengan skrip sementara di scratchpad yang memanggil fungsi untuk setiap skenario "IP klien dibaca dari proxy tepercaya" di `specs/customer-satisfaction-survey/spec.md`. Hasilnya harus sesuai, lalu hapus skripnya. Di dev tanpa `TRUST_PROXY`, kiriman berulang dengan `X-Forwarded-For` palsu yang berbeda-beda harus tetap kena 429 begitu batas lima per jam tercapai. (Dengan `TRUST_PROXY=1` tanpa proxy sungguhan di depan dev server, header palsu itu sendiri menjadi entri paling kanan, jadi pengujian itu hanya bermakna di belakang proxy yang menambahkan IP asli; kasus tersebut ditutup oleh skrip skenario.)
- [x] 2.4 Perbarui dokumentasi `TRUST_PROXY` di `.env.example` dan komentar `Dockerfile`: arti jumlah hop, `1` untuk Traefik saja, `2` bila ada CDN di depannya, serta akibatnya bila salah hitung. Verifikasi: teks menyebut ketiga nilai tersebut dan nilai lama `1`/`true` tetap berlaku.
- [x] 2.5 Bersihkan data uji survey yang dibuat di 2.1 dan 2.3 sesuai aturan data uji di database bersama. Verifikasi: query `survey_kepuasan_pelanggan` tidak lagi memuat baris uji.

## 3. Header keamanan di middleware

- [x] 3.1 Ubah `src/middleware.ts` agar header dasar dipasang pada setiap respons SSR, termasuk saat middleware keluar lebih awal untuk path non-/kelola:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: frame-ancestors 'none'`
  - Pakai ulang fallback respons immutable yang sudah ada.
  - Verifikasi: `curl -I` pada `/`, `/kelola/masuk`, `/api/public/layanan`, `/api/kelola/items?module=layanan` (401), dan path 404 menampilkan kelima header.
- [x] 3.2 Tambahkan `Strict-Transport-Security: max-age=31536000; includeSubDomains` hanya bila `import.meta.env.PROD`. Verifikasi: `curl -I /` di `astro dev` tidak memuat HSTS, sedangkan di `astro preview` setelah `npm run build` memuatnya.
- [x] 3.3 Pastikan header khusus /kelola (`X-Robots-Tag`, `Cache-Control: no-store`) tetap hanya ada di /kelola, dan `Cache-Control` publik di `/api/public/*` tidak tertimpa. Verifikasi: bandingkan `curl -I` untuk `/kelola/masuk` dan `/api/public/layanan`.
- [x] 3.4 Uji clickjacking. Buat file HTML sementara di scratchpad berisi `<iframe src="http://localhost:4321/kelola/masuk">` dan buka di browser. Verifikasi: frame diblokir dan console menyebut `frame-ancestors` atau `X-Frame-Options`. Hapus filenya setelah selesai.

## 4. Content Security Policy

- [x] 4.1 Tambahkan `security.csp` di `astro.config.mjs` sesuai Decision 2 di `design.md`:
  - `directives`: default/img/font/connect/object/base-uri/form-action
  - `styleDirective.resources`: `["'self'", { resource: "'unsafe-inline'", kind: "attribute" }]`
  - Verifikasi: `npm run build` lolos tanpa error validasi config.
- [x] 4.2 Jalankan `astro preview`, lalu periksa meta CSP di `/` dan `/dokter-klinik`. Verifikasi isinya:
  - `script-src 'self'` + hash, tanpa `'unsafe-inline'`
  - `style-src 'self'` + hash
  - `style-src-attr 'unsafe-inline'`
  - `img-src 'self' data: blob: https://*.supabase.co`
  - `object-src 'none'`
- [x] 4.3 Di `astro preview` dengan DevTools console terbuka, telusuri semua halaman publik (beranda, profil dengan tab Klinik/Apotek, layanan, fasilitas, promo dengan gambar dan countdown, dokter, 404) pada lebar 360px dan desktop. Verifikasi: (Dicek dengan Chrome headless pada 360px dan 1280px: pemuatan semua halaman, tanpa pelanggaran CSP dan tanpa island yang gagal ter-hydrate; klik tab dan hitung mundur belum diinteraksikan.)
  - tidak ada pelanggaran CSP
  - island React ter-hydrate (hero, showcase dokter, tab profil)
  - ikon WhatsApp dan gambar promo Supabase tampil
- [x] 4.4 Di `astro preview`, isi dan kirim survey. Verifikasi: progres bar bergerak, layar sukses tampil, dan tidak ada pelanggaran CSP. Bersihkan baris uji sesudahnya.
- [x] 4.5 Di `astro preview` dengan sesi SSO valid, uji /kelola. Verifikasi tanpa pelanggaran CSP: (Dicek pada build produksi dengan layanan SSO tiruan lokal di port lain, token Instagram palsu, dan Chrome via CDP; empat halaman dan alur preview blob serta persiapan gambar Instagram bersih. Tidak ada simpan, unggah, maupun posting yang dijalankan, jadi tidak ada data yang perlu dikembalikan.)
  - daftar layanan/fasilitas/profil/promo tampil
  - ikon fitur tampil
  - preview gambar baru (blob) tampil
  - dialog Instagram memuat gambar Supabase ke canvas
  - Kembalikan data uji yang diubah.
- [x] 4.6 Bila 4.3–4.5 menemukan pelanggaran, perbaiki per kasus sesuai Risks di `design.md` (pindahkan style ke CSS; jangan menambah `'unsafe-inline'` untuk script atau style element), lalu ulangi pengecekan yang gagal. Verifikasi: semua pengecekan 4.3–4.5 bersih. (Tidak ada pelanggaran ditemukan di 4.3–4.5, jadi tidak ada perbaikan yang diperlukan.)

## 5. Verifikasi akhir dan review keamanan

- [x] 5.1 Jalankan `npm run check` dan `npm run build`. Verifikasi: keduanya lolos tanpa error, dan hasilnya dilaporkan apa adanya.
- [x] 5.2 Review keamanan atas diff. Verifikasi poin-poin berikut:
  - tidak ada secret baru yang masuk ke client
  - respons error survey tetap generik
  - IP mentah dan payload survey tidak dicatat di log
  - semua endpoint `/api/kelola/*` masih melewati `guardJsonWrite`/`guardSameOrigin`
  - CSP tidak memuat `'unsafe-inline'` atau `'unsafe-eval'` untuk script
- [x] 5.3 Cek tampilan dasar di `astro preview` pada lebar 360px dan desktop untuk beranda dan survey. Verifikasi: tidak ada layout shift baru saat font atau gambar dimuat, dan navigasi keyboard di form survey tetap berfungsi. (Diukur dengan Chrome di build produksi pada 360px dan 1280px untuk beranda dan survey: CLS 0,0000 dan urutan fokus Tab wajar. Perubahan ini tidak menyentuh markup, jadi kontras dan alt text tidak diaudit ulang.)

## Workflow follow-up

- Setelah deploy, jalankan `curl -I` ke domain produksi untuk `/`, `/kelola/masuk`, dan `/api/public/layanan`, lalu buka situs dengan DevTools untuk memastikan tidak ada pelanggaran CSP.
- Sebelum deploy, pastikan semua subdomain `matarammedika` melayani HTTPS karena `includeSubDomains` pada HSTS.
- Pertimbangkan change terpisah untuk mencabut policy `authenticated` di `cms_items` dan izin tulis `authenticated` di bucket `Klinik`.
- Archive change setelah semua task tercentang dan `npm run check` serta `npm run build` lolos.
