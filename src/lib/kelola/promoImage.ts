import { getServiceSupabase } from "@/lib/supabase/server";
import {
  CMS_ITEMS_TABLE,
  PROMO_IMAGE_BUCKET,
  PROMO_IMAGE_DIR,
  PROMO_IMAGE_MAX_BYTES,
} from "@/lib/kelola/constants";
import { PROMO_IMAGE_PATH } from "@/lib/kelola/schemas";

type ImageKind = { contentType: string; extension: string };

/** The browser-declared MIME type is untrusted, so the format is decided from the file signature. */
function sniffImage(bytes: Uint8Array): ImageKind | null {
  const startsWith = (...signature: number[]) => signature.every((byte, i) => bytes[i] === byte);

  if (startsWith(0xff, 0xd8, 0xff)) return { contentType: "image/jpeg", extension: "jpg" };
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
    return { contentType: "image/png", extension: "png" };
  }
  const isWebp =
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  return isWebp ? { contentType: "image/webp", extension: "webp" } : null;
}

export type UploadResult = { ok: true; path: string } | { ok: false; reason: "type" | "size" };

export async function uploadPromoImage(file: File): Promise<UploadResult> {
  if (file.size > PROMO_IMAGE_MAX_BYTES) return { ok: false, reason: "size" };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) return { ok: false, reason: "type" };

  const path = `${PROMO_IMAGE_DIR}/${crypto.randomUUID()}.${kind.extension}`;
  const { error } = await getServiceSupabase()
    .storage.from(PROMO_IMAGE_BUCKET)
    .upload(path, bytes, {
      contentType: kind.contentType,
      upsert: false,
      cacheControl: "31536000",
    });
  if (error) throw error;
  return { ok: true, path };
}

export async function isPromoImageInUse(path: string): Promise<boolean> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .select("id")
    .eq("module", "promo")
    .filter("data->>image_path", "eq", path)
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/** Best effort: a leftover file is harmless, so a failed removal is logged and never fails the request. */
export async function removePromoImage(path: string): Promise<void> {
  if (!PROMO_IMAGE_PATH.test(path)) return;
  const { error } = await getServiceSupabase().storage.from(PROMO_IMAGE_BUCKET).remove([path]);
  if (error) console.error("[kelola] remove promo image failed", error.message);
}
