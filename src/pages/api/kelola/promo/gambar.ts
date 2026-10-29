import type { APIRoute } from "astro";
import { readJsonBody } from "@/lib/http";
import { PROMO_IMAGE_MAX_BYTES } from "@/lib/kelola/constants";
import { fail, guardJsonWrite, guardSameOrigin, ok, readMultipart } from "@/lib/kelola/http";
import { isPromoImageInUse, removePromoImage, uploadPromoImage } from "@/lib/kelola/promoImage";
import { parseImagePath } from "@/lib/kelola/schemas";

export const prerender = false;

const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

export const POST: APIRoute = async ({ request }) => {
  const rejected = guardSameOrigin(request);
  if (rejected) return rejected;

  const form = await readMultipart(request, PROMO_IMAGE_MAX_BYTES + MULTIPART_OVERHEAD_BYTES);
  if (!form) return fail("validation", 413);
  const file = form.get("file");
  if (!(file instanceof File)) return fail("validation");

  try {
    const result = await uploadPromoImage(file);
    if (!result.ok) return fail("validation", result.reason === "size" ? 413 : 415);
    return ok({ path: result.path }, 201);
  } catch (error) {
    console.error("[kelola] upload promo image failed", error);
    return fail("server");
  }
};

/** Cleans up an upload whose item was never saved; images still referenced by an item are never removed. */
export const DELETE: APIRoute = async ({ request }) => {
  const rejected = guardJsonWrite(request);
  if (rejected) return rejected;

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const path = parseImagePath(body.data);
  if (!path) return fail("validation");

  try {
    if (await isPromoImageInUse(path)) return fail("conflict");
    await removePromoImage(path);
    return ok();
  } catch (error) {
    console.error("[kelola] delete promo image failed", error);
    return fail("server");
  }
};
