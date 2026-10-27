import type { APIRoute } from "astro";
import { fail, ok } from "@/lib/kelola/http";
import { isInstagramConfigured, latestPostsByItem } from "@/lib/kelola/instagram";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const configured = isInstagramConfigured();
    return ok({ configured, posts: configured ? await latestPostsByItem() : {} });
  } catch (error) {
    console.error("[kelola] list instagram posts failed", error);
    return fail("server");
  }
};
