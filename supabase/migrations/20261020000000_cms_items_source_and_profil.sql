-- cms_items: add `source` (which unit the content belongs to) and the `profil` module.
-- Existing layanan / fasilitas / promo rows default to 'klinik'.
-- profil sections: tentang (one row), visi (one row), misi (one row per mission, ordered by sort_order).
-- profil rows keep their text in `body`; `title` mirrors its first 120 chars; `data` is an empty object.
--
-- Rollback: delete from public.cms_items where module = 'profil';
--           drop index cms_items_public_list_idx; recreate it without `source`;
--           alter table public.cms_items drop column source;
--           restore the module/section/data constraints and cms_item_data_valid from 20261016043430_create_cms_items.sql.

alter table public.cms_items
  add column if not exists source text not null default 'klinik';

alter table public.cms_items drop constraint if exists cms_items_source_check;
alter table public.cms_items
  add constraint cms_items_source_check check (source in ('klinik', 'apotek'));

alter table public.cms_items drop constraint if exists cms_items_module_check;
alter table public.cms_items
  add constraint cms_items_module_check check (module in ('layanan', 'fasilitas', 'promo', 'profil'));

alter table public.cms_items drop constraint if exists cms_items_section_check;
alter table public.cms_items
  add constraint cms_items_section_check check (
    (module = 'layanan' and section in ('umum_gigi', 'spesialis'))
    or (module = 'fasilitas' and section in ('umum', 'lainnya'))
    or (module = 'profil' and section in ('tentang', 'visi', 'misi'))
    or (module = 'promo' and section is null)
  );

alter table public.cms_items drop constraint if exists cms_items_profil_body_check;
alter table public.cms_items
  add constraint cms_items_profil_body_check check (module <> 'profil' or char_length(btrim(body)) > 0);

create or replace function public.cms_item_data_valid(p_module text, p_data jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_icon jsonb;
  v_kind text;
  v_start date;
  v_end date;
  v_normal numeric;
  v_promo numeric;
begin
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    return false;
  end if;

  if p_module = 'profil' then
    return true;
  end if;

  if p_module in ('layanan', 'fasilitas') then
    v_icon := p_data -> 'icon';
    if v_icon is null or jsonb_typeof(v_icon) <> 'object' then
      return false;
    end if;
    v_kind := v_icon ->> 'kind';
    if v_kind is null or v_kind not in ('lucide', 'lucideCircle') then
      return false;
    end if;
    if jsonb_typeof(v_icon -> 'name') is distinct from 'string' or length(v_icon ->> 'name') = 0 then
      return false;
    end if;
    if v_kind = 'lucide' then
      return coalesce(jsonb_typeof(v_icon -> 'tone'), 'null') = 'null';
    end if;
    return coalesce((v_icon ->> 'tone') in ('blue', 'green', 'pink', 'lilac', 'mint', 'red'), false);
  end if;

  if p_module = 'promo' then
    if jsonb_typeof(p_data -> 'normal_price') is distinct from 'number'
       or jsonb_typeof(p_data -> 'promo_price') is distinct from 'number'
       or jsonb_typeof(p_data -> 'start_date') is distinct from 'string'
       or jsonb_typeof(p_data -> 'end_date') is distinct from 'string' then
      return false;
    end if;
    if coalesce(jsonb_typeof(p_data -> 'image_path'), 'null') not in ('null', 'string') then
      return false;
    end if;
    v_normal := (p_data ->> 'normal_price')::numeric;
    v_promo := (p_data ->> 'promo_price')::numeric;
    if v_normal < 0 or v_promo < 0 or v_promo > v_normal
       or v_normal <> floor(v_normal) or v_promo <> floor(v_promo) then
      return false;
    end if;
    if (p_data ->> 'start_date') !~ '^\d{4}-\d{2}-\d{2}$'
       or (p_data ->> 'end_date') !~ '^\d{4}-\d{2}-\d{2}$' then
      return false;
    end if;
    v_start := (p_data ->> 'start_date')::date;
    v_end := (p_data ->> 'end_date')::date;
    return v_end >= v_start;
  end if;

  return false;
exception when others then
  return false;
end;
$$;

drop index if exists public.cms_items_public_list_idx;
create index cms_items_public_list_idx
  on public.cms_items (module, source, section, sort_order)
  where is_published and deleted_at is null;

-- Initial profil content (previously hardcoded in the landing page).
insert into public.cms_items (module, source, section, title, body, sort_order, is_published)
select 'profil', v.source, v.section, left(v.body, 120), v.body, v.sort_order, true
from (values
  ('klinik', 'tentang', 'Klinik Mataram Medika berkomitmen untuk memberikan kontribusi terhadap peningkatan kesehatan masyarakat di wilayah Mataram melalui layanan komprehensif. Dengan konsep "one stop service" , kami memudahkan akses ke berbagai layanan kesehatan yang mencakup deteksi dini penyakit, pencegahan, pengobatan, hingga terapi pemulihan. Sebagai unit usaha yang terdaftar dengan nama CV. Mataram Medika, Klinik Mataram Medika spesialisasi dalam layanan kesehatan dan terletak di Jalan Catur Warga No. 13, Mataram. Kami menyediakan layanan Rawat Darurat, Rawat Jalan, praktik dokter umum, dokter gigi, serta dokter spesialis', 0),
  ('klinik', 'visi', 'Menjadi pusat layanan kesehatan terdepan di kota Mataram, Lombok, yang terus menerus berinovasi untuk memberikan pelayanan kesehatan berkualitas tinggi, terjangkau, dan mudah diakses oleh masyarakat lokal.', 0),
  ('klinik', 'misi', 'Memberikan pelayanan kesehatan yang berkualitas dan komprehensif dengan menggunakan teknologi terkini dan tenaga medis yang profesional.', 0),
  ('klinik', 'misi', 'Meningkatkan kesadaran dan pendidikan kesehatan di kalangan masyarakat lokal untuk mendukung gaya hidup yang lebih sehat.', 1),
  ('klinik', 'misi', 'Membangun kerjasama yang kuat dengan stakeholders lokal untuk memperluas jangkauan dan efektivitas layanan kesehatan.', 2),
  ('klinik', 'misi', 'Memastikan bahwa setiap individu, terlepas dari latar belakang ekonomi, memiliki akses ke layanan kesehatan yang baik.', 3),
  ('apotek', 'tentang', 'Apotek Mataram Medika pertama kali didirikan pada februari 2017 yang terletak di Jalan Catur warga nomor 13 Mataram. Apotek Mataram Medika hadir dengan slogan "Terlengkap & Termurah", dengan tujuan dan harapan apotek mataram medika menjadi apotek yang menyediakan berbagai jenis obat dengan lengkap dan harga yang terjangkau, guna untuk memenuhi kebutuhan kesehatan masyarakat.', 0),
  ('apotek', 'visi', 'Menjadi Apotek penyedia produk farmasi yang unggul, terlengkap, termurah, dan transparan', 0),
  ('apotek', 'misi', 'Memberikan pelayanan kefarmasian yang prima dan ramah kepada masyarakat', 0),
  ('apotek', 'misi', 'Menyediakan produk berkualitas di bidang farmasi dan alat kesehatan', 1)
) as v(source, section, body, sort_order)
where not exists (select 1 from public.cms_items where module = 'profil');
