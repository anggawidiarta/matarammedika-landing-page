const TTL_MS = 60_000;

const resetters = new Set<() => void>();

/** Drops every memoized CMS list so the next public request reads fresh rows (this process only). */
export function invalidateCmsCaches(): void {
  for (const reset of resetters) reset();
}

/**
 * Wraps a CMS list query with a short per-process memo.
 * Resolves to null when the list is empty or the query failed with nothing cached,
 * so callers can fall back; a failed refresh keeps serving the last good list.
 */
export function ttlCached<T>(label: string, load: () => Promise<T[]>): () => Promise<T[] | null> {
  let hit: { at: number; items: T[] | null } | null = null;
  resetters.add(() => {
    hit = null;
  });

  return async () => {
    if (hit && Date.now() - hit.at < TTL_MS) return hit.items;

    try {
      const result = await load();
      const items = result.length > 0 ? result : null;
      hit = { at: Date.now(), items };
      return items;
    } catch (error) {
      console.error(`[cms] ${label}`, error);
      return hit?.items ?? null;
    }
  };
}
