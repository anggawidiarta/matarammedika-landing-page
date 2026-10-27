import { useEffect, useRef, useState } from "react";
import { describeError } from "@/components/kelola/api";
import Field, { inputClass } from "@/components/kelola/ui/Field";
import FormDialog from "@/components/kelola/ui/FormDialog";
import PublishToggle from "@/components/kelola/ui/PublishToggle";
import type { ItemWriteInput } from "@/components/kelola/useKelolaItems";
import { focusFirstInvalid, validateBody } from "@/components/kelola/validate";
import { BODY_MAX, SECTIONS_BY_MODULE } from "@/lib/kelola/constants";
import type { KelolaItem } from "@/lib/kelola/types";

type ProfilFormProps = {
  open: boolean;
  item: KelolaItem | null;
  defaultSection: string;
  unitName: string;
  onClose: () => void;
  onSave: (input: ItemWriteInput, id: string | null) => Promise<void>;
};

export default function ProfilForm({
  open,
  item,
  defaultSection,
  unitName,
  onClose,
  onSave,
}: ProfilFormProps) {
  const [section, setSection] = useState(defaultSection);
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);
  const [bodyError, setBodyError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setSection(item?.section ?? defaultSection);
    setBody(item?.body ?? "");
    setPublished(item?.is_published ?? false);
    setBodyError(undefined);
    setFormError(null);
  }, [open, item, defaultSection]);

  const submit = async () => {
    const found = validateBody(body, true);
    setBodyError(found);
    if (found) {
      window.requestAnimationFrame(() => focusFirstInvalid(rootRef.current));
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onSave({ section, body: body.trim(), is_published: published }, item?.id ?? null);
    } catch (error) {
      setFormError(describeError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={open}
      title={item ? `Ubah profil ${unitName}` : `Tambah profil ${unitName}`}
      submitLabel="Simpan"
      submitting={submitting}
      formError={formError}
      onClose={onClose}
      onSubmit={() => void submit()}
    >
      <div ref={rootRef} className="flex flex-col gap-4">
        <div className="grid items-end gap-4 sm:grid-cols-2">
          <Field label="Bagian">
            {(control) => (
              <select
                {...control}
                value={section}
                onChange={(event) => setSection(event.target.value)}
                className={inputClass}
              >
                {SECTIONS_BY_MODULE.profil.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <PublishToggle
            checked={published}
            label="Tampilkan profil di situs"
            onChange={setPublished}
          />
        </div>

        <Field label="Isi" required error={bodyError} hint={`Maksimal ${BODY_MAX} karakter.`}>
          {(control) => (
            <textarea
              {...control}
              rows={6}
              data-autofocus
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={`${inputClass} resize-y`}
            />
          )}
        </Field>
      </div>
    </FormDialog>
  );
}
