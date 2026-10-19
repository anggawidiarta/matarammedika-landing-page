# Tasks

## 1. Kerangka halaman dan token header

- [x] 1.1 Ukur tinggi `KlinikHeader` di mobile dan desktop, lalu tambahkan token `--header-h` di `src/styles/global.css`. Verifikasi: nilai token sama dengan tinggi header yang terukur di DevTools pada 375px dan 1280px.
- [x] 1.2 Ganti `main` di `survey-kepuasan-pelanggan.astro` menjadi `page-container` dengan `pt-8 pb-24`, dan hapus `KlinikPageTitle` dari halaman. Verifikasi: tepi kiri konten sejajar logo header pada 375px dan 1440px, dan kapsul Klinik/Apotek tidak tampil lagi.
- [x] 1.3 Di `SurveyApp`, buat grid `lg:grid-cols-[minmax(300px,1fr)_minmax(0,720px)]` dengan panel samping (h1 rata kiri, caption, blob gradien, `bg-surface-highlight`) yang `lg:sticky` di bawah header. Status sukses juga dirender di kolom form. Verifikasi: di 1440px form tidak lebih lebar dari 720px dan panel tetap terlihat saat scroll ke NPS; di bawah 1024px panel tampil di atas form.

## 2. Progres

- [x] 2.1 Ubah `REQUIRED_COUNT` menjadi `LIKERT.length + 2` dan sertakan `layanan` dalam hitungan `answered` di `useSurveyForm`. Verifikasi: mengisi 6 aspek dan NPS tanpa Layanan menampilkan "7 dari 8", dan setelah Layanan dipilih menampilkan "8 dari 8".
- [x] 2.2 Tambahkan varian `panel` (hanya `lg`, di panel samping) dan `bar` (di bawah `lg`, sticky di `top-[var(--header-h)]`) pada `SurveyProgress`, lalu hapus progres dari atas `SurveyForm`. Verifikasi: di 375px bar tetap terlihat tepat di bawah header saat scroll ke aspek terakhir; di 1280px hanya progres di panel yang tampil.

## 3. Penilaian dan NPS

- [x] 3.1 Ratakan `LikertRatingRow`: hapus kotak bergradien, latar jalur skala, label ujung per baris, dan teks "Anda memilih X dari 5". Gunakan pemisah `border-b` dan grid `lg:grid-cols-[minmax(0,1fr)_auto]` dengan tombol minimal `size-11`. Verifikasi: di 1280px label dan skala ada di satu baris; di 360px label di atas skala, tombol 44x44px, dan tidak ada scroll horizontal di 320px.
- [x] 3.2 Sesuaikan `PenilaianSection` dan `SurveyCard` (padding mobile `px-4`) agar keterangan skala 1 dan 5 tampil sekali di header kartu. Verifikasi: keterangan skala tampil satu kali dan tidak ada kartu di dalam kartu.
- [x] 3.3 Ubah grid `NpsScale` menjadi `grid-cols-6 lg:grid-cols-11`. Verifikasi: di 375px baris pertama 0–5 dan baris kedua 6–10; di 1280px 0–10 dalam satu baris.

## 4. Pengiriman dan layar sukses

- [x] 4.1 Di `ConsentSubmit`, nonaktifkan tombol hanya saat `loading` dan hapus teks bantuan persetujuan. Verifikasi: kirim tanpa centang persetujuan tidak memicu request di tab Network, pesan "Centang persetujuan penggunaan masukan sebelum mengirim." tampil, dan fokus ada di checkbox.
- [x] 4.2 Di `SurveySuccess`, ganti "✓" dengan `CircleCheck` dari lucide, beri heading `tabIndex={-1}`, lalu saat mount scroll ke section (smooth, atau auto jika reduced motion) dengan `scroll-mt` sebesar header dan fokus ke heading. Verifikasi: setelah kiriman sukses, layar sukses terlihat di bawah header dan fokus ada di judul; dengan reduced motion diemulasikan di DevTools, tidak ada scroll halus.

## 5. Integrasi

- [x] 5.1 Jalankan `astro check` dan `astro build`. Verifikasi: keduanya selesai tanpa error.
- [x] 5.2 Uji alur lengkap di dev server pada 360px, 768px, 1024px dan 1440px: isi form, picu kesalahan Layanan dan persetujuan, kirim sukses, lalu "Isi lagi". Verifikasi: semua skenario di `specs/customer-satisfaction-survey/spec.md` terpenuhi dan setelah "Isi lagi" progres kembali "0 dari 8".
