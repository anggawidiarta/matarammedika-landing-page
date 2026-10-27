# Spec Delta

## Purpose

Memungkinkan staf klinik mengelola konten Layanan, Fasilitas, Profil dan Promo yang tampil di situs publik dari area `/kelola`, dengan pratinjau yang identik dengan situs dan perubahan yang langsung terlihat oleh pengunjung.

## ADDED Requirements

### Requirement: Navigasi antar modul
Area kelola SHALL menyediakan tab untuk modul Layanan, Fasilitas, Profil dan Promo, menandai modul aktif, serta tautan ke situs publik dan tombol Keluar.

#### Scenario: Pindah modul
- **WHEN** staf memilih tab Promo
- **THEN** daftar promo tampil dan tab Promo ditandai aktif untuk pembaca layar

#### Scenario: Beranda area kelola
- **WHEN** staf membuka `/kelola`
- **THEN** ia diarahkan ke modul Layanan

### Requirement: Daftar item per modul dan section
Setiap modul SHALL menampilkan item yang belum dihapus, dikelompokkan per section dan diurutkan menurut urutan lalu judul. Daftar kosong dan kegagalan memuat SHALL punya tampilan sendiri.

#### Scenario: Daftar berisi item
- **WHEN** staf membuka modul Layanan
- **THEN** item tampil di bawah section "umum_gigi" dan "spesialis" sesuai urutannya, dengan status Tampil atau Tersembunyi pada tiap item

#### Scenario: Section kosong
- **WHEN** sebuah section belum memiliki item
- **THEN** tampil pesan kosong yang menyebut section itu dan tombol untuk menambah item

#### Scenario: Gagal memuat
- **WHEN** pemuatan data gagal
- **THEN** tampil pesan galat umum dengan tombol Coba lagi, tanpa detail teknis

### Requirement: Menambah dan mengubah item
Staf SHALL dapat menambah dan mengubah item lewat form. Judul wajib 1–120 karakter setelah dipangkas dan isi maksimal 1000 karakter. Item baru SHALL ditempatkan di urutan terakhir section tujuan.

#### Scenario: Tambah item valid
- **WHEN** staf mengisi judul dan menyimpan
- **THEN** item muncul di akhir section yang dipilih dan form tertutup

#### Scenario: Judul kosong
- **WHEN** staf menyimpan dengan judul kosong atau hanya spasi
- **THEN** penyimpanan ditolak, pesan error tampil di dekat kolom judul, dan fokus berpindah ke kolom itu

#### Scenario: Melebihi batas
- **WHEN** judul lebih dari 120 karakter atau isi lebih dari 1000 karakter
- **THEN** penyimpanan ditolak dengan pesan yang menyebut batasnya dan teks yang sudah diketik tidak hilang

#### Scenario: Pindah section
- **WHEN** staf mengubah section sebuah item lalu menyimpan
- **THEN** item muncul di akhir section baru

#### Scenario: Server menolak
- **WHEN** penyimpanan gagal di server
- **THEN** form tetap terbuka dengan isian utuh dan pesan galat umum

### Requirement: Ikon dan warna item Layanan dan Fasilitas
Item Layanan dan Fasilitas SHALL dapat diberi satu ikon dari daftar yang didukung situs publik beserta warna dari enam pilihan yang tersedia, dan pratinjau SHALL menunjukkan kartu seperti yang tampil di situs.

#### Scenario: Pilih ikon
- **WHEN** staf memilih ikon dan warna di form
- **THEN** pratinjau kartu langsung berubah menyesuaikan

#### Scenario: Ikon tidak didukung
- **WHEN** permintaan menyertakan nama ikon atau warna di luar daftar
- **THEN** permintaan ditolak dan data tidak berubah

### Requirement: Profil Klinik dan Apotek
Modul Profil SHALL mengelola teks Tentang, Visi dan Misi secara terpisah untuk Klinik dan Apotek. Isi teks wajib terisi, dan pemilih Klinik/Apotek SHALL dapat dioperasikan dengan keyboard.

#### Scenario: Ganti unit
- **WHEN** staf memilih Apotek
- **THEN** hanya teks profil Apotek yang tampil dan diubah, dan profil Klinik tidak terpengaruh

#### Scenario: Isi profil kosong
- **WHEN** staf menyimpan item profil dengan isi kosong
- **THEN** penyimpanan ditolak dengan pesan error pada kolom isi

#### Scenario: Pemilih unit dengan keyboard
- **WHEN** fokus ada pada pemilih Klinik/Apotek dan staf menekan panah kiri atau kanan
- **THEN** unit berpindah, fokus mengikuti, dan panel yang sesuai tampil

### Requirement: Publikasi dan penyembunyian
Staf SHALL dapat menampilkan atau menyembunyikan item lewat sakelar. Hanya item berstatus tampil dan belum dihapus yang muncul di situs publik.

#### Scenario: Sembunyikan item
- **WHEN** staf mematikan sakelar sebuah item
- **THEN** item hilang dari halaman publik terkait dan tetap ada di daftar kelola dengan status Tersembunyi

#### Scenario: Sakelar aksesibel
- **WHEN** sakelar difokuskan
- **THEN** pembaca layar membacakan nama item dan statusnya, dan Spasi mengubah status

### Requirement: Menghapus item
Penghapusan SHALL meminta konfirmasi, lalu menandai item terhapus dan menyembunyikannya tanpa menghilangkan barisnya dari database.

#### Scenario: Konfirmasi hapus
- **WHEN** staf memilih Hapus lalu mengonfirmasi
- **THEN** item hilang dari daftar kelola dan halaman publik, dan barisnya tetap ada di database dengan tanda terhapus

#### Scenario: Batal hapus
- **WHEN** staf memilih Batal pada dialog konfirmasi atau menekan Esc
- **THEN** item tidak berubah dan fokus kembali ke tombol Hapus

### Requirement: Mengurutkan ulang
Staf SHALL dapat mengubah urutan item dalam satu section dengan tombol naik/turun, keyboard, dan drag di desktop. Urutan baru SHALL tersimpan berurutan tanpa celah.

#### Scenario: Naik satu posisi
- **WHEN** staf menekan tombol Naik pada item kedua
- **THEN** item menjadi pertama, daftar langsung berubah, dan urutan tersimpan

#### Scenario: Item pertama
- **WHEN** staf melihat item pertama sebuah section
- **THEN** tombol Naik nonaktif dan diberi tahu ke pembaca layar

#### Scenario: Penyimpanan urutan gagal
- **WHEN** penyimpanan urutan gagal di server
- **THEN** daftar kembali ke urutan tersimpan dan pesan galat tampil

### Requirement: Promo dengan harga, periode dan gambar
Item Promo SHALL memiliki judul, deskripsi, harga normal, harga promo, tanggal mulai, tanggal berakhir dan satu gambar. Harga berupa bilangan bulat tidak negatif, harga promo tidak boleh melebihi harga normal, dan tanggal berakhir tidak boleh sebelum tanggal mulai.

#### Scenario: Harga promo melebihi normal
- **WHEN** staf mengisi harga promo lebih besar dari harga normal
- **THEN** penyimpanan ditolak dengan pesan error pada kolom harga promo

#### Scenario: Tanggal terbalik
- **WHEN** tanggal berakhir sebelum tanggal mulai
- **THEN** penyimpanan ditolak dengan pesan error pada kolom tanggal berakhir

#### Scenario: Status promo
- **WHEN** daftar promo ditampilkan
- **THEN** tiap promo berstatus Terjadwal, Berlangsung, Segera berakhir (3 hari atau kurang) atau Berakhir menurut zona waktu Asia/Makassar

### Requirement: Unggah gambar promo
Gambar promo SHALL berformat JPG, PNG atau WebP dengan ukuran maksimal 2 MB, dan SHALL divalidasi di server. Gambar lama SHALL dihapus hanya setelah item tersimpan, dan gambar baru yang item-nya gagal tersimpan SHALL dibersihkan.

#### Scenario: Gambar valid
- **WHEN** staf mengunggah JPG 1 MB
- **THEN** gambar tersimpan, pratinjau tampil, dan jalur gambar tercatat pada item

#### Scenario: Format atau ukuran tidak valid
- **WHEN** staf mengunggah GIF atau berkas 3 MB
- **THEN** unggahan ditolak dengan pesan yang menyebut format atau batas ukuran, dan item tidak berubah

#### Scenario: Ganti gambar
- **WHEN** staf mengganti gambar dan penyimpanan berhasil
- **THEN** gambar lama dihapus dari penyimpanan

#### Scenario: Penyimpanan item gagal
- **WHEN** gambar baru terunggah tetapi item gagal tersimpan
- **THEN** gambar baru dihapus dan gambar lama tetap dipakai

#### Scenario: Penyimpanan gambar tidak tersedia
- **WHEN** layanan penyimpanan gambar gagal
- **THEN** staf melihat pesan galat umum dan item tidak berubah

### Requirement: Pratinjau identik dengan situs publik
Pratinjau di form SHALL dirender memakai komponen kartu yang sama dengan halaman publik sehingga tampilannya identik, termasuk tampilan Layanan, Fasilitas dan Promo.

#### Scenario: Edit promo
- **WHEN** staf mengetik judul dan harga promo di form
- **THEN** kartu promo di pratinjau berubah seketika dan sama dengan kartu di halaman `/promo-klinik`

### Requirement: Perubahan langsung terlihat di situs publik
Setelah perubahan tersimpan, halaman publik terkait SHALL menampilkan konten terbaru pada permintaan berikutnya tanpa menunggu kedaluwarsa cache, dalam proses server yang sama.

#### Scenario: Ubah judul layanan
- **WHEN** staf mengubah judul sebuah layanan dan menyimpan
- **THEN** membuka `/layanan-klinik` segera setelahnya menampilkan judul baru

#### Scenario: Gagal menyimpan
- **WHEN** penyimpanan gagal
- **THEN** halaman publik tetap menampilkan konten sebelumnya

### Requirement: Antarmuka responsif
Antarmuka kelola SHALL tampil sebagai tabel pada lebar 640px ke atas dan sebagai daftar kartu di bawahnya, dengan semua fungsi tersedia di kedua tampilan. Form SHALL tampil penuh layar di bawah 640px. Target sentuh SHALL minimal 44x44px.

#### Scenario: Layar 360px
- **WHEN** modul Promo dibuka pada lebar 360px
- **THEN** promo tampil sebagai kartu, semua aksi (ubah, urutan, sakelar, hapus) dapat dijangkau, dan tidak ada scroll horizontal halaman

#### Scenario: Desktop
- **WHEN** modul dibuka pada lebar 1280px
- **THEN** item tampil dalam tabel pada kontainer halaman situs

### Requirement: Aksesibilitas dialog dan form
Dialog form dan konfirmasi SHALL memindahkan fokus ke dalamnya saat dibuka, menjebak fokus, menutup dengan Esc, dan mengembalikan fokus ke pemicu. Setiap kolom SHALL memiliki label, dan pesan error SHALL terhubung ke kolomnya serta diumumkan ke pembaca layar. Animasi SHALL dihentikan bila pengguna memilih mengurangi gerakan.

#### Scenario: Buka dan tutup dialog
- **WHEN** staf membuka form tambah lalu menekan Esc
- **THEN** fokus masuk ke kolom pertama saat dibuka, dialog tertutup saat Esc, dan fokus kembali ke tombol Tambah

#### Scenario: Error terumumkan
- **WHEN** validasi gagal
- **THEN** pesan error tampil di bawah kolom terkait dan dibacakan pembaca layar

#### Scenario: Kurangi gerakan
- **WHEN** sistem pengguna mengaktifkan prefers-reduced-motion
- **THEN** transisi dan animasi antarmuka kelola tidak berjalan

### Requirement: Modul tidak mengganggu performa halaman publik
Kode antarmuka kelola SHALL NOT dimuat oleh halaman publik.

#### Scenario: Beranda dimuat
- **WHEN** pengunjung membuka beranda
- **THEN** tidak ada berkas JavaScript milik antarmuka kelola yang diminta

### Requirement: Endpoint tulis memvalidasi dan membatasi masukan
Setiap endpoint tulis SHALL memvalidasi payload di server terhadap aturan yang sama dengan batasan database, membatasi ukuran body, hanya mengubah baris pada modul dan unit yang diminta, dan memberi respons galat yang tidak membocorkan detail internal.

#### Scenario: Payload tidak valid
- **WHEN** payload memuat section yang tidak dikenal untuk modul tersebut
- **THEN** respons berkode `validation` dan tidak ada baris yang berubah

#### Scenario: Body terlalu besar
- **WHEN** body JSON melebihi batas ukuran
- **THEN** permintaan ditolak tanpa diproses

#### Scenario: Item tidak ditemukan
- **WHEN** ubah atau hapus menargetkan id yang tidak ada atau sudah dihapus
- **THEN** respons berkode `not_found` dan tidak ada data yang berubah

#### Scenario: Galat database
- **WHEN** database mengembalikan galat
- **THEN** respons berkode `server` dengan pesan umum dan galat asli hanya tercatat di log server
