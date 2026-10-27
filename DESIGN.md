---
name: Apotek & Klinik Mataram Medika
description: Landing page Klinik dan Apotek Mataram Medika — terang, tenang, dan selalu dekat ke WhatsApp.
colors:
  brand-blue: "#0d6af6"
  brand-green: "#3dac9c"
  ink-navy: "#031432"
  harbor-mist: "#6c87ae"
  clinic-white: "#ffffff"
  morning-surface: "#f9fbfc"
  sky-tint: "#f2f7ff"
  sky-highlight: "#eff5ff"
  night-footer: "#0a0e31"
  promo-rose: "#ff356b"
  promo-blush: "#ff698d"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.5
  headline:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.375
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.715
  label:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  control: "14px"
  promo-card: "16px"
  panel: "16px"
  card: "24px"
  banner: "32px"
  pill: "9999px"
spacing:
  gutter-mobile: "24px"
  gutter-desktop: "40px"
  gutter-wide: "56px"
  card-x: "32px"
  card-y: "20px"
  section-gap: "40px"
  section-y: "80px"
components:
  button-gradient:
    textColor: "{colors.clinic-white}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
    typography: "{typography.label}"
  button-white:
    backgroundColor: "{colors.clinic-white}"
    textColor: "{colors.brand-blue}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.clinic-white}"
    rounded: "{rounded.card}"
    padding: "20px 32px"
  input:
    backgroundColor: "{colors.sky-tint}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
    height: "48px"
  nav-link:
    textColor: "{colors.harbor-mist}"
  nav-link-active:
    textColor: "{colors.brand-blue}"
  segmented:
    textColor: "{colors.harbor-mist}"
    rounded: "{rounded.control}"
    height: "32px"
    width: "80px"
---

# Design System: Apotek & Klinik Mataram Medika

## Overview

**Creative North Star: "The Bright Waiting Room"**

Ruang tunggu klinik yang terang dan tenang. Permukaan hampir putih dengan sedikit rona biru, kartu putih yang melayang tipis, dan satu cahaya hangat dari gradient biru ke hijau yang selalu menandai "di sini Anda bisa bertindak". Tidak ada yang berteriak; pengunjung yang sedang khawatir soal kesehatan harus langsung merasa diurus dan tahu ke mana harus menekan.

Kepadatan sedang dan lega: blok konten dipisah jarak lebar (40px antar blok, 80px antar section beranda), teks besar dan bulat dari Poppins, dan sudut yang lembut di mana-mana. Klinik dan Apotek adalah dua unit setara dalam satu dunia visual yang sama; perpindahannya lewat satu kontrol Segmented, bukan dua tema berbeda.

Promo adalah satu-satunya tempat warna lain (merah muda) boleh masuk, karena promo memang harus terasa mendesak.

**Key Characteristics:**
- Permukaan terang bertingkat: morning surface → sky tint → kartu putih.
- Gradient biru→hijau (112°) hanya untuk aksi dan momen unggulan.
- Kartu putih membulat 24px dengan bayangan ambient biru-navy yang tipis.
- Tombol aksi berbentuk pill, selalu ke WhatsApp atau halaman tujuan yang jelas.
- Bahasa Indonesia, nada ramah, mobile-first.

## Colors

Palet logo biru dan hijau di atas netral biru-dingin yang sangat terang, dengan navy pekat untuk teks.

### Primary
- **Brand Blue** (`brand-blue`): titik awal gradient, link aktif di navigasi, harga promo, outline fokus keyboard, dan teks tombol putih.

### Secondary
- **Clinic Green** (`brand-green`): titik akhir gradient dan ikon WhatsApp. Jarang dipakai sendirian sebagai warna teks.

### Tertiary
- **Promo Rose** (`promo-rose`) dan **Promo Blush** (`promo-blush`): khusus kartu promo (badge diskon, tombol klaim, cincin "segera berakhir"). Tidak dipakai di luar konteks promo.

### Neutral
- **Ink Navy** (`ink-navy`): judul dan teks utama. Untuk paragraf panjang di kartu, gunakan Ink Navy 80% opasitas.
- **Harbor Mist** (`harbor-mist`): caption, teks sekunder, link navigasi tidak aktif, garis tepi Segmented.
- **Clinic White** (`clinic-white`): kartu dan tombol sekunder di atas gradient.
- **Morning Surface** (`morning-surface`): latar halaman default.
- **Sky Tint** (`sky-tint`) dan **Sky Highlight** (`sky-highlight`): latar section bergantian, latar input, menu mobile aktif, dan callout.
- **Night Footer** (`night-footer`): latar footer.

### Named Rules
**The Gradient Means Go Rule.** Gradient biru→hijau hanya untuk aksi (tombol, Segmented aktif, badge angka) dan satu panel unggulan per halaman (banner CTA, kartu Visi). Bukan latar dekoratif. Varian teks (`gradient-blue-green-text`, 141°) hanya ada di judul hero beranda dan kata sorotan judul halaman promo; jangan tambah pemakaian baru.

**The Mist Is Not Body Rule.** Harbor Mist kontrasnya sekitar 3,7:1 di atas putih. Pakai untuk caption, label kecil yang tidak esensial, atau teks ≥18px; paragraf yang harus dibaca memakai Ink Navy 80%.

**The Rose Stays In Promo Rule.** Merah muda hanya hidup di dalam kartu promo dan halaman promo.

## Typography

**Display/Body Font:** Poppins (fallback ui-sans-serif, system-ui)
**Accent Font:** Sora (fallback ui-sans-serif, system-ui)

**Character:** Poppins yang geometris dan bulat terasa ramah dan mudah dibaca untuk semua umur; Sora yang sedikit lebih teknis dipakai untuk angka, harga, dan label tombol agar terasa tegas.

### Hierarchy
- **Display** (700, 32–40px, 1.5): judul hero beranda saja.
- **Headline** (600, 28px mobile → 32px desktop, 1.375): judul halaman (mis. "Profile", "Daftar Layanan") dan judul banner CTA.
- **Title** (500–600, 20px → 24px, 1.375): judul section dan judul kartu fitur.
- **Body** (400, 16px, 1.5–1.75): paragraf dan deskripsi; batasi sekitar 72ch di kolom lebar.
- **Body Small** (400, 14px, 24px line-height): deskripsi kartu fitur, caption, footer.
- **Label** (Sora 600, 16–18px): teks tombol, harga, angka badge. Angka memakai tabular-nums.

### Named Rules
**The Balanced Heading Rule.** Judul memakai `text-balance` dan paragraf `text-pretty`; tidak ada judul yang meninggalkan satu kata yatim di baris terakhir.

**The No Justify Rule.** Paragraf rata kiri. Rata kanan-kiri memunculkan celah tak rata di layar HP.

## Layout

Kontainer halaman (`page-container`) maksimal 1600px dengan gutter 24px di HP, 40px dari 1024px, dan 56px dari 1280px. Halaman dalam memakai kolom vertikal dengan jarak 40–48px antar blok, padding atas 32px dan bawah 96px. Section beranda bergantian latar Morning Surface dan Sky Tint dengan padding vertikal 80px.

Grid kartu: 1 kolom di HP, 2 kolom dari `md`/`sm`, 3 kolom dari `lg`/`xl`, dan 5 kolom untuk fasilitas di `xl`. Konten dua bagian (Visi/Misi, Tentang Kami) berdampingan dari `lg` dan menumpuk di bawahnya. Header sticky setinggi 95px (`--header-h`); navigasi desktop muncul dari `lg`, di bawahnya diganti menu `<details>`.

## Elevation & Depth

Sistem berlapis dengan bayangan ambient tipis: kedalaman berasal dari tingkatan permukaan (surface → tint → putih) ditambah bayangan biru-navy yang lebar dan sangat transparan. Elemen aksi sedikit lebih terangkat dengan bayangan biru yang lebih terasa.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 24px 16px rgb(3 9 50 / 0.04)`): kartu konten putih (fitur, profil).
- **Float** (`box-shadow: 0 12px 16px rgb(63 128 240 / 0.08)`): kartu promo saat diam.
- **Nav** (`box-shadow: 0 12px 32px rgb(63 128 240 / 0.08)`): permukaan navigasi melayang.
- **CTA** (`box-shadow: 0 8px 11.5px rgb(65 132 247 / 0.24)`): tombol gradient/putih, panel gradient, dan kartu promo saat hover.

### Named Rules
**The One Elevation Rule.** Satu elemen memilih border atau bayangan, tidak keduanya. Kartu putih tidak diberi garis tepi.

## Shapes

Bentuk lembut di semua tempat. Kartu konten membulat 24px, kartu promo dan panel kecil 16px, banner CTA 32px. Semua tombol aksi dan avatar berbentuk pill/lingkaran penuh. Segmented memakai 14px di ujung luar dan sambungan rata di tengah. Ikon fitur duduk di lingkaran bertona (latar warna 10% + glyph warna penuh).

## Components

### Buttons
Lembut dan meyakinkan: pill tebal yang terlihat bisa ditekan.
- **Shape:** pill penuh (9999px), tinggi minimal 44px.
- **Gradient (primary):** latar gradient biru→hijau 112°, teks putih Sora/Poppins 600 16–18px, padding 16px × 28px, bayangan CTA.
- **White (di atas gradient):** latar putih, teks Brand Blue, ikon WhatsApp hijau, padding sama.
- **Hover / Focus / Active:** naik 2px saat hover, mengecil ke 0,96–0,97 saat ditekan, outline fokus 2px (Brand Blue di permukaan terang, putih di atas gradient) dengan offset 2–4px. Semua gerak dimatikan di `prefers-reduced-motion`.

### Segmented (Klinik / Apotek)
Kontrol dua segmen 80 × 32px. Segmen aktif berisi gradient dengan teks putih; segmen tidak aktif bergaris tepi Harbor Mist dengan teks Harbor Mist. Interaktif sebagai `tablist` saat ada handler, statis `aria-hidden` saat hanya penanda.

### Cards / Containers
- **Corner Style:** 24px (konten), 16px (promo).
- **Background:** Clinic White di atas Morning Surface atau Sky Tint.
- **Shadow Strategy:** Card shadow saat diam; promo naik 4px dan berganti ke CTA shadow saat hover.
- **Border:** tidak ada.
- **Internal Padding:** 20px × 32px (fitur), 24–28px × 24–32px (konten profil).
- **Panel unggulan:** panel gradient dengan tekstur banner 6% opasitas, teks putih, sudut 24–32px.

### Inputs / Fields
- **Style:** latar Sky Tint, garis tepi Harbor Mist 30%, sudut 16px, tinggi minimal 48px, teks Ink Navy 14px.
- **Focus:** outline 2px Brand Blue offset 2px.

### Navigation
Link Poppins 14px → 16px di `xl`. Tidak aktif: Harbor Mist 80% opasitas, hover ke Ink Navy. Aktif: Brand Blue semibold. Menu HP berupa blok membulat 16px dengan latar Sky Highlight untuk item aktif. CTA "Informasi" di header memakai tombol gradient.

### Promo Card (Signature)
Kartu 16px dengan foto 16:9, gradasi gelap di bawah untuk judul putih, badge status di kiri atas, lingkaran diskon Promo Rose di kanan atas, harga Sora Brand Blue, harga normal dicoret, dan tombol klaim pill ke WhatsApp.

## Area Kelola (`/kelola`)

Permukaan Operate untuk staf klinik, bukan halaman pengunjung. Dunia visualnya sama dengan situs publik, tetapi dipakai untuk menyelesaikan tugas: pola yang sudah dikenal (tab, tabel, sakelar, dialog) lebih penting daripada ekspresi.

- **Kerangka:** bilah atas putih bergaris bawah tipis dengan logo, tab modul berikon (Layanan, Fasilitas, Promo, Profil) bergaris bawah biru saat aktif, tautan "Lihat situs", Keluar, dan avatar inisial. Di HP tab turun ke baris kedua dengan ikon di atas label. Konten memakai `page-container`; tidak ada header, footer, atau navigasi publik.
- **Kepala modul:** ikon modul di kotak 12px, judul, satu kalimat pengantar, ringkasan "N dari M … tampil di situs", dan tombol "Lihat di situs" ke halaman publik modul itu.
- **Blok konten:** kartu putih 16px dengan Card shadow, tanpa border. Kolom tabel hanya yang esensial: urutan, isi utama (harga ikut di bawah judul promo), periode, status Instagram, sakelar tampil, dan aksi; lebar kolom tetap agar antar tabel sejajar. Tabel di 640px ke atas; di bawahnya setiap baris bertumpuk menjadi kartu dalam kartu yang sama (satu DOM, tanpa duplikasi).
- **Sudut:** area ini lebih tegas dari situs publik: dialog dan kartu 16px, tombol, input, dan tombol ikon 8px, chip status 6px. Hanya sakelar dan avatar yang bulat penuh.
- **Tombol:** gradient hanya untuk aksi utama (Simpan, Masuk, Posting). Aksi sekunder putih dengan cincin Ink Navy 15%. Destruktif memakai token `danger` (`#b42318`), bukan merah muda promo.
- **Status:** chip kecil dengan titik warna dan teks (tidak hanya warna). Merah muda hanya muncul untuk status promo "Segera berakhir".
- **Form:** dialog `<dialog>` native (layar penuh di bawah 640px), kolom Sky Tint 48px, galat di bawah kolom dengan `role="alert"`, fokus awal lewat `data-autofocus`. Pratinjau di form memakai komponen kartu publik asli (`IconFeatureCard`, `PromoCard`) di atas permukaan Sky Tint dan dibuat `inert`.
- **Gerak:** 150-250ms, hanya untuk status (dialog masuk, sakelar); semua dimatikan di `prefers-reduced-motion`.
- **Aksesibilitas:** target sentuh 44px, urutan item lewat tombol naik/turun (drag hanya tambahan di desktop), sakelar `role="switch"`, kontras mengikuti aturan "Mist Is Not Body".

## Do's and Don'ts

### Do:
- **Do** arahkan setiap halaman ke satu aksi WhatsApp yang jelas (tombol gradient atau tombol putih di atas panel gradient).
- **Do** gunakan Ink Navy 80% untuk paragraf di kartu; Harbor Mist untuk caption saja.
- **Do** pakai kartu putih 24px dengan Card shadow untuk blok konten.
- **Do** beri setiap kontrol state hover, active, dan fokus keyboard yang terlihat, serta hormati `prefers-reduced-motion`.
- **Do** sembunyikan bagian yang kosong dari CMS atau tampilkan pesan kosong yang sopan; jangan isi dengan contoh palsu.

### Don't:
- **Don't** gunakan gradient sebagai latar dekoratif tanpa aksi, atau sebagai teks di luar judul hero beranda dan judul promo.
- **Don't** bawa warna promo (merah muda) ke luar konteks promo.
- **Don't** beri kartu putih garis tepi sekaligus bayangan.
- **Don't** rata kanan-kiri paragraf.
- **Don't** tampilkan testimoni, jumlah pasien, atau angka yang tidak berasal dari data nyata.
