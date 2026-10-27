# Design

## Context

- Landing page berjalan sebagai Astro 7 `output: "server"` (adapter Node standalone) di Dokploy, dengan satu klien Supabase service-role di `src/lib/supabase/server.ts`. Belum ada middleware, auth, cookie, maupun endpoint tulis selain `POST /api/survey-kepuasan`.
- Pembacaan publik dibungkus `ttlCached` (memo 60 detik per proses, `src/lib/cms/ttlCache.ts`) dan header `PUBLIC_CACHE_CONTROL`.
- Admin (repo `matarammedika-admin`, Vite SPA) menulis langsung dari browser ke Supabase memakai sesi Supabase yang diterbitkan layanan SSO. Kontrak SSO yang dipakai: `POST /api/sso/exchange-code`, `GET /api/sso/me`, `POST /api/sso/refresh`, `POST /api/auth/logout`, dengan `user.apps` berisi app key. Detail di `matarammedika-admin/src/lib/sso.ts`.
- RLS pada `cms_items` hanya mengizinkan `authenticated` select/insert/update, tanpa DELETE. Service role melewati RLS, sehingga otorisasi pindah sepenuhnya ke kode server.
- Token Instagram di admin tertanam di bundel browser (aman hanya karena di belakang Tailscale). Landing page publik, jadi token harus di server.
- Motivasi dan lingkup: lihat `proposal.md`. Perilaku yang harus dipenuhi: lihat `specs/`.

## Goals / Non-Goals

**Goals:**

- Paritas fungsi 4 modul dan posting Instagram, dengan semua tulis lewat server.
- Nol penambahan JS di halaman publik dan nol dependensi baru.
- Pratinjau memakai komponen publik yang sama sehingga tidak ada dua implementasi tampilan yang bisa menyimpang.
- Setiap pengaturan keamanan (sesi, CSRF, validasi, batas ukuran) dapat dijelaskan dalam satu tempat: middleware dan helper `http.ts`.

**Non-Goals:**

- Model role/permission, audit log, riwayat versi item, atau pembatalan (undo).
- Realtime multi-staf (dua staf yang mengedit bersamaan: terakhir menyimpan menang).
- Invalidasi cache lintas proses/instance. Cukup proses server yang sama (lihat Risiko).
- Menghapus atau memigrasi fitur CMS di repo admin (ditangani lewat pengarsipan branch).

## Decisions

### 1. Sesi SSO disimpan di cookie httpOnly dan divalidasi di middleware

Login: `/kelola/masuk/sso` membuat `state` acak (cookie httpOnly, 10 menit) lalu mengalihkan ke `${SSO_USERS_URL}/login?app=admin&redirect=<origin>/kelola/callback?state=…&next=…`. `/kelola/callback` mencocokkan `state`, menghapusnya (sekali pakai), menukar `code`, memeriksa `apps.includes("admin")`, lalu memasang cookie token akses dan refresh (`httpOnly`, `Secure` di produksi, `SameSite=Lax`, `Path=/`).

`src/middleware.ts` hanya bekerja untuk path `/kelola*` dan `/api/kelola*`. Ia memanggil `GET /api/sso/me` dengan token dari cookie, di-memo dalam proses selama 60 detik per hash token supaya tidak memukul SSO tiap permintaan. Bila 401, ia mencoba `refresh` satu kali dan menulis ulang cookie. Hasil valid disimpan di `locals.kelolaUser`. Middleware juga memasang `X-Robots-Tag` dan `Cache-Control: no-store`.

- **Alasan**: token tidak terjangkau JavaScript sehingga XSS di island tidak bisa mencuri sesi. Pencabutan akses terasa dalam ≤ 60 detik (cukup untuk kasus ini). Kode tukar-token hanya berjalan di server sehingga masalah Strict Mode yang ada di admin (penukaran kode ganda) tidak muncul.
- **Konfigurasi opsional**: `middleware.ts` ikut dimuat untuk semua rute, sehingga env wajib yang hilang akan menjatuhkan situs publik. Karena itu `SSO_USERS_URL` dan `SITE_ORIGIN` opsional di skema; bila `SSO_USERS_URL` kosong, `/kelola` menampilkan "layanan masuk tidak tersedia" dan situs publik tidak terpengaruh. `SITE_ORIGIN` menentukan alamat callback yang dikirim ke SSO karena kontainer berada di belakang proxy TLS (asal `request.url` tidak dapat dipercaya).
- **Alternatif**: (a) sessionStorage seperti admin: ditolak karena dapat dibaca JS dan sesi hilang tiap tab. (b) Cookie sesi sendiri yang ditandatangani: ditolak karena menduplikasi masa berlaku/pencabutan yang sudah dimiliki SSO dan perlu secret baru. (c) Supabase Auth langsung: ditolak oleh pemilik (akun harus tetap di SSO).

### 2. Semua tulis lewat server dengan service role, bukan token Supabase di browser

Admin memakai sesi Supabase `authenticated` dan RLS. Di landing page, endpoint `/api/kelola/*` memakai `getServiceSupabase()` setelah middleware memastikan sesi valid. Browser tidak menerima token Supabase.

- **Alasan**: tidak ada kunci Supabase tulis di browser, validasi bisa dipusatkan (zod), dan unggah gambar/IG yang butuh rahasia server tidak perlu jalur terpisah.
- **Konsekuensi**: RLS tidak melindungi lagi, jadi setiap query wajib memfilter `module` dan `source` sendiri dan mengambil kolom eksplisit. Ini sesuai aturan proyek (service role).
- **Alternatif**: meneruskan token Supabase dari `/api/sso/exchange` ke browser seperti admin. Ditolak karena membawa token tulis ke halaman publik dan butuh kunci anon di bundel.

### 3. Perlindungan CSRF berlapis

Karena autentikasi berbasis cookie, endpoint tulis rentan CSRF. Mitigasi:

- Cookie `SameSite=Lax`.
- Pemeriksaan `Origin` oleh `guardJsonWrite`/`guardSameOrigin`: `Origin` harus sama persis dengan `SITE_ORIGIN` (skema + host). Pemeriksaan bawaan Astro (`security.checkOrigin`) dimatikan karena tanpa `allowedDomains` Astro tidak mempercayai header `Host`, sehingga `request.url` di balik proxy selalu `localhost` dan semua POST form ditolak; terbukti pada uji server build.
- Helper `requireJsonRequest` untuk endpoint JSON: wajib `Content-Type: application/json` dan `Origin` sama dengan situs, sehingga form silang-situs tidak bisa memicunya.
- Callback login dijaga `state` sekali pakai.

- **Alasan**: tanpa token CSRF terpisah, tanpa dependensi, dan cukup untuk model ancaman (staf internal, area tersembunyi).
- **Alternatif**: token CSRF double-submit. Ditolak karena menambah state dan kode tanpa perlindungan ekstra yang berarti di atas `Origin` + `SameSite`.

### 4. Satu API item generik, divalidasi per modul oleh zod

`/api/kelola/items` (GET/POST), `/items/[id]` (PATCH/DELETE) dan `/items/reorder` (POST) melayani keempat modul. `schemas.ts` menentukan section yang sah, bentuk `data` dan batas panjang per modul, mencerminkan `cms_item_data_valid()` dan CHECK di database. Ikon dan warna memakai `KLINIK_ICON_NAMES` dan `CIRCLE_TONES` yang sudah dipakai pembaca publik (`src/types/feature.ts`), sehingga nilai yang bisa ditulis selalu yang bisa dirender. Regex jalur gambar promo memakai yang sama dengan `src/lib/cms/promo.ts`.

`sort_order` untuk item baru dan hasil reorder dihitung di server (`items.ts`), bukan dipercaya dari klien. Reorder menerima `ids[]` satu section, memeriksa bahwa semuanya milik modul/unit/section itu dan belum dihapus, lalu menomori ulang 0..n-1.

- **Alasan**: satu jalur kode menyamai satu hook `useCmsItems` di admin; menambah modul berikutnya (Dokter) cukup menambah skema.
- **Alternatif**: endpoint per modul. Ditolak karena menggandakan logika CRUD identik empat kali.

### 5. Gambar promo diunggah lewat server

`POST /api/kelola/promo/gambar` (multipart) memvalidasi MIME dan ukuran (≤ 2 MB, jpg/png/webp) di server, mengunggah ke bucket `Klinik` di `cms/promo/<uuid>.<ext>`, lalu mengembalikan `image_path`. Penghapusan gambar lama dikerjakan server pada PATCH item setelah baris tersimpan. Jika simpan gagal, klien memanggil `DELETE` untuk gambar baru; endpoint itu hanya menerima jalur yang cocok regex dan tidak dipakai item mana pun.

- **Alasan**: mempertahankan urutan "simpan dulu, hapus lama kemudian" dari admin, dan server menjadi satu-satunya yang menyentuh storage dengan kunci tulis.
- **Alternatif**: URL bertanda tangan agar browser mengunggah langsung. Ditolak karena menambah langkah dan kita tetap perlu validasi isi di server. Batas 2 MB membuat proxy lewat server murah.

### 6. Instagram dijalankan sepenuhnya di server; browser hanya merender gambar

Browser merender ulang gambar promo ke kanvas 1080×1350 JPEG dengan latar putih (port `instagramUtils`), lalu mengirimkannya bersama keterangan ke `POST /api/kelola/promo/[id]/instagram`. Server menjalankan urutan yang sama dengan admin: menandai `publishing` yang macet > 5 menit sebagai gagal, menyisipkan baris `publishing` (kode 23505 dari indeks unik parsial berarti "sedang diposting"), mengunggah JPEG ke `cms/promo/instagram/`, memanggil Graph API (`/media`, polling `status_code` dengan batas waktu, `/media_publish`, `permalink`), lalu memperbarui baris menjadi `published` atau `failed` (pesan ≤ 500 karakter, tanpa token/URL bertanda tangan). `GET /api/kelola/promo/instagram` mengembalikan status terbaru per promo. Env `IG_*` opsional; bila kosong, server melaporkan `instagram: false` ke halaman dan opsi disembunyikan.

`requested_by` dibiarkan kosong karena service role tidak punya `auth.uid()`.

- **Alasan**: memenuhi aturan "token Meta tidak ke browser" dan memakai indeks unik yang sudah menjadi kunci pencegahan posting ganda.
- **Alternatif**: merender gambar di server (butuh `sharp`/canvas, dependensi baru). Ditolak; kanvas di browser sudah teruji di admin.

### 7. Invalidasi cache publik lewat registry di `ttlCached`

`ttlCached` mendaftarkan setiap instance ke registry modul; `invalidateCmsCaches()` mengosongkan semuanya. Dipanggil setelah setiap mutasi item sukses (dan posting IG tidak memerlukannya). Header `PUBLIC_CACHE_CONTROL` pada halaman publik tidak diubah.

- **Alasan**: perubahan terlihat segera di proses yang sama tanpa mengubah perilaku cache publik atau menurunkan kinerja.
- **Alternatif**: memangkas TTL jadi 0: ditolak karena membebani Supabase untuk pengunjung. Webhook ke CDN: tidak ada CDN yang dikelola di repo ini.

### 8. Antarmuka: satu island React per halaman `/kelola`, data awal dari server

Tiap halaman `.astro` (`layanan`, `fasilitas`, `profil`, `promo`) mengambil daftar awal di frontmatter dan meneruskannya sebagai props ke satu island `client:load` (area kelola sepenuhnya interaktif; tidak ada konten di atas lipatan yang perlu dioptimalkan untuk SEO). Halaman `masuk`, `masuk/sso`, `callback` dan `keluar` murni `.astro`/endpoint tanpa JS client. `KelolaLayout.astro` tidak memuat `KlinikHeader`, footer publik, `ClientRouter`, maupun `promoCountdown`, dan memuat `<meta name="robots" content="noindex">`.

Setelah halaman terbuka, mutasi dan refetch lewat `fetch` ke `/api/kelola/*` (`useKelolaItems`), dengan pembaruan optimistis hanya untuk reorder.

- **Alasan**: tidak ada kilatan "memuat" pada tampilan pertama, dan bundel kelola terpisah dari bundel publik karena hanya diimpor halaman kelola.
- **Alternatif**: SPA React tunggal dengan router klien. Ditolak karena menambah router/state global dan bertentangan dengan pola Astro di repo ini.

### 9. Komponen UI: dasar sendiri, native `<dialog>`, dan pemakaian ulang komponen publik

Komponen kelola ditulis sendiri dengan token Tailwind situs (tidak membawa `Button`, `Card`, `DropDownInput` dari admin). Dialog memakai `<dialog>` native dengan `showModal()` untuk jebakan fokus dan Esc gratis; di ≤ 640px tampil layar penuh. Pratinjau memakai `IconFeatureCard` dan `PromoCard`; ikon memakai `renderIcon`/`lucideMap`; status promo dan zona waktu memakai `promoDisplay.ts`. `Segmented` diperbaiki (roving tabindex, panah, `aria-controls`) dan dipakai di Profil.

Bahasa visual: kartu `rounded-3xl` dengan `shadow-card` tanpa border (One Elevation), gradien biru→hijau hanya untuk aksi utama (Simpan/Tambah), aksi sekunder outline, destruktif merah, merah muda hanya pada konteks promo, `font-accent` + `tabular-nums` untuk harga/tanggal/urutan, `muted` hanya caption, fokus `outline-blue`, transisi 200 ms ease-out dengan `motion-reduce`.

- **Alasan**: konsisten dengan identitas situs, tidak menambah dependensi UI, dan pratinjau tidak bisa menyimpang dari tampilan publik.
- **Alternatif**: salin komponen admin apa adanya (bahasa visual admin berbeda dan butuh Tailwind 3 + `tailwind-merge`). Library dialog/headless: dependensi baru tanpa manfaat di atas `<dialog>`.

### 10. SEO, cache dan fallback

- Halaman `/kelola*` bukan konten publik: `noindex, nofollow`, `no-store`, tidak masuk sitemap, dan sengaja tidak ditambahkan ke `robots.txt` (entri `Disallow` justru mengiklankan path tersembunyi).
- Rute publik tidak berubah: `PUBLIC_CACHE_CONTROL` dan `ttlCached` tetap. Kegagalan CMS di sisi publik tetap berperilaku seperti sekarang (bagian kosong disembunyikan atau memakai pesan sopan, tanpa fallback statis).
- Bila Supabase gagal di area kelola, halaman tetap terbuka dengan keadaan galat dan tombol Coba lagi (bukan halaman kosong).

## Risks / Trade-offs

- **Service role tanpa RLS** → setiap endpoint diperiksa terhadap daftar kontrol: sesi (middleware), zod, batas body, filter `module`/`source`, kolom eksplisit, galat generik. Review keamanan khusus endpoint ada sebagai task akhir.
- **Cookie-auth membuka CSRF** → `SameSite=Lax` + `Origin` + `Content-Type` JSON wajib + `state` callback (Keputusan 3).
- **Invalidasi cache hanya per proses** → bila Dokploy menjalankan > 1 replika, replika lain tetap melayani cache sampai TTL 60 detik habis. Dokploy saat ini satu kontainer; didokumentasikan di tasks, tidak diselesaikan sekarang.
- **Pencabutan akses tertunda hingga 60 detik** karena memo `me` → diterima; bisa dikecilkan bila diperlukan.
- **Dua staf mengedit item yang sama** → terakhir menyimpan menang; tidak ada kunci optimistis. Diterima untuk skala tim kecil.
- **Reorder N update paralel tanpa transaksi** (seperti admin) → server menomori ulang dan mengembalikan urutan akhir; bila sebagian gagal, klien menerima daftar sebenarnya dari server (spec: kembali ke urutan tersimpan).
- **`SITE_ORIGIN` wajib di produksi** → tanpa nilai ini pemeriksaan `Origin` gagal tertutup (semua penulisan `/kelola` ditolak 403) dan alamat callback SSO menjadi `localhost`. Dicatat di `.env.example` dan prasyarat rilis.
- **Konfigurasi SSO di luar repo** → login tidak akan berfungsi sebelum redirect `/kelola/callback` didaftarkan di layanan SSO. Dicatat sebagai prasyarat di tasks dan di `.env.example`.
- **Gambar IG dirender di browser** → kualitas bergantung peramban; server memvalidasi JPEG dan ukuran, bukan isinya.
- **Perubahan Profil admin masih staged** → bisa hilang bila branch dibersihkan; task terakhir meminta persetujuan pemilik untuk men-commit-nya sebagai arsip.

## Migration Plan

1. Prasyarat sebelum merilis (sama dengan `.env.example`):
   - Env runtime di Dokploy (bukan build arg): `SSO_USERS_URL` (layanan SSO pusat), `SITE_ORIGIN` (origin publik persis, termasuk `https://`, wajib karena pemeriksaan `Origin` dan alamat callback bergantung padanya), dan opsional `IG_USER_ID`, `IG_ACCESS_TOKEN`, `IG_GRAPH_VERSION`, `IG_GRAPH_HOST` (bila `IG_USER_ID`/`IG_ACCESS_TOKEN` kosong, opsi Instagram tersembunyi).
   - Daftarkan `https://<domain>/kelola/callback` sebagai redirect yang diizinkan di layanan SSO.
   - Jalankan satu kontainer saja; invalidasi cache publik hanya berlaku dalam satu proses.
2. Rilis landing page. Rute publik tidak berubah sehingga tidak ada langkah migrasi data; tabel dan bucket yang ada dipakai apa adanya.
3. Uji alur login dengan satu akun admin pada produksi sebelum memberi tahu staf.
4. Admin: tidak ada rilis ulang. Cherry-pick `f602cc7` ke branch baru dari `testing`; branch CMS diarsipkan.

**Rollback**: karena tidak ada perubahan skema atau rute publik, cukup deploy ulang versi sebelumnya; area `/kelola` hilang dan staf kembali tanpa CMS (admin tidak memilikinya di `testing`/`main`). Data tetap utuh.

## Open Questions

- Domain produksi landing page untuk didaftarkan di layanan SSO (diisi oleh pemilik SSO saat menyiapkan prasyarat; tidak mengubah desain).
