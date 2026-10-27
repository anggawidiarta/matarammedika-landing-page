# Spec Delta

## Purpose

Memungkinkan staf memposting promo ke akun Instagram klinik dari area kelola, dengan kredensial Instagram hanya berada di server dan status tiap percobaan posting tercatat.

## ADDED Requirements

### Requirement: Opsi Instagram bergantung pada konfigurasi
Opsi posting ke Instagram SHALL hanya tampil bila kredensial Instagram terkonfigurasi di server. Nilai kredensial SHALL NOT pernah dikirim ke browser.

#### Scenario: Kredensial tersedia
- **WHEN** staf membuka form promo dan kredensial Instagram terkonfigurasi
- **THEN** opsi "Posting juga ke Instagram" beserta kolom keterangan tampil

#### Scenario: Kredensial tidak ada
- **WHEN** kredensial Instagram tidak terkonfigurasi
- **THEN** opsi Instagram tidak tampil dan permintaan posting langsung ke endpoint ditolak dengan galat umum

#### Scenario: Kredensial tidak bocor
- **WHEN** sumber halaman, respons API, atau bundel JavaScript kelola diperiksa
- **THEN** token Instagram tidak ditemukan di dalamnya

### Requirement: Keterangan posting divalidasi
Keterangan (caption) SHALL berisi 1–2200 karakter dengan paling banyak 30 tagar, dan SHALL dapat disusun otomatis dari data promo sebelum disunting staf.

#### Scenario: Keterangan terlalu panjang
- **WHEN** staf mengisi keterangan lebih dari 2200 karakter atau lebih dari 30 tagar
- **THEN** posting ditolak dengan pesan yang menyebut batasnya dan keterangan tidak hilang

#### Scenario: Keterangan otomatis
- **WHEN** staf mengaktifkan opsi Instagram pada promo yang sudah terisi
- **THEN** kolom keterangan terisi usulan dari judul, harga dan periode promo yang dapat disunting

### Requirement: Gambar posting berformat potret 4:5
Gambar yang dikirim ke Instagram SHALL berukuran 1080×1350 piksel berformat JPEG, dibuat dari gambar promo dengan latar putih, dan SHALL ditampilkan sebagai pratinjau sebelum diposting.

#### Scenario: Pratinjau
- **WHEN** staf membuka dialog posting Instagram
- **THEN** pratinjau 4:5 dari gambar yang akan diposting tampil

#### Scenario: Berkas dari klien tidak sesuai
- **WHEN** server menerima gambar posting yang bukan JPEG atau melebihi batas ukuran
- **THEN** posting ditolak dan tidak ada panggilan ke Instagram

### Requirement: Posting bersamaan dengan penyimpanan promo
Staf SHALL dapat memposting ke Instagram saat menyimpan promo. Kegagalan posting SHALL NOT membatalkan penyimpanan promo, dan staf SHALL diberi tahu bahwa promo tersimpan tetapi posting gagal.

#### Scenario: Simpan dan posting berhasil
- **WHEN** staf menyimpan promo dengan opsi Instagram aktif dan Instagram menerima posting
- **THEN** promo tersimpan, status posting menjadi Terposting, dan tautan ke posting tampil

#### Scenario: Posting gagal
- **WHEN** promo tersimpan tetapi Instagram menolak posting
- **THEN** promo tetap tersimpan, status posting menjadi Gagal dengan alasan singkat yang aman, dan staf dapat mencoba lagi

#### Scenario: Instagram tidak merespons
- **WHEN** Instagram tidak selesai memproses media dalam batas waktu
- **THEN** status posting menjadi Gagal dengan pesan batas waktu, dan sistem tidak menunggu tanpa batas

### Requirement: Posting ulang dari daftar promo
Staf SHALL dapat memposting ulang atau mencoba lagi sebuah promo dari daftar lewat dialog yang menampilkan keterangan dan pratinjau. Setiap percobaan SHALL tercatat dengan status Sedang diposting, Terposting, atau Gagal.

#### Scenario: Coba lagi setelah gagal
- **WHEN** staf membuka dialog pada promo berstatus Gagal dan mengirim ulang
- **THEN** percobaan baru tercatat dan status terbaru tampil di baris promo

#### Scenario: Status pada daftar
- **WHEN** daftar promo ditampilkan
- **THEN** tiap promo menampilkan status posting terbaru, dan status Terposting menyertakan tautan ke Instagram

### Requirement: Tidak ada posting ganda bersamaan
Sistem SHALL mencegah dua posting berjalan bersamaan untuk promo yang sama, dan posting yang berstatus Sedang diposting lebih dari 5 menit SHALL dianggap macet dan ditandai Gagal sebelum percobaan baru dimulai.

#### Scenario: Posting sedang berjalan
- **WHEN** staf memicu posting untuk promo yang sedang diposting kurang dari 5 menit
- **THEN** permintaan ditolak dengan pesan bahwa promo sedang diposting dan tidak ada panggilan baru ke Instagram

#### Scenario: Posting macet
- **WHEN** staf memicu posting untuk promo yang berstatus Sedang diposting lebih dari 5 menit
- **THEN** percobaan lama ditandai Gagal dan percobaan baru dimulai

### Requirement: Dialog Instagram aksesibel
Dialog dan status posting SHALL dapat dioperasikan dengan keyboard, mengumumkan perubahan status ke pembaca layar, dan menonaktifkan tombol kirim selama posting berjalan.

#### Scenario: Posting berjalan
- **WHEN** staf menekan Kirim
- **THEN** tombol dinonaktifkan, status "Sedang diposting" diumumkan, dan hasil akhir (berhasil atau gagal) diumumkan saat selesai
