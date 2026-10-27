import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import InstagramDialog from "@/components/kelola/InstagramDialog";
import ManagerHeader from "@/components/kelola/ManagerHeader";
import PromoForm from "@/components/kelola/PromoForm";
import SectionTable, { type TableColumn } from "@/components/kelola/SectionTable";
import { fetchInstagramPosts } from "@/components/kelola/instagramClient";
import { imageUrlFor, readPromo } from "@/components/kelola/promoData";
import { IconButton } from "@/components/kelola/ui/Button";
import ConfirmDialog from "@/components/kelola/ui/ConfirmDialog";
import StatusChip, { type ChipTone } from "@/components/kelola/ui/StatusChip";
import { ToastRegion } from "@/components/kelola/ui/Toast";
import useItemActions from "@/components/kelola/useItemActions";
import useKelolaItems from "@/components/kelola/useKelolaItems";
import {
  formatPromoPeriod,
  formatRupiah,
  promoSchedule,
  type PromoSchedule,
} from "@/lib/cms/promoDisplay";
import type { InstagramPost, InstagramStatus, KelolaItem } from "@/lib/kelola/types";
import promoClinicImg from "@/assets/photos/promo-clinic.webp";

type PromoManagerProps = {
  initialItems: KelolaItem[];
  imageBaseUrl: string;
  instagramEnabled: boolean;
  initialPosts: Record<string, InstagramPost>;
};

const SCHEDULE_CHIP: Record<PromoSchedule, { tone: ChipTone; label: string }> = {
  scheduled: { tone: "blue", label: "Terjadwal" },
  ongoing: { tone: "green", label: "Berlangsung" },
  ending: { tone: "promo", label: "Segera berakhir" },
  ended: { tone: "gray", label: "Berakhir" },
};

const INSTAGRAM_CHIP: Record<InstagramStatus, { tone: ChipTone; label: string }> = {
  publishing: { tone: "blue", label: "Sedang diposting" },
  published: { tone: "green", label: "Terposting" },
  failed: { tone: "red", label: "Gagal diposting" },
};

export default function PromoManager({
  initialItems,
  imageBaseUrl,
  instagramEnabled,
  initialPosts,
}: PromoManagerProps) {
  const store = useKelolaItems({ module: "promo", initialItems });
  const actions = useItemActions(store, { Noun: "Promo" });
  const [posts, setPosts] = useState(initialPosts);
  const [instagramTarget, setInstagramTarget] = useState<KelolaItem | null>(null);

  const refreshPosts = useCallback(async () => {
    if (!instagramEnabled) return;
    try {
      setPosts(await fetchInstagramPosts());
    } catch {
      // The list keeps its last known statuses; a failed refresh is not worth interrupting the user.
    }
  }, [instagramEnabled]);

  const imageUrlOf = (item: KelolaItem) => imageUrlFor(imageBaseUrl, readPromo(item).imagePath);

  const columns: TableColumn<KelolaItem>[] = [
    {
      header: "Promo",
      render: (item) => {
        const fields = readPromo(item);
        return (
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={imageUrlOf(item) ?? promoClinicImg.src}
              alt=""
              width={96}
              height={54}
              loading="lazy"
              decoding="async"
              className="bg-surface-tint aspect-video w-24 shrink-0 rounded-lg object-cover outline-1 -outline-offset-1 outline-black/10"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="line-clamp-2 text-base leading-snug font-medium">{item.title}</p>
              <p className="font-accent flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
                <span className="text-blue font-semibold">{formatRupiah(fields.promoPrice)}</span>
                {fields.normalPrice > fields.promoPrice && (
                  <span className="text-heading/70 line-through">
                    {formatRupiah(fields.normalPrice)}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      header: "Periode",
      width: "w-52",
      render: (item) => {
        const fields = readPromo(item);
        const chip = SCHEDULE_CHIP[promoSchedule(fields.startDate, fields.endDate)];
        return (
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-sm tabular-nums">
              {formatPromoPeriod(fields.startDate, fields.endDate)}
            </span>
            <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
          </div>
        );
      },
    },
  ];

  if (instagramEnabled) {
    columns.push({
      header: "Instagram",
      width: "w-44",
      render: (item) => {
        const post = posts[item.id];
        if (!post) return <span className="text-heading/70 text-sm">Belum diposting</span>;
        const chip = INSTAGRAM_CHIP[post.status];
        const permalink =
          post.status === "published" && post.permalink?.startsWith("https://")
            ? post.permalink
            : undefined;
        return (
          <StatusChip
            tone={chip.tone}
            href={permalink}
            title={post.status === "failed" ? (post.error_message ?? undefined) : undefined}
          >
            {chip.label}
          </StatusChip>
        );
      },
    });
  }

  const instagramAction = (item: KelolaItem) => {
    const posted = posts[item.id] !== undefined;
    return (
      <IconButton
        label={`${posted ? "Posting ulang" : "Posting"} ${item.title} ke Instagram`}
        onClick={() => setInstagramTarget(item)}
      >
        <Send size={18} aria-hidden />
      </IconButton>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <ManagerHeader
        module="promo"
        heading="Promo"
        noun="promo"
        total={store.items.length}
        published={store.items.filter((item) => item.is_published).length}
        intro="Promo yang tampil di halaman Promo Klinik. Status berlangsung atau berakhir mengikuti tanggal, dalam zona waktu WITA."
        loadError={store.loadError}
        loading={store.loading}
        onRetry={() => void store.refetch()}
      />

      <SectionTable
        title="Daftar promo"
        items={store.items}
        columns={columns}
        rowName={(item) => item.title}
        busyIds={actions.busyIds}
        emptyTitle="Belum ada promo"
        emptyDescription="Tambahkan promo pertama agar tampil di situs."
        rowActions={instagramEnabled ? instagramAction : undefined}
        addLabel="Tambah promo"
        onAdd={() => actions.openCreate(null)}
        onEdit={actions.openEdit}
        onDelete={actions.askDelete}
        onMove={actions.move}
        onTogglePublished={actions.togglePublished}
      />

      <PromoForm
        open={actions.formTarget !== null}
        item={actions.formTarget?.item ?? null}
        imageBaseUrl={imageBaseUrl}
        instagramEnabled={instagramEnabled}
        onClose={actions.closeForm}
        onPersist={actions.persist}
        onFinish={actions.finishSave}
        onInstagramAttempted={() => void refreshPosts()}
      />

      <InstagramDialog
        open={instagramTarget !== null}
        item={instagramTarget}
        imageUrl={instagramTarget ? imageUrlOf(instagramTarget) : null}
        lastPost={instagramTarget ? posts[instagramTarget.id] : undefined}
        onClose={() => setInstagramTarget(null)}
        onFinished={({ posted }) => {
          void refreshPosts();
          if (posted) {
            actions.toasts.success("Promo diposting ke Instagram.");
            setInstagramTarget(null);
          }
        }}
      />

      <ConfirmDialog
        open={actions.deleting !== null}
        title="Hapus promo?"
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
