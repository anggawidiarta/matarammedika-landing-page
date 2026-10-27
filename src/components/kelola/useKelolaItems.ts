import { useCallback, useState } from "react";
import { api } from "@/components/kelola/api";
import type { CmsModule, CmsSource } from "@/lib/kelola/constants";
import type { KelolaItem } from "@/lib/kelola/types";

export type ItemWriteInput = {
  section: string | null;
  title?: string;
  body: string;
  data?: Record<string, unknown>;
  is_published: boolean;
};

type UseKelolaItemsArgs = {
  module: CmsModule;
  source?: CmsSource;
  initialItems: KelolaItem[];
};

function sortItems(items: KelolaItem[]): KelolaItem[] {
  return [...items].sort(
    (a, b) =>
      (a.section ?? "").localeCompare(b.section ?? "") ||
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title),
  );
}

export function moveId(ids: string[], id: string, toIndex: number): string[] {
  const from = ids.indexOf(id);
  const to = Math.max(0, Math.min(toIndex, ids.length - 1));
  if (from < 0 || from === to) return ids;
  const next = [...ids];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

/** Client mirror of /api/kelola/items for one module and unit. Every write goes through the server. */
export default function useKelolaItems({
  module,
  source = "klinik",
  initialItems,
}: UseKelolaItemsArgs) {
  const [items, setItems] = useState<KelolaItem[]>(() => sortItems(initialItems));
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);

  const query = `module=${module}&source=${source}`;

  const refetch = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const result = await api<{ items: KelolaItem[] }>("GET", `/api/kelola/items?${query}`);
      setItems(sortItems(result.items));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const create = useCallback(
    async (input: ItemWriteInput): Promise<string> => {
      const result = await api<{ item: KelolaItem }>("POST", "/api/kelola/items", {
        module,
        source,
        ...input,
      });
      await refetch();
      return result.item.id;
    },
    [module, source, refetch],
  );

  const update = useCallback(
    async (id: string, input: ItemWriteInput): Promise<string> => {
      await api("PATCH", `/api/kelola/items/${id}`, input);
      await refetch();
      return id;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await api("DELETE", `/api/kelola/items/${id}`);
      await refetch();
    },
    [refetch],
  );

  const setPublished = useCallback(
    async (id: string, isPublished: boolean) => {
      await api("PATCH", `/api/kelola/items/${id}`, { is_published: isPublished });
      await refetch();
    },
    [refetch],
  );

  /** Moves one item within its section. The list updates first and is restored if the server rejects the order. */
  const move = useCallback(
    async (id: string, toIndex: number) => {
      const target = items.find((item) => item.id === id);
      if (!target) return;

      const group = items.filter((item) => item.section === target.section);
      const orderedIds = moveId(
        group.map((item) => item.id),
        id,
        toIndex,
      );
      if (orderedIds.every((value, index) => value === group[index].id)) return;

      const previous = items;
      const position = new Map(orderedIds.map((value, index) => [value, index]));
      setItems(
        sortItems(
          items.map((item) =>
            item.section === target.section
              ? { ...item, sort_order: position.get(item.id) ?? item.sort_order }
              : item,
          ),
        ),
      );

      try {
        await api("POST", "/api/kelola/items/reorder", {
          module,
          source,
          section: target.section,
          ids: orderedIds,
        });
      } catch (error) {
        setItems(previous);
        throw error;
      }
    },
    [items, module, source],
  );

  return { items, loading, loadError, refetch, create, update, remove, setPublished, move };
}
