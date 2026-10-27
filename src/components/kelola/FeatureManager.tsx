import FeatureForm from "@/components/kelola/FeatureForm";
import ManagerHeader from "@/components/kelola/ManagerHeader";
import SectionTable, { type TableColumn } from "@/components/kelola/SectionTable";
import { SmallIcon, readIcon } from "@/components/kelola/featureIcon";
import ConfirmDialog from "@/components/kelola/ui/ConfirmDialog";
import { ToastRegion } from "@/components/kelola/ui/Toast";
import useItemActions from "@/components/kelola/useItemActions";
import useKelolaItems from "@/components/kelola/useKelolaItems";
import { SECTIONS_BY_MODULE } from "@/lib/kelola/constants";
import type { KelolaItem } from "@/lib/kelola/types";

type FeatureModule = "layanan" | "fasilitas";

type FeatureManagerProps = {
  module: FeatureModule;
  initialItems: KelolaItem[];
};

const COPY: Record<FeatureModule, { heading: string; intro: string; noun: string; Noun: string }> =
  {
    layanan: {
      heading: "Layanan",
      intro:
        "Daftar yang tampil di halaman Layanan Klinik. Atur urutan, tampilkan atau sembunyikan, dan ubah isinya.",
      noun: "layanan",
      Noun: "Layanan",
    },
    fasilitas: {
      heading: "Fasilitas",
      intro:
        "Daftar yang tampil di halaman Fasilitas Klinik. Atur urutan, tampilkan atau sembunyikan, dan ubah isinya.",
      noun: "fasilitas",
      Noun: "Fasilitas",
    },
  };

export default function FeatureManager({ module, initialItems }: FeatureManagerProps) {
  const copy = COPY[module];
  const store = useKelolaItems({ module, initialItems });
  const actions = useItemActions(store, copy);
  const sections = SECTIONS_BY_MODULE[module];

  const columns: TableColumn<KelolaItem>[] = [
    {
      header: copy.Noun,
      render: (item) => (
        <div className="flex min-w-0 items-center gap-4">
          <SmallIcon descriptor={readIcon(item.data)} size={44} />
          <div className="min-w-0">
            <p className="text-base leading-snug font-medium">{item.title}</p>
            {item.body && (
              <p className="text-heading/80 mt-1 line-clamp-2 max-w-prose text-sm leading-6">
                {item.body}
              </p>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ManagerHeader
        module={module}
        heading={copy.heading}
        noun={copy.noun}
        total={store.items.length}
        published={store.items.filter((item) => item.is_published).length}
        intro={copy.intro}
        loadError={store.loadError}
        loading={store.loading}
        onRetry={() => void store.refetch()}
      />

      {sections.map((section) => (
        <SectionTable
          key={section.value}
          title={section.label}
          items={store.items.filter((item) => item.section === section.value)}
          columns={columns}
          rowName={(item) => item.title}
          busyIds={actions.busyIds}
          emptyTitle={`Belum ada ${copy.noun} di kelompok ini`}
          emptyDescription="Tambahkan yang pertama agar tampil di situs."
          addLabel={`Tambah ${copy.noun}`}
          onAdd={() => actions.openCreate(section.value)}
          onEdit={actions.openEdit}
          onDelete={actions.askDelete}
          onMove={actions.move}
          onTogglePublished={actions.togglePublished}
        />
      ))}

      <FeatureForm
        module={module}
        open={actions.formTarget !== null}
        item={actions.formTarget?.item ?? null}
        defaultSection={actions.formTarget?.section ?? sections[0].value}
        onClose={actions.closeForm}
        onSave={actions.save}
      />

      <ConfirmDialog
        open={actions.deleting !== null}
        title={`Hapus ${copy.noun}?`}
        message={
          actions.deleting
            ? `"${actions.deleting.title}" akan hilang dari daftar dan dari situs. Data tidak dihapus permanen dari database.`
            : ""
        }
        confirmLabel="Hapus"
        onConfirm={actions.confirmDelete}
        onCancel={actions.cancelDelete}
      />

      <ToastRegion toasts={actions.toasts.toasts} onDismiss={actions.toasts.dismiss} />
    </div>
  );
}
