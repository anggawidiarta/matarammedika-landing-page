# Spec Delta

## Purpose

Halaman publik tempat pasien Klinik Mataram Medika mengisi survey kepuasan pelanggan: tata letaknya, indikator progres, input skala, alur pengiriman dan layar sukses.

## ADDED Requirements

### Requirement: Judul survey tanpa penanda unit
Judul halaman survey SHALL tampil tanpa kapsul Klinik/Apotek.

#### Scenario: Halaman survey dibuka
- **WHEN** pengunjung membuka `/survey-kepuasan-pelanggan`
- **THEN** judul "Survey Kepuasan Pelanggan" tampil tanpa kapsul Klinik/Apotek di sebelahnya

### Requirement: Lebar konten mengikuti kontainer halaman situs
Konten halaman survey SHALL memakai batas lebar dan padding horizontal yang sama dengan header dan footer situs pada setiap ukuran layar.

#### Scenario: Tepi kiri sejajar header
- **WHEN** halaman survey ditampilkan di lebar layar mana pun
- **THEN** tepi kiri konten sejajar dengan tepi kiri logo di header situs

### Requirement: Tata letak dua kolom di desktop
Pada lebar layar 1024px ke atas, halaman survey SHALL menampilkan panel samping berisi judul, caption dan progres di kiri, serta form di kanan dengan lebar form maksimal 720px.

#### Scenario: Desktop lebar
- **WHEN** halaman ditampilkan pada lebar 1440px
- **THEN** panel samping tampil di kiri dan form di kanan, dan lebar form tidak melebihi 720px

#### Scenario: Panel tetap terlihat saat scroll
- **WHEN** pengguna desktop men-scroll form ke bagian NPS
- **THEN** panel samping beserta progresnya tetap terlihat di bawah header situs tanpa tertutup header

### Requirement: Tata letak satu kolom di mobile
Di bawah lebar 1024px, halaman survey SHALL menampilkan panel judul di atas form dalam satu kolom, dan bar progres SHALL tetap terlihat tepat di bawah header situs saat form di-scroll.

#### Scenario: Scroll di mobile
- **WHEN** pengguna pada lebar 375px men-scroll ke pertanyaan penilaian terakhir
- **THEN** bar progres tetap terlihat tepat di bawah header situs

#### Scenario: Tanpa scroll horizontal
- **WHEN** halaman ditampilkan pada lebar 320px
- **THEN** tidak ada scroll horizontal halaman

### Requirement: Progres menghitung semua isian wajib
Indikator progres SHALL menghitung 8 isian wajib: Layanan, enam aspek penilaian dan NPS.

#### Scenario: Layanan belum dipilih
- **WHEN** keenam aspek penilaian dan NPS sudah diisi tetapi Layanan belum dipilih
- **THEN** progres menampilkan "7 dari 8" dan belum penuh

#### Scenario: Semua isian wajib terisi
- **WHEN** Layanan, keenam aspek penilaian dan NPS sudah diisi
- **THEN** progres menampilkan "8 dari 8" dan penuh

### Requirement: Penilaian aspek ringkas di desktop
Pada lebar 1024px ke atas, setiap aspek penilaian SHALL tampil dalam satu baris dengan label di kiri dan skala 1–5 di kanan. Di layar lebih sempit, label SHALL tampil di atas skala. Tombol skala SHALL berukuran minimal 44x44px di semua lebar.

#### Scenario: Desktop
- **WHEN** bagian penilaian ditampilkan pada lebar 1280px
- **THEN** label setiap aspek dan skala 1–5 berada pada baris yang sama

#### Scenario: Mobile
- **WHEN** bagian penilaian ditampilkan pada lebar 360px
- **THEN** label tampil di atas skala, dan setiap tombol skala berukuran minimal 44x44px

### Requirement: Skala NPS berurutan di layar sempit
Di bawah lebar 1024px, skala NPS SHALL tampil dalam dua baris berurutan, 0–5 lalu 6–10. Pada lebar 1024px ke atas, skala SHALL tampil dalam satu baris 0–10.

#### Scenario: Mobile
- **WHEN** skala NPS ditampilkan pada lebar 375px
- **THEN** baris pertama berisi 0 sampai 5 dan baris kedua berisi 6 sampai 10

#### Scenario: Desktop
- **WHEN** skala NPS ditampilkan pada lebar 1280px
- **THEN** angka 0 sampai 10 tampil dalam satu baris

### Requirement: Persetujuan divalidasi saat mengirim
Tombol Kirim SHALL selalu aktif kecuali saat pengiriman sedang berlangsung. Jika persetujuan belum dicentang saat mengirim, survey SHALL tidak dikirim, pesan kesalahan persetujuan SHALL tampil, dan fokus SHALL dipindah ke checkbox persetujuan.

#### Scenario: Kirim tanpa persetujuan
- **WHEN** semua isian wajib terisi, persetujuan belum dicentang, dan pengguna menekan Kirim
- **THEN** tidak ada permintaan ke server, pesan "Centang persetujuan penggunaan masukan sebelum mengirim." tampil, dan fokus berada di checkbox persetujuan

#### Scenario: Sedang mengirim
- **WHEN** pengiriman sedang berlangsung
- **THEN** tombol Kirim nonaktif dan bertuliskan "Mengirim…"

### Requirement: Layar sukses menerima fokus
Setelah survey berhasil dikirim, halaman SHALL di-scroll ke posisi layar sukses dan fokus SHALL dipindah ke judul layar sukses, sehingga pembaca layar mengumumkannya.

#### Scenario: Kiriman berhasil
- **WHEN** server menerima survey dengan sukses
- **THEN** layar sukses terlihat di viewport dan fokus berada pada judul "Terima kasih atas masukan Anda"

#### Scenario: Gerak dikurangi
- **WHEN** pengguna mengaktifkan preferensi reduced motion dan kiriman berhasil
- **THEN** halaman pindah ke layar sukses tanpa animasi scroll halus
