# Spec Delta

## Purpose

Header keamanan HTTP dan Content Security Policy yang dikirim situs untuk halaman publik, area /kelola dan API. Tujuannya membatasi sumber resource yang boleh dimuat browser dan mencegah halaman dimuat di dalam frame situs lain.

## ADDED Requirements

### Requirement: Header keamanan dasar pada respons server
Setiap respons yang dirender server SHALL membawa `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, dan `Permissions-Policy` yang mematikan kamera, mikrofon dan geolokasi. Ini berlaku untuk halaman publik, /kelola, API dan halaman 404.

#### Scenario: Halaman publik SSR
- **WHEN** pengunjung membuka `/`
- **THEN** respons membawa ketiga header tersebut

#### Scenario: Respons API
- **WHEN** klien memanggil `GET /api/public/layanan`
- **THEN** respons JSON membawa ketiga header tersebut

#### Scenario: Respons error
- **WHEN** klien memanggil `GET /api/kelola/items?module=layanan` tanpa sesi
- **THEN** respons 401 tetap membawa ketiga header tersebut

### Requirement: Halaman server tidak dapat dimuat di dalam frame
Setiap respons yang dirender server SHALL melarang pemuatan dalam frame dari origin mana pun, lewat `X-Frame-Options: DENY` dan CSP `frame-ancestors 'none'`.

#### Scenario: Area /kelola di dalam iframe
- **WHEN** situs lain memuat `/kelola/layanan` di dalam `<iframe>`
- **THEN** browser menolak menampilkan halaman tersebut di dalam frame

#### Scenario: Halaman login /kelola
- **WHEN** situs lain memuat `/kelola/masuk` di dalam `<iframe>`
- **THEN** browser menolak menampilkan halaman tersebut di dalam frame

### Requirement: HSTS hanya di produksi
Di build produksi, respons yang dirender server SHALL membawa `Strict-Transport-Security` dengan `max-age` minimal 180 hari. Di dev server header ini SHALL NOT dikirim.

#### Scenario: Produksi
- **WHEN** situs berjalan dari hasil `npm run build`
- **THEN** respons `/` membawa header `Strict-Transport-Security`

#### Scenario: Dev server
- **WHEN** situs berjalan lewat `astro dev`
- **THEN** respons `/` tidak membawa header `Strict-Transport-Security`

### Requirement: Content Security Policy pada setiap halaman
Setiap halaman HTML, termasuk yang di-prerender, SHALL membawa Content Security Policy. Script SHALL hanya dimuat dari origin sendiri atau script inline yang hash-nya tercantum di policy. Plugin (`object-src`) SHALL dilarang, dan `base-uri` serta `form-action` SHALL dibatasi ke origin sendiri.

#### Scenario: Script inline yang tidak dikenal
- **WHEN** sebuah script inline yang tidak berasal dari build disisipkan ke halaman
- **THEN** browser menolak menjalankannya dan mencatat pelanggaran CSP di console

#### Scenario: Halaman prerender
- **WHEN** pengunjung membuka `/dokter-klinik` atau `/survey-kepuasan-pelanggan`
- **THEN** halaman membawa Content Security Policy

#### Scenario: Script domain luar
- **WHEN** halaman mencoba memuat script dari domain selain origin sendiri
- **THEN** browser memblokir script tersebut

### Requirement: Fungsi situs tetap berjalan di bawah CSP
CSP SHALL mengizinkan semua resource yang dipakai situs: script dan style hasil build, font yang di-host sendiri, gambar dari origin sendiri, Supabase Storage, `data:` dan `blob:`, serta request `fetch` ke origin sendiri. Tidak boleh ada pelanggaran CSP saat situs dipakai normal.

#### Scenario: Halaman publik
- **WHEN** pengunjung membuka setiap halaman publik di build produksi
- **THEN** semua komponen interaktif berfungsi, gambar promo dari Supabase tampil, dan console tidak menampilkan pelanggaran CSP

#### Scenario: Kirim survey
- **WHEN** pengunjung mengisi dan mengirim survey di build produksi
- **THEN** survey terkirim dan layar sukses tampil tanpa pelanggaran CSP

#### Scenario: Preview gambar dan posting Instagram di /kelola
- **WHEN** staf memilih gambar promo baru lalu membuka dialog posting Instagram di build produksi
- **THEN** preview gambar (blob) dan gambar dari Supabase tampil tanpa pelanggaran CSP

#### Scenario: Gambar dari domain lain
- **WHEN** halaman mencoba memuat gambar dari domain selain origin sendiri dan Supabase Storage
- **THEN** browser memblokir gambar tersebut
