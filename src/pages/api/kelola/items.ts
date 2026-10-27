import type { APIRoute } from "astro";
import { invalidateCmsCaches } from "@/lib/cms/ttlCache";
import { fail, guardJsonWrite, ok, readJsonBody } from "@/lib/kelola/http";
import { createItem, listItems } from "@/lib/kelola/items";
import { parseItemWrite, parseScope } from "@/lib/kelola/schemas";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const scope = parseScope(Object.fromEntries(url.searchParams));
  if (!scope) return fail("validation");

  try {
    return ok({ items: await listItems(scope) });
  } catch (error) {
    console.error("[kelola] list items failed", error);
    return fail("server");
  }
};

export const POST: APIRoute = async ({ request }) => {
  const rejected = guardJsonWrite(request);
  if (rejected) return rejected;

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const scope = parseScope(body.data);
  if (!scope) return fail("validation");
  const write = parseItemWrite(scope.module, body.data);
  if (!write.ok) return fail("validation");

  try {
    const item = await createItem(scope, write.value);
    invalidateCmsCaches();
    return ok({ item }, 201);
  } catch (error) {
    console.error("[kelola] create item failed", error);
    return fail("server");
  }
};
