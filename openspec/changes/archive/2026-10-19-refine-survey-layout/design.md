# Design

## Context

Motivasi ada di proposal.md (bagian Why). Kondisi kode saat ini yang membentuk pendekatan:

- `survey-kepuasan-pelanggan.astro` membungkus `KlinikPageTitle` dan `SurveyApp` (React, `client:load`) dalam `main` dengan `max-w-[760px] px-6`. Halaman lain memakai utility `page-container` (maks 1600px, padding 1.5rem / 2.5rem di `lg` / 3.5rem di `xl`).
- Header situs (`KlinikHeader.astro`) memakai `sticky top-0 z-50`. Elemen apa pun yang ikut menempel harus diberi jarak sebesar tinggi header.
- `SurveyProgress` hanya tampil di bagian atas form. `REQUIRED_COUNT = LIKERT.length + 1` belum menghitung Layanan.
- `LikertRatingRow` menumpuk tiga lapis: kartu, `fieldset` bergradien, lalu jalur skala berlatar. `NpsScale` memakai `grid-cols-4 sm:grid-cols-6 lg:grid-cols-11`.
- `ConsentSubmit` menonaktifkan tombol saat `!consent`. Skema zod (`consent: z.literal(true)`) dan `surveyFieldFocus` sudah punya pesan dan target fokus untuk `consent`.
- Proyek belum punya test runner. Pemeriksaan otomatis yang tersedia hanya `astro check` dan `astro build`.

## Goals / Non-Goals

**Goals:**
- Status form (`useSurveyForm`) tetap satu sumber. Panel samping dan form membaca state yang sama.
- Tidak mengubah komponen bersama (`KlinikPageTitle`, `Segmented`) untuk halaman lain.

**Non-Goals:**
- Tidak mengubah API, skema, rate limit, atau urutan dan isi pertanyaan.
- Tidak menyimpan draf isian, dan tidak menambah metadata SEO per halaman.

## Decisions

### 1. Seluruh tata letak dirender di dalam island React
`SurveyApp` merender grid dua kolom (panel dan form). Halaman `.astro` hanya menyediakan `main.page-container`.
- *Alasan:* progres di panel butuh state form. Kalau panel ada di Astro, kita perlu dua island yang berbagi state lewat store atau event, dan itu berlebihan untuk satu halaman.
- *Alternatif:* panel di Astro dengan progres sebagai island terpisah. Ditolak karena butuh sinkronisasi state.
- Judul di panel memakai `<h1>` sendiri, bukan `KlinikPageTitle`, karena komponen itu dirancang rata tengah dengan kapsul. Kapsul otomatis hilang karena komponen itu tidak dipakai lagi di halaman ini.

### 2. Grid `lg:grid-cols-[minmax(300px,1fr)_minmax(0,720px)]`
Panel menyesuaikan lebar dan mengisi sisa ruang, sedangkan form dibatasi 720px. Panel memakai gaya header Promo: `bg-surface-highlight`, `rounded-[24px]`, dan dua blob gradien `aria-hidden`.
- *Alternatif:* sidebar 320px tetap dan form mengisi sisa. Ditolak karena form bisa selebar ~1190px di layar 1600px.
- Di desktop, isi panel dibungkus `lg:sticky` dengan `top` sebesar tinggi header ditambah jarak. Panel ditaruh di grid dengan `self-start` agar sticky berfungsi.

### 3. Tinggi header sebagai token CSS
Tambahkan `--header-h` di `global.css`, dan elemen yang menempel memakai `top-[calc(var(--header-h)+…)]`. Nilainya diukur di Chrome saat implementasi: 95px di semua lebar layar.
- *Alternatif:* angka tetap di setiap komponen. Ditolak karena nilainya akan tersebar di beberapa tempat dan mudah berbeda satu sama lain.
- *Alternatif:* ukur header dengan JS (ResizeObserver). Ditolak karena tinggi header stabil, jadi JS hanya menambah kerumitan tanpa manfaat.

### 4. Progres: satu komponen, dua tampilan
`SurveyProgress` menerima varian: `panel` (teks besar dan bar, tampil hanya di `lg`) dan `bar` (bar tipis plus teks kecil, `sticky` di bawah header, tampil hanya di bawah `lg`). `REQUIRED_COUNT` menjadi `LIKERT.length + 2`, dan `answered` di `useSurveyForm` menambah 1 jika `layanan` terisi.

### 5. Penilaian datar
`LikertRatingRow` tidak lagi memakai kotak bergradien maupun latar jalur skala. Setiap aspek menjadi satu `fieldset` dengan pemisah `border-b` di dalam kartu Penilaian, memakai grid `lg:grid-cols-[minmax(0,1fr)_auto]` dan `items-center`. Tombol skala minimal `size-11` (44px). Label "Sangat tidak puas / Sangat puas" tampil sekali di header kartu, tidak diulang di setiap baris. Teks "Anda memilih X dari 5" dihapus karena pilihan sudah terlihat dari tombol yang aktif, dan aria-label setiap radio tetap ada.
- Hitungan muat di mobile 320px: 320 − 48 (page) − 32 (kartu `px-4`) = 240px, sedangkan 5×44 + 4×4 (gap-1) = 236px. Di `sm` ke atas gap menjadi 8px.

### 6. NPS `grid-cols-6 lg:grid-cols-11`
Di layar sempit tampil 6+5 (0–5, 6–10) secara alami tanpa markup khusus. Label "Tidak mungkin / Sangat mungkin" tetap ada.
- *Catatan:* di `lg` 1024px dengan panel minimal 300px, tombol NPS menjadi sekitar 42px. Spec hanya mewajibkan 44px untuk skala penilaian, dan target sentuh di desktop dengan pointer masih memadai.

### 7. Persetujuan lewat validasi yang sudah ada
`disabled` hanya `isLoading`. Teks bantuan "Tombol aktif setelah…" dihapus. Saat dikirim, `validateSurveyClient` sudah mengembalikan `field: "consent"` dan `surveyFieldFocus` sudah memfokus checkbox tanpa scroll. Skema zod mengecek field sesuai urutan deklarasi, jadi kesalahan persetujuan baru muncul setelah isian lain valid.

### 8. Sukses: fokus ke judul
`SurveySuccess` memakai `useRef` dan `useEffect` saat mount: `scrollIntoView({ block: "start", behavior })` dengan `behavior` "smooth" atau "auto" mengikuti `prefers-reduced-motion`, lalu `heading.focus({ preventScroll: true })`. Heading diberi `tabIndex={-1}`. Offset header ditangani dengan `scroll-mt-[var(--header-h)]` pada section. Ikon "✓" diganti `CircleCheck` dari `lucide-react`.

## Risks / Trade-offs

- [Dua elemen sticky (header dan bar progres mobile) memakan tinggi layar di HP kecil] → bar progres dibuat setipis mungkin (sekitar 36px, teks `text-xs`).
- [Nilai `--header-h` tidak sesuai jika header berubah di masa depan] → token didefinisikan di dekat `page-container` di `global.css` dengan komentar singkat yang mengaitkannya ke `KlinikHeader`.
- [Menghapus "Anda memilih X dari 5" mengurangi umpan balik visual] → status terpilih tetap jelas lewat warna tombol dan nomor aspek yang berubah menjadi gradien.
- [Tanpa test runner, regresi hanya ditangkap secara manual] → tasks menyertakan pemeriksaan di browser pada 360px, 768px, 1024px dan 1440px, ditambah `astro check` dan `astro build`.
