import { useState } from "react";
import ManagerHeader from "@/components/kelola/ManagerHeader";
import ProfilForm from "@/components/kelola/ProfilForm";
import SectionTable, { type TableColumn } from "@/components/kelola/SectionTable";
import ConfirmDialog from "@/components/kelola/ui/ConfirmDialog";
import { ToastRegion } from "@/components/kelola/ui/Toast";
import useItemActions from "@/components/kelola/useItemActions";
import useKelolaItems from "@/components/kelola/useKelolaItems";
import Segmented, { type SegmentedUnit } from "@/components/shared/ui/Segmented";
import { SECTIONS_BY_MODULE, SOURCES } from "@/lib/kelola/constants";
import type { KelolaItem } from "@/lib/kelola/types";

type ProfilManagerProps = {
  initialItems: Record<SegmentedUnit, KelolaItem[]>;
  initialUnit: SegmentedUnit;
};

const PANEL_ID = "kelola-profil-panel";
const SINGLE_ENTRY_SECTIONS = new Set(["tentang", "visi"]);

const columns: TableColumn<KelolaItem>[] = [
  {
    header: "Isi",
    render: (item) => (
      <p className="text-heading/80 line-clamp-3 max-w-prose text-sm leading-6">{item.body}</p>
    ),
  },
];

function unitName(unit: SegmentedUnit): string {
  return SOURCES.find((source) => source.value === unit)?.label ?? unit;
}

export default function ProfilManager({ initialItems, initialUnit }: ProfilManagerProps) {
  const [unit, setUnit] = useState<SegmentedUnit>(initialUnit);
  const klinik = useKelolaItems({
    module: "profil",
    source: "klinik",
    initialItems: initialItems.klinik,
  });
  const apotek = useKelolaItems({
    module: "profil",
    source: "apotek",
    initialItems: initialItems.apotek,
  });
  const store = unit === "klinik" ? klinik : apotek;
  const actions = useItemActions(store, { Noun: "Profil" });
  const name = unitName(unit);

  return (
    <div className="flex flex-col gap-6">
      <ManagerHeader
        module="profil"
        heading="Profil"
        noun="teks"
        total={store.items.length}
        published={store.items.filter((item) => item.is_published).length}
        intro="Teks Tentang Kami, Visi, dan Misi di halaman Profil. Klinik dan Apotek memiliki isi masing-masing."
        loadError={store.loadError}
        loading={store.loading}
        onRetry={() => void store.refetch()}
      >
        <div className="mt-4">
          <Segmented active={unit} onChange={setUnit} panelId={PANEL_ID} />
        </div>
      </ManagerHeader>

      <div id={PANEL_ID} role="tabpanel" className="flex flex-col gap-6">
        {SECTIONS_BY_MODULE.profil.map((section) => {
          const items = store.items.filter((item) => item.section === section.value);
          return (
            <SectionTable
              key={`${unit}-${section.value}`}
              title={section.label}
              items={items}
              columns={columns}
              rowName={(item) =>
                `${section.label}${items.length > 1 ? ` ${items.indexOf(item) + 1}` : ""}`
              }
              busyIds={actions.busyIds}
              emptyTitle={`${section.label} ${name} belum diisi`}
              emptyDescription="Tambahkan teksnya agar tampil di halaman Profil."
              addLabel="Tambah teks"
              reorderable={!SINGLE_ENTRY_SECTIONS.has(section.value)}
              canAdd={!SINGLE_ENTRY_SECTIONS.has(section.value) || items.length === 0}
              onAdd={() => actions.openCreate(section.value)}
              onEdit={actions.openEdit}
              onDelete={actions.askDelete}
              onMove={actions.move}
              onTogglePublished={actions.togglePublished}
            />
          );
        })}
      </div>

      <ProfilForm
        open={actions.formTarget !== null}
        item={actions.formTarget?.item ?? null}
        defaultSection={actions.formTarget?.section ?? SECTIONS_BY_MODULE.profil[0].value}
        unitName={name}
        onClose={actions.closeForm}
        onSave={actions.save}
      />

      <ConfirmDialog
        open={actions.deleting !== null}
        title="Hapus teks profil?"
        message="Teks ini akan hilang dari daftar dan dari halaman Profil. Data tidak dihapus permanen dari database."
        confirmLabel="Hapus"
        onConfirm={actions.confirmDelete}
        onCancel={actions.cancelDelete}
      />

      <ToastRegion toasts={actions.toasts.toasts} onDismiss={actions.toasts.dismiss} />
    </div>
  );
}
