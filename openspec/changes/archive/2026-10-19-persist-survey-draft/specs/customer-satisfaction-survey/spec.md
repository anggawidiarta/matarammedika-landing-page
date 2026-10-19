# Spec Delta

## ADDED Requirements

### Requirement: Draf isian dipulihkan dalam tab yang sama
Isian survey SHALL disimpan sementara di browser setiap kali berubah dan dipulihkan saat halaman dimuat ulang pada tab yang sama. Isian yang disimpan adalah nama, tanggal kunjungan, layanan, penilaian setiap aspek, NPS dan saran.

#### Scenario: Muat ulang halaman
- **WHEN** pengguna mengisi nama, layanan, penilaian, NPS dan saran lalu memuat ulang halaman
- **THEN** semua isian tersebut terisi kembali dan progres menampilkan jumlah yang sama seperti sebelum dimuat ulang

#### Scenario: Tab lain
- **WHEN** pengguna membuka halaman survey di tab atau jendela baru
- **THEN** form tampil kosong tanpa isian dari tab sebelumnya

### Requirement: Persetujuan tidak disimpan
Status persetujuan penggunaan masukan SHALL NOT disimpan sebagai bagian dari draf.

#### Scenario: Muat ulang setelah mencentang persetujuan
- **WHEN** pengguna mencentang persetujuan lalu memuat ulang halaman
- **THEN** isian lain dipulihkan tetapi persetujuan kembali tidak tercentang

### Requirement: Draf dihapus setelah selesai
Draf SHALL dihapus saat survey berhasil dikirim dan saat pengguna memilih "Isi lagi".

#### Scenario: Kiriman berhasil
- **WHEN** server menerima survey dengan sukses lalu pengguna memuat ulang halaman
- **THEN** form tampil kosong dan tidak ada draf tersimpan

#### Scenario: Isi lagi
- **WHEN** pengguna menekan "Isi lagi" pada layar sukses
- **THEN** form kosong dan tidak ada draf tersimpan

#### Scenario: Kiriman gagal
- **WHEN** pengiriman gagal karena kesalahan server atau jaringan
- **THEN** isian dan draf tetap ada sehingga pengguna dapat mengirim ulang

### Requirement: Draf tidak valid diabaikan
Isi draf SHALL divalidasi setiap kali dimuat. Nilai yang tidak valid SHALL diabaikan per bidang, dan draf yang tidak terbaca atau storage yang tidak tersedia SHALL NOT menghalangi form dipakai.

#### Scenario: Nilai di luar rentang
- **WHEN** draf berisi layanan di luar pilihan yang ada, NPS di atas 10, penilaian di luar 1–5, atau tanggal yang formatnya salah
- **THEN** bidang yang tidak valid tampil kosong (tanggal kembali ke hari ini) dan bidang lain yang valid tetap dipulihkan

#### Scenario: Teks melebihi batas
- **WHEN** draf berisi nama atau saran lebih panjang dari batas karakter form
- **THEN** teks dipotong sesuai batas tersebut

#### Scenario: Draf rusak
- **WHEN** isi draf bukan data yang dapat dibaca
- **THEN** form tampil kosong tanpa pesan kesalahan

#### Scenario: Storage diblokir
- **WHEN** browser memblokir penyimpanan sementara
- **THEN** form tetap dapat diisi dan dikirim seperti biasa tanpa pemulihan draf

### Requirement: Draf kosong tidak disimpan
Draf yang hanya berisi tanggal otomatis SHALL NOT disimpan.

#### Scenario: Form belum disentuh
- **WHEN** pengguna membuka halaman dan tidak mengisi apa pun
- **THEN** tidak ada draf tersimpan di browser
