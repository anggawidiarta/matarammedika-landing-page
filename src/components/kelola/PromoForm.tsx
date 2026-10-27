import { useEffect, useRef, useState } from "react";
import { api, describeError } from "@/components/kelola/api";
import {
  describeInstagramError,
  postPromoToInstagram,
  renderInstagramJpeg,
} from "@/components/kelola/instagramClient";
import {
  imageUrlFor,
  readPromo,
  toPromoItem,
  type PromoFields,
} from "@/components/kelola/promoData";
import Button from "@/components/kelola/ui/Button";
import Field, { inputClass } from "@/components/kelola/ui/Field";
import FormDialog from "@/components/kelola/ui/FormDialog";
import PublishToggle from "@/components/kelola/ui/PublishToggle";
import type { ItemWriteInput } from "@/components/kelola/useKelolaItems";
import { focusFirstInvalid, validateText } from "@/components/kelola/validate";
import PromoCard from "@/components/shared/cards/PromoCard";
import { addDaysToIsoDate, toPromoCards, todayInClinicZone } from "@/lib/cms/promoDisplay";
import {
  BODY_MAX,
  PROMO_IMAGE_MAX_BYTES,
  PROMO_IMAGE_TYPES,
  TITLE_MAX,
} from "@/lib/kelola/constants";
import { INSTAGRAM_CAPTION_MAX, INSTAGRAM_HASHTAG_MAX } from "@/lib/kelola/constants";
import {
  buildInstagramCaption,
  countHashtags,
  instagramBlockReason,
  validateInstagramCaption,
} from "@/lib/kelola/instagramCaption";
import type { KelolaItem } from "@/lib/kelola/types";

type PromoFormProps = {
  open: boolean;
  item: KelolaItem | null;
  imageBaseUrl: string;
  instagramEnabled: boolean;
  onClose: () => void;
  onPersist: (input: ItemWriteInput, id: string | null) => Promise<string>;
  onFinish: (options?: { message?: string; warning?: string }) => void;
  onInstagramAttempted: () => void;
};

type Draft = {
  title: string;
  body: string;
  normalPrice: string;
  promoPrice: string;
  startDate: string;
  endDate: string;
  published: boolean;
  existingPath: string | null;
  file: File | null;
  postToInstagram: boolean;
  caption: string;
  captionTouched: boolean;
};

type Errors = Partial<
  Record<
    | "title"
    | "body"
    | "normalPrice"
    | "promoPrice"
    | "startDate"
    | "endDate"
    | "image"
    | "instagram"
    | "caption",
    string
  >
>;

const MAX_PRICE_DIGITS = 12;

function emptyDraft(item: KelolaItem | null): Draft {
  if (!item) {
    const today = todayInClinicZone();
    return {
      title: "",
      body: "",
      normalPrice: "",
      promoPrice: "",
      startDate: today,
      endDate: addDaysToIsoDate(today, 30),
      published: false,
      existingPath: null,
      file: null,
      postToInstagram: false,
      caption: "",
      captionTouched: false,
    };
  }
  const fields = readPromo(item);
  return {
    title: item.title,
    body: item.body,
    normalPrice: String(fields.normalPrice),
    promoPrice: String(fields.promoPrice),
    startDate: fields.startDate,
    endDate: fields.endDate,
    published: item.is_published,
    existingPath: fields.imagePath,
    file: null,
    postToInstagram: false,
    caption: "",
    captionTouched: false,
  };
}

function suggestCaption(draft: Draft): string {
  return buildInstagramCaption({
    title: draft.title,
    body: draft.body,
    normalPrice: Number(draft.normalPrice) || 0,
    promoPrice: Number(draft.promoPrice) || 0,
    startDate: draft.startDate,
    endDate: draft.endDate,
  });
}

function captionOf(draft: Draft): string {
  return draft.captionTouched ? draft.caption : suggestCaption(draft);
}

function formatDigits(digits: string): string {
  return digits ? Number(digits).toLocaleString("id-ID") : "";
}

function validate(draft: Draft): Errors {
  const errors: Errors = { ...validateText(draft.title, draft.body) };

  const normal = draft.normalPrice === "" ? null : Number(draft.normalPrice);
  const promo = draft.promoPrice === "" ? null : Number(draft.promoPrice);
  if (normal === null) errors.normalPrice = "Harga normal wajib diisi dengan angka.";
  if (promo === null) errors.promoPrice = "Harga promo wajib diisi dengan angka.";
  else if (normal !== null && promo > normal) {
    errors.promoPrice = "Harga promo tidak boleh lebih besar dari harga normal.";
  }

  if (!draft.startDate) errors.startDate = "Tanggal mulai wajib diisi.";
  if (!draft.endDate) errors.endDate = "Tanggal berakhir wajib diisi.";
  else if (draft.startDate && draft.endDate < draft.startDate) {
    errors.endDate = "Tanggal berakhir tidak boleh sebelum tanggal mulai.";
  }

  if (!draft.file && !draft.existingPath) errors.image = "Gambar promo wajib diunggah.";

  if (draft.postToInstagram) {
    const blocked = instagramBlockReason(draft.published, draft.endDate);
    if (blocked) errors.instagram = blocked;
    const captionProblem = validateInstagramCaption(captionOf(draft));
    if (captionProblem) errors.caption = captionProblem;
  }
  return errors;
}

function checkImageFile(file: File): string | null {
  if (!(file.type in PROMO_IMAGE_TYPES)) return "Format gambar harus JPG, PNG, atau WebP.";
  if (file.size > PROMO_IMAGE_MAX_BYTES) return "Ukuran gambar maksimal 2 MB.";
  return null;
}

function PriceInput({
  control,
  value,
  onChange,
}: {
  control: Record<string, unknown>;
  value: string;
  onChange: (digits: string) => void;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="font-accent text-heading/70 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm"
      >
        Rp
      </span>
      <input
        {...control}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatDigits(value)}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, MAX_PRICE_DIGITS))
        }
        className={`${inputClass} font-accent pl-10 tabular-nums`}
      />
    </div>
  );
}

export default function PromoForm({
  open,
  item,
  imageBaseUrl,
  instagramEnabled,
  onClose,
  onPersist,
  onFinish,
  onInstagramAttempted,
}: PromoFormProps) {
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(item));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(emptyDraft(item));
    setErrors({});
    setFormError(null);
  }, [open, item]);

  useEffect(() => {
    if (!draft.file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(draft.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [draft.file]);

  const patch = (changes: Partial<Draft>) => setDraft((current) => ({ ...current, ...changes }));

  const chooseFile = (file: File | null) => {
    if (!file) return patch({ file: null });
    const problem = checkImageFile(file);
    if (problem) {
      setErrors((current) => ({ ...current, image: problem }));
      return;
    }
    setErrors((current) => ({ ...current, image: undefined }));
    patch({ file });
  };

  const submit = async () => {
    const found = validate(draft);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      window.requestAnimationFrame(() => focusFirstInvalid(rootRef.current));
      return;
    }

    setSubmitting(true);
    setFormError(null);
    let uploadedPath: string | null = null;
    let itemId: string;
    try {
      if (draft.file) {
        const form = new FormData();
        form.set("file", draft.file);
        uploadedPath = (await api<{ path: string }>("POST", "/api/kelola/promo/gambar", form)).path;
      }
      itemId = await onPersist(
        {
          section: null,
          title: draft.title.trim(),
          body: draft.body.trim(),
          data: {
            image_path: uploadedPath ?? draft.existingPath,
            normal_price: Number(draft.normalPrice),
            promo_price: Number(draft.promoPrice),
            start_date: draft.startDate,
            end_date: draft.endDate,
          },
          is_published: draft.published,
        },
        item?.id ?? null,
      );
    } catch (error) {
      if (uploadedPath) {
        await api("DELETE", "/api/kelola/promo/gambar", { path: uploadedPath }).catch(
          () => undefined,
        );
      }
      setFormError(describeError(error));
      setSubmitting(false);
      return;
    }

    let warning: string | undefined;
    let message: string | undefined;
    if (draft.postToInstagram) {
      try {
        const imageSource =
          draft.file ?? imageUrlFor(imageBaseUrl, uploadedPath ?? draft.existingPath);
        if (!imageSource) throw new Error("Promo belum memiliki gambar.");
        await postPromoToInstagram(
          itemId,
          captionOf(draft).trim(),
          await renderInstagramJpeg(imageSource),
        );
        message = "Promo disimpan dan diposting ke Instagram.";
      } catch (error) {
        warning = `Promo tersimpan, tetapi posting Instagram gagal: ${describeInstagramError(error)}`;
      }
      onInstagramAttempted();
    }
    setSubmitting(false);
    onFinish({ message, warning });
  };

  const fields: PromoFields = {
    imagePath: draft.existingPath,
    normalPrice: Number(draft.normalPrice) || 0,
    promoPrice: Number(draft.promoPrice) || 0,
    startDate: draft.startDate || todayInClinicZone(),
    endDate: draft.endDate || draft.startDate || todayInClinicZone(),
  };
  const today = todayInClinicZone();
  const previewCard = toPromoCards(
    [
      toPromoItem(
        "preview",
        draft.title.trim() || "Judul promo",
        draft.body.trim() || "Deskripsi singkat promo akan tampil di sini.",
        fields,
        previewUrl ?? imageUrlFor(imageBaseUrl, draft.existingPath),
      ),
    ],
    fields.startDate > today ? fields.startDate : today,
  )[0];

  return (
    <FormDialog
      open={open}
      title={item ? "Ubah promo" : "Tambah promo"}
      submitLabel="Simpan"
      submitting={submitting}
      formError={formError}
      onClose={onClose}
      onSubmit={() => void submit()}
      size="lg"
    >
      <div ref={rootRef} className="grid gap-x-8 gap-y-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Field
            label="Judul"
            required
            error={errors.title}
            hint={`Maksimal ${TITLE_MAX} karakter.`}
          >
            {(control) => (
              <input
                {...control}
                type="text"
                data-autofocus
                value={draft.title}
                onChange={(event) => patch({ title: event.target.value })}
                className={inputClass}
              />
            )}
          </Field>

          <Field label="Deskripsi" error={errors.body} hint={`Maksimal ${BODY_MAX} karakter.`}>
            {(control) => (
              <textarea
                {...control}
                rows={2}
                value={draft.body}
                onChange={(event) => patch({ body: event.target.value })}
                className={`${inputClass} resize-y`}
              />
            )}
          </Field>

          <div className="@container">
            <div className="grid gap-4 @lg:grid-cols-2 @2xl:grid-cols-4">
              <Field label="Harga normal" required error={errors.normalPrice}>
                {(control) => (
                  <PriceInput
                    control={control}
                    value={draft.normalPrice}
                    onChange={(normalPrice) => patch({ normalPrice })}
                  />
                )}
              </Field>
              <Field label="Harga promo" required error={errors.promoPrice}>
                {(control) => (
                  <PriceInput
                    control={control}
                    value={draft.promoPrice}
                    onChange={(promoPrice) => patch({ promoPrice })}
                  />
                )}
              </Field>
              <Field label="Mulai" required error={errors.startDate}>
                {(control) => (
                  <input
                    {...control}
                    type="date"
                    value={draft.startDate}
                    onChange={(event) => patch({ startDate: event.target.value })}
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="Berakhir" required error={errors.endDate}>
                {(control) => (
                  <input
                    {...control}
                    type="date"
                    min={draft.startDate || undefined}
                    value={draft.endDate}
                    onChange={(event) => patch({ endDate: event.target.value })}
                    className={inputClass}
                  />
                )}
              </Field>
            </div>
          </div>

          <Field
            label="Gambar"
            required={!item}
            error={errors.image}
            hint="JPG, PNG, atau WebP, maks. 2 MB. Rasio 16:9 paling pas."
          >
            {(control) => (
              <input
                {...control}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
                className="text-heading/80 file:bg-surface-highlight file:text-blue hover:file:bg-surface-tint block w-full text-sm file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-lg file:border-0 file:px-5 file:font-semibold"
              />
            )}
          </Field>

          <PublishToggle
            checked={draft.published}
            label="Tampilkan promo di situs"
            onChange={(published) => patch({ published })}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-semibold">Pratinjau di situs</h3>
            <div inert className="bg-surface-tint rounded-2xl p-3">
              {previewCard && <PromoCard promo={previewCard} />}
            </div>
            {fields.startDate > today && (
              <p className="text-heading/80 text-[13px] leading-5">
                Promo belum mulai, jadi baru tampil di situs pada tanggal mulainya.
              </p>
            )}
          </div>

          {instagramEnabled && (
            <div
              className={`bg-surface-tint flex flex-col gap-3 rounded-lg ${draft.postToInstagram || errors.instagram ? "pb-3" : ""}`}
            >
              <PublishToggle
                checked={draft.postToInstagram}
                label="Posting juga ke Instagram"
                title="Posting juga ke Instagram"
                onChange={(postToInstagram) => patch({ postToInstagram })}
                className="bg-transparent"
              />
              {errors.instagram && (
                <p role="alert" className="text-danger px-3.5 text-sm leading-5 font-medium">
                  {errors.instagram}
                </p>
              )}
              {draft.postToInstagram && (
                <div className="flex flex-col gap-2 px-3.5">
                  <Field
                    label="Keterangan (caption)"
                    required
                    error={errors.caption}
                    hint={`${captionOf(draft).trim().length}/${INSTAGRAM_CAPTION_MAX} karakter, ${countHashtags(captionOf(draft))}/${INSTAGRAM_HASHTAG_MAX} tagar`}
                  >
                    {(control) => (
                      <textarea
                        {...control}
                        rows={6}
                        value={captionOf(draft)}
                        onChange={(event) =>
                          patch({ caption: event.target.value, captionTouched: true })
                        }
                        className={`${inputClass} resize-y bg-white`}
                      />
                    )}
                  </Field>
                  <div>
                    <Button
                      variant="quiet"
                      className="-ml-4"
                      onClick={() => patch({ captionTouched: false, caption: "" })}
                    >
                      Susun ulang dari data promo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
