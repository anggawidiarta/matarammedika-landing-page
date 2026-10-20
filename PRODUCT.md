# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Pasien dan keluarga di Mataram dan sekitarnya (Lombok). Mereka mencari info layanan, dokter, fasilitas, dan promo, lalu reservasi atau bertanya lewat WhatsApp. Akses banyak lewat HP.

## Product Purpose
Landing page Apotek & Klinik Mataram Medika (CV. Mataram Medika). Membantu pengunjung mengenal dua unit (Klinik dan Apotek), menemukan layanan, dokter, fasilitas, dan promo, mengisi survei kepuasan, dan menghubungi unit lewat WhatsApp. Konten layanan, fasilitas, promo, dan profil dikelola dari CMS admin (`cms_items`, dipisah per `source` klinik/apotek).

## Positioning
- Klinik: konsep "one stop service", dari deteksi dini, pencegahan, pengobatan, sampai terapi pemulihan.
- Apotek: slogan "Terlengkap & Termurah", berdiri Februari 2017.
- Klinik dan Apotek berada di satu alamat: Jl. Catur Warga No. 13, Mataram.

## Operating Context
Situs Astro (SSR) membaca konten terbit dari Supabase lewat service role; admin terpisah (`matarammedika-admin`) mengelola CMS. Halaman publik di-cache singkat. Klinik dan Apotek bisa diganti lewat switch (Segmented) di beranda dan profil.

## Capabilities and Constraints
- Halaman: Beranda, Dokter, Layanan, Fasilitas, Promo, Survei Kepuasan, Profil.
- Konten tanpa fallback statis: bagian kosong disembunyikan atau diberi pesan kosong.
- Bahasa Indonesia saja.
- Nomor WhatsApp Klinik dan Apotek ada di `src/data/site.ts`.

## Brand Commitments
Logo Apotek & Klinik Mataram Medika. Palet biru `#0d6af6` dan hijau `#3dac9c` dengan gradient biru-hijau. Font Poppins (body) dan Sora (aksen). Nada ramah dan sopan.

## Evidence on Hand
Teks profil Klinik dan Apotek, daftar layanan dan fasilitas dari CMS, foto di `src/assets`, logo asuransi mitra di `src/assets/asuransi`. Tidak ada testimoni, jumlah pasien, atau angka lain yang tersedia; jangan mengarang.

## Product Principles
- Jalur ke reservasi/WhatsApp selalu dekat dan jelas.
- Klinik dan Apotek setara; pengunjung bisa berpindah unit tanpa tersesat.
- Hanya klaim yang benar dan bersumber dari konten nyata; tanpa testimoni atau angka palsu.
- Mobile-first: mudah dibaca dan dipakai di HP.
- Konten selalu bisa diubah staf lewat CMS tanpa mengubah kode.

## Accessibility & Inclusion
Target WCAG AA: kontras teks, fokus keyboard terlihat, area sentuh memadai, dan hormati prefers-reduced-motion.
