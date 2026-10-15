const navLinkBase =
  "rounded-md transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

export function navLinkClass(label: string, activeLabel: string) {
  return label === activeLabel
    ? `${navLinkBase} font-semibold text-blue`
    : `${navLinkBase} text-muted opacity-80 hover:text-heading hover:opacity-100`;
}

export function navLinkMobileClass(label: string, activeLabel: string) {
  return label === activeLabel
    ? `${navLinkBase} block rounded-2xl bg-surface-highlight px-4 py-3 font-semibold text-blue`
    : `${navLinkBase} block rounded-2xl px-4 py-3 text-muted opacity-80 hover:bg-surface-tint hover:text-heading hover:opacity-100`;
}
