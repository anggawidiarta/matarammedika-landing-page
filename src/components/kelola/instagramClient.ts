import { ApiError, api, describeError } from "@/components/kelola/api";
import type { InstagramPost } from "@/lib/kelola/types";

/** 4:5 portrait, the tallest ratio Instagram accepts, so promo images keep the most area. */
const IMAGE_WIDTH = 1080;
const IMAGE_HEIGHT = 1350;
const JPEG_QUALITY = 0.9;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gambar promo gagal dimuat untuk Instagram."));
    image.src = src;
  });
}

/**
 * Instagram only accepts JPEG between 4:5 and 1.91:1, while promos may be PNG/WebP in any ratio,
 * so the image is letterboxed onto a white 1080x1350 canvas instead of being cropped.
 */
export async function renderInstagramJpeg(source: File | string): Promise<Blob> {
  // The list already loaded this URL without CORS; a cached non-CORS response would taint the canvas.
  const src =
    typeof source === "string" ? `${source}?ig=${Date.now()}` : URL.createObjectURL(source);
  try {
    const image = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = IMAGE_WIDTH;
    canvas.height = IMAGE_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Peramban tidak mendukung pembuatan gambar Instagram.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(
      image,
      (canvas.width - width) / 2,
      (canvas.height - height) / 2,
      width,
      height,
    );

    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Gagal membuat gambar Instagram."))),
        "image/jpeg",
        JPEG_QUALITY,
      ),
    );
  } finally {
    if (typeof source !== "string") URL.revokeObjectURL(src);
  }
}

export async function postPromoToInstagram(
  itemId: string,
  caption: string,
  jpeg: Blob,
): Promise<InstagramPost> {
  const form = new FormData();
  form.set("caption", caption);
  form.set("image", jpeg, "instagram.jpg");
  const result = await api<{ post: InstagramPost }>(
    "POST",
    `/api/kelola/promo/${itemId}/instagram`,
    form,
  );
  return result.post;
}

export async function fetchInstagramPosts(): Promise<Record<string, InstagramPost>> {
  const result = await api<{ posts: Record<string, InstagramPost> }>(
    "GET",
    "/api/kelola/promo/instagram",
  );
  return result.posts;
}

/** Canvas and image-load failures are plain Errors whose message is already user-facing Indonesian. */
export function describeInstagramError(error: unknown): string {
  if (error instanceof Error && !(error instanceof ApiError)) return error.message;
  return describeError(error);
}
