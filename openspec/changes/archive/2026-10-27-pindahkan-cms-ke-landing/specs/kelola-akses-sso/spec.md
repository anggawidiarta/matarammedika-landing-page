# Spec Delta

## Purpose

Mengatur akses ke area pengelolaan konten `/kelola` lewat SSO pusat Mataram Medika: siapa yang boleh masuk, bagaimana sesi dijaga, dan bagaimana area itu tetap tersembunyi dari pengunjung publik dan mesin pencari.

## ADDED Requirements

### Requirement: Area kelola tidak ditautkan dari situs publik
Situs publik SHALL NOT menampilkan tautan, menu, atau entri sitemap yang mengarah ke `/kelola`. Semua halaman `/kelola` SHALL mengirim sinyal `noindex` dan tidak boleh di-cache.

#### Scenario: Navigasi publik
- **WHEN** pengunjung membuka beranda, header, footer, atau peta situs
- **THEN** tidak ada tautan atau entri yang mengarah ke `/kelola`

#### Scenario: Respons area kelola
- **WHEN** halaman atau endpoint di bawah `/kelola` atau `/api/kelola` direspons
- **THEN** respons memuat `X-Robots-Tag: noindex, nofollow` dan `Cache-Control: no-store`

### Requirement: Halaman di balik sesi mengarahkan ke login
Setiap halaman `/kelola` selain halaman masuk SHALL mengalihkan pengunjung tanpa sesi valid ke halaman masuk, dengan menyimpan tujuan semula.

#### Scenario: Buka halaman tanpa sesi
- **WHEN** pengunjung tanpa sesi membuka `/kelola/promo`
- **THEN** ia dialihkan ke halaman masuk dan setelah login berhasil kembali ke `/kelola/promo`

#### Scenario: Tujuan di luar area kelola
- **WHEN** parameter tujuan berisi alamat di luar `/kelola`, misalnya `https://contoh.com` atau `//contoh.com`
- **THEN** tujuan diabaikan dan pengguna diarahkan ke `/kelola/layanan` setelah login

### Requirement: Endpoint tulis menolak permintaan tanpa sesi
Setiap endpoint di bawah `/api/kelola` SHALL menolak permintaan tanpa sesi valid dengan status 401 dan tanpa mengubah data.

#### Scenario: Permintaan tanpa sesi
- **WHEN** permintaan `POST` ke endpoint item dikirim tanpa sesi
- **THEN** respons 401 dengan kode `unauthenticated` dan tidak ada baris yang dibuat

#### Scenario: Permintaan lintas asal
- **WHEN** permintaan tulis berasal dari `Origin` yang berbeda dari situs
- **THEN** permintaan ditolak dan tidak ada data yang berubah

### Requirement: Login lewat SSO pusat
Halaman masuk SHALL memulai login dengan mengalihkan pengguna ke layanan SSO untuk aplikasi `admin`, dan setelah pengguna kembali membawa kode, sistem SHALL menukar kode itu di sisi server. Token SSO SHALL NOT dapat dibaca oleh JavaScript di browser.

#### Scenario: Login berhasil
- **WHEN** pengguna memiliki akses `admin` dan kembali dari SSO dengan kode yang valid
- **THEN** sesi dibuat, pengguna masuk ke area kelola, dan namanya tampil di bilah atas

#### Scenario: Kode tidak valid atau kedaluwarsa
- **WHEN** penukaran kode ditolak SSO
- **THEN** pengguna kembali ke halaman masuk dengan pesan bahwa login gagal dan tombol untuk mencoba lagi, tanpa sesi terbentuk

#### Scenario: Layanan SSO tidak dapat dihubungi
- **WHEN** layanan SSO tidak merespons saat penukaran kode
- **THEN** pengguna melihat pesan bahwa layanan masuk sedang tidak tersedia, tanpa detail teknis, dan tanpa sesi terbentuk

### Requirement: Login dilindungi dari pemalsuan callback
Callback login SHALL hanya diterima bila parameter `state` cocok dengan nilai yang dibuat saat login dimulai pada peramban yang sama dan belum kedaluwarsa (10 menit).

#### Scenario: State tidak cocok
- **WHEN** callback dibuka dengan `state` yang salah atau tanpa `state`
- **THEN** callback ditolak, tidak ada sesi terbentuk, dan pengguna kembali ke halaman masuk dengan pesan gagal

#### Scenario: State dipakai ulang
- **WHEN** callback yang sudah berhasil dibuka lagi dengan kode dan `state` yang sama
- **THEN** callback ditolak dan sesi yang ada tidak berubah

### Requirement: Akses dibatasi pada pengguna aplikasi admin
Hanya pengguna SSO yang memiliki akses aplikasi `admin` SHALL dapat membuat sesi. Pengguna SSO lain SHALL ditolak tanpa sesi terbentuk.

#### Scenario: Pengguna tanpa akses admin
- **WHEN** pengguna berhasil login di SSO tetapi tidak memiliki akses `admin`
- **THEN** pengguna kembali ke halaman masuk dengan pesan bahwa akunnya tidak memiliki akses, dan tidak ada sesi terbentuk

#### Scenario: Akses dicabut saat sesi berjalan
- **WHEN** akses `admin` pengguna dicabut di SSO dan sesi lokal masih ada
- **THEN** permintaan berikutnya setelah masa validasi (maksimal 60 detik) ditolak dan pengguna dialihkan ke halaman masuk

### Requirement: Sesi diperpanjang otomatis dan dapat diakhiri
Sistem SHALL memperpanjang sesi memakai refresh token SSO sebelum meminta login ulang, dan keluar SHALL mengakhiri sesi di SSO serta menghapus cookie sesi.

#### Scenario: Token akses kedaluwarsa
- **WHEN** token akses sudah kedaluwarsa tetapi refresh token masih berlaku
- **THEN** permintaan berhasil tanpa pengguna diminta login ulang

#### Scenario: Refresh gagal
- **WHEN** refresh token ditolak SSO
- **THEN** cookie sesi dihapus dan pengguna dialihkan ke halaman masuk dengan pesan sesi berakhir

#### Scenario: Keluar
- **WHEN** pengguna memilih Keluar
- **THEN** sesi berakhir di SSO, cookie sesi dihapus, dan membuka kembali `/kelola/layanan` mengalihkan ke halaman masuk

### Requirement: Halaman masuk aksesibel dan sesuai identitas situs
Halaman masuk SHALL memakai identitas visual situs, menampilkan pesan error dalam bahasa Indonesia yang diumumkan ke pembaca layar, dan dapat dioperasikan penuh dengan keyboard.

#### Scenario: Pesan error terbaca
- **WHEN** halaman masuk dibuka dengan alasan gagal, tanpa akses, atau sesi berakhir
- **THEN** pesan yang sesuai tampil dalam area `role="alert"` dan tombol masuk dapat difokuskan serta diaktifkan dengan keyboard

#### Scenario: Layar sempit
- **WHEN** halaman masuk dibuka pada lebar 360px
- **THEN** tidak ada scroll horizontal dan tombol masuk berukuran minimal 44px
