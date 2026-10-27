export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly detail?: string,
  ) {
    super(code);
  }
}

function redirectToLogin(): never {
  const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
  window.location.assign(`/kelola/masuk?alasan=kedaluwarsa&next=${next}`);
  throw new ApiError("unauthenticated", 401);
}

type RequestBody = unknown | FormData;

export async function api<T = Record<string, never>>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: RequestBody,
): Promise<T> {
  const isForm = body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("network", 0);
  }

  if (response.status === 401) redirectToLogin();

  let json: { ok?: boolean; error?: string; message?: string } | null = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  if (!response.ok || !json?.ok) {
    throw new ApiError(json?.error ?? "server", response.status, json?.message);
  }
  return json as T;
}

export function describeError(error: unknown): string {
  if (!(error instanceof ApiError)) return "Terjadi gangguan. Coba lagi beberapa saat lagi.";
  if (error.detail) return error.detail;
  if (error.code === "network")
    return "Tidak dapat terhubung ke server. Periksa sambungan internet Anda.";
  if (error.code === "validation") {
    if (error.status === 413) return "Berkas atau data terlalu besar.";
    if (error.status === 415) return "Format berkas tidak didukung.";
    return "Isian belum sesuai. Periksa kembali lalu coba lagi.";
  }
  if (error.code === "conflict") return "Data sudah berubah. Muat ulang daftar lalu coba lagi.";
  if (error.code === "not_found") return "Item tidak ditemukan. Mungkin sudah dihapus.";
  return "Terjadi gangguan. Coba lagi beberapa saat lagi.";
}
