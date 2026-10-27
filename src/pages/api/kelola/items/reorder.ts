import type { APIRoute } from "astro";
import { invalidateCmsCaches } from "@/lib/cms/ttlCache";
import { fail, guardJsonWrite, ok, readJsonBody } from "@/lib/kelola/http";
import { reorderItems } from "@/lib/kelola/items";
import { parseReorder } from "@/lib/kelola/schemas";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rejected = guardJsonWrite(request);
  if (rejected) return rejected;

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const reorder = parseReorder(body.data);
  if (!reorder) return fail("validation");

  try {
    const result = await reorderItems(reorder);
    if (!result.ok) return fail("conflict");
    invalidateCmsCaches();
    return ok({ items: result.items });
  } catch (error) {
    console.error("[kelola] reorder failed", error);
    return fail("server");
  }
};
