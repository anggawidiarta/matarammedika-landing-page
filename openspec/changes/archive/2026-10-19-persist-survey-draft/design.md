# Design

## Context

Motivasi ada di proposal.md dan requirement di spec delta. Kondisi kode yang membentuk pendekatan:

- Semua state form berada di satu hook, `useSurveyForm` ([useSurveyForm.ts](src/components/survey/useSurveyForm.ts)), jadi penyimpanan cukup menempel di sana.
- Halaman survey di-prerender (`prerender = true`) dan komponennya dimuat dengan `client:load`. HTML dari server dibuat dengan form kosong, sehingga membaca storage saat render pertama akan menghasilkan hydration mismatch.
- Hook sudah punya efek setelah mount yang mengisi tanggal dengan hari ini karena alasan yang sama.
- Skema zod (`parseSurveyPayload`) memvalidasi payload saat dikirim, tetapi tidak dipakai untuk draf karena draf boleh belum lengkap (misalnya `consent` belum ada dan layanan belum dipilih).

## Goals / Non-Goals

**Goals:**
- Pulih dari muat ulang tanpa mengubah tampilan atau alur pengiriman.
- Aman terhadap isi storage yang diubah atau rusak, serta storage yang diblokir.

**Non-Goals:**
- Lintas tab atau lintas sesi, sinkronisasi antar tab, kedaluwarsa draf, dan enkripsi.

## Decisions

### 1. `sessionStorage` dengan satu kunci JSON
Satu kunci `survey-kepuasan-draft` berisi seluruh draf.
- *Alasan:* `sessionStorage` hidup sesuai tab, cocok dengan "isi lagi jika tidak sengaja muat ulang" dan tidak meninggalkan data nama atau saran setelah tab ditutup.
- *Alternatif:* `localStorage`. Ditolak karena data bertahan tanpa batas di perangkat bersama (misalnya komputer klinik) dan bisa muncul untuk pengguna berikutnya.

### 2. Modul terpisah `surveyDraft.ts`
Fungsi `loadDraft`, `saveDraft` dan `clearDraft` berada di berkas sendiri, bukan di dalam hook.
- *Alasan:* hook sudah panjang, dan akses storage plus validasi murni adalah logika yang bisa dipahami sendiri.

### 3. Dimuat setelah mount, disimpan hanya setelah dimuat
Efek mount membaca draf, mengisi state, lalu menandai `draftLoaded`. Efek penyimpanan baru berjalan setelah `draftLoaded` bernilai benar.
- *Alasan:* tanpa penanda itu, efek penyimpanan berjalan pada render pertama dengan state kosong dan menimpa draf sebelum sempat dibaca.
- *Alternatif:* inisialisasi state langsung dari storage (`useState(() => loadDraft())`). Ditolak karena mismatch hydration.

### 4. Validasi ulang setiap field, bukan zod
`parseDraft` memeriksa tiap field secara terpisah: layanan harus salah satu `LAYANAN_VALUES`, penilaian bilangan bulat 1–5, NPS bilangan bulat 0–10, teks dipotong sesuai `NAMA_MAX` dan `SARAN_MAX`, tanggal berformat `YYYY-MM-DD`.
- *Alasan:* satu nilai buruk tidak boleh membuang seluruh draf, dan zod menolak payload yang belum lengkap. Pemeriksaan penuh tetap terjadi saat dikirim.

### 5. Persetujuan dikecualikan
`consent` tidak ada di tipe `SurveyDraft`.
- *Alasan:* persetujuan penggunaan masukan sebaiknya diberikan secara sadar pada saat mengirim.

### 6. Draf kosong menghapus kunci
`saveDraft` menghapus kunci jika tidak ada nama, layanan, saran, NPS, maupun penilaian. Tanggal otomatis tidak dihitung sebagai isi.
- *Alasan:* mencegah kunci berisi data tanpa nilai muncul pada setiap kunjungan, dan membuat "Isi lagi" cukup dengan mengosongkan state tanpa panggilan hapus tambahan.

### 7. Penghapusan setelah sukses dilakukan eksplisit
`clearDraft()` dipanggil tepat sebelum status menjadi `success`, dan efek penyimpanan melewati status `success`.
- *Alasan:* tanpa pengecualian itu, efek penyimpanan menulis ulang draf pada render yang sama dengan layar sukses.

## Risks / Trade-offs

- [Nama dan saran tertinggal di storage jika pengguna meninggalkan tab terbuka di perangkat bersama] → batas `sessionStorage` per tab dan penghapusan setelah kirim sudah membatasinya. Tidak ada kedaluwarsa tambahan karena dianggap berlebihan untuk lingkup ini.
- [Setiap ketikan pada kolom saran menulis ke storage] → penulisan sinkron dan kecil (di bawah 1 KB), jadi tidak diberi debounce.
- [Struktur draf berubah di masa depan] → field yang tidak dikenal diabaikan dan field yang hilang jatuh ke nilai kosong, sehingga draf lama tetap terbaca tanpa versi skema.
- [Tidak ada test runner di proyek] → verifikasi dilakukan manual di browser, termasuk skenario data rusak (lihat tasks.md).
