import type { APIRoute } from "astro";
import { INSTAGRAM_IMAGE_MAX_BYTES } from "@/lib/kelola/constants";
import { fail, guardSameOrigin, ok, readMultipart } from "@/lib/kelola/http";
import { validateInstagramCaption } from "@/lib/kelola/instagramCaption";
import { isInstagramConfigured, publishPromoToInstagram } from "@/lib/kelola/instagram";
import { parseItemId } from "@/lib/kelola/schemas";

export const prerender = false;

const MULTIPART_OVERHEAD_BYTES = 64 * 1024;
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

function isJpeg(bytes: Uint8Array): boolean {
  return JPEG_SIGNATURE.every((byte, index) => bytes[index] === byte);
}

export const POST: APIRoute = async ({ request, params }) => {
  const rejected = guardSameOrigin(request);
  if (rejected) return rejected;
  if (!isInstagramConfigured()) return fail("server", 503);

  const itemId = parseItemId(params.id);
  if (!itemId) return fail("validation");

  const form = await readMultipart(request, INSTAGRAM_IMAGE_MAX_BYTES + MULTIPART_OVERHEAD_BYTES);
  if (!form) return fail("validation", 413);

  const caption = form.get("caption");
  const image = form.get("image");
  if (typeof caption !== "string" || !(image instanceof File)) return fail("validation");

  const trimmed = caption.trim();
  if (validateInstagramCaption(trimmed)) return fail("validation");
  if (image.size > INSTAGRAM_IMAGE_MAX_BYTES) return fail("validation", 413);

  const jpeg = new Uint8Array(await image.arrayBuffer());
  if (!isJpeg(jpeg)) return fail("validation", 415);

  try {
    const result = await publishPromoToInstagram({ itemId, caption: trimmed, jpeg });
    if (result.ok) return ok({ post: result.post });

    switch (result.reason) {
      case "not_found":
        return fail("not_found");
      case "not_configured":
        return fail("server", 503);
      case "blocked":
      case "conflict":
        return fail("conflict", 409, { message: result.message });
      case "failed":
        return fail("server", 502, { message: result.message, post: result.post });
    }
  } catch (error) {
    console.error("[kelola] instagram post failed", error);
    return fail("server");
  }
};
