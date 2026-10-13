-- CMS POC: layanan & fasilitas marketing content
-- Applied remotely as: create_cms_feature_items
-- Admin CRUD via authenticated supabase client; public read via Astro service-role API only.

create table public.cms_feature_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  content_type text not null,
  section text not null,
  title text not null,
  body text not null,
  icon_kind text not null,
  icon_name text not null,
  icon_tone text null,
  sort_order int not null default 0,
  is_published boolean not null default false,
  is_deleted boolean not null default false,
  constraint cms_feature_items_content_type_check check (
    content_type in ('layanan', 'fasilitas')
  ),
  constraint cms_feature_items_section_check check (
    (content_type = 'layanan' and section in ('umum_gigi', 'spesialis'))
    or (content_type = 'fasilitas' and section in ('umum', 'lainnya'))
  ),
  constraint cms_feature_items_title_len check (char_length(title) <= 120),
  constraint cms_feature_items_body_len check (char_length(body) <= 1000),
  constraint cms_feature_items_icon_kind_check check (
    icon_kind in ('lucide', 'lucideCircle')
  ),
  constraint cms_feature_items_icon_tone_check check (
    icon_tone is null
    or icon_tone in ('blue', 'green', 'pink', 'lilac', 'mint', 'red')
  ),
  constraint cms_feature_items_lucide_circle_tone check (
    (icon_kind = 'lucide' and icon_tone is null)
    or (icon_kind = 'lucideCircle' and icon_tone is not null)
  )
);

create index cms_feature_items_public_list_idx
  on public.cms_feature_items (content_type, is_published, is_deleted, section, sort_order);

create or replace function public.set_cms_feature_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cms_feature_items_set_updated_at
before update on public.cms_feature_items
for each row
execute function public.set_cms_feature_items_updated_at();

alter table public.cms_feature_items enable row level security;

create policy "cms_feature_items_select_authenticated"
  on public.cms_feature_items
  for select
  to authenticated
  using (true);

create policy "cms_feature_items_insert_authenticated"
  on public.cms_feature_items
  for insert
  to authenticated
  with check (true);

create policy "cms_feature_items_update_authenticated"
  on public.cms_feature_items
  for update
  to authenticated
  using (true)
  with check (true);

comment on table public.cms_feature_items is
  'CMS POC marketing layanan/fasilitas; admin authenticated CRUD; public via Astro service-role API only.';

-- Seed from existing landing hardcoded content (published)
insert into public.cms_feature_items (
  content_type, section, title, body, icon_kind, icon_name, icon_tone, sort_order, is_published
) values
  ('layanan', 'umum_gigi', 'Umum',
   'Menangani keluhan gigi dan mulut seperti pencabutan, penambalan, pembersihan karang gigi, dan konsultasi kesehatan gigi.',
   'lucideCircle', 'heartPulse', 'blue', 0, true),
  ('layanan', 'umum_gigi', 'Gigi',
   'Pelayanan pemeriksaan kesehatan dasar, konsultasi keluhan umum, dan tindakan medis ringan.',
   'lucide', 'tooth', null, 1, true),
  ('layanan', 'spesialis', 'Spesialis Anak',
   'Perawatan bayi, balita, dan anak, termasuk pemeriksaan rutin, penanganan penyakit umum, pemantauan tumbuh kembang, dan imunisasi.',
   'lucide', 'baby', null, 0, true),
  ('layanan', 'spesialis', 'Spesialis Kandungan',
   'Layanan pemeriksaan kehamilan, kesehatan reproduksi wanita, deteksi dini gangguan kehamilan, USG, serta konsultasi terkait kehamilan dan fertilitas.',
   'lucideCircle', 'baby', 'green', 1, true),
  ('layanan', 'spesialis', 'Spesialis Kulit & Kelamin',
   'Menangani masalah kulit, alergi, infeksi menular, serta konsultasi estetika dasar.',
   'lucideCircle', 'sparkles', 'pink', 2, true),
  ('layanan', 'spesialis', 'Spesialis THT',
   'Pelayanan khusus untuk menangani gangguan telinga, hidung, dan tenggorokan, termasuk infeksi, alergi, gangguan pendengaran, sinusitis.',
   'lucideCircle', 'ear', 'lilac', 3, true),
  ('layanan', 'spesialis', 'Spesialis Saraf',
   'pemeriksaan dan penanganan gangguan sistem saraf, seperti sakit kepala kronis, stroke, kejang, neuropati, gangguan gerak.',
   'lucide', 'brain', null, 4, true),
  ('layanan', 'spesialis', 'Spesialis Kejiwaan',
   'Menangani masalah kesehatan mental seperti kecemasan, depresi, stres berat, gangguan tidur, trauma, serta penilaian kondisi psikologis.',
   'lucide', 'brainCircuit', null, 5, true),
  ('layanan', 'spesialis', 'Spesialis Penyakit Dalam',
   'Menangani berbagai gangguan kesehatan pada organ dalam seperti diabetes, hipertensi, maag kronis, infeksi, gangguan metabolik, serta penyakit kronis lainnya pada dewasa.',
   'lucide', 'activity', null, 6, true),
  ('layanan', 'spesialis', 'Spesialis Paru-Paru',
   'Layanan pemeriksaan dan penanganan gangguan pernapasan seperti asma, pneumonia, TBC, infeksi saluran napas, PPOK, serta masalah kesehatan paru lainnya.',
   'lucide', 'lungs', null, 7, true),
  ('fasilitas', 'umum', 'Administrasi',
   'Loket pendaftaran, informasi, dan pembayaran pasien.',
   'lucide', 'clipboardList', null, 0, true),
  ('fasilitas', 'umum', 'Ruang Tunggu',
   'Area menunggu yang nyaman dengan fasilitas dasar.',
   'lucide', 'clock', null, 1, true),
  ('fasilitas', 'umum', 'Ruang Menyusui',
   'Ruang privat untuk ibu menyusui dengan kenyamanan memadai.',
   'lucide', 'baby', null, 2, true),
  ('fasilitas', 'umum', 'Ruang Praktik Dokter',
   'Tempat dokter melakukan pemeriksaan dan konsultasi.',
   'lucide', 'stethoscope', null, 3, true),
  ('fasilitas', 'umum', 'Toilet',
   'Toilet bersih dengan fasilitas kebersihan lengkap.',
   'lucideCircle', 'toilet', 'blue', 4, true),
  ('fasilitas', 'lainnya', 'Handsanitizer',
   'Tersedia di berbagai titik untuk menjaga kebersihan tangan pengunjung.',
   'lucideCircle', 'droplets', 'mint', 0, true),
  ('fasilitas', 'lainnya', 'Pemadam Api (APAR)',
   'Peralatan keselamatan untuk penanganan darurat kebakaran.',
   'lucideCircle', 'flame', 'red', 1, true),
  ('fasilitas', 'lainnya', 'CCTV',
   'Sistem kamera pengawas untuk keamanan seluruh area klinik.',
   'lucide', 'cctv', null, 2, true),
  ('fasilitas', 'lainnya', 'Zona Bebas Rokok',
   'Area klinik sepenuhnya bebas rokok demi kenyamanan dan kesehatan bersama.',
   'lucide', 'cigaretteOff', null, 3, true);
