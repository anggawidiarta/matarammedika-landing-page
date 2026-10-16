import { SUPABASE_URL } from "astro:env/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { ttlCached } from "@/lib/cms/ttlCache";
import type { PromoItem } from "@/lib/cms/promoDisplay";

type PromoRow = {
  id: string;
  title: string;
  body: string;
  data: unknown;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_PATH = /^cms\/promo\/[\w.-]+$/;
const IMAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/Klinik/`;

function isRupiah(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

/** Trust boundary: rows come from a jsonb column, so rebuild only what passes validation. */
function mapPromoRow(row: PromoRow): PromoItem | null {
  const data = row.data;
  if (typeof data !== "object" || data === null) return null;
  const { image_path, normal_price, promo_price, start_date, end_date } = data as Record<
    string,
    unknown
  >;

  if (!isRupiah(normal_price) || !isRupiah(promo_price) || promo_price > normal_price) return null;
  if (typeof start_date !== "string" || !ISO_DATE.test(start_date)) return null;
  if (typeof end_date !== "string" || !ISO_DATE.test(end_date) || end_date < start_date) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    imageUrl:
      typeof image_path === "string" && IMAGE_PATH.test(image_path)
        ? `${IMAGE_BASE}${image_path}`
        : null,
    normalPrice: normal_price,
    promoPrice: promo_price,
    startDate: start_date,
    endDate: end_date,
  };
}

async function queryPublishedPromos(): Promise<PromoItem[]> {
  const { data, error } = await getServiceSupabase()
    .from("cms_items")
    .select("id, title, body, data")
    .eq("module", "promo")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => mapPromoRow(row))
    .filter((item): item is PromoItem => item !== null);
}

/** Published promos in CMS order; null when empty or the query failed. Status/visibility is applied per request via `toPromoCards`. */
export const loadPublishedPromos = ttlCached("loadPublishedPromos", queryPublishedPromos);
