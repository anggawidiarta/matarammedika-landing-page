import { getServiceSupabase } from "@/lib/supabase/server";
import { CMS_ITEMS_TABLE } from "@/lib/kelola/constants";
import type { KelolaItem } from "@/lib/kelola/types";
import type { ItemScope, ItemWrite, ReorderRequest } from "@/lib/kelola/schemas";

const COLUMNS =
  "id, module, source, section, title, body, data, sort_order, is_published, created_at, updated_at";

function sectionOperator(section: string | null) {
  return section === null
    ? ({ op: "is", value: null } as const)
    : ({ op: "eq", value: section } as const);
}

async function nextSortOrder(scope: ItemScope, section: string | null): Promise<number> {
  const { op, value } = sectionOperator(section);
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .select("sort_order")
    .eq("module", scope.module)
    .eq("source", scope.source)
    .is("deleted_at", null)
    .filter("section", op, value)
    .order("sort_order", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data && data.length > 0 ? (data[0].sort_order as number) + 1 : 0;
}

export async function listItems(scope: ItemScope): Promise<KelolaItem[]> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .select(COLUMNS)
    .eq("module", scope.module)
    .eq("source", scope.source)
    .is("deleted_at", null)
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw error;
  return (data ?? []) as KelolaItem[];
}

export async function findItem(id: string): Promise<KelolaItem | null> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .select(COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return (data as KelolaItem | null) ?? null;
}

export async function createItem(scope: ItemScope, write: ItemWrite): Promise<KelolaItem> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .insert({
      module: scope.module,
      source: scope.source,
      section: write.section,
      title: write.title,
      body: write.body,
      data: write.data,
      sort_order: await nextSortOrder(scope, write.section),
      is_published: write.is_published,
    })
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data as KelolaItem;
}

/** Moving an item to another section appends it to the end of that section. */
export async function updateItem(
  current: KelolaItem,
  write: ItemWrite,
): Promise<KelolaItem | null> {
  const movedSection = current.section !== write.section;
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .update({
      section: write.section,
      title: write.title,
      body: write.body,
      data: write.data,
      is_published: write.is_published,
      ...(movedSection
        ? {
            sort_order: await nextSortOrder(
              { module: current.module, source: current.source },
              write.section,
            ),
          }
        : {}),
    })
    .eq("id", current.id)
    .is("deleted_at", null)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  return (data as KelolaItem | null) ?? null;
}

export async function setPublished(id: string, isPublished: boolean): Promise<KelolaItem | null> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .update({ is_published: isPublished })
    .eq("id", id)
    .is("deleted_at", null)
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  return (data as KelolaItem | null) ?? null;
}

/** Rows are never removed: a deleted item is hidden and flagged so it can be recovered from the database. */
export async function softDeleteItem(id: string): Promise<boolean> {
  const { data, error } = await getServiceSupabase()
    .from(CMS_ITEMS_TABLE)
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export type ReorderResult = { ok: true; items: KelolaItem[] } | { ok: false; reason: "stale" };

/** The request must name exactly the section's current items; a mismatch means the client list is stale. */
export async function reorderItems(request: ReorderRequest): Promise<ReorderResult> {
  const { op, value } = sectionOperator(request.section);
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from(CMS_ITEMS_TABLE)
    .select(COLUMNS)
    .eq("module", request.module)
    .eq("source", request.source)
    .is("deleted_at", null)
    .filter("section", op, value);
  if (error) throw error;

  const current = (data ?? []) as KelolaItem[];
  const byId = new Map(current.map((item) => [item.id, item]));
  const matches = current.length === request.ids.length && request.ids.every((id) => byId.has(id));
  if (!matches) return { ok: false, reason: "stale" };

  const changed = request.ids
    .map((id, index) => ({ id, index }))
    .filter(({ id, index }) => byId.get(id)?.sort_order !== index);

  const results = await Promise.all(
    changed.map(({ id, index }) =>
      supabase
        .from(CMS_ITEMS_TABLE)
        .update({ sort_order: index })
        .eq("id", id)
        .is("deleted_at", null),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;

  const items = request.ids.map((id, index) => ({
    ...(byId.get(id) as KelolaItem),
    sort_order: index,
  }));
  return { ok: true, items };
}
