import { useState } from "react";
import { ApiError, describeError } from "@/components/kelola/api";
import { useToasts } from "@/components/kelola/ui/Toast";
import type useKelolaItems from "@/components/kelola/useKelolaItems";
import type { ItemWriteInput } from "@/components/kelola/useKelolaItems";
import type { KelolaItem } from "@/lib/kelola/types";

type ItemStore = ReturnType<typeof useKelolaItems>;

export type FormTarget = { item: KelolaItem | null; section: string | null };

type Labels = { Noun: string };

/** Shared row actions for every manager: busy rows, toasts, delete confirmation and the create/edit target. */
export default function useItemActions(store: ItemStore, labels: Labels) {
  const toasts = useToasts();
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [deleting, setDeleting] = useState<KelolaItem | null>(null);
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(new Set());

  const withBusy = async (id: string, work: () => Promise<void>) => {
    setBusyIds((current) => new Set(current).add(id));
    try {
      await work();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const persist = (input: ItemWriteInput, id: string | null): Promise<string> =>
    id ? store.update(id, input) : store.create(input);

  /** Closes the form after a save; a warning means a follow-up step (e.g. Instagram) failed but the item is saved. */
  const finishSave = (options: { message?: string; warning?: string } = {}) => {
    setFormTarget(null);
    toasts.success(options.message ?? `${labels.Noun} disimpan.`);
    if (options.warning) toasts.error(options.warning);
  };

  const save = async (input: ItemWriteInput, id: string | null) => {
    await persist(input, id);
    finishSave();
  };

  const togglePublished = (item: KelolaItem, next: boolean) =>
    void withBusy(item.id, async () => {
      try {
        await store.setPublished(item.id, next);
        toasts.success(
          next ? `${item.title} ditampilkan di situs.` : `${item.title} disembunyikan dari situs.`,
        );
      } catch (error) {
        toasts.error(describeError(error));
      }
    });

  const move = async (id: string, toIndex: number) => {
    try {
      await store.move(id, toIndex);
    } catch (error) {
      toasts.error(describeError(error));
      if (error instanceof ApiError && error.code === "conflict") await store.refetch();
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await store.remove(deleting.id);
    toasts.success(`${deleting.title} dihapus.`);
    setDeleting(null);
  };

  return {
    toasts,
    busyIds,
    formTarget,
    openCreate: (section: string | null) => setFormTarget({ item: null, section }),
    openEdit: (item: KelolaItem) => setFormTarget({ item, section: item.section }),
    closeForm: () => setFormTarget(null),
    deleting,
    askDelete: setDeleting,
    cancelDelete: () => setDeleting(null),
    save,
    persist,
    finishSave,
    togglePublished,
    move,
    confirmDelete,
  };
}
