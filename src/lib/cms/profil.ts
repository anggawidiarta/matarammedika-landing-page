import { getServiceSupabase } from "@/lib/supabase/server";
import { ttlCached } from "@/lib/cms/ttlCache";
import type { ProfilContent, ProfilUnit } from "@/lib/cms/types";

type ProfilRow = {
  section: string;
  body: string;
};

async function queryPublishedProfil(source: ProfilUnit): Promise<ProfilRow[]> {
  const { data, error } = await getServiceSupabase()
    .from("cms_items")
    .select("section, body")
    .eq("module", "profil")
    .eq("source", source)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

const loaders: Record<ProfilUnit, () => Promise<ProfilRow[] | null>> = {
  klinik: ttlCached("loadPublishedProfil(klinik)", () => queryPublishedProfil("klinik")),
  apotek: ttlCached("loadPublishedProfil(apotek)", () => queryPublishedProfil("apotek")),
};

export async function loadProfilContent(unit: ProfilUnit): Promise<ProfilContent> {
  const rows = (await loaders[unit]()) ?? [];
  const bodiesOf = (section: string) =>
    rows.filter((row) => row.section === section && row.body.trim()).map((row) => row.body);

  return {
    about: bodiesOf("tentang")[0] ?? null,
    vision: bodiesOf("visi")[0] ?? null,
    missions: bodiesOf("misi"),
  };
}
