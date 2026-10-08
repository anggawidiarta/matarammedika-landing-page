# Komponen Klinik

Struktur folder:

| Folder | Isi |
|--------|-----|
| `layout/` | Shell halaman: header, footer, `KlinikPageShell` |
| `ui/` | Logo, Segmented, link CTA, ikon lingkaran, `renderIcon` |
| `sections/` | Blok section: `KlinikPageTitle` |
| `cards/` | Kartu reusable: layanan/fasilitas, promo, teks profil |
| `data/` | Data statis, asset URL, nav, konstanta |
| `pages/` | Satu komponen React per route Astro |

Import dari halaman Astro: `@/components/klinik/pages/<NamaPage>`.
