# Proposal

## Why

Halaman Survey Kepuasan Pelanggan adalah satu-satunya halaman yang tidak memakai `page-container`. Di desktop ia tampil sebagai kolom sempit 760px di tengah halaman selebar 1600px, dan di mobile padding bertumpuk menyisakan sekitar 216px untuk lima tombol skala rating. Kapsul Klinik/Apotek di judulnya hanya hiasan tanpa fungsi. Selain itu ada beberapa celah perilaku: progres tidak menghitung Layanan yang wajib, tombol Kirim nonaktif tanpa penjelasan yang jelas, dan layar sukses tidak memindahkan fokus.

## What Changes

- Hapus kapsul Klinik/Apotek dari judul halaman survey.
- Layout memakai `page-container` dengan dua kolom di desktop: panel samping berlatar highlight (judul rata kiri, caption, progres yang menempel saat scroll) dan kolom form dengan lebar maksimal sekitar 720px. Mobile memakai satu kolom dengan bar progres tipis yang menempel di bawah header situs.
- Progres menghitung 8 isian wajib: Layanan, 6 aspek penilaian dan NPS.
- Skala NPS 0–10 di layar sempit tampil dalam dua baris berurutan, 0–5 dan 6–10.
- Penilaian aspek di desktop tampil satu baris (label di kiri, skala 1–5 di kanan). Kotak bersarang di dalam kartu dihilangkan.
- Tombol Kirim selalu aktif. Persetujuan yang belum dicentang ditolak lewat validasi dengan pesan, dan fokus dipindah ke checkbox persetujuan.
- Setelah kiriman berhasil, halaman di-scroll ke atas dan fokus dipindah ke judul layar sukses.
- Ikon centang teks pada layar sukses diganti ikon lucide.

Di luar lingkup: penyimpanan draf isian di `sessionStorage`, dan `title`/`description` per halaman untuk SEO.

## Capabilities

### New Capabilities

- `customer-satisfaction-survey`: Halaman survey kepuasan pelanggan publik, mencakup tata letak responsif, indikator progres, input skala, alur pengiriman dan layar sukses.

### Modified Capabilities
<!-- Belum ada spec yang tercatat di openspec/specs/. -->

## Impact

- Halaman: `src/pages/survey-kepuasan-pelanggan.astro`.
- Komponen: `src/components/survey/` (SurveyApp, SurveyForm, SurveyProgress, LikertRatingRow, PenilaianSection, NpsScale, ConsentSubmit, SurveySuccess, formUi, useSurveyForm).
- Gaya: `src/styles/global.css` mendapat token tinggi header untuk elemen yang menempel.
- Tidak ada perubahan pada API `/api/survey-kepuasan`, skema zod, `KlinikPageTitle`, `Segmented`, maupun dependensi baru (`lucide-react` sudah terpasang).
