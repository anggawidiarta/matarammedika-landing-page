import { useEffect, useState } from "react";
import {
  describeInstagramError,
  postPromoToInstagram,
  renderInstagramJpeg,
} from "@/components/kelola/instagramClient";
import { readPromo } from "@/components/kelola/promoData";
import Button from "@/components/kelola/ui/Button";
import Dialog from "@/components/kelola/ui/Dialog";
import Field, { inputClass } from "@/components/kelola/ui/Field";
import { INSTAGRAM_CAPTION_MAX, INSTAGRAM_HASHTAG_MAX } from "@/lib/kelola/constants";
import {
  buildInstagramCaption,
  countHashtags,
  instagramBlockReason,
  validateInstagramCaption,
} from "@/lib/kelola/instagramCaption";
import type { InstagramPost, KelolaItem } from "@/lib/kelola/types";

type InstagramDialogProps = {
  open: boolean;
  item: KelolaItem | null;
  imageUrl: string | null;
  lastPost: InstagramPost | undefined;
  onClose: () => void;
  onFinished: (outcome: { posted: boolean }) => void;
};

function suggestedCaption(item: KelolaItem): string {
  const fields = readPromo(item);
  return buildInstagramCaption({
    title: item.title,
    body: item.body,
    normalPrice: fields.normalPrice,
    promoPrice: fields.promoPrice,
    startDate: fields.startDate,
    endDate: fields.endDate,
  });
}

export default function InstagramDialog({
  open,
  item,
  imageUrl,
  lastPost,
  onClose,
  onFinished,
}: InstagramDialogProps) {
  const [caption, setCaption] = useState("");
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string | null; error: string | null }>({
    url: null,
    error: null,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !item) return;
    setCaption(suggestedCaption(item));
    setCaptionError(null);
    setError(null);
    setPreview({ url: null, error: null });
    if (!imageUrl) {
      setPreview({ url: null, error: "Promo belum memiliki gambar." });
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;
    renderInstagramJpeg(imageUrl)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPreview({ url: objectUrl, error: null });
      })
      .catch((reason) => {
        if (!cancelled) setPreview({ url: null, error: describeInstagramError(reason) });
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, item, imageUrl]);

  if (!item)
    return (
      <Dialog open={false} title="Posting ke Instagram" onClose={onClose}>
        {null}
      </Dialog>
    );

  const blockReason = instagramBlockReason(item.is_published, readPromo(item).endDate);
  const canSend = !blockReason && !preview.error && preview.url !== null;

  const send = async () => {
    const problem = validateInstagramCaption(caption);
    setCaptionError(problem);
    if (problem) return;

    setBusy(true);
    setError(null);
    try {
      const blob = await renderInstagramJpeg(imageUrl as string);
      await postPromoToInstagram(item.id, caption.trim(), blob);
      onFinished({ posted: true });
    } catch (reason) {
      setError(describeInstagramError(reason));
      onFinished({ posted: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      title="Posting ke Instagram"
      onClose={onClose}
      size="lg"
      busy={busy}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Tutup
          </Button>
          <Button onClick={() => void send()} loading={busy} disabled={!canSend}>
            {busy ? "Memposting" : "Posting sekarang"}
          </Button>
        </>
      }
    >
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-heading/80 text-sm leading-6">
            Foto promo <span className="text-heading font-semibold">{item.title}</span> akan
            diposting ke akun Instagram klinik.
          </p>

          {blockReason && (
            <p
              role="alert"
              className="bg-promo-red-light/40 rounded-lg px-3.5 py-2.5 text-sm leading-5"
            >
              {blockReason}
            </p>
          )}

          {lastPost && (
            <p className="text-heading/80 text-sm leading-6">
              Percobaan terakhir:{" "}
              <span className="text-heading font-medium">
                {lastPost.status === "published"
                  ? "terposting"
                  : lastPost.status === "failed"
                    ? "gagal"
                    : "sedang diposting"}
              </span>
              {lastPost.status === "failed" && lastPost.error_message
                ? `. ${lastPost.error_message}`
                : "."}
            </p>
          )}

          <Field
            label="Keterangan (caption)"
            required
            error={captionError}
            hint={`${caption.trim().length}/${INSTAGRAM_CAPTION_MAX} karakter, ${countHashtags(caption)}/${INSTAGRAM_HASHTAG_MAX} tagar`}
          >
            {(control) => (
              <textarea
                {...control}
                rows={8}
                data-autofocus
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                className={`${inputClass} resize-y`}
              />
            )}
          </Field>
          <div>
            <Button
              variant="quiet"
              className="-ml-4"
              onClick={() => setCaption(suggestedCaption(item))}
              disabled={busy}
            >
              Susun ulang dari data promo
            </Button>
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm leading-6 font-medium">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold">Pratinjau di Instagram (4:5)</h3>
          <div className="bg-surface-tint relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-lg">
            {preview.url && (
              <img
                src={preview.url}
                alt={`Pratinjau gambar posting ${item.title}`}
                className="size-full object-contain"
              />
            )}
            {!preview.url && !preview.error && (
              <p className="text-heading/70 absolute inset-0 grid place-items-center px-4 text-center text-sm">
                Menyiapkan gambar
              </p>
            )}
            {preview.error && (
              <p
                role="alert"
                className="text-danger absolute inset-0 grid place-items-center px-4 text-center text-sm"
              >
                {preview.error}
              </p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
