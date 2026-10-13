export function assetUrl(file: string | { src: string }) {
  return typeof file === "string" ? file : file.src;
}
