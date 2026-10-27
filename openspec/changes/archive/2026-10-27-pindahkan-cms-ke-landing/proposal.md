# Proposal

## Why

Konten yang tampil di landing page (Layanan, Fasilitas, Profil, Promo) saat ini diubah lewat aplikasi admin yang terpisah. Staf klinik tidak bisa melihat hasilnya sebelum membuka situs publik, dan perubahan yang sudah disimpan baru terlihat setelah cache server kedaluwarsa. Fitur CMS di admin juga belum pernah dirilis (hanya ada di branch `feature/content-management-system`), sehingga memindahkannya sekarang tidak memutus alur kerja yang sudah berjalan. Dengan CMS berada di aplikasi yang menampilkan kontennya, pihak klinik mengelola konten dari satu tempat dengan pratinjau yang identik dengan situs publik, dan admin kembali fokus pada operasional klinik.

## What Changes

- Tambah area pengelolaan konten tersembunyi di `/kelola` (tanpa tautan dari navigasi, header, footer, atau sitemap, dan bertanda `noindex`).
- Login memakai SSO pusat yang sama dengan admin: pengguna diarahkan ke layanan SSO, kembali membawa kode, lalu server Astro menukar kode itu dan memasang sesi di cookie `httpOnly`. Akses diberikan kepada pengguna yang memiliki app key `admin`.
- Pindahkan empat modul CMS dari admin dengan perilaku yang sama: Layanan, Fasilitas, Profil (Klinik/Apotek) dan Promo. Mencakup tambah, ubah, pindah section, urutkan ulang, publikasikan/sembunyikan, hapus (soft delete) dan unggah gambar promo.
- Pindahkan posting promo ke Instagram. Panggilan Graph API dan token Meta berpindah ke server; browser hanya merender gambar 1080×1350 dan mengirimnya.
- Semua penulisan data lewat endpoint server di `/api/kelola/*` dengan validasi zod yang mencerminkan CHECK constraint di database. Browser tidak lagi memegang token Supabase.
- Pratinjau di form memakai komponen publik asli (`IconFeatureCard`, `PromoCard`) sehingga identik dengan tampilan situs.
- Setiap perubahan yang tersimpan langsung menyegarkan cache publik pada proses server yang sama.
- Tampilan mengikuti identitas desain landing page ("The Bright Waiting Room"): desktop-first dengan tabel, dan daftar kartu yang tetap bisa dipakai penuh di layar ≤ 640px.
- Perbaiki `Segmented` (pemilih Klinik/Apotek) agar dapat dioperasikan dengan keyboard; temuan P0 dari critique ProfilPage, dan dipakai juga di halaman Profil CMS.
- Di repo `matarammedika-admin`: branch CMS dibiarkan sebagai arsip (tidak di-merge) dan fix `CurrencyInput` (`f602cc7`) di-cherry-pick ke branch baru dari `testing`.

Di luar lingkup:

- Modul konten yang masih hardcode: Dokter, Hero beranda, Kontak/footer, Instagram/Facebook footer, logo asuransi.
- Sistem role atau permission granular; hak akses cukup app key `admin`.
- Perubahan skema tabel `cms_items` atau `cms_promo_instagram_posts`, dan perubahan pada layanan SSO.
- Perubahan pada branch `testing`/`main` admin selain cherry-pick fix `CurrencyInput`, serta penghapusan branch CMS admin.
- Penjadwalan posting Instagram dan jenis konten IG selain satu foto.

## Capabilities

### New Capabilities

- `kelola-akses-sso`: Gerbang masuk tersembunyi ke area `/kelola` lewat SSO pusat, mencakup alur login/logout, sesi cookie, pembatasan app key `admin`, penolakan akses tanpa sesi, dan perlindungan area dari indeks mesin pencari.
- `kelola-konten`: Pengelolaan konten Layanan, Fasilitas, Profil dan Promo oleh staf, mencakup validasi, urutan, status publikasi, soft delete, unggah gambar promo, pratinjau, antarmuka responsif yang aksesibel, dan penyegaran cache publik setelah perubahan.
- `kelola-promo-instagram`: Posting promo ke Instagram dari server, mencakup status posting, pencegahan posting ganda, pemulihan posting yang macet, dan perilaku saat kredensial Instagram tidak dikonfigurasi.

### Modified Capabilities

<!-- Belum ada spec lain yang berubah. Satu-satunya spec tercatat adalah customer-satisfaction-survey dan tidak tersentuh. -->

## Impact

- **Kode baru**: `src/middleware.ts`, `src/lib/kelola/**`, `src/pages/kelola/**`, `src/pages/api/kelola/**`, `src/layouts/KelolaLayout.astro`, `src/components/kelola/**`, `.env.example`.
- **Kode diubah**: `astro.config.mjs` (skema env), `src/lib/cms/ttlCache.ts` (registry invalidasi), `src/components/shared/ui/Segmented.tsx` (keyboard), `src/lib/cms/promoDisplay.ts` (formatter bila perlu), `openspec/config.yaml` (konteks: CMS kini dikelola di repo ini dan tidak ada fallback statis), `PRODUCT.md`/`DESIGN.md` (catat surface `/kelola`).
- **Performa**: JS yang dikirim ke halaman publik tidak bertambah. Island React untuk `/kelola` hanya diimpor dari halaman `/kelola`, jadi tidak masuk ke bundel halaman publik. Tidak ada font baru. Gambar promo tetap lewat bucket `Klinik` yang sama.
- **Privasi/keamanan**: Endpoint tulis memakai service-role key sehingga RLS tidak berlaku; karena itu setiap endpoint wajib memeriksa sesi SSO, memvalidasi payload dengan zod, membatasi ukuran body, dan membatasi `module`/`source` sendiri. Token SSO disimpan hanya di cookie `httpOnly`. Callback memakai `state` dan hanya menerima tujuan `next` di bawah `/kelola` (anti open-redirect). Token Meta pindah dari bundel browser admin ke env server. Respons `/kelola*` memakai `Cache-Control: no-store` dan `X-Robots-Tag: noindex`.
- **Konfigurasi baru**: env server `SSO_USERS_URL` dan `SITE_ORIGIN` (alamat publik untuk callback SSO), serta `IG_USER_ID`, `IG_ACCESS_TOKEN`, `IG_GRAPH_VERSION`, `IG_GRAPH_HOST` (opsional; bila IG kosong, opsi Instagram disembunyikan). Dokploy perlu menambahkan env ini saat runtime.
- **Ketergantungan eksternal**: layanan SSO di repo lain harus mengizinkan redirect `https://<domain-landing>/kelola/callback` (dan `http://localhost:4321/kelola/callback` untuk dev). Ini di luar repo ini dan dilakukan pemilik layanan SSO.
- **matarammedika-admin**: tidak ada perubahan di `testing`/`main`. Branch `feature/content-management-system` diarsipkan sebagai referensi porting; perubahan Profil yang masih staged perlu di-commit di sana dengan persetujuan pemilik.
- **Skema Supabase**: tidak berubah. Tabel dan RLS yang ada dipakai apa adanya; `requested_by` pada `cms_promo_instagram_posts` dibiarkan kosong karena service role tidak punya `auth.uid()`.
- **Dependensi**: tidak ada penambahan. zod, React, lucide-react dan Tailwind yang sudah ada mencukupi.
