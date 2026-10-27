import { BODY_MAX, TITLE_MAX } from "@/lib/kelola/constants";

export type TextErrors = { title?: string; body?: string };

export function validateText(
  title: string,
  body: string,
  options: { titleRequired?: boolean; bodyRequired?: boolean } = {},
): TextErrors {
  const { titleRequired = true, bodyRequired = false } = options;
  const errors: TextErrors = {};
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();

  if (titleRequired && trimmedTitle.length === 0) errors.title = "Judul wajib diisi.";
  else if (trimmedTitle.length > TITLE_MAX) {
    errors.title = `Judul maksimal ${TITLE_MAX} karakter (sekarang ${trimmedTitle.length}).`;
  }

  if (bodyRequired && trimmedBody.length === 0) errors.body = "Isi wajib diisi.";
  else if (trimmedBody.length > BODY_MAX) {
    errors.body = `Isi maksimal ${BODY_MAX} karakter (sekarang ${trimmedBody.length}).`;
  }
  return errors;
}

export function focusFirstInvalid(root: HTMLElement | null) {
  root?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
}

export function validateBody(body: string, required: boolean): string | undefined {
  return validateText("x", body, { bodyRequired: required }).body;
}
