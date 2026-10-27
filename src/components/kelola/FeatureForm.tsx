import { useEffect, useRef, useState } from "react";
import IconPicker from "@/components/kelola/IconPicker";
import { SmallIcon, readIcon, TONE_LABELS } from "@/components/kelola/featureIcon";
import Field, { inputClass } from "@/components/kelola/ui/Field";
import FormDialog from "@/components/kelola/ui/FormDialog";
import PublishToggle from "@/components/kelola/ui/PublishToggle";
import { describeError } from "@/components/kelola/api";
import type { ItemWriteInput } from "@/components/kelola/useKelolaItems";
import { focusFirstInvalid, validateText, type TextErrors } from "@/components/kelola/validate";
import IconFeatureCard from "@/components/shared/cards/IconFeatureCard";
import { renderIcon } from "@/components/shared/ui/iconDescriptor";
import { BODY_MAX, CIRCLE_TONES, SECTIONS_BY_MODULE, TITLE_MAX } from "@/lib/kelola/constants";
import type { KelolaItem } from "@/lib/kelola/types";
import type { CircleTone, IconDescriptor, KlinikLucideName } from "@/types/feature";

type FeatureModule = "layanan" | "fasilitas";

type FeatureFormProps = {
  module: FeatureModule;
  open: boolean;
  item: KelolaItem | null;
  defaultSection: string;
  onClose: () => void;
  onSave: (input: ItemWriteInput, id: string | null) => Promise<void>;
};

type Draft = {
  section: string;
  title: string;
  body: string;
  styled: boolean;
  iconName: KlinikLucideName;
  tone: CircleTone;
  published: boolean;
};

const NOUN: Record<FeatureModule, string> = { layanan: "layanan", fasilitas: "fasilitas" };

function draftFor(item: KelolaItem | null, defaultSection: string): Draft {
  const icon = item ? readIcon(item.data) : null;
  return {
    section: item?.section ?? defaultSection,
    title: item?.title ?? "",
    body: item?.body ?? "",
    styled: icon ? icon.kind === "lucideCircle" : true,
    iconName: icon?.name ?? "stethoscope",
    tone: icon?.kind === "lucideCircle" ? icon.tone : "blue",
    published: item?.is_published ?? false,
  };
}

function descriptorOf(draft: Draft): IconDescriptor {
  return draft.styled
    ? { kind: "lucideCircle", name: draft.iconName, tone: draft.tone }
    : { kind: "lucide", name: draft.iconName };
}

export default function FeatureForm({
  module,
  open,
  item,
  defaultSection,
  onClose,
  onSave,
}: FeatureFormProps) {
  const [draft, setDraft] = useState<Draft>(() => draftFor(item, defaultSection));
  const [errors, setErrors] = useState<TextErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const noun = NOUN[module];

  useEffect(() => {
    if (!open) return;
    setDraft(draftFor(item, defaultSection));
    setErrors({});
    setFormError(null);
  }, [open, item, defaultSection]);

  const patch = (changes: Partial<Draft>) => setDraft((current) => ({ ...current, ...changes }));

  const submit = async () => {
    const found = validateText(draft.title, draft.body);
    setErrors(found);
    if (found.title || found.body) {
      window.requestAnimationFrame(() => focusFirstInvalid(rootRef.current));
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onSave(
        {
          section: draft.section,
          title: draft.title.trim(),
          body: draft.body.trim(),
          data: { icon: descriptorOf(draft) },
          is_published: draft.published,
        },
        item?.id ?? null,
      );
    } catch (error) {
      setFormError(describeError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const sections = SECTIONS_BY_MODULE[module];
  const descriptor = descriptorOf(draft);

  return (
    <FormDialog
      open={open}
      title={item ? `Ubah ${noun}` : `Tambah ${noun}`}
      submitLabel="Simpan"
      submitting={submitting}
      formError={formError}
      onClose={onClose}
      onSubmit={() => void submit()}
      size="lg"
    >
      <div ref={rootRef} className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Field label="Kelompok">
            {(control) => (
              <select
                {...control}
                value={draft.section}
                onChange={(event) => patch({ section: event.target.value })}
                className={inputClass}
              >
                {sections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

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

          <Field label="Isi" error={errors.body} hint={`Maksimal ${BODY_MAX} karakter.`}>
            {(control) => (
              <textarea
                {...control}
                rows={3}
                value={draft.body}
                onChange={(event) => patch({ body: event.target.value })}
                className={`${inputClass} resize-y`}
              />
            )}
          </Field>

          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-1.5 text-sm font-semibold">Gaya ikon</legend>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { value: true, label: "Lingkaran berwarna" },
                { value: false, label: "Polos" },
              ].map((option) => (
                <label key={option.label} className="relative">
                  <input
                    type="radio"
                    name="gaya-ikon"
                    checked={draft.styled === option.value}
                    onChange={() => patch({ styled: option.value })}
                    className="peer sr-only"
                  />
                  <span className="peer-checked:bg-surface-highlight peer-checked:text-blue peer-checked:ring-blue peer-focus-visible:outline-blue ring-heading/15 hover:bg-surface-tint inline-flex min-h-11 cursor-pointer items-center rounded-lg px-4 text-sm font-medium ring-1 transition-colors duration-200 ease-out peer-checked:font-semibold peer-checked:ring-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 motion-reduce:transition-none">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {draft.styled && (
              <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Warna ikon">
                {CIRCLE_TONES.map((tone) => (
                  <label key={tone} className="relative">
                    <input
                      type="radio"
                      name="warna-ikon"
                      checked={draft.tone === tone}
                      onChange={() => patch({ tone })}
                      className="peer sr-only"
                    />
                    <span
                      title={TONE_LABELS[tone]}
                      className="peer-checked:ring-blue peer-focus-visible:outline-blue flex size-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-transparent peer-checked:ring-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                    >
                      <SmallIcon
                        descriptor={{ kind: "lucideCircle", name: draft.iconName, tone }}
                        size={34}
                      />
                      <span className="sr-only">{TONE_LABELS[tone]}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <PublishToggle
            checked={draft.published}
            label={`Tampilkan ${noun} di situs`}
            onChange={(published) => patch({ published })}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-semibold">Pratinjau di situs</h3>
            <div className="bg-surface-tint rounded-2xl p-3">
              <IconFeatureCard
                icon={renderIcon(descriptor)}
                title={draft.title.trim() || `Judul ${noun}`}
                body={draft.body.trim() || "Penjelasan singkat akan tampil di sini."}
              />
            </div>
          </div>

          <IconPicker value={draft.iconName} onChange={(iconName) => patch({ iconName })} />
        </div>
      </div>
    </FormDialog>
  );
}
