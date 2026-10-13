import type { APIRoute } from "astro";
import { publicFeaturesResponse } from "@/lib/cms/publicApi";

export const prerender = false;

export const GET: APIRoute = async () =>
  publicFeaturesResponse("layanan", "[api/public/layanan]");
