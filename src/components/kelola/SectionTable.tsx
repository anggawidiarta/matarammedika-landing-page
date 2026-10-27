import { useId, useState, type DragEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import Button, { IconButton } from "@/components/kelola/ui/Button";
import EmptyState from "@/components/kelola/ui/EmptyState";
import Switch from "@/components/kelola/ui/Switch";
import type { KelolaItem } from "@/lib/kelola/types";

export type TableColumn<T> = {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
  width?: string;
};

type SectionTableProps<T extends KelolaItem> = {
  title: string;
  items: T[];
  columns: TableColumn<T>[];
  rowName: (item: T) => string;
  busyIds: ReadonlySet<string>;
  emptyTitle: string;
  emptyDescription?: string;
  addLabel: string;
  canAdd?: boolean;
  reorderable?: boolean;
  rowActions?: (item: T) => ReactNode;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onMove: (id: string, toIndex: number) => Promise<void>;
  onTogglePublished: (item: T, next: boolean) => void;
};

const cell = "px-2 py-3 align-middle sm:first:pl-6 sm:last:pr-6 2xl:px-3";
const headerCell = `${cell} py-2 text-left text-sm font-medium text-heading/70 max-sm:hidden`;

function focusMoveButton(id: string, preferred: "up" | "down") {
  const order: ("up" | "down")[] = preferred === "up" ? ["up", "down"] : ["down", "up"];
  window.requestAnimationFrame(() => {
    for (const direction of order) {
      const button = document.getElementById(`move-${direction}-${id}`) as HTMLButtonElement | null;
      if (button && !button.disabled) {
        button.focus();
        return;
      }
    }
  });
}

export default function SectionTable<T extends KelolaItem>({
  title,
  items,
  columns,
  rowName,
  busyIds,
  emptyTitle,
  emptyDescription,
  addLabel,
  canAdd = true,
  reorderable = true,
  rowActions,
  onAdd,
  onEdit,
  onDelete,
  onMove,
  onTogglePublished,
}: SectionTableProps<T>) {
  const headingId = useId();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const move = async (id: string, toIndex: number, direction: "up" | "down") => {
    await onMove(id, toIndex);
    focusMoveButton(id, direction);
  };

  const startDrag = (event: DragEvent<HTMLElement>, id: string) => {
    const row = event.currentTarget.closest("tr");
    if (row) event.dataTransfer.setDragImage(row, 24, 24);
    event.dataTransfer.effectAllowed = "move";
    setDragId(id);
  };

  const endDrag = () => {
    setDragId(null);
    setOverId(null);
  };

  const dropOn = (index: number) => {
    if (dragId) void onMove(dragId, index);
    endDrag();
  };

  return (
    <section
      aria-labelledby={headingId}
      className="shadow-card overflow-hidden rounded-2xl bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 sm:px-6">
        <h2
          id={headingId}
          className="flex items-center gap-2.5 text-lg leading-snug font-semibold text-balance sm:text-xl"
        >
          {title}
          <span className="bg-surface-tint font-accent text-heading/80 inline-flex min-w-7 items-center justify-center rounded-full px-2 text-sm font-medium tabular-nums">
            {items.length}
          </span>
        </h2>
        {canAdd && (
          <Button variant="secondary" onClick={onAdd} className="shrink-0">
            <Plus size={18} aria-hidden />
            {addLabel}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="sm:overflow-x-auto">
          <table className="w-full max-sm:block sm:table-fixed" role="table">
            <colgroup className="max-sm:hidden">
              {reorderable && <col className="w-40" />}
              {columns.map((column) => (
                <col key={column.header} className={column.width} />
              ))}
              <col className="w-48" />
              <col className={rowActions ? "w-44" : "w-32"} />
            </colgroup>
            <thead className="bg-surface-tint/60 max-sm:hidden" role="rowgroup">
              <tr role="row">
                {reorderable && (
                  <th scope="col" role="columnheader" className={headerCell}>
                    Urutan
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.header} scope="col" role="columnheader" className={headerCell}>
                    {column.header}
                  </th>
                ))}
                <th scope="col" role="columnheader" className={headerCell}>
                  Tampil di situs
                </th>
                <th scope="col" role="columnheader" className={`${headerCell} text-right`}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="max-sm:block" role="rowgroup">
              {items.map((item, index) => {
                const name = rowName(item);
                const busy = busyIds.has(item.id);
                const isFirst = index === 0;
                const isLast = index === items.length - 1;
                return (
                  <tr
                    key={item.id}
                    role="row"
                    onDragOver={(event) => {
                      if (!dragId || dragId === item.id) return;
                      event.preventDefault();
                      setOverId(item.id);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      dropOn(index);
                    }}
                    className={`border-heading/8 sm:hover:bg-surface-tint/40 border-t transition-colors duration-150 motion-reduce:transition-none max-sm:flex max-sm:flex-wrap max-sm:items-center max-sm:gap-y-1 max-sm:px-5 max-sm:py-4 ${
                      overId === item.id ? "bg-surface-highlight" : ""
                    } ${dragId === item.id ? "opacity-50" : ""} ${busy ? "opacity-60" : ""}`}
                  >
                    {reorderable && (
                      <td role="cell" className={`${cell} max-sm:order-4 max-sm:p-0 max-sm:pt-1`}>
                        <div className="flex items-center gap-0.5">
                          <span className="text-heading/80 mr-1 text-sm sm:hidden">Urutan</span>
                          <span
                            aria-hidden
                            draggable
                            onDragStart={(event) => startDrag(event, item.id)}
                            onDragEnd={endDrag}
                            className="text-heading/50 hover:text-heading hidden size-8 cursor-grab items-center justify-center active:cursor-grabbing sm:inline-flex"
                          >
                            <GripVertical size={18} />
                          </span>
                          <IconButton
                            id={`move-up-${item.id}`}
                            label={`Naikkan ${name}`}
                            disabled={isFirst || busy}
                            onClick={() => void move(item.id, index - 1, "up")}
                          >
                            <ArrowUp size={18} aria-hidden />
                          </IconButton>
                          <IconButton
                            id={`move-down-${item.id}`}
                            label={`Turunkan ${name}`}
                            disabled={isLast || busy}
                            onClick={() => void move(item.id, index + 1, "down")}
                          >
                            <ArrowDown size={18} aria-hidden />
                          </IconButton>
                        </div>
                      </td>
                    )}

                    {columns.map((column, columnIndex) => (
                      <td
                        key={column.header}
                        role="cell"
                        className={`${cell} ${column.className ?? ""} ${
                          columnIndex === 0
                            ? "max-sm:order-1 max-sm:w-full max-sm:p-0"
                            : "max-sm:order-2 max-sm:w-full max-sm:p-0 max-sm:pt-1"
                        }`}
                      >
                        {column.render(item)}
                      </td>
                    ))}

                    <td
                      role="cell"
                      className={`${cell} max-sm:order-3 max-sm:w-full max-sm:p-0 max-sm:pt-2`}
                    >
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={item.is_published}
                          label={`Tampilkan ${name} di situs`}
                          disabled={busy}
                          onChange={(next) => onTogglePublished(item, next)}
                        />
                        <span
                          className={`min-w-24 text-sm ${item.is_published ? "text-heading font-medium" : "text-heading/70"}`}
                        >
                          {item.is_published ? "Tampil" : "Tersembunyi"}
                        </span>
                      </div>
                    </td>

                    <td
                      role="cell"
                      className={`${cell} max-sm:order-5 max-sm:ml-auto max-sm:p-0 max-sm:pt-1`}
                    >
                      <div className="flex items-center justify-end gap-0.5">
                        {rowActions?.(item)}
                        <IconButton
                          label={`Ubah ${name}`}
                          onClick={() => onEdit(item)}
                          disabled={busy}
                        >
                          <Pencil size={18} aria-hidden />
                        </IconButton>
                        <IconButton
                          label={`Hapus ${name}`}
                          tone="danger"
                          onClick={() => onDelete(item)}
                          disabled={busy}
                        >
                          <Trash2 size={18} aria-hidden />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
