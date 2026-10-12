-- Layanan is required (matches Zod surveyPayloadSchema).
update public.survey_kepuasan_pelanggan
set layanan = 'Klinik'
where layanan is null;

alter table public.survey_kepuasan_pelanggan
  alter column layanan set not null;
