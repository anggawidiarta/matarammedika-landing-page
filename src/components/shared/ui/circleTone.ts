export type CircleTone = "blue" | "green" | "pink" | "lilac" | "mint" | "red";

/** Background + glyph colors aligned with former circle-*.svg fills */
export const circleToneClass: Record<CircleTone, { bg: string; fg: string }> = {
  blue: { bg: "bg-[#2F80ED]/10", fg: "text-[#2F80ED]" },
  green: { bg: "bg-green/10", fg: "text-green" },
  pink: { bg: "bg-[#EAF2FD]", fg: "text-[#2F80ED]" },
  lilac: { bg: "bg-[#7A00FF]/10", fg: "text-[#7A00FF]" },
  mint: { bg: "bg-[#2FED6E]/10", fg: "text-[#2FED6E]" },
  red: { bg: "bg-[#ED2F32]/10", fg: "text-[#ED2F32]" },
};
