import { z } from "zod";
import {
  BODY_MAX,
  CIRCLE_TONES,
  KLINIK_ICON_NAMES,
  MODULES,
  SOURCES,
  TITLE_MAX,
  sectionValues,
  type CmsModule,
  type CmsSource,
} from "@/lib/kelola/constants";

const SOURCE_VALUES = SOURCES.map((source) => source.value) as [CmsSource, ...CmsSource[]];

export const PROMO_IMAGE_PATH = /^cms\/promo\/[\w.-]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type ItemWrite = {
  section: string | null;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_published: boolean;
};

const title = z.string().trim().min(1).max(TITLE_MAX);
const body = z.string().trim().max(BODY_MAX);
const publishedFlag = z.boolean();

function isRealDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

const isoDate = z.string().regex(ISO_DATE).refine(isRealDate);
const rupiah = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);

const featureData = z.object({
  icon: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("lucide"), name: z.enum(KLINIK_ICON_NAMES) }),
    z.object({
      kind: z.literal("lucideCircle"),
      name: z.enum(KLINIK_ICON_NAMES),
      tone: z.enum(CIRCLE_TONES),
    }),
  ]),
});

const promoData = z
  .object({
    image_path: z.string().regex(PROMO_IMAGE_PATH).nullable(),
    normal_price: rupiah,
    promo_price: rupiah,
    start_date: isoDate,
    end_date: isoDate,
  })
  .refine((data) => data.promo_price <= data.normal_price, {
    path: ["promo_price"],
    message: "promo_price_above_normal",
  })
  .refine((data) => data.end_date >= data.start_date, {
    path: ["end_date"],
    message: "end_before_start",
  });

function sectionEnum(module: CmsModule) {
  return z.enum(sectionValues(module) as [string, ...string[]]);
}

const featureWrite = (module: "layanan" | "fasilitas") =>
  z.object({
    section: sectionEnum(module),
    title,
    body,
    data: featureData,
    is_published: publishedFlag,
  });

const promoWrite = z.object({
  title,
  body,
  data: promoData,
  is_published: publishedFlag,
});

const profilWrite = z.object({
  section: sectionEnum("profil"),
  body: body.min(1),
  is_published: publishedFlag,
});

export type ParsedWrite = { ok: true; value: ItemWrite } | { ok: false };

/** Mirrors the CHECK constraints on `cms_items` so a bad payload fails here with a clean error instead of at the database. */
export function parseItemWrite(module: CmsModule, raw: unknown): ParsedWrite {
  if (module === "layanan" || module === "fasilitas") {
    const parsed = featureWrite(module).safeParse(raw);
    return parsed.success ? { ok: true, value: parsed.data } : { ok: false };
  }

  if (module === "promo") {
    const parsed = promoWrite.safeParse(raw);
    return parsed.success ? { ok: true, value: { ...parsed.data, section: null } } : { ok: false };
  }

  const parsed = profilWrite.safeParse(raw);
  if (!parsed.success) return { ok: false };
  return {
    ok: true,
    value: {
      section: parsed.data.section,
      title: parsed.data.body.slice(0, TITLE_MAX).trim(),
      body: parsed.data.body,
      data: {},
      is_published: parsed.data.is_published,
    },
  };
}

const scopeShape = {
  module: z.enum(MODULES),
  source: z.enum(SOURCE_VALUES).default("klinik"),
};

/** Only the profil module is split per unit; other modules always belong to klinik. */
function hasValidSource(scope: { module: CmsModule; source: CmsSource }): boolean {
  return scope.module === "profil" || scope.source === "klinik";
}

export type ItemScope = { module: CmsModule; source: CmsSource };

export function parseScope(raw: unknown): ItemScope | null {
  const parsed = z.object(scopeShape).safeParse(raw);
  return parsed.success && hasValidSource(parsed.data) ? parsed.data : null;
}

const uuid = z.uuid();

export function parseItemId(raw: unknown): string | null {
  const parsed = uuid.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

const reorderSchema = z.object({
  ...scopeShape,
  section: z.string().nullable(),
  ids: z.array(uuid).min(1).max(200),
});

export type ReorderRequest = ItemScope & { section: string | null; ids: string[] };

const publishOnlySchema = z.object({ is_published: z.boolean() }).strict();

export function parsePublishOnly(raw: unknown): boolean | null {
  const parsed = publishOnlySchema.safeParse(raw);
  return parsed.success ? parsed.data.is_published : null;
}

const imagePathRequest = z.object({ path: z.string().regex(PROMO_IMAGE_PATH) });

export function parseImagePath(raw: unknown): string | null {
  const parsed = imagePathRequest.safeParse(raw);
  return parsed.success ? parsed.data.path : null;
}

export function parseReorder(raw: unknown): ReorderRequest | null {
  const parsed = reorderSchema.safeParse(raw);
  if (!parsed.success || !hasValidSource(parsed.data)) return null;
  if (new Set(parsed.data.ids).size !== parsed.data.ids.length) return null;
  const sections = sectionValues(parsed.data.module);
  const sectionOk =
    parsed.data.module === "promo"
      ? parsed.data.section === null
      : parsed.data.section !== null && sections.includes(parsed.data.section);
  return sectionOk ? parsed.data : null;
}
