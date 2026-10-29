import type { APIRoute } from "astro";
import { invalidateCmsCaches } from "@/lib/cms/ttlCache";
import { readJsonBody } from "@/lib/http";
import { fail, guardJsonWrite, guardSameOrigin, ok } from "@/lib/kelola/http";
import { findItem, setPublished, softDeleteItem, updateItem } from "@/lib/kelola/items";
import { removePromoImage } from "@/lib/kelola/promoImage";
import { parseItemId, parseItemWrite, parsePublishOnly } from "@/lib/kelola/schemas";

export const prerender = false;

function imagePathOf(data: Record<string, unknown>): string | null {
  return typeof data.image_path === "string" ? data.image_path : null;
}

export const PATCH: APIRoute = async ({ request, params }) => {
  const rejected = guardJsonWrite(request);
  if (rejected) return rejected;

  const id = parseItemId(params.id);
  if (!id) return fail("validation");

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  try {
    const publishOnly = parsePublishOnly(body.data);
    if (publishOnly !== null) {
      const item = await setPublished(id, publishOnly);
      if (!item) return fail("not_found");
      invalidateCmsCaches();
      return ok({ item });
    }

    const current = await findItem(id);
    if (!current) return fail("not_found");
    const write = parseItemWrite(current.module, body.data);
    if (!write.ok) return fail("validation");

    const item = await updateItem(current, write.value);
    if (!item) return fail("not_found");
    invalidateCmsCaches();

    const previousImage = imagePathOf(current.data);
    if (previousImage && previousImage !== imagePathOf(item.data)) {
      await removePromoImage(previousImage);
    }
    return ok({ item });
  } catch (error) {
    console.error("[kelola] update item failed", error);
    return fail("server");
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const rejected = guardSameOrigin(request);
  if (rejected) return rejected;

  const id = parseItemId(params.id);
  if (!id) return fail("validation");

  try {
    if (!(await softDeleteItem(id))) return fail("not_found");
    invalidateCmsCaches();
    return ok();
  } catch (error) {
    console.error("[kelola] delete item failed", error);
    return fail("server");
  }
};
