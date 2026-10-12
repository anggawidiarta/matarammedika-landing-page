-- Survey kepuasan pelanggan (landing page)
-- Applied remotely as: create_survey_kepuasan_pelanggan (20261012044742)
-- Inserts only via service role from Astro server; RLS enabled with no anon/authenticated policies.

create table public.survey_kepuasan_pelanggan (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nama text null,
  tanggal_kunjungan date null,
  layanan text null,
  rating_pendaftaran smallint not null,
  rating_keramahan smallint not null,
  rating_tunggu smallint not null,
  rating_dokter smallint not null,
  rating_kebersihan smallint not null,
  rating_keseluruhan smallint not null,
  nps smallint not null,
  saran text null,
  consent boolean not null,
  client_ip_hash text not null,
  user_agent text null,
  constraint survey_kepuasan_nama_len check (nama is null or char_length(nama) <= 120),
  constraint survey_kepuasan_layanan_check check (
    layanan is null or layanan in ('Klinik', 'Apotek', 'Klinik & Apotek')
  ),
  constraint survey_kepuasan_rating_pendaftaran check (rating_pendaftaran between 1 and 5),
  constraint survey_kepuasan_rating_keramahan check (rating_keramahan between 1 and 5),
  constraint survey_kepuasan_rating_tunggu check (rating_tunggu between 1 and 5),
  constraint survey_kepuasan_rating_dokter check (rating_dokter between 1 and 5),
  constraint survey_kepuasan_rating_kebersihan check (rating_kebersihan between 1 and 5),
  constraint survey_kepuasan_rating_keseluruhan check (rating_keseluruhan between 1 and 5),
  constraint survey_kepuasan_nps check (nps between 0 and 10),
  constraint survey_kepuasan_saran_len check (saran is null or char_length(saran) <= 500),
  constraint survey_kepuasan_consent_true check (consent = true)
);

create index survey_kepuasan_pelanggan_ip_created_idx
  on public.survey_kepuasan_pelanggan (client_ip_hash, created_at desc);

alter table public.survey_kepuasan_pelanggan enable row level security;

comment on table public.survey_kepuasan_pelanggan is
  'Hasil survey kepuasan pelanggan landing page; insert hanya via service role dari server Astro.';
