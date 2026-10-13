# PRD — Clinic CMS & Omnichannel Distribution

- **Versi:** 1.1
- **Status:** Draft untuk implementasi
- **Bahasa:** Indonesia
- **Stack existing:** React + TypeScript, Astro, Supabase, PostgreSQL
- **Tim:** Satu developer
- **Kanal prioritas:** WhatsApp dan Instagram
- **Scope omnichannel MVP:** Distribusi konten; bukan unified inbox

> **Instruksi untuk coding agents:** Dokumen ini adalah sumber konteks produk. Jangan menganggap nama tabel atau endpoint konseptual sebagai skema yang sudah ada. Sebelum mengubah kode, audit repository, instruksi seperti `AGENTS.md`, backend, Supabase schema/migrations, Auth, RLS, Storage, deployment Astro, dan pola testing. Pertahankan konvensi project existing. Jangan melakukan perubahan destruktif pada data atau migrasi produksi tanpa persetujuan eksplisit.

---

## TL;DR

Bangun CMS di dalam aplikasi admin klinik yang sudah ada. Pertahankan React + TypeScript untuk admin, Astro untuk landing page, dan Supabase/PostgreSQL sebagai fondasi backend. CMS mengelola konten editorial, membaca data dokter/layanan/fasilitas dari modul operasional yang menjadi sumber otoritatif, menerbitkan konten ke Astro, dan mendistribusikan versi konten yang sesuai ke WhatsApp serta Instagram.

Prinsip inti:

1. **Perluas backend/Supabase existing.** Jangan membuat backend CMS kedua atau microservices tanpa alasan yang tervalidasi.
2. **Jangan menduplikasi sumber data operasional.** Dokter, layanan, dan fasilitas tetap bersumber dari modul existing.
3. **Pisahkan konten utama, versi yang disetujui, variasi kanal, job distribusi, dan percobaan pengiriman.**
4. **API publik hanya boleh mengembalikan konten yang telah dipublikasikan.**
5. **Jangan mengekspos service-role key atau token Meta di frontend.**
6. **Status harus per kanal.** Sukses di Instagram tidak berarti sukses di WhatsApp.
7. **Mulai dari CMS dan publikasi Astro**, kemudian selesaikan integrasi kanal setelah akun dan izin provider terverifikasi.
8. **MVP hanya untuk distribusi konten.** Unified inbox, chatbot, dan profil pasien terpadu tidak termasuk.

## 1. Ringkasan produk

Clinic CMS & Omnichannel Distribution adalah modul dalam aplikasi admin klinik untuk mengelola konten company profile secara terpusat, memublikasikannya ke landing page Astro, serta mendistribusikan konten terpilih ke WhatsApp dan Instagram.

### Masalah yang diselesaikan

- Pembaruan konten rutin terlalu bergantung pada developer.
- Konten harus disusun ulang secara manual untuk berbagai kanal.
- Draft, approval, publikasi, dan status pengiriman tidak mudah dipantau.
- Data dokter dan layanan berisiko tidak konsisten jika diduplikasi.
- Kegagalan distribusi perlu tercatat dan dapat ditindaklanjuti.

### Tujuan dan indikator keberhasilan

| ID | Tujuan | Indikator |
|---|---|---|
| G-01 | Mengurangi ketergantungan pada developer | Staf dapat memperbarui konten standar tanpa perubahan kode. |
| G-02 | Memusatkan pengelolaan | Konten dalam scope dikelola melalui aplikasi admin. |
| G-03 | Mempermudah distribusi | Konten dapat ditargetkan ke kanal yang sudah terhubung. |
| G-04 | Menjaga konsistensi | Data operasional menggunakan sumber otoritatif yang ditetapkan. |
| G-05 | Meningkatkan keterlacakan | Versi, status publikasi, dan status pengiriman dapat ditelusuri. |

Target numerik belum ditetapkan. Ukur baseline terlebih dahulu. Target pilot yang dapat dipertimbangkan: 80% pembaruan konten standar tidak membutuhkan developer; pengurangan 50% waktu pembaruan; seluruh publikasi dan kegagalan distribusi yang terdeteksi memiliki catatan status. Angka ini adalah usulan, bukan hasil terukur.

## 2. Pengguna dan akses

| Role | Tanggung jawab |
|---|---|
| System Administrator | Mengelola pengguna/role, konfigurasi CMS, integrasi kanal, dan audit. |
| Content Editor | Membuat/mengedit konten, mengunggah media, menyiapkan variasi kanal, dan mengajukan review. |
| Approver | Menyetujui, menolak, atau meminta revisi dengan catatan. |
| Viewer/Management | Melihat kalender, status distribusi, dan laporan; tanpa hak edit secara default. |

Persyaratan:
- Terapkan prinsip least privilege.
- Pembuat konten tidak otomatis menjadi approver.
- Otorisasi harus ditegakkan di backend/database, bukan hanya dengan menyembunyikan UI.
- Gunakan sistem autentikasi existing jika memungkinkan; audit Supabase Auth dan pola autentikasi sebelum mengubahnya.

## 3. Scope

### Termasuk MVP

- CRUD konten artikel/berita, pengumuman, dan halaman company profile.
- Structured content, slug, SEO metadata, media library.
- Relasi ke dokter, layanan, dan fasilitas dari modul operasional.
- Draft, review, approval, preview, publish, unpublish, version history, dan audit log.
- API konten publik untuk Astro.
- Cache invalidation, rebuild, atau revalidation sesuai cara Astro dideploy.
- Variasi konten untuk WhatsApp dan Instagram.
- Distribusi langsung/terjadwal.
- Status per kanal, pencatatan error, retry yang aman, dan ringkasan distribusi.
- Penyimpanan media melalui Supabase Storage atau sistem media existing yang sesuai.

### Tidak termasuk MVP

- Unified inbox untuk membalas pesan masuk.
- Chatbot AI atau publikasi otomatis tanpa approval.
- Customer data platform atau profil pasien terpadu lintas kanal.
- Otomasi kampanye kompleks dan segmentasi perilaku.
- Pengiriman informasi medis individual melalui modul pemasaran.
- Semua format Instagram sebelum dukungan API masing-masing diverifikasi.

## 4. Tipe konten

| Tipe | Field/catatan |
|---|---|
| Dokter | Nama, spesialisasi, foto, bio, jadwal; data utama tetap dari modul operasional bila tersedia. |
| Layanan | Nama, deskripsi, manfaat, gambar, CTA; relasikan ke layanan existing. |
| Fasilitas | Nama, deskripsi, foto, lokasi. |
| Artikel/berita | Judul, slug, body, thumbnail, penulis, SEO metadata. |
| Pengumuman | Judul, isi, periode tayang, prioritas. |
| Halaman statis | Hero, section, CTA, SEO metadata. |
| Survei kepuasan | Definisi survei/periode/tautan; jawaban responden disimpan dan diamankan terpisah. |

Gunakan structured content untuk entitas yang digunakan kembali. Jangan menyimpan seluruh website sebagai satu field HTML bebas. Jangan membuat sumber data tandingan untuk dokter, layanan, jadwal, atau fasilitas jika modul operasional sudah menjadi sumber otoritatif.

## 5. Functional requirements

| ID | Persyaratan | Prioritas |
|---|---|---|
| CMS-01 | CRUD, pencarian, filter, pagination, dan arsip konten | Must |
| CMS-02 | Field terstruktur, slug, SEO, media, dan relasi data | Must |
| CMS-03 | Draft, approval, preview, publish, unpublish | Must |
| CMS-04 | Version history dan audit log | Must |
| WEB-01 | API publik hanya menyajikan konten published | Must |
| WEB-02 | Cache invalidation/rebuild/revalidation sesuai deployment Astro | Must |
| DIST-01 | Koneksi akun dan validasi kesiapan kanal | Must untuk distribusi otomatis |
| DIST-02 | Variasi konten per kanal dan validasi format | Must |
| DIST-03 | Pengiriman langsung dan penjadwalan | Must |
| DIST-04 | Status per kanal, provider reference, error, dan retry | Must |
| DIST-05 | Ringkasan distribusi dan tindakan manual untuk kegagalan | Should |
| SEC-01 | RBAC, secret management, dan validasi backend | Must |

## 6. Rekomendasi arsitektur

### Prinsip

Gunakan **modular monolith** di backend/Supabase existing. Pisahkan tanggung jawab secara logis. Worker boleh dijalankan sebagai proses terpisah jika dibutuhkan, tetapi tidak perlu memecah semua modul menjadi microservices.

### Komponen

- **React + TypeScript:** CMS UI, approval, preview, jadwal, dashboard distribusi.
- **Supabase PostgreSQL:** data konten, versi, approval, publikasi, job, attempt, dan audit.
- **Supabase Auth:** autentikasi pengguna jika sesuai dengan sistem existing.
- **RLS:** lapisan pertahanan tambahan untuk akses data; bukan satu-satunya enforcement workflow.
- **Supabase Storage:** media CMS, dengan bucket dan policies yang sesuai untuk media publik/privat.
- **Supabase Edge Functions:** endpoint server-side atau adapter ringan yang membutuhkan secret, jika cocok dengan runtime dan pola deployment.
- **Scheduler/worker:** memproses job terjadwal, retry, dan callback/webhook. Harus ada persistensi job, locking/claim, timeout, dan recovery.
- **Astro:** mengambil konten publik dari API/query terbatas; preview draft lewat jalur terproteksi.
- **Channel adapters:** lapisan integrasi untuk WhatsApp dan Instagram agar detail provider tidak tersebar ke logika CMS.

### Supabase: batas dan pertimbangan

1. Audit repository, tabel, migrations, Auth, RLS, Storage, Edge Functions, dan deployment sebelum membuat perubahan.
2. Jangan mengekspos service-role key atau token Meta di browser.
3. Validasi role dan transisi workflow di server-side. RLS tetap harus diuji, tetapi tidak otomatis menjamin workflow approval aman.
4. Jangan menganggap scheduled Edge Function sama dengan queue worker yang persisten dan andal.
5. Antrean berbasis PostgreSQL dapat dipertimbangkan untuk MVP jika klaim job, konkurensi, retry, dan recovery dirancang benar. Jika project sudah memiliki queue yang stabil, gunakan yang ada.
6. Gunakan migrasi terkontrol dan regression test agar modul CMS tidak mengganggu transaksi klinik.
7. Pisahkan konten publik dari data pasien, pembayaran, dan rekam medis.

## 7. Model data konseptual

Nama berikut adalah usulan, bukan asumsi bahwa tabel belum ada. Audit skema existing dan konvensi repository sebelum membuat migration.

| Entitas | Tanggung jawab |
|---|---|
| `content_items` | Identitas konten dan metadata umum. |
| `content_versions` | Snapshot revisi konten. |
| `content_relations` | Referensi ke dokter, layanan, dan fasilitas existing. |
| `media_assets` | Metadata media, alt text, lokasi Storage, status penggunaan. |
| `approval_records` | Reviewer, keputusan, waktu, komentar. |
| `publication_records` | Status publikasi website dan versi yang dipublikasikan. |
| `channel_accounts` | Referensi akun/provider dan status koneksi; secret disimpan aman di server. |
| `channel_content_variants` | Konten khusus kanal yang mengacu ke versi sumber. |
| `distribution_jobs` | Kanal, versi, jadwal target, status, dan informasi klaim job. |
| `distribution_attempts` | Setiap percobaan, waktu, response/provider ID, dan error yang disanitasi. |
| `audit_logs` | Actor, aksi, waktu, dan objek yang terdampak. |

Data dokter/layanan/fasilitas tetap berada di sumber operasional. CMS hanya menyimpan referensi dan field editorial yang memang menjadi tanggung jawab CMS.

## 8. Workflow dan business rules

### Workflow konseptual

`Draft → In Review → Approved → Publish Now / Scheduled → Published`

Revisi dapat mengembalikan konten ke review. Konten yang sudah terbit dapat di-unpublish atau diarsipkan sesuai kebijakan.

### Aturan bisnis

1. Approval tidak sama dengan keberhasilan publikasi atau pengiriman.
2. Status distribusi dicatat per kanal.
3. Perubahan material pada variasi kanal setelah approval harus memicu review ulang sesuai kebijakan.
4. Retry harus idempotent bila provider mendukung. Untuk hasil yang tidak pasti, hindari retry buta yang dapat menghasilkan duplikat.
5. Unpublish website tidak otomatis menghapus posting/pesan eksternal.
6. Job terjadwal dapat dibatalkan, dipulihkan setelah restart, dan dipantau jika terlambat.
7. Gunakan timezone eksplisit untuk penjadwalan.
8. Catat versi konten yang benar-benar dikirim agar perubahan selanjutnya dapat ditelusuri.
9. Status `sent` tidak boleh dianggap berarti pesan dibaca atau konten dilihat.

## 9. Persyaratan provider

### WhatsApp

Preferensi produksi: **WhatsApp Cloud API resmi dari Meta**.

- Tidak ada biaya lisensi API dasar, tetapi biaya pesan tertentu dapat berlaku sesuai ketentuan Meta.
- Perlu validasi akun, izin, token, dan kebijakan provider.
- Pesan yang memulai percakapan bisnis dapat memerlukan template yang disetujui; aturan berbeda berlaku di dalam jendela layanan pelanggan.
- Hormati opt-in, opt-out, dan kebijakan pesan.
- Catat provider message ID serta status yang tersedia melalui response/webhook.
- Batasi MVP pada pengumuman/konten publik. Jangan memasukkan informasi medis individual atau rekam medis ke modul pemasaran.

Library tidak resmi seperti Baileys mungkin gratis dan berguna untuk eksperimen, tetapi tidak direkomendasikan untuk nomor utama klinik karena risiko perubahan protokol, gangguan session, dan pemblokiran akun.

Dokumentasi resmi: https://developers.facebook.com/docs/whatsapp/cloud-api/

### Instagram

Preferensi produksi: **Instagram API resmi dari Meta**.

- Tidak ada biaya lisensi API pihak ketiga yang wajib untuk menggunakan API resmi.
- Perlu akun profesional, aplikasi, token, permission, dan setup yang sesuai.
- Verifikasi kemampuan publishing dan izin pada akun klinik yang sebenarnya.
- Mulai dengan format posting yang telah diuji.
- Jangan menjanjikan dukungan Stories, Reels, atau carousel sebelum jalur API yang dipilih diverifikasi.
- Catat media/post ID dan status yang tersedia.
- Sediakan prosedur reconnect jika token kedaluwarsa.

Dokumentasi: https://developers.facebook.com/docs/instagram-platform/

**Catatan biaya:** “gratis” berarti tidak ada biaya lisensi API dasar. Infrastruktur, hosting, storage, penggunaan Supabase, dan biaya pesan WhatsApp tertentu tetap dapat berlaku. Harga, permission, dan kebijakan provider dapat berubah; verifikasi sebelum rilis.

### Distribusi multi-kanal

Satu konten dapat memiliki satu job untuk Astro, satu job untuk Instagram, dan satu job untuk WhatsApp. Job harus independen sehingga kegagalan pada satu kanal tidak menggagalkan kanal lainnya.

## 10. Astro publishing contract

Endpoint berikut adalah contoh konseptual; periksa endpoint existing sebelum menambah yang baru.

- `GET /api/public/doctors`
- `GET /api/public/services`
- `GET /api/public/facilities`
- `GET /api/public/articles`
- `GET /api/public/articles/:slug`

Persyaratan:
- Hanya konten published yang dapat diakses.
- Jangan serialisasi field internal/sensitif.
- Preview menggunakan autentikasi terpisah.
- Perubahan publish/unpublish memicu mekanisme refresh yang sesuai dengan mode rendering/deployment Astro.
- Terapkan pagination, validasi parameter, dan error response yang konsisten.
- Jangan memberi akses luas ke database hanya karena Astro dan admin memakai Supabase.

## 11. Non-functional requirements

| Area | Persyaratan |
|---|---|
| Security | RBAC, secret management, input validation, preview terproteksi, RLS yang diuji. |
| Reliability | Job persisten, recovery setelah restart, timeout, retry terbatas, isolasi kegagalan per kanal. |
| Performance | Pagination, query efisien, cache, dan media delivery sesuai kebutuhan. |
| Consistency | Versi yang disetujui dapat ditelusuri ke versi yang dipublikasikan/dikirim. |
| Observability | Log terstruktur, metrik job, status token, error provider. |
| Privacy | Minimalkan data penerima; pisahkan survei dan data pasien dari konten publik. |
| Maintainability | Modul dan adapter provider memiliki batas tanggung jawab yang jelas. |
| Recovery | Backup, migration, dan rollback mengikuti praktik project existing. |

## 12. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Akses API provider belum siap | Distribusi otomatis tertunda | Validasi akun, izin, dan onboarding di awal. |
| Backend existing terikat erat | Regresi pada admin | Modul terisolasi, migrasi bertahap, regression test. |
| Data operasional berubah | Konten publik usang | Tetapkan sumber otoritatif dan strategi refresh. |
| Job hilang/duplikat | Pengiriman terlewat/ganda | Queue persisten, locking, idempotency, recovery. |
| Rate limit/downtime | Pengiriman tertunda | Backoff, retry terbatas, status error, tindakan manual. |
| Konten salah tayang | Informasi klinik tidak akurat | Approval, preview, audit, prosedur koreksi. |
| Beban solo developer | Scope creep | Satu vertical slice, batasi tipe konten dan format kanal. |
| Credential bocor | Akun kanal disalahgunakan | Secret server-side, redaksi log, rotasi/reconnect. |
| Cache Astro stale | Konten tidak terbarui | Uji mekanisme invalidation/rebuild/revalidation sejak awal. |

## 13. Roadmap

Estimasi awal untuk satu developer, perlu diperbarui setelah audit teknis.

| Fase | Estimasi | Deliverable |
|---|---|---|
| 1. Discovery & technical spike | 3–5 hari kerja | Audit Supabase/Auth/RLS/Storage, data existing, deployment Astro, kesiapan akun Meta. |
| 2. CMS foundation | 1–2 minggu | Model konten, CRUD, media, relasi data, permission. |
| 3. Workflow & Astro | 1–2 minggu | Approval, versioning, API publik, preview, cache refresh. |
| 4. Distribution engine | 1–2 minggu | Job persisten, scheduler/worker, adapter, status, retry. |
| 5. Integrasi & rilis | 1–2 minggu | Uji provider nyata, security/regression test, monitoring, pilot. |

Total kasar: 5–9 minggu kerja, jika backend cukup siap dan onboarding provider tidak mengalami hambatan besar. Proses onboarding provider dapat berjalan paralel.

## 14. Acceptance criteria

- [ ] Editor dapat mengelola konten tanpa perubahan kode Astro.
- [ ] Dokter/layanan/fasilitas tetap menggunakan sumber data operasional yang ditetapkan.
- [ ] Draft tidak dapat diakses melalui endpoint publik.
- [ ] Approval dan tindakan publish dapat diaudit.
- [ ] Konten published tampil di Astro sesuai target pembaruan yang disepakati.
- [ ] Variasi konten dapat dibuat untuk WhatsApp dan Instagram.
- [ ] Distribusi membuat job independen per kanal.
- [ ] Job terjadwal tetap tersimpan dan dapat diproses setelah worker restart.
- [ ] Kegagalan satu kanal tidak menggagalkan kanal lain.
- [ ] Status, provider reference, dan error yang tersedia dapat ditelusuri.
- [ ] Retry ditangani dengan aman; duplikasi diminimalkan dan kasus ambigu tidak di-retry secara buta.
- [ ] Token tidak terekspos di frontend maupun log.
- [ ] Regression test tidak menemukan kerusakan pada alur admin existing.
- [ ] Fitur distribusi otomatis baru dinyatakan siap setelah diuji pada akun provider yang benar-benar akan digunakan.

## 15. Rekomendasi implementasi

1. Audit repository, skema PostgreSQL, migrations, Supabase Auth/RLS/Storage/Edge Functions, serta mode deployment Astro.
2. Bangun satu vertical slice: editor membuat pengumuman → approver menyetujui → API memublikasikan → konten tampil di Astro.
3. Validasi cache/rebuild/unpublish dan akses draft.
4. Tambahkan persistent distribution jobs, worker, status, retry, dan audit.
5. Integrasikan WhatsApp Cloud API dan Instagram API resmi, setelah akun/izin diverifikasi.
6. Pilot dengan satu nomor WhatsApp dan satu akun Instagram; pantau kegagalan sebelum memperluas penggunaan.

Jangan mulai dari microservices atau unified inbox. Untuk satu developer, pendekatan paling terkendali adalah modular monolith, Supabase existing, satu alur end-to-end yang terbukti, lalu menambahkan integrasi kanal secara bertahap.

---

## Catatan untuk coding agents

Sebelum melakukan implementasi:
- Baca instruksi repository seperti `AGENTS.md`, README, dan dokumentasi internal jika ada.
- Identifikasi framework backend dan pola penggunaan Supabase yang sebenarnya.
- Periksa schema/migrations serta RLS policies sebelum menambah tabel.
- Cari ulang endpoint existing sebelum membuat endpoint baru.
- Pertahankan gaya kode, struktur folder, naming, testing, dan mekanisme deployment existing.
- Jangan menyimpan secrets dalam source code, file frontend, atau log.
- Jangan mengubah data produksi atau menjalankan migration destruktif tanpa persetujuan eksplisit.
- Implementasikan secara bertahap dan laporkan asumsi, file yang berubah, migration, pengujian, dan risiko yang belum terselesaikan.
- Jika requirement bertentangan dengan implementasi existing atau tidak cukup jelas, berhenti pada keputusan tersebut dan ajukan pertanyaan daripada menebak.
