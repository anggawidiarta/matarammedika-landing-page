import { IG_ACCESS_TOKEN, IG_GRAPH_HOST, IG_GRAPH_VERSION, IG_USER_ID } from "astro:env/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { todayInClinicZone } from "@/lib/cms/promoDisplay";
import {
  CMS_INSTAGRAM_TABLE,
  INSTAGRAM_ERROR_MAX,
  INSTAGRAM_IMAGE_DIR,
  INSTAGRAM_STALE_PUBLISHING_MS,
  PROMO_IMAGE_BUCKET,
} from "@/lib/kelola/constants";
import { findItem } from "@/lib/kelola/items";
import type { InstagramPost } from "@/lib/kelola/types";

const POST_COLUMNS = "id, item_id, status, permalink, error_message, created_at, published_at";
const GRAPH_TIMEOUT_MS = 15_000;
const CONTAINER_POLL_ATTEMPTS = 10;
const CONTAINER_POLL_DELAY_MS = 2000;
const DEFAULT_GRAPH_VERSION = "v23.0";
const DEFAULT_GRAPH_HOST = "graph.instagram.com";

type GraphConfig = { userId: string; accessToken: string; graphBase: string };

function graphConfig(): GraphConfig | null {
  const userId = IG_USER_ID?.trim();
  const accessToken = IG_ACCESS_TOKEN?.trim();
  if (!userId || !accessToken) return null;

  const host = IG_GRAPH_HOST?.trim() || DEFAULT_GRAPH_HOST;
  const origin = /^https?:\/\//.test(host) ? host : `https://${host}`;
  const version = IG_GRAPH_VERSION?.trim() || DEFAULT_GRAPH_VERSION;
  return { userId, accessToken, graphBase: `${origin.replace(/\/+$/, "")}/${version}` };
}

export function isInstagramConfigured(): boolean {
  return graphConfig() !== null;
}

/** Newest attempt per promo, so the list can show one status each. */
export async function latestPostsByItem(): Promise<Record<string, InstagramPost>> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_INSTAGRAM_TABLE)
    .select(POST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;

  const latest: Record<string, InstagramPost> = {};
  for (const post of (data ?? []) as InstagramPost[]) {
    if (!latest[post.item_id]) latest[post.item_id] = post;
  }
  return latest;
}

class GraphError extends Error {}

function redactToken(message: string, config: GraphConfig): string {
  return message.split(config.accessToken).join("***");
}

async function readGraph(
  response: Response,
  config: GraphConfig,
): Promise<Record<string, unknown>> {
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) {
    const message = (payload?.error as { message?: unknown } | undefined)?.message;
    throw new GraphError(
      typeof message === "string"
        ? `Instagram: ${redactToken(message, config)}`
        : "Instagram menolak permintaan.",
    );
  }
  return payload ?? {};
}

async function graphPost(config: GraphConfig, path: string, params: Record<string, string>) {
  const response = await fetch(`${config.graphBase}/${path}`, {
    method: "POST",
    body: new URLSearchParams({ ...params, access_token: config.accessToken }),
    signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS),
  });
  return readGraph(response, config);
}

async function graphGet(config: GraphConfig, path: string, fields: string) {
  const query = new URLSearchParams({ fields, access_token: config.accessToken });
  const response = await fetch(`${config.graphBase}/${path}?${query}`, {
    signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS),
  });
  return readGraph(response, config);
}

async function waitForContainer(config: GraphConfig, containerId: string): Promise<void> {
  for (let attempt = 0; attempt < CONTAINER_POLL_ATTEMPTS; attempt++) {
    const { status_code: statusCode } = await graphGet(config, containerId, "status_code");
    if (statusCode === "FINISHED") return;
    if (statusCode === "ERROR" || statusCode === "EXPIRED") {
      throw new GraphError(`Instagram gagal memproses gambar (${String(statusCode)}).`);
    }
    await new Promise((resolve) => setTimeout(resolve, CONTAINER_POLL_DELAY_MS));
  }
  throw new GraphError("Instagram terlalu lama memproses gambar. Coba lagi.");
}

function failureMessage(error: unknown, config: GraphConfig): string {
  if (error instanceof GraphError) return error.message;
  if (error instanceof Error && error.name === "TimeoutError") {
    return "Instagram tidak merespons tepat waktu. Coba lagi.";
  }
  console.error("[kelola] instagram publish failed", redactToken(String(error), config));
  return "Gagal memposting ke Instagram.";
}

export type PublishResult =
  | { ok: true; post: InstagramPost }
  | { ok: false; reason: "not_configured" | "not_found" | "blocked" | "conflict"; message?: string }
  | { ok: false; reason: "failed"; message: string; post: InstagramPost | null };

/** A tab closed mid-publish would otherwise leave a row stuck in "publishing" and block retries forever. */
async function failStalePublishing(itemId: string): Promise<void> {
  await getServiceSupabase()
    .from(CMS_INSTAGRAM_TABLE)
    .update({ status: "failed", error_message: "Proses terhenti sebelum selesai." })
    .eq("item_id", itemId)
    .eq("status", "publishing")
    .lt("created_at", new Date(Date.now() - INSTAGRAM_STALE_PUBLISHING_MS).toISOString());
}

async function removeImage(path: string): Promise<void> {
  const { error } = await getServiceSupabase().storage.from(PROMO_IMAGE_BUCKET).remove([path]);
  if (error) console.error("[kelola] remove instagram image failed", error.message);
}

export async function publishPromoToInstagram(args: {
  itemId: string;
  caption: string;
  jpeg: Uint8Array<ArrayBuffer>;
}): Promise<PublishResult> {
  const config = graphConfig();
  if (!config) return { ok: false, reason: "not_configured" };

  const item = await findItem(args.itemId);
  if (!item || item.module !== "promo") return { ok: false, reason: "not_found" };
  if (!item.is_published) {
    return { ok: false, reason: "blocked", message: "Tampilkan promo di situs terlebih dahulu." };
  }
  const endDate = typeof item.data.end_date === "string" ? item.data.end_date : "";
  if (endDate && endDate < todayInClinicZone()) {
    return { ok: false, reason: "blocked", message: "Promo sudah berakhir." };
  }

  const supabase = getServiceSupabase();
  await failStalePublishing(item.id);

  const imagePath = `${INSTAGRAM_IMAGE_DIR}/${crypto.randomUUID()}.jpg`;
  const upload = await supabase.storage
    .from(PROMO_IMAGE_BUCKET)
    .upload(imagePath, args.jpeg, { contentType: "image/jpeg", upsert: false });
  if (upload.error) throw upload.error;

  const attempt = await supabase
    .from(CMS_INSTAGRAM_TABLE)
    .insert({ item_id: item.id, caption: args.caption, image_path: imagePath })
    .select("id")
    .single();
  if (attempt.error?.code === "23505") {
    await removeImage(imagePath);
    return {
      ok: false,
      reason: "conflict",
      message: "Promo ini sedang diposting. Tunggu sebentar.",
    };
  }
  if (attempt.error) {
    await removeImage(imagePath);
    throw attempt.error;
  }
  const attemptId = attempt.data.id as string;

  try {
    const imageUrl = supabase.storage.from(PROMO_IMAGE_BUCKET).getPublicUrl(imagePath)
      .data.publicUrl;
    const container = await graphPost(config, `${config.userId}/media`, {
      image_url: imageUrl,
      caption: args.caption,
    });
    const containerId = String(container.id ?? "");
    await supabase
      .from(CMS_INSTAGRAM_TABLE)
      .update({ ig_container_id: containerId })
      .eq("id", attemptId);

    await waitForContainer(config, containerId);
    const media = await graphPost(config, `${config.userId}/media_publish`, {
      creation_id: containerId,
    });
    const mediaId = String(media.id ?? "");
    const { permalink } = await graphGet(config, mediaId, "permalink");

    const { data, error } = await supabase
      .from(CMS_INSTAGRAM_TABLE)
      .update({
        status: "published",
        ig_media_id: mediaId,
        permalink:
          typeof permalink === "string" && permalink.startsWith("https://") ? permalink : null,
        published_at: new Date().toISOString(),
      })
      .eq("id", attemptId)
      .select(POST_COLUMNS)
      .single();
    if (error) throw error;
    return { ok: true, post: data as InstagramPost };
  } catch (error) {
    const message = failureMessage(error, config);
    const { data } = await supabase
      .from(CMS_INSTAGRAM_TABLE)
      .update({ status: "failed", error_message: message.slice(0, INSTAGRAM_ERROR_MAX) })
      .eq("id", attemptId)
      .select(POST_COLUMNS)
      .maybeSingle();
    return { ok: false, reason: "failed", message, post: (data as InstagramPost | null) ?? null };
  }
}
