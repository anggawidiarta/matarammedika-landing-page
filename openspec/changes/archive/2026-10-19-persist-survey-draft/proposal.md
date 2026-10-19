# Proposal

## Why

Survey kepuasan memuat enam penilaian, NPS, layanan dan saran. Jika pengguna tidak sengaja memuat ulang halaman atau berpindah halaman lalu kembali, semua isian hilang dan harus diisi dari awal. Penyimpanan sementara di `sessionStorage` menghindarinya tanpa menyimpan data di luar tab pengguna. Ini sudah ditunda dari change `refine-survey-layout` dan kini sudah diimplementasikan, sehingga change ini mencatat perilakunya di spec.

## What Changes

- Isian survey (nama, tanggal kunjungan, layanan, enam penilaian, NPS, saran) disimpan di `sessionStorage` setiap kali berubah, dan dipulihkan saat halaman dimuat ulang pada tab yang sama.
- Persetujuan tidak ikut disimpan, sehingga pengguna harus mencentangnya lagi setiap kali.
- Draf dihapus setelah survey berhasil terkirim dan saat pengguna menekan "Isi lagi".
- Isi draf divalidasi ulang saat dimuat. Nilai yang tidak valid diabaikan, dan draf yang rusak atau storage yang tidak tersedia tidak menghalangi form.
- Draf hanya berisi tanggal otomatis (tanpa isian lain) tidak disimpan.

Di luar lingkup: penyimpanan lintas tab atau lintas sesi (`localStorage`), penyimpanan di server, dan kedaluwarsa draf.

## Capabilities

### New Capabilities

### Modified Capabilities

- `customer-satisfaction-survey`: menambah requirement pemulihan dan penghapusan draf isian. Requirement yang sudah ada tidak berubah.

## Impact

- Kode: berkas baru `src/components/survey/surveyDraft.ts` dan perubahan pada `src/components/survey/useSurveyForm.ts`. Sudah diimplementasikan.
- Tidak ada perubahan pada API `/api/survey-kepuasan`, skema zod, tampilan, maupun dependensi.
- Privasi: data hanya berada di browser pengguna selama tab terbuka. Nama dan saran bersifat opsional tetapi tersimpan di storage tersebut sampai tab ditutup atau survey terkirim.
