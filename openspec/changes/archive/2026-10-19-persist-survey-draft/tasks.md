# Tasks

## 1. Modul draf

- [x] 1.1 Buat `src/components/survey/surveyDraft.ts` dengan `loadDraft`, `saveDraft` dan `clearDraft`, memakai satu kunci `sessionStorage` dan semua akses dibungkus try/catch. Verifikasi: `astro check` bersih dan modul tidak melempar saat storage diblokir (lihat 3.2).
- [x] 1.2 Validasi tiap field saat dimuat (layanan, penilaian 1–5, NPS 0–10, tanggal `YYYY-MM-DD`, pemotongan nama dan saran) dan jangan sertakan persetujuan. Verifikasi: draf yang dirusak manual di storage dimuat dengan field tidak valid kosong dan field valid tetap (lihat 3.1).

## 2. Integrasi ke form

- [x] 2.1 Di `useSurveyForm`, muat draf setelah mount, simpan hanya setelah `draftLoaded`, dan lewati penyimpanan saat status `success`. Verifikasi: isi form, muat ulang, dan semua isian kecuali persetujuan pulih tanpa peringatan hydration di konsol.
- [x] 2.2 Panggil `clearDraft()` sebelum status menjadi `success`, dan biarkan "Isi lagi" mengosongkan draf lewat state kosong. Verifikasi: setelah kirim berhasil dan setelah "Isi lagi", kunci draf tidak ada di `sessionStorage`.

## 3. Verifikasi

- [x] 3.1 Uji di browser: pulih setelah muat ulang, persetujuan tidak pulih, draf dihapus setelah sukses dan setelah "Isi lagi", draf tetap ada setelah kiriman gagal, draf rusak (nilai di luar rentang, teks panjang, bukan JSON) diabaikan, dan form yang belum disentuh tidak menyimpan draf. Verifikasi: setiap skenario di spec delta menghasilkan keluaran yang diharapkan.
- [x] 3.2 Uji dengan `sessionStorage` diblokir. Verifikasi: form tampil, dapat diisi dan terkirim, tanpa error JavaScript.
- [x] 3.3 Jalankan `astro check` dan `openspec validate persist-survey-draft --strict`. Verifikasi: tanpa error.

## Workflow follow-up

- Arsipkan change dengan `/opsx:archive` agar requirement draf masuk ke spec utama `customer-satisfaction-survey`.
